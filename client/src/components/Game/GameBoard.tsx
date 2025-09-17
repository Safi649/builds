import React, { useCallback, useRef, useEffect, useState } from "react";
import { useBlockGame } from "../../lib/stores/useBlockGame";
import { useAudio } from "../../lib/stores/useAudio";
import { BlockShape, Position } from "../../types/game";
import { BOARD_SIZE } from "../../lib/game/gameLogic";
import { cn } from "../../lib/utils";

interface GameBoardProps {
  className?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ className }) => {
  const {
    board,
    draggedBlock,
    canPlaceBlockAt,
    placeBlock,
    hintMove,
    showHint
  } = useBlockGame();
  
  const { playHit, playSuccess } = useAudio();
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const [isValidDrop, setIsValidDrop] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedBlock || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const cellSize = rect.width / BOARD_SIZE;
    
    const col = Math.floor((e.clientX - rect.left) / cellSize);
    const row = Math.floor((e.clientY - rect.top) / cellSize);
    
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      const position = { row, col };
      setDragPosition(position);
      setIsValidDrop(canPlaceBlockAt(draggedBlock, position));
    } else {
      setDragPosition(null);
      setIsValidDrop(false);
    }
  }, [draggedBlock, canPlaceBlockAt]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedBlock || !dragPosition || !isValidDrop) {
      playHit();
      return;
    }

    const success = placeBlock(draggedBlock, dragPosition);
    if (success) {
      playSuccess();
    } else {
      playHit();
    }
    
    setDragPosition(null);
    setIsValidDrop(false);
  }, [draggedBlock, dragPosition, isValidDrop, placeBlock, playHit, playSuccess]);

  const handleDragLeave = useCallback(() => {
    setDragPosition(null);
    setIsValidDrop(false);
  }, []);

  // Touch handling for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!draggedBlock || !boardRef.current) return;

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const cellSize = rect.width / BOARD_SIZE;
    
    const col = Math.floor((touch.clientX - rect.left) / cellSize);
    const row = Math.floor((touch.clientY - rect.top) / cellSize);
    
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      const position = { row, col };
      setDragPosition(position);
      setIsValidDrop(canPlaceBlockAt(draggedBlock, position));
    } else {
      setDragPosition(null);
      setIsValidDrop(false);
    }
  }, [draggedBlock, canPlaceBlockAt]);

  const handleTouchEnd = useCallback(() => {
    if (!draggedBlock || !dragPosition || !isValidDrop) {
      playHit();
      setDragPosition(null);
      setIsValidDrop(false);
      return;
    }

    const success = placeBlock(draggedBlock, dragPosition);
    if (success) {
      playSuccess();
    } else {
      playHit();
    }
    
    setDragPosition(null);
    setIsValidDrop(false);
  }, [draggedBlock, dragPosition, isValidDrop, placeBlock, playHit, playSuccess]);

  useEffect(() => {
    if (draggedBlock) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [draggedBlock, handleTouchMove, handleTouchEnd]);

  const isHintCell = useCallback((row: number, col: number): boolean => {
    if (!showHint || !hintMove) return false;
    
    const { block, position } = hintMove;
    
    for (let i = 0; i < block.cells.length; i++) {
      for (let j = 0; j < block.cells[i].length; j++) {
        if (block.cells[i][j] && 
            position.row + i === row && 
            position.col + j === col) {
          return true;
        }
      }
    }
    
    return false;
  }, [showHint, hintMove]);

  const isDragPreviewCell = useCallback((row: number, col: number): boolean => {
    if (!draggedBlock || !dragPosition) return false;
    
    for (let i = 0; i < draggedBlock.cells.length; i++) {
      for (let j = 0; j < draggedBlock.cells[i].length; j++) {
        if (draggedBlock.cells[i][j] && 
            dragPosition.row + i === row && 
            dragPosition.col + j === col) {
          return true;
        }
      }
    }
    
    return false;
  }, [draggedBlock, dragPosition]);

  return (
    <div
      ref={boardRef}
      className={cn(
        "game-board relative aspect-square w-full max-w-sm mx-auto",
        "grid grid-cols-10 gap-1 p-4 bg-card rounded-lg border",
        "select-none touch-none",
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isHint = isHintCell(rowIndex, colIndex);
          const isDragPreview = isDragPreviewCell(rowIndex, colIndex);
          const shouldShowDragPreview = isDragPreview && isValidDrop;
          const shouldShowInvalidDrag = isDragPreview && !isValidDrop;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "game-cell aspect-square rounded-sm border transition-all duration-200",
                "border-border/50",
                cell.filled && "filled",
                isHint && "ring-2 ring-yellow-400 ring-opacity-50",
                shouldShowDragPreview && "valid-drop",
                shouldShowInvalidDrag && "invalid-drop"
              )}
              style={{
                backgroundColor: cell.filled 
                  ? cell.color 
                  : shouldShowDragPreview 
                    ? draggedBlock?.color + "40" 
                    : "transparent"
              }}
            />
          );
        })
      )}
    </div>
  );
};
