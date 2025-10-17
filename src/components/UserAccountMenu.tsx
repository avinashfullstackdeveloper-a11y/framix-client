import { User, LogOut, Settings, Shield, Heart } from "lucide-react";
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
}

export function UserAccountMenu({ user }: UserAccountMenuProps) {
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
          className="relative h-10 w-10 rounded-full bg-gradient-to-r from-[#E84288] to-[#9B4DCA] hover:opacity-90"
        >
          <span className="text-white font-semibold">{initials}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-neutral-800" align="end">
        <DropdownMenuLabel className="text-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-neutral-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={() => navigate("/settings/personal")}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Your Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/settings/favourite")}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Favourite</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/feedback")}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>Give Feedback</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/report-bug")}
          className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer"
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Report Bug</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-400 focus:text-red-300 focus:bg-neutral-800 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
