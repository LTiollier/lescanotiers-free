import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect, useState } from 'react';

export function usePWA() {
  const [needRefreshState, setNeedRefreshState] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefreshFromSW, setNeedRefreshFromSW],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('Service Worker registered:', r);
    },
    onRegisterError(error: Error) {
      console.error('Service Worker registration error:', error);
    },
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (needRefreshFromSW) {
      setNeedRefreshState(true);
    }
  }, [needRefreshFromSW]);

  const updateApp = async () => {
    await updateServiceWorker(true);
    setNeedRefreshState(false);
  };

  const closeNotification = () => {
    setOfflineReady(false);
    setNeedRefreshFromSW(false);
    setNeedRefreshState(false);
  };

  return {
    offlineReady,
    needRefresh: needRefreshState,
    updateApp,
    closeNotification,
    isOffline,
  };
}
