'use client';

import { useEffect } from 'react';

const PwaSetup = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.info('[PWA] Nova versão disponível. Atualize para obter as últimas melhorias.');
              }
            });
          }
        };

        console.info('[PWA] Service worker registrado com sucesso.');
      } catch (error) {
        console.warn('[PWA] Falha ao registrar o service worker', error);
      }
    };

    const handleLoad = () => {
      void register();
    };

    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return null;
};

export default PwaSetup;
