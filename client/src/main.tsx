import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, ErrorInfo, ReactNode } from "react";
import App from "./App";
import "./index.css";
import { FirebaseProvider } from "./components/Firebase/FirebaseProvider";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#1a1a1a', 
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h1>SafiBuilds Block Puzzle</h1>
          <p>Something went wrong loading the game.</p>
          <pre style={{ background: '#333', padding: '10px', fontSize: '12px' }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Reload Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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

// Defensive root element check
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found');
  document.body.innerHTML = `
    <div style="padding: 20px; background: #1a1a1a; color: #fff; font-family: Arial; min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
      <h1>SafiBuilds Block Puzzle</h1>
      <p>Error: Root element not found</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Reload Game</button>
    </div>
  `;
} else {
  console.log('Root element found, creating React app');
  
  createRoot(rootElement).render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
