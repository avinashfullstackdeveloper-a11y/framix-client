import { User, LogOut, Settings, Shield, Heart, Bell } from "lucide-react";
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

interface UserAccountMenuProps {
  user: {
    id: string;
    email: string;
    name?: string;
    username?: string;
  };
  onNavigate?: () => void;
}

export function UserAccountMenu({ user, onNavigate }: UserAccountMenuProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Prioritize username over name for display
  const displayName = user.username || user.name || user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-gradient-to-r from-[#E84288] to-[#9B4DCA] hover:opacity-90 hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#E84288] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all duration-200 border border-[#E84288]/20"
        >
          <span className="text-white font-semibold">{initials}</span>
        </Button>
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
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            navigate("/notifications");
          }}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
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
