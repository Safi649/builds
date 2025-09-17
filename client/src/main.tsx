import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { FirebaseProvider } from "./components/Firebase/FirebaseProvider";

// Service Worker Management
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Register service worker in production
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('SW registered: ', registration);
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
} else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Clear service worker and caches in development
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => caches.delete(cacheName));
  });
  console.log('Development mode: cleared service worker and caches');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

console.log('App mount - main.tsx loaded');

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </QueryClientProvider>
);
