// PersonalInformation.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface ProfileData {
  name: string;
  location: string;
  email: string;
  socialMedia: string;
  website: string;
  bio: string;
}

export default function PersonalInformation() {
  const { user, isLoading, refetchUser } = useAuth();
  const { toast } = useToast();

  // Profile form data
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    location: "",
    email: "",
    socialMedia: "",
    website: "",
    bio: "",
  });

  // Password states
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [completion, setCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Initialize profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user?.username || user?.name || "",
        location: user?.location || "",
        email: user?.email || "",
        socialMedia: user?.socialMedia || "",
        website: user?.website || "",
        bio: user?.bio || "",
      });
    }
  }, [user]);

  // Fetch full profile after user is loaded
  useEffect(() => {
    if (user) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      fetch(`${apiUrl}/api/user/profile`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.ok ? res.json() : null)
        .then((profile) => {
          console.log("INSPECT: /api/user/profile response", profile);
          if (profile && profile.user) {
            setProfileData((prev) => ({
              ...prev,
              location: profile.user.location || "",
              socialMedia: profile.user.socialMedia || "",
              website: profile.user.website || "",
              bio: profile.user.bio || "",
            }));
          }
        })
        .catch(() => {
          // Ignore fetch errors for profile
        });
    }
  }, [user]);

  // Calculate completion percentage
  useEffect(() => {
    const fields = [
      { key: "name", label: "Name" },
      { key: "location", label: "Location" },
      { key: "email", label: "Email" },
      { key: "socialMedia", label: "Social media" },
      { key: "website", label: "Website" },
      { key: "bio", label: "Bio" },
    ];

    const filledFields = fields.filter((field) => {
      const value = profileData[field.key as keyof ProfileData];
      return value && value.trim() !== "";
    });
    const completionPercentage = Math.round(
      (filledFields.length / fields.length) * 100
    );
    const missing = fields
      .filter((field) => {
        const value = profileData[field.key as keyof ProfileData];
        return !value || value.trim() === "";
      })
      .map((field) => field.label);

    setCompletion(completionPercentage);
    setMissingFields(missing);
  }, [profileData]);

  const handleProfileInputChange = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUsernameUpdate = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/user/username`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: profileData.name }),
      });

      if (!response.ok) throw new Error("Failed to update username");

      // Refresh the session to get updated user data
      await refetchUser();

      toast({
        title: "Success",
        description: "Username updated successfully",
      });
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

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update username if it has changed
      if (profileData.name !== (user?.username || user?.name || "")) {
        await handleUsernameUpdate();
      }

      // Update password if password fields are filled
      if (isEditingPassword && newPassword && confirmPassword) {
        await handlePasswordUpdate();
      }

      // Add your additional profile update API calls here for other fields
      // Only update profile fields (location, socialMedia, website, bio) if changed
      // Since user object does not contain profile fields, always send PATCH for these fields
      const updatedFields: Partial<ProfileData> = {
        location: profileData.location,
        socialMedia: profileData.socialMedia,
        website: profileData.website,
        bio: profileData.bio,
      };

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await fetch(`${apiUrl}/api/user/profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedFields),
        });

        // Always refetch user data to update UI after profile PATCH
        // Refetch user, then fetch latest profile fields and update form state
        await refetchUser();

        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/user/profile`, {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            const profile = await res.json();
            console.log("DEBUG: /api/user/profile GET response", profile);
            if (profile && profile.user) {
              setProfileData((prev) => ({
                ...prev,
                location: profile.user.location || "",
                socialMedia: profile.user.socialMedia || "",
                website: profile.user.website || "",
                bio: profile.user.bio || "",
              }));
            }
          }
        } catch {
          // Ignore errors when fetching profile after save
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "All changes saved successfully",
      });

      // Reset password editing state if password was updated
      if (isEditingPassword && newPassword && confirmPassword) {
        setIsEditingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        name: user?.username || user?.name || "",
        location: "",
        email: user?.email || "",
        socialMedia: "",
        website: "",
        bio: "",
      });
    }

    // Reset password fields
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-[600px] bg-black text-white p-8 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[600px] bg-black text-white p-8 flex items-center justify-center">
        <div className="text-neutral-400">Please sign in to view this page</div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-black text-white">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Personal Information</h1>
          <p className="text-neutral-400 mt-2">
            This information will be displayed publicly on your profile.
          </p>
        </div>

        {/* Profile Information Section */}
        <Card className="bg-[#1a1a1a] border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-neutral-400">
              Update your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      handleProfileInputChange("name", e.target.value)
                    }
                    className="bg-neutral-900 border-neutral-700 text-white"
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-neutral-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) =>
                      handleProfileInputChange("location", e.target.value)
                    }
                    placeholder="Your location"
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileInputChange("email", e.target.value)
                    }
                    className="bg-neutral-900 border-neutral-700 text-white"
                    disabled
                  />
                  <p className="text-xs text-neutral-500">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMedia" className="text-neutral-300">
                    X (Twitter) Handle
                  </Label>
                  <Input
                    id="socialMedia"
                    value={profileData.socialMedia}
                    onChange={(e) =>
                      handleProfileInputChange("socialMedia", e.target.value)
                    }
                    placeholder="Your Social media handle"
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-neutral-300">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={profileData.website}
                  onChange={(e) =>
                    handleProfileInputChange("website", e.target.value)
                  }
                  placeholder="Your website URL"
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-neutral-300">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    handleProfileInputChange("bio", e.target.value)
                  }
                  placeholder="Write a few sentences about yourself"
                  rows={4}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Password Management Section */}
              <div className="space-y-4 pt-4">
                <Separator className="bg-neutral-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-neutral-300">
                      Password Management
                    </Label>
                    <p className="text-sm text-neutral-400">
                      Change your account password
                    </p>
                  </div>
                  {!isEditingPassword && (
                    <Button
                      onClick={() => setIsEditingPassword(true)}
                      variant="outline"
                      className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
                    >
                      Change Password
                    </Button>
                  )}
                </div>

                {isEditingPassword && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-neutral-300"
                      >
                        Current Password
                      </Label>
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
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-neutral-300">
                        New Password
                      </Label>
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
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-neutral-300"
                      >
                        Confirm New Password
                      </Label>
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#E84288] to-[#9B4DCA] hover:opacity-90"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}