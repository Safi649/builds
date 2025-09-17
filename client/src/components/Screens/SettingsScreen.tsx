import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Smartphone, 
  Wifi, 
  WifiOff,
  User,
  LogIn,
  LogOut,
  Trash2,
  Download,
  Shield,
  Bell,
  HelpCircle
} from "lucide-react";
import { useTheme } from "../../lib/stores/useTheme";
import { useAudio } from "../../lib/stores/useAudio";
import { useFirebase } from "../../lib/stores/useFirebase";
import { useFirebaseContext } from "../Firebase/FirebaseProvider";
import { getLocalStorage, setLocalStorage } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  showHints: boolean;
  autoSave: boolean;
}

export const SettingsScreen: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isMuted, toggleMute } = useAudio();
  const { 
    isEnabled: isFirebaseEnabled, 
    setEnabled: setFirebaseEnabled,
    user, 
    userProfile,
    signInAnonymously,
    signInWithGoogle,
    signOut 
  } = useFirebase();
  const { isConfigured } = useFirebaseContext();

  // Local settings state
  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    const saved = getLocalStorage("safibuilds_game_settings");
    return saved || {
      soundEnabled: !isMuted,
      musicEnabled: true,
      vibrationEnabled: true,
      showHints: true,
      autoSave: true
    };
  });

  const [playerName, setPlayerName] = useState(() => {
    return getLocalStorage("safibuilds_player_name") || "Player";
  });

  const updateGameSettings = (key: keyof GameSettings, value: boolean) => {
    const newSettings = { ...gameSettings, [key]: value };
    setGameSettings(newSettings);
    setLocalStorage("safibuilds_game_settings", newSettings);
    
    // Apply audio setting immediately
    if (key === "soundEnabled" && value !== !isMuted) {
      toggleMute();
    }
  };

  const updatePlayerName = (name: string) => {
    setPlayerName(name);
    setLocalStorage("safibuilds_player_name", name);
  };

  const clearAllData = () => {
    localStorage.removeItem("safibuilds_block_puzzle_high_scores");
    localStorage.removeItem("safibuilds_game_settings");
    localStorage.removeItem("safibuilds_player_name");
    localStorage.removeItem("safibuilds-theme-storage");
    localStorage.removeItem("safibuilds-firebase-storage");
    
    toast.success("All local data cleared successfully");
    
    // Reset to defaults
    setGameSettings({
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
      showHints: true,
      autoSave: true
    });
    setPlayerName("Player");
    setTheme("system");
  };

  const handleFirebaseSignIn = async (method: "anonymous" | "google") => {
    try {
      if (method === "anonymous") {
        await signInAnonymously();
        toast.success("Signed in as guest");
      } else {
        await signInWithGoogle();
        toast.success("Signed in with Google");
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error("Sign in failed. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Sign out failed. Please try again.");
    }
  };

  const installPWA = () => {
    const installEvent = (window as any).deferredPrompt;
    if (installEvent) {
      installEvent.prompt();
      installEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success("App installed successfully!");
        }
      });
    } else {
      toast.info("App is already installed or installation is not available");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Settings
          </CardTitle>
          <CardDescription>
            Customize your game experience
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Game Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Game Settings</CardTitle>
          <CardDescription>
            Configure gameplay preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {gameSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <Label htmlFor="sound">Sound Effects</Label>
            </div>
            <Switch
              id="sound"
              checked={gameSettings.soundEnabled}
              onCheckedChange={(checked) => updateGameSettings("soundEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <Label htmlFor="music">Background Music</Label>
            </div>
            <Switch
              id="music"
              checked={gameSettings.musicEnabled}
              onCheckedChange={(checked) => updateGameSettings("musicEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <Label htmlFor="vibration">Vibration (Mobile)</Label>
            </div>
            <Switch
              id="vibration"
              checked={gameSettings.vibrationEnabled}
              onCheckedChange={(checked) => updateGameSettings("vibrationEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <Label htmlFor="hints">Show Hints</Label>
            </div>
            <Switch
              id="hints"
              checked={gameSettings.showHints}
              onCheckedChange={(checked) => updateGameSettings("showHints", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <Label htmlFor="autosave">Auto Save Progress</Label>
            </div>
            <Switch
              id="autosave"
              checked={gameSettings.autoSave}
              onCheckedChange={(checked) => updateGameSettings("autoSave", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
          <CardDescription>
            Customize the app's look and feel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {resolvedTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <Label>Theme</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
              >
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Player Profile</CardTitle>
          <CardDescription>
            Manage your player information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playername">Player Name</Label>
            <Input
              id="playername"
              value={playerName}
              onChange={(e) => updatePlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Online Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {isFirebaseEnabled ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-gray-500" />}
            Online Features
            {!isConfigured && <Badge variant="secondary">Not Configured</Badge>}
          </CardTitle>
          <CardDescription>
            Connect to save progress and compete globally
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConfigured ? (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="firebase">Enable Online Features</Label>
                <Switch
                  id="firebase"
                  checked={isFirebaseEnabled}
                  onCheckedChange={setFirebaseEnabled}
                />
              </div>

              {isFirebaseEnabled && (
                <div className="space-y-4 pt-4 border-t">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{userProfile?.displayName || "Anonymous"}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.isAnonymous ? "Guest Account" : userProfile?.email}
                          </p>
                        </div>
                      </div>
                      
                      {user.isAnonymous && (
                        <Button
                          onClick={() => handleFirebaseSignIn("google")}
                          variant="outline"
                          className="w-full"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Upgrade to Google Account
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleFirebaseSignIn("google")}
                        className="w-full"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In with Google
                      </Button>
                      
                      <Button
                        onClick={() => handleFirebaseSignIn("anonymous")}
                        variant="outline"
                        className="w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Continue as Guest
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Online features require Firebase configuration
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">App Management</CardTitle>
          <CardDescription>
            Install and manage the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={installPWA}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your local game data, including high scores, 
                  settings, and progress. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllData} className="bg-destructive text-destructive-foreground">
                  Clear Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">App Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Version: 1.0.0</p>
          <p>Build: Production</p>
          <p>Package: com.safibuilds.blockblast.web</p>
          <p>© 2024 SafiBuilds. All rights reserved.</p>
        </CardContent>
      </Card>

      {/* Ad Banner Placeholder */}
      <div className="ad-banner">
        <span>Advertisement Space</span>
      </div>
    </div>
  );
};
