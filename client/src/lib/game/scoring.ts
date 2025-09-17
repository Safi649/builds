import { HighScore } from "../../types/game";
import { getLocalStorage, setLocalStorage } from "../utils";

const HIGH_SCORES_KEY = "safibuilds_block_puzzle_high_scores";
const MAX_LOCAL_SCORES = 10;

// Get local high scores
export function getLocalHighScores(): HighScore[] {
  const scores = getLocalStorage(HIGH_SCORES_KEY) || [];
  return scores.sort((a: HighScore, b: HighScore) => b.score - a.score);
}

// Save high score locally
export function saveLocalHighScore(score: HighScore): void {
  const currentScores = getLocalHighScores();
  const newScores = [...currentScores, score];
  
  // Sort by score (highest first) and keep only top scores
  newScores.sort((a, b) => b.score - a.score);
  const topScores = newScores.slice(0, MAX_LOCAL_SCORES);
  
  setLocalStorage(HIGH_SCORES_KEY, topScores);
}

// Check if score qualifies for high score list
export function isHighScore(score: number): boolean {
  const currentScores = getLocalHighScores();
  
  if (currentScores.length < MAX_LOCAL_SCORES) {
    return true;
  }
  
  const lowestScore = currentScores[currentScores.length - 1]?.score || 0;
  return score > lowestScore;
}

// Generate score statistics
export function getScoreStatistics(): {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  bestLevel: number;
} {
  const scores = getLocalHighScores();
  
  if (scores.length === 0) {
    return {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      bestLevel: 0
    };
  }
  
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const bestScore = scores[0]?.score || 0;
  const bestLevel = Math.max(...scores.map(score => score.level));
  
  return {
    gamesPlayed: scores.length,
    totalScore,
    averageScore: Math.round(totalScore / scores.length),
    bestScore,
    bestLevel
  };
}

// Format score for display
export function formatScore(score: number): string {
  if (score >= 1000000) {
    return `${(score / 1000000).toFixed(1)}M`;
  } else if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}K`;
  }
  return score.toString();
}

// Calculate rank based on score
export function calculateRank(score: number): {
  rank: string;
  nextRank: string;
  progress: number;
} {
  const ranks = [
    { name: "Novice", minScore: 0 },
    { name: "Amateur", minScore: 1000 },
    { name: "Skilled", minScore: 5000 },
    { name: "Expert", minScore: 15000 },
    { name: "Master", minScore: 35000 },
    { name: "Grand Master", minScore: 75000 },
    { name: "Legend", minScore: 150000 }
  ];
  
  let currentRank = ranks[0];
  let nextRank = ranks[1];
  
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (score >= ranks[i].minScore) {
      currentRank = ranks[i];
      nextRank = ranks[i + 1] || ranks[i];
      break;
    }
  }
  
  const progress = nextRank === currentRank 
    ? 100 
    : ((score - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100;
  
  return {
    rank: currentRank.name,
    nextRank: nextRank.name,
    progress: Math.min(100, Math.max(0, progress))
  };
}

// Share score using Web Share API
export async function shareScore(score: number, level: number): Promise<boolean> {
  if (!navigator.share) {
    // Fallback to clipboard
    const text = `I just scored ${formatScore(score)} points and reached level ${level} in SafiBuilds Block Puzzle! Can you beat it?`;
    
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }
  
  try {
    await navigator.share({
      title: "SafiBuilds Block Puzzle",
      text: `I just scored ${formatScore(score)} points and reached level ${level} in SafiBuilds Block Puzzle! Can you beat it?`,
      url: window.location.href
    });
    return true;
  } catch (error) {
    console.error("Share failed:", error);
    return false;
  }
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export function checkAchievements(score: number, level: number): Achievement[] {
  const achievements: Achievement[] = [
    {
      id: "first_game",
      name: "First Steps",
      description: "Complete your first game",
      icon: "🎮",
      unlocked: false
    },
    {
      id: "score_1k",
      name: "Rising Star",
      description: "Score 1,000 points",
      icon: "⭐",
      unlocked: score >= 1000
    },
    {
      id: "score_10k",
      name: "High Scorer",
      description: "Score 10,000 points",
      icon: "🏆",
      unlocked: score >= 10000
    },
    {
      id: "level_10",
      name: "Dedicated Player",
      description: "Reach level 10",
      icon: "💎",
      unlocked: level >= 10
    },
    {
      id: "level_25",
      name: "Block Master",
      description: "Reach level 25",
      icon: "👑",
      unlocked: level >= 25
    }
  ];
  
  return achievements.filter(achievement => achievement.unlocked);
}
