import { 
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { initializeFirebase } from "./config";
import { UserProfile } from "../../types/game";

const { auth, firestore } = initializeFirebase();

// Sign in anonymously
export async function signInAnonymously(): Promise<User> {
  const result = await firebaseSignInAnonymously(auth);
  await createOrUpdateUserProfile(result.user);
  return result.user;
}

// Sign in with Google
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await createOrUpdateUserProfile(result.user);
  return result.user;
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Create or update user profile in Firestore
export async function createOrUpdateUserProfile(user: User): Promise<void> {
  const userRef = doc(firestore, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create new user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || "Anonymous Player",
      email: user.email || "",
      photoURL: user.photoURL || "",
      isAnonymous: user.isAnonymous,
      highScore: 0,
      gamesPlayed: 0,
      totalScore: 0
    };
    
    await setDoc(userRef, {
      ...userProfile,
      createdAt: new Date(),
      lastLoginAt: new Date()
    });
  } else {
    // Update last login
    await updateDoc(userRef, {
      lastLoginAt: new Date(),
      displayName: user.displayName || userSnap.data().displayName,
      email: user.email || userSnap.data().email,
      photoURL: user.photoURL || userSnap.data().photoURL
    });
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
}

// Update user profile
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date()
  });
}

// Update user stats after game
export async function updateUserStats(uid: string, score: number, level: number): Promise<void> {
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data();
    await updateDoc(userRef, {
      gamesPlayed: (userData.gamesPlayed || 0) + 1,
      totalScore: (userData.totalScore || 0) + score,
      highScore: Math.max(userData.highScore || 0, score),
      updatedAt: new Date()
    });
  }
}

// Set up auth state listener
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
