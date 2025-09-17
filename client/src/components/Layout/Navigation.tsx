import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Home, Play, Trophy, Settings, Info } from "lucide-react";
import { cn } from "../../lib/utils";

const navigationItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/play", icon: Play, label: "Play" },
  { path: "/leaderboard", icon: Trophy, label: "Scores" },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/about", icon: Info, label: "About" }
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0",
                isActive && "text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
