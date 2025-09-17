import React, { useEffect, createContext, useContext } from "react";
import { User } from "firebase/auth";
import { useFirebase } from "../../lib/stores/useFirebase";
import { isFirebaseConfigured, initializeFirebase } from "../../lib/firebase/config";
import { 
  onAuthStateChange, 
  signInAnonymously as authSignInAnonymously,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  getUserProfile,
  updateUserStats
} from "../../lib/firebase/auth";
import {
  saveHighScoreToFirestore,
  getGlobalHighScores,
  getUserHighScores
} from "../../lib/firebase/firestore";
import { HighScore, UserProfile } from "../../types/game";

interface FirebaseContextType {
  isConfigured: boolean;
  isEnabled: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  isConfigured: false,
  isEnabled: false
});

export const useFirebaseContext = () => useContext(FirebaseContext);

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const {
    isEnabled,
    setInitialized,
    setUser,
    setUserProfile,
    setOnlineHighScores,
    setLoadingScores
  } = useFirebase();

  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured || !isEnabled) {
      return;
    }

    try {
      // Initialize Firebase
      initializeFirebase();
      setInitialized(true);

      // Set up auth state listener
      const unsubscribe = onAuthStateChange(async (user: User | null) => {
        setUser(user);
        
        if (user) {
          // Load user profile
          try {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
          } catch (error) {
            console.error("Failed to load user profile:", error);
          }
        } else {
          setUserProfile(null);
        }
      });

      // Override Firebase actions in store
      useFirebase.setState({
        signInAnonymously: async () => {
          try {
            await authSignInAnonymously();
          } catch (error) {
            console.error("Anonymous sign-in failed:", error);
            throw error;
          }
        },

        signInWithGoogle: async () => {
          try {
            await authSignInWithGoogle();
          } catch (error) {
            console.error("Google sign-in failed:", error);
            throw error;
          }
        },

        signOut: async () => {
          try {
            await authSignOut();
          } catch (error) {
            console.error("Sign-out failed:", error);
            throw error;
          }
        },

        saveHighScore: async (score: HighScore) => {
          try {
            const user = useFirebase.getState().user;
            if (!user) {
              throw new Error("User not authenticated");
            }

            const scoreWithUser = {
              ...score,
              uid: user.uid,
              playerName: useFirebase.getState().userProfile?.displayName || "Anonymous"
            };

            await saveHighScoreToFirestore(scoreWithUser);
            
            // Update user stats
            await updateUserStats(user.uid, score.score, score.level);
            
            // Reload leaderboard
            await useFirebase.getState().loadHighScores();
          } catch (error) {
            console.error("Failed to save high score:", error);
            throw error;
          }
        },

        loadHighScores: async () => {
          try {
            setLoadingScores(true);
            const scores = await getGlobalHighScores(50);
            setOnlineHighScores(scores);
          } catch (error) {
            console.error("Failed to load high scores:", error);
          } finally {
            setLoadingScores(false);
          }
        },

        updateUserProfile: async (updates: Partial<UserProfile>) => {
          try {
            const user = useFirebase.getState().user;
            if (!user) {
              throw new Error("User not authenticated");
            }

            await import("../../lib/firebase/auth").then(({ updateUserProfile }) =>
              updateUserProfile(user.uid, updates)
            );

            // Update local state
            const currentProfile = useFirebase.getState().userProfile;
            if (currentProfile) {
              setUserProfile({ ...currentProfile, ...updates });
            }
          } catch (error) {
            console.error("Failed to update user profile:", error);
            throw error;
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setInitialized(false);
    }
  }, [isConfigured, isEnabled, setInitialized, setUser, setUserProfile, setOnlineHighScores, setLoadingScores]);

  return (
    <FirebaseContext.Provider value={{ isConfigured, isEnabled }}>
      {children}
    </FirebaseContext.Provider>
  );
};
