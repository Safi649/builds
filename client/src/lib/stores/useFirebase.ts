import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";
import { HighScore, UserProfile } from "../../types/game";

interface FirebaseState {
  // Configuration
  isEnabled: boolean;
  isInitialized: boolean;
  
  // Authentication
  user: User | null;
  userProfile: UserProfile | null;
  isAnonymous: boolean;
  
  // Leaderboard
  onlineHighScores: HighScore[];
  isLoadingScores: boolean;
  
  // Actions
  setEnabled: (enabled: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setOnlineHighScores: (scores: HighScore[]) => void;
  setLoadingScores: (loading: boolean) => void;
  
  // Auth actions
  signInAnonymously: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Firestore actions
  saveHighScore: (score: HighScore) => Promise<void>;
  loadHighScores: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useFirebase = create<FirebaseState>()(
  persist(
    (set, get) => ({
      // Configuration
      isEnabled: false,
      isInitialized: false,
      
      // Authentication
      user: null,
      userProfile: null,
      isAnonymous: false,
      
      // Leaderboard
      onlineHighScores: [],
      isLoadingScores: false,
      
      // Actions
      setEnabled: (enabled: boolean) => {
        set({ isEnabled: enabled });
      },
      
      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized });
      },
      
      setUser: (user: User | null) => {
        set({ 
          user, 
          isAnonymous: user?.isAnonymous || false 
        });
      },
      
      setUserProfile: (profile: UserProfile | null) => {
        set({ userProfile: profile });
      },
      
      setOnlineHighScores: (scores: HighScore[]) => {
        set({ onlineHighScores: scores });
      },
      
      setLoadingScores: (loading: boolean) => {
        set({ isLoadingScores: loading });
      },
      
      // Auth actions (will be implemented by Firebase provider)
      signInAnonymously: async () => {
        console.log("Firebase not enabled - signInAnonymously");
      },
      
      signInWithGoogle: async () => {
        console.log("Firebase not enabled - signInWithGoogle");
      },
      
      signOut: async () => {
        console.log("Firebase not enabled - signOut");
        set({ 
          user: null, 
          userProfile: null, 
          isAnonymous: false 
        });
      },
      
      // Firestore actions (will be implemented by Firebase provider)
      saveHighScore: async (score: HighScore) => {
        console.log("Firebase not enabled - saveHighScore", score);
      },
      
      loadHighScores: async () => {
        console.log("Firebase not enabled - loadHighScores");
        set({ isLoadingScores: false });
      },
      
      updateUserProfile: async (updates: Partial<UserProfile>) => {
        console.log("Firebase not enabled - updateUserProfile", updates);
      }
    }),
    {
      name: "safibuilds-firebase-storage",
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        userProfile: state.userProfile
      })
    }
  )
);
