import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Trophy, Medal, Crown, Star, RefreshCw, Users, User } from "lucide-react";
import { getLocalHighScores, formatScore } from "../../lib/game/scoring";
import { useFirebase } from "../../lib/stores/useFirebase";
import { HighScore } from "../../types/game";
import { cn } from "../../lib/utils";

export const LeaderboardScreen: React.FC = () => {
  const { 
    isEnabled: isFirebaseEnabled, 
    onlineHighScores, 
    isLoadingScores, 
    loadHighScores,
    user 
  } = useFirebase();
  
  const [localScores, setLocalScores] = useState<HighScore[]>([]);

  useEffect(() => {
    // Load local scores
    setLocalScores(getLocalHighScores());
    
    // Load online scores if Firebase is enabled
    if (isFirebaseEnabled) {
      loadHighScores();
    }
  }, [isFirebaseEnabled, loadHighScores]);

  const handleRefresh = () => {
    setLocalScores(getLocalHighScores());
    if (isFirebaseEnabled) {
      loadHighScores();
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (position: number) => {
    switch (position) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  const ScoreList: React.FC<{ 
    scores: HighScore[]; 
    emptyMessage: string;
    showUserBadge?: boolean;
  }> = ({ scores, emptyMessage, showUserBadge = false }) => (
    <div className="space-y-3">
      {scores.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        scores.map((score, index) => {
          const position = index + 1;
          const isCurrentUser = showUserBadge && user && !score.isLocal && 
            score.playerName === (user.displayName || user.email);
          
          return (
            <Card 
              key={score.id} 
              className={cn(
                "transition-colors",
                position <= 3 && "bg-gradient-to-r from-primary/5 to-secondary/5",
                isCurrentUser && "ring-2 ring-primary/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={getRankBadgeVariant(position)} className="min-w-8 justify-center">
                      #{position}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      {getRankIcon(position)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{score.playerName}</p>
                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                          {score.isLocal && (
                            <Badge variant="outline" className="text-xs">Local</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Level {score.level} • {new Date(score.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">
                      {formatScore(score.score)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Leaderboard
          </CardTitle>
          <CardDescription>
            See how you rank against other players
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="w-full"
            disabled={isLoadingScores}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingScores && "animate-spin")} />
            Refresh Scores
          </Button>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue={isFirebaseEnabled ? "global" : "local"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Local Scores
          </TabsTrigger>
          <TabsTrigger 
            value="global" 
            disabled={!isFirebaseEnabled}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Global Scores
            {!isFirebaseEnabled && <Badge variant="secondary" className="text-xs ml-1">Offline</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Local Best Scores</CardTitle>
              <CardDescription>
                High scores saved on this device
              </CardDescription>
            </CardHeader>
          </Card>
          
          <ScoreList 
            scores={localScores}
            emptyMessage="No local scores yet. Start playing to set your first high score!"
          />
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Leaderboard</CardTitle>
              <CardDescription>
                {isFirebaseEnabled 
                  ? "Top players from around the world"
                  : "Enable online features in settings to view global scores"
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {isFirebaseEnabled ? (
            <ScoreList 
              scores={onlineHighScores}
              emptyMessage="No global scores available. Be the first to set a high score!"
              showUserBadge={true}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Global leaderboard is not available offline
                </p>
                <Button variant="outline" onClick={() => window.location.href = "/settings"}>
                  Enable Online Features
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Ad Banner Placeholder */}
      <div className="ad-banner">
        <span>Advertisement Space</span>
      </div>
    </div>
  );
};
