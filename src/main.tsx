import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Web3ModalProvider } from './lib/web3Config';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Web3ModalProvider>
        <App />
      </Web3ModalProvider>
    </StrictMode>,
  );
}
