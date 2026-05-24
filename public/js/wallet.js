// public/js/wallet.js
// Complete MetaMask wallet integration — no external dependencies

(function() {
  'use strict';
  
  const STORAGE_KEY = 'zascout_wallet';
  
  const state = {
    address: null,
    chainId: null,
    connected: false
  };
  
  // ── DOM helpers ──────────────────────────────────────────────────────────────
  
  function $(id) { return document.getElementById(id); }
  
  function updateUI() {
    const btn = $('wallet-btn');
    const addrDisplay = $('wallet-address');
    const statusDot = $('wallet-status');
    const disconnectBtn = $('wallet-disconnect');
    
    if (!btn) return;
    
    if (state.connected && state.address) {
      const short = `${state.address.slice(0, 6)}...${state.address.slice(-4)}`;
      btn.textContent = short;
      btn.classList.add('connected');
      btn.setAttribute('aria-label', `Wallet connected: ${state.address}`);
      
      if (addrDisplay) {
        addrDisplay.textContent = short;
        addrDisplay.title = state.address;
      }
      if (statusDot) {
        statusDot.classList.add('online');
        statusDot.title = 'Wallet connected';
      }
      if (disconnectBtn) {
        disconnectBtn.style.display = 'inline-block';
      }
      
      // Dispatch event so other parts of the UI can react
      document.dispatchEvent(new CustomEvent('walletConnected', {
        detail: { address: state.address, chainId: state.chainId }
      }));
    } else {
      btn.textContent = 'Connect Wallet';
      btn.classList.remove('connected');
      btn.setAttribute('aria-label', 'Connect MetaMask wallet');
      
      if (addrDisplay) addrDisplay.textContent = '';
      if (statusDot) statusDot.classList.remove('online');
      if (disconnectBtn) disconnectBtn.style.display = 'none';
      
      document.dispatchEvent(new CustomEvent('walletDisconnected'));
    }
  }
  
  // ── Persistence ───────────────────────────────────────────────────────────────
  
  function saveSession() {
    if (state.address) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        address: state.address,
        chainId: state.chainId
      }));
    }
  }
  
  function clearSession() {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  
  function loadSession() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { address, chainId } = JSON.parse(saved);
        if (address) return { address, chainId };
      }
    } catch {}
    return null;
  }
  
  // ── Core wallet logic ─────────────────────────────────────────────────────────
  
  function showError(message) {
    const errorEl = $('wallet-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
    } else {
      console.warn('[Wallet]', message);
      if (window.showGlobalToastNotification) {
          window.showGlobalToastNotification('Wallet Error', message, 'alert-circle');
      }
    }
  }
  
  async function connectWallet() {
    if (!window.ethereum) {
      showError('MetaMask not detected. Please install MetaMask to connect.');
      window.open('https://metamask.io/download/', '_blank', 'noopener');
      return;
    }
    
    const btn = $('wallet-btn');
    if (btn) {
      btn.textContent = 'Connecting...';
      btn.disabled = true;
    }
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask');
      }
      
      // Get chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      state.address = accounts[0];
      state.chainId = chainId;
      state.connected = true;
      
      saveSession();
      updateUI();
      if (window.showGlobalToastNotification) {
        window.showGlobalToastNotification('Wallet Connected', 'Successfully connected MetaMask', 'check-circle');
      }
    } catch (err) {
      if (err.code === 4001) {
        showError('Connection rejected. Please approve the MetaMask request.');
      } else if (err.code === -32002) {
        showError('MetaMask is already processing a request. Check your MetaMask extension.');
      } else {
        showError(`Connection failed: ${err.message}`);
      }
      updateUI();
    } finally {
      if (btn) btn.disabled = false;
    }
  }
  
  function disconnectWallet() {
    state.address = null;
    state.chainId = null;
    state.connected = false;
    clearSession();
    updateUI();
    if (window.showGlobalToastNotification) {
      window.showGlobalToastNotification('Wallet Disconnected', 'Logged out from wallet successfully', 'info');
    }
  }
  
  // ── MetaMask event listeners ──────────────────────────────────────────────────
  
  function attachEthereumListeners() {
    if (!window.ethereum) return;
    
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        state.address = accounts[0];
        saveSession();
        updateUI();
      }
    });
    
    window.ethereum.on('chainChanged', chainId => {
      state.chainId = chainId;
      saveSession();
      // Reload recommended by MetaMask on chain change
      window.location.reload();
    });
    
    window.ethereum.on('disconnect', () => {
      disconnectWallet();
    });
  }
  
  // ── Auto-reconnect from session ───────────────────────────────────────────────
  
  async function tryAutoReconnect() {
    const saved = loadSession();
    if (!saved || !window.ethereum) return;
    
    try {
      // Check if the previously connected account is still authorised
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts[0] && accounts[0].toLowerCase() === saved.address.toLowerCase()) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        state.address = accounts[0];
        state.chainId = chainId;
        state.connected = true;
        updateUI();
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  }
  
  // ── Bootstrap ─────────────────────────────────────────────────────────────────
  
  function init() {
    const btn = $('wallet-btn');
    const disconnectBtn = $('wallet-disconnect');
    
    if (btn) {
      btn.addEventListener('click', () => {
        if (state.connected) {
          // Clicking again while connected — show address options or just copy
          navigator.clipboard?.writeText(state.address).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 1500);
          }).catch(() => {});
        } else {
          connectWallet();
        }
      });
    }
    
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', disconnectWallet);
    }
    
    attachEthereumListeners();
    tryAutoReconnect();
    updateUI();
  }
  
  // Expose to global for use by other scripts
  window.ZAWallet = {
    connect: connectWallet,
    disconnect: disconnectWallet,
    getAddress: () => state.address,
    isConnected: () => state.connected,
    getChainId: () => state.chainId
  };
  
  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
