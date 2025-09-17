import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "../../lib/stores/useTheme";
import { useAudio } from "../../lib/stores/useAudio";
import { useFirebase } from "../../lib/stores/useFirebase";
import { ArrowLeft, Sun, Moon, Volume2, VolumeX, Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isMuted, toggleMute } = useAudio();
  const { user, userProfile, signOut } = useFirebase();

  const isHomePage = location.pathname === "/";
  const pageTitle = getPageTitle(location.pathname);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-none">
              {isHomePage ? "SafiBuilds Block Puzzle" : pageTitle}
            </h1>
            {isHomePage && (
              <p className="text-xs text-muted-foreground">
                A fun and addictive puzzle game
              </p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Audio toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="p-2"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.photoURL} />
                    <AvatarFallback>
                      {userProfile?.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.photoURL} />
                    <AvatarFallback>
                      {userProfile?.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {userProfile?.displayName || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.isAnonymous ? "Guest Player" : userProfile?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="p-2"
            >
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

function getPageTitle(pathname: string): string {
  switch (pathname) {
    case "/play":
      return "Play Game";
    case "/leaderboard":
      return "Leaderboard";
    case "/settings":
      return "Settings";
    case "/about":
      return "About";
    default:
      return "SafiBuilds Block Puzzle";
  }
}
