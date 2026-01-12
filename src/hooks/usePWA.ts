import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect, useState } from 'react';

export function usePWA() {
  const [needRefreshState, setNeedRefreshState] = useState(false);

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
  };
}
