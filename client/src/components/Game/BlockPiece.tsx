import React, { useCallback, useRef, useState } from "react";
import { useBlockGame } from "../../lib/stores/useBlockGame";
import { BlockShape } from "../../types/game";
import { cn } from "../../lib/utils";

interface BlockPieceProps {
  block: BlockShape;
  className?: string;
  disabled?: boolean;
}

export const BlockPiece: React.FC<BlockPieceProps> = ({ 
  block, 
  className,
  disabled = false
}) => {
  const { selectBlock, setDraggedBlock, selectedBlock } = useBlockGame();
  const [isDragging, setIsDragging] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const isSelected = selectedBlock?.id === block.id;

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    setDraggedBlock(block);
    setIsDragging(true);
    
    // Create a custom drag image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cellSize = 30;
      canvas.width = block.cells[0].length * cellSize;
      canvas.height = block.cells.length * cellSize;
      
      ctx.fillStyle = block.color;
      block.cells.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell) {
            ctx.fillRect(j * cellSize, i * cellSize, cellSize - 2, cellSize - 2);
          }
        });
      });
      
      e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
    }
  }, [block, setDraggedBlock, disabled]);

  const handleDragEnd = useCallback(() => {
    setDraggedBlock(null);
    setIsDragging(false);
  }, [setDraggedBlock]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    selectBlock(block);
  }, [block, selectBlock, disabled]);

  // Touch handling for mobile drag
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    selectBlock(block);
  }, [block, selectBlock, disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Start dragging if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      setDraggedBlock(block);
      setIsDragging(true);
      e.preventDefault(); // Prevent scrolling
    }
  }, [block, setDraggedBlock, disabled]);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
    if (isDragging) {
      setDraggedBlock(null);
      setIsDragging(false);
    }
  }, [isDragging, setDraggedBlock]);

  // Add touch event listeners
  React.useEffect(() => {
    const element = blockRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const maxCols = Math.max(...block.cells.map(row => row.length));
  const gridCols = `grid-cols-${Math.min(maxCols, 5)}`;

  return (
    <div
      ref={blockRef}
      className={cn(
        "block-piece inline-block p-2 rounded-lg transition-all duration-200",
        "bg-card border border-border/50 hover:border-border",
        "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-primary ring-opacity-50 transform scale-105",
        isDragging && "dragging opacity-50 transform scale-110",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div 
        className={cn("grid gap-1", gridCols)}
        style={{ 
          gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))` 
        }}
      >
        {block.cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square rounded-sm transition-all duration-200",
                "w-6 h-6 md:w-8 md:h-8"
              )}
              style={{
                backgroundColor: cell ? block.color : "transparent",
                boxShadow: cell 
                  ? `inset 0 0 0 1px ${block.color}dd, 0 1px 3px rgba(0,0,0,0.2)`
                  : "none"
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
