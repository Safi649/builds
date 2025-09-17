export interface BlockShape {
  id: string;
  cells: boolean[][];
  color: string;
}

export interface GameCell {
  filled: boolean;
  color: string;
}

export interface GameState {
  board: GameCell[][];
  score: number;
  level: number;
  linesCleared: number;
  nextBlocks: BlockShape[];
  isGameOver: boolean;
  isPaused: boolean;
  canPlaceAnyBlock: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface ScorePopup {
  id: string;
  points: number;
  position: Position;
  timestamp: number;
}

export interface HighScore {
  id: string;
  playerName: string;
  score: number;
  level: number;
  timestamp: number;
  isLocal: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  showHints: boolean;
  autoSave: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isAnonymous: boolean;
  highScore: number;
  gamesPlayed: number;
  totalScore: number;
}
