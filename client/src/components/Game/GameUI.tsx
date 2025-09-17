import React from "react";
import { useBlockGame } from "../../lib/stores/useBlockGame";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { BlockPiece } from "./BlockPiece";
import { Pause, RotateCcw, Lightbulb, LightbulbOff } from "lucide-react";
import { formatScore, calculateRank } from "../../lib/game/scoring";
import { cn } from "../../lib/utils";

interface GameUIProps {
  onPause: () => void;
  onRestart: () => void;
  className?: string;
}

export const GameUI: React.FC<GameUIProps> = ({ 
  onPause, 
  onRestart, 
  className 
}) => {
  const {
    score,
    level,
    nextBlocks,
    isGameOver,
    isPaused,
    canPlaceAnyBlock,
    showHint,
    toggleHint,
    getHint
  } = useBlockGame();

  const rank = calculateRank(score);
  const levelProgress = ((score % 5000) / 5000) * 100;

  const handleHintToggle = () => {
    if (!showHint) {
      getHint();
    }
    toggleHint();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Score and Level */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-primary">
                {formatScore(score)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-2xl font-bold text-secondary-foreground">
                {level}
              </p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
          
          {/* Rank */}
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">Rank</p>
            <p className="text-sm font-semibold text-primary">{rank.rank}</p>
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPause}
          disabled={isGameOver}
          className="flex-1"
        >
          <Pause className="w-4 h-4 mr-1" />
          Pause
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleHintToggle}
          disabled={isGameOver || !canPlaceAnyBlock}
          className={cn(
            "flex-1",
            showHint && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          )}
        >
          {showHint ? (
            <LightbulbOff className="w-4 h-4 mr-1" />
          ) : (
            <Lightbulb className="w-4 h-4 mr-1" />
          )}
          Hint
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Restart
        </Button>
      </div>

      {/* Next Blocks */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-center mb-3">Next Blocks</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {nextBlocks.map((block) => (
              <BlockPiece
                key={block.id}
                block={block}
                disabled={isGameOver || isPaused}
                className="transform hover:scale-105 transition-transform"
              />
            ))}
          </div>
          
          {!canPlaceAnyBlock && !isGameOver && (
            <p className="text-xs text-center text-destructive mt-2">
              No valid moves available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ad Banner Placeholder */}
      <div className="ad-banner">
        <span>Advertisement Space</span>
      </div>
    </div>
  );
};
