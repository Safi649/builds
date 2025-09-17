import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Play, Trophy, Settings, Gamepad2, Target, Zap } from "lucide-react";
import { getScoreStatistics } from "../../lib/game/scoring";
import { useFirebase } from "../../lib/stores/useFirebase";

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled: isFirebaseEnabled, user } = useFirebase();
  const stats = getScoreStatistics();

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <Card className="text-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to SafiBuilds Block Puzzle
          </CardTitle>
          <CardDescription className="text-lg">
            Challenge your mind with addictive block puzzle gameplay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            size="lg" 
            onClick={() => navigate("/play")}
            className="w-full max-w-xs text-lg font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Playing
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {stats.gamesPlayed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.gamesPlayed}</p>
                <p className="text-sm text-muted-foreground">Games Played</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{stats.bestScore.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{stats.bestLevel}</p>
                <p className="text-sm text-muted-foreground">Best Level</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{stats.averageScore.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Target className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Strategic Gameplay</h3>
            <p className="text-sm text-muted-foreground">
              Plan your moves carefully to clear lines and achieve high scores
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Progressive Difficulty</h3>
            <p className="text-sm text-muted-foreground">
              Face increasingly challenging levels as you improve your skills
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Compete & Compare</h3>
            <p className="text-sm text-muted-foreground">
              Track your progress and compete on the leaderboards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/leaderboard")}
          className="h-16 flex flex-col gap-1"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Leaderboard</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/settings")}
          className="h-16 flex flex-col gap-1"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Button>
      </div>

      {/* Firebase Status */}
      {isFirebaseEnabled && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {user ? (
                  user.isAnonymous ? "Playing as Guest" : `Signed in as ${user.displayName || user.email}`
                ) : (
                  "Online features available"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PWA Install Prompt */}
      <Button 
        id="install-button" 
        variant="outline" 
        className="w-full hidden"
        style={{ display: 'none' }}
      >
        Install App
      </Button>

      {/* Ad Banner Placeholder */}
      <div className="ad-banner">
        <span>Advertisement Space</span>
      </div>
    </div>
  );
};
