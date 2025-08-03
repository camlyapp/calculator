
"use client";

import { useEffect, useCallback } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';

const PwaInstaller = () => {
    const { setInstallPrompt } = usePwaInstall();

    const handleBeforeInstallPrompt = useCallback((event: Event) => {
        event.preventDefault();
        setInstallPrompt(event);
    }, [setInstallPrompt]);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
                .catch((error) => console.error('Service Worker registration failed:', error));
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [handleBeforeInstallPrompt]);

    return null; // This component does not render anything
};

export default PwaInstaller;
