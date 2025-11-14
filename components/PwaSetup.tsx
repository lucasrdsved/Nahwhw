'use client';

import { useEffect } from 'react';

const PwaSetup = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register('/service-worker.js');
          console.info('[PWA] Service worker registrado com sucesso.');
        } catch (error) {
          console.warn('[PWA] Falha ao registrar o service worker', error);
        }
      };

      register();
    }
  }, []);

  return null;
};

export default PwaSetup;
