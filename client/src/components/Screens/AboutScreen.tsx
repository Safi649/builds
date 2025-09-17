import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  Info, 
  Heart, 
  Star, 
  Share2, 
  Mail, 
  ExternalLink,
  Github,
  Twitter,
  Gamepad2,
  Target,
  Zap,
  Users,
  Award,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

export const AboutScreen: React.FC = () => {
  const handleShare = async () => {
    const shareData = {
      title: "SafiBuilds Block Puzzle",
      text: "Check out this amazing block puzzle game!",
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleRate = () => {
    // This would open the app store when published
    toast.info("Rate us on the app store when published!");
  };

  const handleFeedback = () => {
    const email = "feedback@safibuilds.com";
    const subject = "SafiBuilds Block Puzzle Feedback";
    const body = "Hi SafiBuilds team,\n\nI'd like to share some feedback about the Block Puzzle game:\n\n";
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const features = [
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: "Strategic Gameplay",
      description: "Plan your moves carefully to clear lines and maximize your score"
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Progressive Difficulty",
      description: "Experience increasing challenge as you advance through levels"
    },
    {
      icon: <Users className="w-5 h-5 text-green-500" />,
      title: "Global Leaderboards",
      description: "Compete with players worldwide and track your progress"
    },
    {
      icon: <Award className="w-5 h-5 text-purple-500" />,
      title: "Achievement System",
      description: "Unlock achievements and earn rewards for your skills"
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-orange-500" />,
      title: "Smart Hints",
      description: "Get helpful hints when you're stuck on difficult situations"
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-red-500" />,
      title: "Intuitive Controls",
      description: "Smooth touch controls optimized for mobile devices"
    }
  ];

  const team = [
    {
      name: "SafiBuilds Development Team",
      role: "Game Developers",
      description: "Passionate developers creating engaging puzzle experiences"
    }
  ];

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="text-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            SafiBuilds Block Puzzle
          </CardTitle>
          <CardDescription className="text-lg">
            A fun and addictive puzzle game for all ages
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">Version 1.0.0</Badge>
            <Badge variant="outline">Free to Play</Badge>
            <Badge variant="outline">Progressive Web App</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Game Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            About the Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            SafiBuilds Block Puzzle is an engaging puzzle game that challenges your spatial reasoning 
            and strategic thinking. Place colorful block pieces on the board to clear lines, columns, 
            and 3×3 squares. The more you clear at once, the higher your score!
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            With progressively challenging levels, beautiful graphics, and smooth gameplay, 
            this game provides hours of entertainment while exercising your mind. Compete 
            with friends and players worldwide on the global leaderboards.
          </p>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How to Play:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Drag and drop block pieces onto the game board</li>
              <li>• Clear complete rows, columns, or 3×3 squares to score points</li>
              <li>• Plan ahead - the game ends when no more pieces can be placed</li>
              <li>• Aim for combos to maximize your score multiplier</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>
            What makes SafiBuilds Block Puzzle special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Team */}
      <Card>
        <CardHeader>
          <CardTitle>Development Team</CardTitle>
          <CardDescription>
            Meet the creators behind SafiBuilds Block Puzzle
          </CardDescription>
        </CardHeader>
        <CardContent>
          {team.map((member, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{member.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Technology */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Built with modern web technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-sm">React</h4>
              <p className="text-xs text-muted-foreground">Frontend Framework</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-sm">TypeScript</h4>
              <p className="text-xs text-muted-foreground">Type Safety</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-sm">PWA</h4>
              <p className="text-xs text-muted-foreground">Offline Support</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-sm">Firebase</h4>
              <p className="text-xs text-muted-foreground">Online Features</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Feedback</CardTitle>
          <CardDescription>
            We'd love to hear from you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <Button onClick={handleShare} variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Game
            </Button>
            
            <Button onClick={handleRate} variant="outline" className="w-full">
              <Star className="w-4 h-4 mr-2" />
              Rate Us
            </Button>
            
            <Button onClick={handleFeedback} variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Feedback
            </Button>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Follow us for updates</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast.info("Visit our website for more games!")}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Website
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast.info("Follow us on Twitter for updates!")}
              >
                <Twitter className="w-4 h-4 mr-1" />
                Twitter
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast.info("Check out our GitHub repository!")}
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Copyright</h4>
            <p>© 2024 SafiBuilds. All rights reserved.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Privacy</h4>
            <p>
              We respect your privacy. Local scores are stored on your device only. 
              Online features require account creation and follow our privacy policy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Open Source</h4>
            <p>
              This game is built using open-source technologies and libraries. 
              We acknowledge and thank the open-source community for their contributions.
            </p>
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs">
              Made with <Heart className="w-3 h-3 inline text-red-500" /> by the SafiBuilds team
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ad Banner Placeholder */}
      <div className="ad-banner">
        <span>Advertisement Space</span>
      </div>
    </div>
  );
};
