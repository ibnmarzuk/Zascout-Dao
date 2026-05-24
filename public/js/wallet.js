// public/js/wallet.js
// Multi-wallet connection system

(function() {
  'use strict';
  
  const STORAGE_KEY = 'zascout_wallet';
  
  const state = {
    address: null,
    chainId: null,
    connected: false,
    walletType: null
  };
  
  function $(id) { return document.getElementById(id); }
  
  function updateUI() {
    const btn = $('wallet-btn');
    const addrDisplay = $('wallet-address');
    const statusDot = $('wallet-status');
    const disconnectBtn = $('wallet-disconnect');
    
    if (!btn) return;
    
    if (state.connected && state.address) {
      const short = `${state.address.slice(0, 6)}...${state.address.slice(-4)}`;
      btn.innerHTML = `<i data-lucide="wallet" class="w-4 h-4 mr-1"></i> ${short}`;
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
      
      document.dispatchEvent(new CustomEvent('walletConnected', {
        detail: { address: state.address, chainId: state.chainId, type: state.walletType }
      }));
      if (window.lucide) window.lucide.createIcons();
    } else {
      btn.innerHTML = 'Connect Wallet';
      btn.classList.remove('connected');
      btn.setAttribute('aria-label', 'Connect wallet');
      
      if (addrDisplay) addrDisplay.textContent = '';
      if (statusDot) statusDot.classList.remove('online');
      if (disconnectBtn) disconnectBtn.style.display = 'none';
      
      document.dispatchEvent(new CustomEvent('walletDisconnected'));
    }
  }
  
  function saveSession() {
    if (state.address) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        address: state.address,
        chainId: state.chainId,
        walletType: state.walletType
      }));
    }
  }
  
  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }
  
  function loadSession() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address) return parsed;
      }
    } catch {}
    return null;
  }
  
  function showError(message) {
    console.warn('[Wallet]', message);
    if (window.showGlobalToastNotification) {
        window.showGlobalToastNotification('Wallet Error', message, 'alert-circle', 'error');
    } else {
        const errorEl = $('wallet-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
        }
    }
  }
  
  async function connectProvider(type) {
    closeWalletModal();
    const btn = $('wallet-btn');
    if (btn) {
      btn.textContent = 'Connecting...';
      btn.disabled = true;
    }
    try {
      let accounts, chainId;
      if (type === 'metamask') {
        if (!window.ethereum) throw new Error('MetaMask not detected');
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        chainId = await window.ethereum.request({ method: 'eth_chainId' });
      } else if (type === 'phantom') {
        if (!window.phantom || !window.phantom.solana) throw new Error('Phantom not detected');
        const resp = await window.phantom.solana.connect();
        accounts = [resp.publicKey.toString()];
        chainId = 'solana:mainnet';
      } else if (type === 'trustwallet') {
        const tw = window.trustwallet || window.ethereum;
        if (!tw) throw new Error('Trust Wallet not detected');
        accounts = await tw.request({ method: 'eth_requestAccounts' });
        chainId = await tw.request({ method: 'eth_chainId' });
      } else if (type === 'coinbase') {
        const cb = window.coinbaseWalletExtension || window.ethereum;
        if (!cb) throw new Error('Coinbase Wallet not detected');
        accounts = await cb.request({ method: 'eth_requestAccounts' });
        chainId = await cb.request({ method: 'eth_chainId' });
      } else {
        throw new Error('WalletConnect integration requires additional setup flow.');
      }
      
      if (!accounts || accounts.length === 0) throw new Error('No accounts returned');
      
      state.address = accounts[0];
      state.chainId = chainId;
      state.walletType = type;
      state.connected = true;
      
      saveSession();
      updateUI();
      if (window.showGlobalToastNotification) {
        window.showGlobalToastNotification('Wallet Connected', `Successfully connected ${type}`, 'check-circle', 'success');
      }
    } catch (err) {
      showError(err.message || 'Connection failed.');
      updateUI();
    } finally {
      if (btn) btn.disabled = false;
    }
  }
  
  function disconnectWallet() {
    state.address = null;
    state.chainId = null;
    state.connected = false;
    state.walletType = null;
    clearSession();
    updateUI();
    if (window.showGlobalToastNotification) {
      window.showGlobalToastNotification('Wallet Disconnected', 'Logged out from wallet successfully', 'info');
    }
  }

  function openWalletModal() {
      let modal = document.getElementById('wallet-selection-modal');
      if (!modal) {
          modal = document.createElement('div');
          modal.id = 'wallet-selection-modal';
          modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 pointer-events-none';
          modal.innerHTML = `
              <div class="bg-brand-dark border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(0,112,243,0.1)] transform scale-95 transition-transform duration-300 relative">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl -mr-12 -mt-12 rounded-full pointer-events-none"></div>
                  <div class="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/5 blur-3xl -ml-12 -mb-12 rounded-full pointer-events-none"></div>
                  
                  <div class="flex items-center justify-between mb-6 relative z-10">
                      <h3 class="text-xl font-bold text-white tracking-tight">Connect Wallet</h3>
                      <button id="close-wallet-modal" class="text-white/50 hover:text-white transition-colors bg-white/5 rounded-full p-1.5 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                  </div>
                  <div class="flex flex-col gap-3 relative z-10">
                      <button class="wallet-option flex items-center gap-4 w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#F6851B]/30 transition-all font-medium text-white shadow-sm" data-type="metamask">
                          <div class="w-8 h-8 rounded-full bg-[#F6851B]/20 flex items-center justify-center text-[#F6851B] font-bold">M</div>
                          MetaMask
                      </button>
                      <button class="wallet-option flex items-center gap-4 w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#AB9FF2]/30 transition-all font-medium text-white shadow-sm" data-type="phantom">
                          <div class="w-8 h-8 rounded-full bg-[#AB9FF2]/20 flex items-center justify-center text-[#AB9FF2] font-bold">P</div>
                          Phantom
                      </button>
                      <button class="wallet-option flex items-center gap-4 w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#3375BB]/30 transition-all font-medium text-white shadow-sm" data-type="trustwallet">
                          <div class="w-8 h-8 rounded-full bg-[#3375BB]/20 flex items-center justify-center text-[#3375BB] font-bold">T</div>
                          Trust Wallet
                      </button>
                      <button class="wallet-option flex items-center gap-4 w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#0052FF]/30 transition-all font-medium text-white shadow-sm" data-type="coinbase">
                          <div class="w-8 h-8 rounded-full bg-[#0052FF]/20 flex items-center justify-center text-[#0052FF] font-bold border border-[#0052FF]/40">C</div>
                          Coinbase Wallet
                      </button>
                      <button class="wallet-option flex items-center gap-4 w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all font-medium text-white/50" data-type="walletconnect">
                          <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold border border-white/10">W</div>
                          WalletConnect
                      </button>
                  </div>
                  <p class="text-[10px] text-white/30 text-center mt-6 uppercase tracking-wider relative z-10">Secure Connection Portal</p>
              </div>
          `;
          document.body.appendChild(modal);

          modal.querySelector('#close-wallet-modal').addEventListener('click', closeWalletModal);
          modal.addEventListener('click', (e) => {
              if (e.target === modal) closeWalletModal();
          });
          modal.querySelectorAll('.wallet-option').forEach(btn => {
              btn.addEventListener('click', (e) => {
                  const type = e.currentTarget.getAttribute('data-type');
                  connectProvider(type);
              });
          });
      }
      
      // Animate entry
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.firstElementChild.classList.remove('scale-95');
  }

  function closeWalletModal() {
      const modal = document.getElementById('wallet-selection-modal');
      if (modal) {
          modal.classList.add('opacity-0', 'pointer-events-none');
          modal.firstElementChild.classList.add('scale-95');
      }
  }

  function init() {
    const btn = $('wallet-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.connected) {
           disconnectWallet();
        } else {
           openWalletModal();
        }
      });
    }
    
    const saved = loadSession();
    if (saved) {
      state.address = saved.address;
      state.chainId = saved.chainId;
      state.walletType = saved.walletType;
      state.connected = true;
      updateUI();
    }
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length === 0) disconnectWallet();
        else {
          state.address = accounts[0];
          saveSession();
          updateUI();
        }
      });
      window.ethereum.on('chainChanged', chainId => {
        state.chainId = chainId;
        saveSession();
        updateUI();
      });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.ZAWallet = {
    connect: openWalletModal,
    disconnect: disconnectWallet,
    getAddress: () => state.address,
    isConnected: () => state.connected
  };
})();
