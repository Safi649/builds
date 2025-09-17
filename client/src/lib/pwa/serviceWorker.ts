// Service worker registration and management
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('SW registered: ', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              showUpdateAvailable();
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.log('SW registration failed: ', error);
      return null;
    }
  }
  return null;
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const result = await registration.unregister();
        console.log('SW unregistered: ', result);
        return result;
      }
    } catch (error) {
      console.log('SW unregistration failed: ', error);
    }
  }
  return false;
};

export const updateServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('SW update triggered');
      }
    } catch (error) {
      console.log('SW update failed: ', error);
    }
  }
};

const showUpdateAvailable = (): void => {
  // This would typically show a notification to the user
  console.log('New app version available! Refresh to update.');
  
  // You can integrate with your notification system here
  if (window.confirm('New version available! Refresh to update?')) {
    window.location.reload();
  }
};

// PWA install prompt handling
export const promptInstall = async (): Promise<boolean> => {
  const deferredPrompt = (window as any).deferredPrompt;
  
  if (!deferredPrompt) {
    console.log('PWA install prompt not available');
    return false;
  }
  
  try {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA install accepted');
      return true;
    } else {
      console.log('PWA install dismissed');
      return false;
    }
  } catch (error) {
    console.log('PWA install prompt failed: ', error);
    return false;
  } finally {
    (window as any).deferredPrompt = null;
  }
};

// Check if app is installed
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches ||
         (window.navigator as any).standalone === true;
};

// Check if install is available
export const isInstallAvailable = (): boolean => {
  return !!(window as any).deferredPrompt;
};

// Network status handling
export const getNetworkStatus = (): boolean => {
  return navigator.onLine;
};

export const addNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Cache management
export const clearAppCache = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('App cache cleared');
    } catch (error) {
      console.log('Cache clearing failed: ', error);
    }
  }
};

// Storage usage estimation
export const getStorageUsage = async (): Promise<{
  quota: number;
  usage: number;
  usagePercent: number;
} | null> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        usagePercent: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0
      };
    } catch (error) {
      console.log('Storage estimation failed: ', error);
    }
  }
  return null;
};
