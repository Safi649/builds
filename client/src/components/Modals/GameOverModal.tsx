import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import {
  Trophy,
  RotateCcw,
  Share2,
  Save,
  Home,
  Crown,
  Target,
  Zap,
  Star
} from "lucide-react";
import { useBlockGame } from "../../lib/stores/useBlockGame";
import { useFirebase } from "../../lib/stores/useFirebase";
import { formatScore, calculateRank, shareScore, isHighScore } from "../../lib/game/scoring";
import { getLocalStorage, setLocalStorage } from "../../lib/utils";

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onRestart
}) => {
  const { score, level, linesCleared } = useBlockGame();
  const { isEnabled: isFirebaseEnabled, user, saveHighScore } = useFirebase();
  
  const [playerName, setPlayerName] = useState(() => {
    return getLocalStorage("safibuilds_player_name") || "Player";
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const rank = calculateRank(score);
  const isNewHighScore = isHighScore(score);

  const handleShare = async () => {
    try {
      const success = await shareScore(score, level);
      if (success) {
        toast.success("Score shared successfully!");
      }
    } catch (error) {
      toast.error("Failed to share score");
    }
  };

  const handleSaveToLeaderboard = async () => {
    if (!isFirebaseEnabled || !user || hasSaved) return;

    setIsSaving(true);
    try {
      const highScore = {
        id: `${user.uid}_${Date.now()}`,
        playerName: user.displayName || playerName,
        score,
        level,
        timestamp: Date.now(),
        isLocal: false
      };

      await saveHighScore(highScore);
      setHasSaved(true);
      toast.success("Score saved to leaderboard!");
    } catch (error) {
      console.error("Failed to save high score:", error);
      toast.error("Failed to save score to leaderboard");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    onRestart();
    onClose();
    setHasSaved(false);
  };

  const handleGoHome = () => {
    onClose();
    window.location.href = "/";
  };

  const updatePlayerName = (name: string) => {
    setPlayerName(name);
    setLocalStorage("safibuilds_player_name", name);
  };

  const getScoreMessage = () => {
    if (score >= 100000) return "Legendary Performance! 🏆";
    if (score >= 50000) return "Outstanding! 🌟";
    if (score >= 25000) return "Excellent! 💎";
    if (score >= 10000) return "Great Job! ⭐";
    if (score >= 5000) return "Good Work! 👍";
    return "Keep Practicing! 💪";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              {isNewHighScore ? (
                <Crown className="w-12 h-12 text-yellow-500" />
              ) : (
                <Trophy className="w-12 h-12 text-primary" />
              )}
            </div>
          </div>
          
          <DialogTitle className="text-2xl">
            {isNewHighScore ? "New High Score!" : "Game Over"}
          </DialogTitle>
          
          <DialogDescription className="text-lg font-medium text-primary">
            {getScoreMessage()}
          </DialogDescription>
        </DialogHeader>

        {/* Score Display */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {formatScore(score)}
                </p>
                <p className="text-sm text-muted-foreground">Final Score</p>
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
                  <p className="text-lg font-semibold">{Math.round(score / (level || 1))}</p>
                  <p className="text-xs text-muted-foreground">Avg/Level</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Rank: {rank.rank}</span>
                </div>
                {rank.rank !== rank.nextRank && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round(rank.progress)}% to {rank.nextRank}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Name Input (for local saves) */}
        {!isFirebaseEnabled && (
          <div className="space-y-2">
            <Label htmlFor="playername">Player Name</Label>
            <Input
              id="playername"
              value={playerName}
              onChange={(e) => updatePlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {/* Save to Online Leaderboard */}
          {isFirebaseEnabled && user && !hasSaved && (
            <Button
              onClick={handleSaveToLeaderboard}
              disabled={isSaving}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save to Leaderboard"}
            </Button>
          )}

          {hasSaved && (
            <div className="text-center">
              <Badge variant="secondary" className="text-green-600">
                ✓ Saved to Leaderboard
              </Badge>
            </div>
          )}

          {/* Share Score */}
          <Button onClick={handleShare} variant="outline" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share Score
          </Button>

          <Separator />

          {/* Game Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleRestart} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            
            <Button onClick={handleGoHome} variant="outline" className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Firebase Sign-in Prompt */}
        {!isFirebaseEnabled && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Enable online features to compete globally!
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = "/settings"}
            >
              Enable Online Features
            </Button>
          </div>
        )}

        {/* Ad Banner Placeholder */}
        <div className="ad-banner mt-4">
          <span className="text-xs">Advertisement Space</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
