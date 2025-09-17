import { GameCell, BlockShape, Position, GameState } from "../../types/game";
import { getLevelBasedBlockShapes } from "./blockShapes";

export const BOARD_SIZE = 10;

// Create empty game board
export function createEmptyBoard(): GameCell[][] {
  return Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill(null).map(() => ({
      filled: false,
      color: ""
    }))
  );
}

// Check if a block can be placed at a specific position
export function canPlaceBlock(
  board: GameCell[][],
  block: BlockShape,
  position: Position
): boolean {
  const { row, col } = position;
  
  for (let i = 0; i < block.cells.length; i++) {
    for (let j = 0; j < block.cells[i].length; j++) {
      if (block.cells[i][j]) {
        const boardRow = row + i;
        const boardCol = col + j;
        
        // Check bounds
        if (
          boardRow < 0 ||
          boardRow >= BOARD_SIZE ||
          boardCol < 0 ||
          boardCol >= BOARD_SIZE
        ) {
          return false;
        }
        
        // Check if cell is already filled
        if (board[boardRow][boardCol].filled) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Place a block on the board
export function placeBlock(
  board: GameCell[][],
  block: BlockShape,
  position: Position
): GameCell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { row, col } = position;
  
  for (let i = 0; i < block.cells.length; i++) {
    for (let j = 0; j < block.cells[i].length; j++) {
      if (block.cells[i][j]) {
        const boardRow = row + i;
        const boardCol = col + j;
        
        newBoard[boardRow][boardCol] = {
          filled: true,
          color: block.color
        };
      }
    }
  }
  
  return newBoard;
}

// Check for completed lines (rows, columns, or 3x3 squares)
export function checkCompletedLines(board: GameCell[][]): {
  rows: number[];
  cols: number[];
  squares: Position[];
} {
  const completedRows: number[] = [];
  const completedCols: number[] = [];
  const completedSquares: Position[] = [];
  
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (board[row].every(cell => cell.filled)) {
      completedRows.push(row);
    }
  }
  
  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    if (board.every(row => row[col].filled)) {
      completedCols.push(col);
    }
  }
  
  // Check 3x3 squares
  for (let startRow = 0; startRow <= BOARD_SIZE - 3; startRow += 3) {
    for (let startCol = 0; startCol <= BOARD_SIZE - 3; startCol += 3) {
      let isComplete = true;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[startRow + i][startCol + j].filled) {
            isComplete = false;
            break;
          }
        }
        if (!isComplete) break;
      }
      
      if (isComplete) {
        completedSquares.push({ row: startRow, col: startCol });
      }
    }
  }
  
  return { rows: completedRows, cols: completedCols, squares: completedSquares };
}

// Clear completed lines from the board
export function clearCompletedLines(
  board: GameCell[][],
  completedLines: { rows: number[]; cols: number[]; squares: Position[] }
): GameCell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  // Clear completed rows
  completedLines.rows.forEach(row => {
    for (let col = 0; col < BOARD_SIZE; col++) {
      newBoard[row][col] = { filled: false, color: "" };
    }
  });
  
  // Clear completed columns
  completedLines.cols.forEach(col => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      newBoard[row][col] = { filled: false, color: "" };
    }
  });
  
  // Clear completed 3x3 squares
  completedLines.squares.forEach(({ row: startRow, col: startCol }) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newBoard[startRow + i][startCol + j] = { filled: false, color: "" };
      }
    }
  });
  
  return newBoard;
}

// Check if any of the available blocks can be placed on the board
export function canPlaceAnyBlock(board: GameCell[][], blocks: BlockShape[]): boolean {
  for (const block of blocks) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (canPlaceBlock(board, block, { row, col })) {
          return true;
        }
      }
    }
  }
  return false;
}

