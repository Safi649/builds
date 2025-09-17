import React from "react";
import { ScorePopup as ScorePopupType } from "../../types/game";
import { formatScore } from "../../lib/game/scoring";
import { cn } from "../../lib/utils";

interface ScorePopupProps {
  popup: ScorePopupType;
  className?: string;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ popup, className }) => {
  return (
    <div
      className={cn(
        "score-popup absolute pointer-events-none z-50",
        "text-lg font-bold text-primary drop-shadow-lg",
        "transform -translate-x-1/2 -translate-y-1/2",
        className
      )}
      style={{
        left: `${(popup.position.col + 0.5) * 10}%`,
        top: `${(popup.position.row + 0.5) * 10}%`,
      }}
    >
      +{formatScore(popup.points)}
    </div>
  );
};
