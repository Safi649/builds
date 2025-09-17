import { 
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp
} from "firebase/firestore";
import { initializeFirebase } from "./config";
import { HighScore } from "../../types/game";

const { firestore } = initializeFirebase();

// Save high score to Firestore
export async function saveHighScoreToFirestore(score: HighScore): Promise<string> {
  const scoresCollection = collection(firestore, "highScores");
  
  const scoreData = {
    ...score,
    timestamp: Timestamp.fromDate(new Date(score.timestamp)),
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(scoresCollection, scoreData);
  return docRef.id;
}

// Get global high scores
export async function getGlobalHighScores(limitCount: number = 50): Promise<HighScore[]> {
  const scoresCollection = collection(firestore, "highScores");
  const q = query(
    scoresCollection,
    orderBy("score", "desc"),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp.toMillis(),
      isLocal: false
    } as HighScore;
  });
}

// Get user's high scores
export async function getUserHighScores(uid: string, limitCount: number = 10): Promise<HighScore[]> {
  const scoresCollection = collection(firestore, "highScores");
  const q = query(
    scoresCollection,
    where("uid", "==", uid),
    orderBy("score", "desc"),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp.toMillis(),
      isLocal: false
    } as HighScore;
  });
}

// Get recent high scores
export async function getRecentHighScores(limitCount: number = 20): Promise<HighScore[]> {
  const scoresCollection = collection(firestore, "highScores");
  const q = query(
    scoresCollection,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp.toMillis(),
      isLocal: false
    } as HighScore;
  });
}

// Get leaderboard with user's rank
export async function getLeaderboardWithRank(uid: string): Promise<{
  globalScores: HighScore[];
  userRank: number;
  userScore: HighScore | null;
}> {
  const globalScores = await getGlobalHighScores(100);
  const userScores = await getUserHighScores(uid, 1);
  const userScore = userScores[0] || null;
  
  let userRank = -1;
  if (userScore) {
    userRank = globalScores.findIndex(score => score.id === userScore.id) + 1;
    if (userRank === 0) {
      // User's score not in top 100, calculate approximate rank
      const scoresCollection = collection(firestore, "highScores");
      const q = query(
        scoresCollection,
        where("score", ">", userScore.score)
      );
      const querySnapshot = await getDocs(q);
      userRank = querySnapshot.size + 1;
    }
  }
  
  return {
    globalScores: globalScores.slice(0, 50), // Return top 50 for display
    userRank,
    userScore
  };
}

// Delete old scores (maintenance function)
export async function deleteOldScores(daysOld: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const scoresCollection = collection(firestore, "highScores");
  const q = query(
    scoresCollection,
    where("createdAt", "<", Timestamp.fromDate(cutoffDate))
  );
  
  const querySnapshot = await getDocs(q);
  const deletePromises = querySnapshot.docs.map(doc => import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(doc.ref)));
  await Promise.all(deletePromises);
  
  return querySnapshot.size;
}
