import { User, LogOut, Shield, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export function UserAccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  // Prioritize username over name for display
  const displayName = user.username || user.name || user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
        variant: "default",
      });
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 border border-neutral-300 bg-white text-black hover:opacity-90 hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#E84288] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all duration-200">
          <AvatarImage
            key={user.avatar}
            src={user.avatar || ""}
            alt={displayName}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <AvatarFallback className="text-black font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-neutral-800" align="start">
        <DropdownMenuLabel className="text-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-neutral-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            navigate("/settings/personal");
          }}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Your Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            navigate("/settings/favourite");
          }}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Favourite</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            navigate("/notifications");
          }}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            navigate("/feedback");
          }}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Give Feedback</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            navigate("/report-bug");
          }}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Report Bug</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            handleSignOut();
          }}
          className="text-red-400 focus:text-red-300 focus:bg-neutral-800 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
