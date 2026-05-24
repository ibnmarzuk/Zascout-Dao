import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster, toast } from 'sonner';

// Create a mount point if it doesn't exist
let reactRoot = document.getElementById('react-root');
if (!reactRoot) {
  reactRoot = document.createElement('div');
  reactRoot.id = 'react-root';
  document.body.appendChild(reactRoot);
}

// Render the global Toaster
createRoot(reactRoot).render(
  <Toaster position="top-center" richColors />
);

// Expose the toast function globally so vanilla JS can call it
(window as any).reactToast = toast;
