import { User, LogOut, Settings, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const displayName = user.name || user.username || user.email;
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
        <DropdownMenuItem className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-neutral-300 focus:text-white focus:bg-neutral-800 cursor-pointer">
          <Shield className="mr-2 h-4 w-4" />
          <span>Security</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-400 focus:text-red-300 focus:bg-neutral-800 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
