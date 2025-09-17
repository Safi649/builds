import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  Play,
  RotateCcw,
  Home,
  Settings,
  Volume2,
  VolumeX,
  Lightbulb,
  Target,
  Pause
} from "lucide-react";
import { useBlockGame } from "../../lib/stores/useBlockGame";
import { useAudio } from "../../lib/stores/useAudio";
import { formatScore, calculateRank } from "../../lib/game/scoring";

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onClose,
  onRestart
}) => {
  const { 
    score, 
    level, 
    linesCleared, 
    resumeGame, 
    toggleHint, 
    showHint 
  } = useBlockGame();
  const { isMuted, toggleMute } = useAudio();

  const rank = calculateRank(score);

  const handleResume = () => {
    resumeGame();
    onClose();
  };

  const handleRestart = () => {
    onRestart();
    onClose();
  };

  const handleHome = () => {
    onClose();
    window.location.href = "/";
  };

  const handleSettings = () => {
    onClose();
    window.location.href = "/settings";
  };

  const tips = [
    "Try to clear multiple lines at once for higher scores",
    "Look for opportunities to clear 3×3 squares for bonus points",
    "Plan ahead - consider how each piece affects future moves",
    "Save smaller pieces for tight spaces later in the game",
    "Combo clears give you score multipliers",
    "Use the hint feature when you're stuck"
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Pause className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl">Game Paused</DialogTitle>
          <DialogDescription>
            Take a break and resume when you're ready
          </DialogDescription>
        </DialogHeader>

        {/* Current Game Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {formatScore(score)}
                </p>
                <p className="text-sm text-muted-foreground">Current Score</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold">{level}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{linesCleared}</p>
                  <p className="text-xs text-muted-foreground">Lines Cleared</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{rank.rank}</p>
                  <p className="text-xs text-muted-foreground">Rank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Tip */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Pro Tip</h4>
                <p className="text-sm text-muted-foreground">{randomTip}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={toggleMute}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
            
            <Button
              onClick={toggleHint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          </div>

          <Separator />

          {/* Main Actions */}
          <Button onClick={handleResume} className="w-full" size="lg">
            <Play className="w-4 h-4 mr-2" />
            Resume Game
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
            
            <Button onClick={handleSettings} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          <Button onClick={handleHome} variant="ghost" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Exit to Home
          </Button>
        </div>

        {/* Achievement Progress (if any) */}
        {score > 1000 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Great Progress!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  You're on track for a high score
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ad Banner Placeholder */}
        <div className="ad-banner">
          <span className="text-xs">Advertisement Space</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
