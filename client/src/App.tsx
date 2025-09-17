import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { useTheme } from "./lib/stores/useTheme";
import { useAudio } from "./lib/stores/useAudio";
import { Navigation } from "./components/Layout/Navigation";
import { Header } from "./components/Layout/Header";
import { HomeScreen } from "./components/Screens/HomeScreen";
import { PlayScreen } from "./components/Screens/PlayScreen";
import { LeaderboardScreen } from "./components/Screens/LeaderboardScreen";
import { SettingsScreen } from "./components/Screens/SettingsScreen";
import { AboutScreen } from "./components/Screens/AboutScreen";

function App() {
  const { theme } = useTheme();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    // Initialize audio
    const backgroundMusic = new Audio("/sounds/background.mp3");
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);

    // Register PWA install prompt
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
      deferredPrompt = e;
      // Show install button when available
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('PWA installed');
            }
            deferredPrompt = null;
          });
        });
      }
    });
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/play" element={<PlayScreen />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/about" element={<AboutScreen />} />
          </Routes>
        </main>
        <Navigation />
        <Toaster 
          theme={theme as "light" | "dark"}
          position="top-center"
          richColors
        />
      </div>
    </Router>
  );
}

export default App;
