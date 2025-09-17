import React, { useEffect, useState } from "react";
import { useBlockGame } from "../../lib/stores/useBlockGame";
import { GameBoard } from "../Game/GameBoard";
import { GameUI } from "../Game/GameUI";
import { ScorePopup } from "../Game/ScorePopup";
import { GameOverModal } from "../Modals/GameOverModal";
import { PauseModal } from "../Modals/PauseModal";
import { Card, CardContent } from "../ui/card";

export const PlayScreen: React.FC = () => {
  const {
    isGameOver,
    isPaused,
    scorePopups,
    startNewGame
  } = useBlockGame();

  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle game over
  useEffect(() => {
    if (isGameOver) {
      setShowGameOverModal(true);
    }
  }, [isGameOver]);

  // Handle pause state
  useEffect(() => {
    setShowPauseModal(isPaused);
  }, [isPaused]);

  const handlePause = () => {
    const { pauseGame } = useBlockGame.getState();
    pauseGame();
  };

  const handleRestart = () => {
    startNewGame();
    setShowGameOverModal(false);
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <Card className="w-full max-w-lg">
            <CardContent className="p-4 relative">
              <GameBoard />
              
              {/* Score Popups */}
              {scorePopups.map((popup) => (
                <ScorePopup key={popup.id} popup={popup} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Game UI */}
        <div className="lg:col-span-1">
          <GameUI 
            onPause={handlePause}
            onRestart={handleRestart}
          />
        </div>
      </div>

      {/* Modals */}
      <GameOverModal 
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        onRestart={handleRestart}
      />
      
      <PauseModal 
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onRestart={handleRestart}
      />
    </div>
  );
};
