
"use client";

import { create } from 'zustand';

interface PwaInstallState {
  installPrompt: Event | null;
  setInstallPrompt: (event: Event | null) => void;
  handleInstallClick: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

export const usePwaInstall = create<PwaInstallState>((set, get) => ({
  installPrompt: null,
  setInstallPrompt: (event) => set({ installPrompt: event }),
  handleInstallClick: async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { installPrompt } = get();
    if (!installPrompt) {
      return;
    }
    // The `prompt` method can only be called once.
    (installPrompt as any).prompt();
    const { outcome } = await (installPrompt as any).userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // Clear the prompt once it's used.
    set({ installPrompt: null });
  },
}));
