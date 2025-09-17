import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GameState, BlockShape, Position, ScorePopup } from "../../types/game";
import { 
  initializeGameState, 
  updateGameStateAfterMove, 
  canPlaceBlock,
  getBestMoveHint
} from "../game/gameLogic";
import { saveLocalHighScore, isHighScore } from "../game/scoring";

interface BlockGameState extends GameState {
  // UI state
  selectedBlock: BlockShape | null;
  draggedBlock: BlockShape | null;
  scorePopups: ScorePopup[];
  showHint: boolean;
  hintMove: { block: BlockShape; position: Position } | null;
  
  // Actions
  startNewGame: () => void;
  selectBlock: (block: BlockShape) => void;
  setDraggedBlock: (block: BlockShape | null) => void;
  placeBlock: (block: BlockShape, position: Position) => boolean;
  pauseGame: () => void;
  resumeGame: () => void;
  addScorePopup: (points: number, position: Position) => void;
  removeScorePopup: (id: string) => void;
  toggleHint: () => void;
  getHint: () => void;
  canPlaceBlockAt: (block: BlockShape, position: Position) => boolean;
}

export const useBlockGame = create<BlockGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initialize with empty game state
    ...initializeGameState(),
    
    // UI state
    selectedBlock: null,
    draggedBlock: null,
    scorePopups: [],
    showHint: false,
    hintMove: null,
    
    // Actions
    startNewGame: () => {
      const newGameState = initializeGameState();
      set({
        ...newGameState,
        selectedBlock: null,
        draggedBlock: null,
        scorePopups: [],
        showHint: false,
        hintMove: null
      });
    },
    
    selectBlock: (block: BlockShape) => {
      set({ selectedBlock: block });
    },
    
    setDraggedBlock: (block: BlockShape | null) => {
      set({ draggedBlock: block });
    },
    
    placeBlock: (block: BlockShape, position: Position) => {
      const state = get();
      
      if (!canPlaceBlock(state.board, block, position)) {
        return false;
      }
      
      const newGameState = updateGameStateAfterMove(state, block, position);
      
      // Check if this is a new high score
      if (newGameState.isGameOver && isHighScore(newGameState.score)) {
        const highScore = {
          id: `local_${Date.now()}`,
          playerName: "Player",
          score: newGameState.score,
          level: newGameState.level,
          timestamp: Date.now(),
          isLocal: true
        };
        saveLocalHighScore(highScore);
      }
      
      set({
        ...newGameState,
        selectedBlock: null,
        draggedBlock: null,
        hintMove: null
      });
      
      return true;
    },
    
    pauseGame: () => {
      set(state => ({ isPaused: true }));
    },
    
    resumeGame: () => {
      set(state => ({ isPaused: false }));
    },
    
    addScorePopup: (points: number, position: Position) => {
      const popup: ScorePopup = {
        id: `popup_${Date.now()}_${Math.random()}`,
        points,
        position,
        timestamp: Date.now()
      };
      
      set(state => ({
        scorePopups: [...state.scorePopups, popup]
      }));
      
      // Auto-remove after animation
      setTimeout(() => {
        get().removeScorePopup(popup.id);
      }, 1000);
    },
    
    removeScorePopup: (id: string) => {
      set(state => ({
        scorePopups: state.scorePopups.filter(popup => popup.id !== id)
      }));
    },
    
    toggleHint: () => {
      set(state => ({ showHint: !state.showHint }));
    },
    
    getHint: () => {
      const state = get();
      const hint = getBestMoveHint(state.board, state.nextBlocks);
      set({ hintMove: hint });
    },
    
    canPlaceBlockAt: (block: BlockShape, position: Position) => {
      const state = get();
      return canPlaceBlock(state.board, block, position);
    }
  }))
);

// Subscribe to game over events
useBlockGame.subscribe(
  (state) => state.isGameOver,
  (isGameOver) => {
    if (isGameOver) {
      console.log("Game Over!");
      // You can add additional game over logic here
    }
  }
);

// Subscribe to level changes
useBlockGame.subscribe(
  (state) => state.level,
  (level, previousLevel) => {
    if (level > previousLevel) {
      console.log(`Level up! Now at level ${level}`);
      // You can add level up animations or sounds here
    }
  }
);
