import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function PersonalInformation() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update username state when user data changes
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  const handleUsernameUpdate = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/user/username`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error("Failed to update username");

      // Refresh the session to get updated user data
      await refetch();

      toast({
        title: "Success",
        description: "Username updated successfully",
      });
      setIsEditingUsername(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update username",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/user/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-neutral-400">Please sign in to view this page</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Personal Information</h1>
          <p className="text-neutral-400 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Email Section */}
        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Email Address</CardTitle>
            <CardDescription className="text-neutral-400">Your email address is used for authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">{user?.email}</span>
              <span className="text-xs text-neutral-500">Cannot be changed</span>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-neutral-800" />

        {/* Username Section */}
        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Username</CardTitle>
            <CardDescription className="text-neutral-400">Update your display username</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-neutral-300">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditingUsername}
                className="bg-neutral-900 border-neutral-700 text-white disabled:opacity-70"
              />
            </div>
            <div className="flex gap-2">
              {!isEditingUsername ? (
                <Button
                  onClick={() => setIsEditingUsername(true)}
                  variant="outline"
                  className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
                >
                  Edit Username
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleUsernameUpdate}
                    className="bg-gradient-to-r from-[#E84288] to-[#9B4DCA] hover:opacity-90"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingUsername(false);
                      setUsername(user?.username || "");
                    }}
                    variant="outline"
                    className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-neutral-800" />

        {/* Password Section */}
        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Password</CardTitle>
            <CardDescription className="text-neutral-400">Change your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditingPassword ? (
              <Button
                onClick={() => setIsEditingPassword(true)}
                variant="outline"
                className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
              >
                Change Password
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-neutral-300">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-neutral-900 border-neutral-700 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-neutral-300">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-neutral-900 border-neutral-700 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-neutral-300">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-neutral-900 border-neutral-700 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePasswordUpdate}
                    className="bg-gradient-to-r from-[#E84288] to-[#9B4DCA] hover:opacity-90"
                  >
                    Update Password
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    variant="outline"
                    className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