// Calculate score based on placed blocks and cleared lines
export function calculateScore(
  placedCells: number,
  completedLines: { rows: number[]; cols: number[]; squares: Position[] },
  level: number
): number {
  let score = 0;
  
  // Base score for placing blocks
  score += placedCells * 10;
  
  // Bonus for clearing lines
  const totalRows = completedLines.rows.length;
  const totalCols = completedLines.cols.length;
  const totalSquares = completedLines.squares.length;
  
  // Row/column bonuses
  score += totalRows * 100 * level;
  score += totalCols * 100 * level;
  
  // 3x3 square bonuses (higher value)
  score += totalSquares * 300 * level;
  
  // Combo bonus
  const totalClears = totalRows + totalCols + totalSquares;
  if (totalClears > 1) {
    score += (totalClears - 1) * 200 * level; // Combo multiplier
  }
  
  return score;
}

// Get level based on score
export function getLevelFromScore(score: number): number {
  return Math.floor(score / 5000) + 1;
}

// Initialize new game state
export function initializeGameState(): GameState {
  return {
    board: createEmptyBoard(),
    score: 0,
    level: 1,
    linesCleared: 0,
    nextBlocks: getLevelBasedBlockShapes(1, 3),
    isGameOver: false,
    isPaused: false,
    canPlaceAnyBlock: true
  };
}

// Update game state after placing a block
export function updateGameStateAfterMove(
  currentState: GameState,
  placedBlock: BlockShape,
  position: Position
): GameState {
  // Place the block
  let newBoard = placeBlock(currentState.board, placedBlock, position);
  
  // Count placed cells for scoring
  const placedCells = placedBlock.cells.flat().filter(cell => cell).length;
  
  // Check for completed lines
  const completedLines = checkCompletedLines(newBoard);
  
  // Clear completed lines
  newBoard = clearCompletedLines(newBoard, completedLines);
  
  // Calculate score
  const newScore = currentState.score + calculateScore(placedCells, completedLines, currentState.level);
  
  // Update level
  const newLevel = getLevelFromScore(newScore);
  
  // Count total lines cleared
  const totalLinesCleared = completedLines.rows.length + completedLines.cols.length + (completedLines.squares.length * 3);
  const newLinesCleared = currentState.linesCleared + totalLinesCleared;
  
  // Remove the used block and add a new one if this was the last of the current set
  const remainingBlocks = currentState.nextBlocks.filter(block => block.id !== placedBlock.id);
  let nextBlocks = remainingBlocks;
  
  // If we used all blocks, generate new ones
  if (remainingBlocks.length === 0) {
    nextBlocks = getLevelBasedBlockShapes(newLevel, 3);
  }
  
  // Check if any block can be placed
  const canPlaceAny = canPlaceAnyBlock(newBoard, nextBlocks);
  
  return {
    board: newBoard,
    score: newScore,
    level: newLevel,
    linesCleared: newLinesCleared,
    nextBlocks,
    isGameOver: !canPlaceAny,
    isPaused: currentState.isPaused,
    canPlaceAnyBlock: canPlaceAny
  };
}

// Get hint for best move (simple heuristic)
export function getBestMoveHint(board: GameCell[][], blocks: BlockShape[]): {
  block: BlockShape;
  position: Position;
} | null {
  let bestMove = null;
  let bestScore = -1;
  
  for (const block of blocks) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const position = { row, col };
        
        if (canPlaceBlock(board, block, position)) {
          const tempBoard = placeBlock(board, block, position);
          const completedLines = checkCompletedLines(tempBoard);
          const totalClears = completedLines.rows.length + completedLines.cols.length + completedLines.squares.length;
          
          // Score this move
          let moveScore = totalClears * 100;
          
          // Prefer moves that create more space
          const clearedCells = (completedLines.rows.length * BOARD_SIZE) + 
                              (completedLines.cols.length * BOARD_SIZE) + 
                              (completedLines.squares.length * 9);
          moveScore += clearedCells * 10;
          
          if (moveScore > bestScore) {
            bestScore = moveScore;
            bestMove = { block, position };
          }
        }
      }
    }
  }
  
  return bestMove;
}
