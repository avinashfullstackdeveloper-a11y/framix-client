import React from "react";
import ReactDOM from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
  // Avatar UI: show user.avatar if present, else initials fallback
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateColorFromString, getContrastTextColor } from "@/lib/utils";

interface AccountSectionProps {
  className?: string;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  className = "",
}) => {
  const { user, isLoading, deleteAccount } = useAuth();
  const { toast } = useToast();

  const displayName = user?.username || user?.name || user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  // Generate dynamic colors
  const bgColor = generateColorFromString(user?.email || displayName);
  const textColor = getContrastTextColor(bgColor);
  
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Danger Zone Handlers
  /**
   * Handles Delete Account confirmation.
   * - Calls deleteAccount from AuthContext, which integrates with backend.
   * - Waits for backend confirmation before clearing local data and logging out.
   * - Disables UI during deletion.
   * - Provides user feedback on error.
   * - Redirects user to SignIn page after deletion.
   */
  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      alert('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeleting(true);

    try {
      // Wait for backend confirmation before clearing local data and logging out
      await deleteAccount();

      // Show success toast
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "default",
      });

      setIsDeleting(false);
      setShowConfirmDialog(false);
      setConfirmText("");

      // Redirect to SignIn page after a short delay to show the toast
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (error) {
      // Show error from backend if available
      let errorMsg = "Failed to delete account. Please try again.";
      if (error instanceof Error && error.message) {
        errorMsg = error.message;
      }
      alert(errorMsg);
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = () => {
    setShowConfirmDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowConfirmDialog(false);
    setConfirmText("");
  };

  return (
    <div className={`min-h-[600px] bg-black text-white ${className}`}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Account settings</h1>
          <p className="text-neutral-400 mt-2">
            Manage you're account preferences and data
          </p>
        </div>

        {/* Account Information Section */}
        <section className="w-full">
          <div className="flex w-full items-center gap-2 text-lg text-[rgba(242,242,242,1)] font-semibold leading-loose flex-wrap">
            <Avatar className="h-8 w-8 border border-neutral-700">
              {typeof user?.avatar === "string" && user.avatar ? (
                <AvatarImage
                  key={user.avatar}
                  src={user.avatar}
                  alt={displayName}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <AvatarFallback
                className="font-semibold"
                style={{
                  backgroundColor: bgColor,
                  color: textColor
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="self-stretch my-auto">Account Information</h3>
          </div>
          <div className="bg-black border w-full mt-4 p-6 rounded-lg border-[rgba(255,71,156,0.6)] border-solid">
            {isLoading ? (
              <div className="text-neutral-400">Loading...</div>
            ) : !user ? (
              <div className="text-neutral-400">
                Please sign in to view this page
              </div>
            ) : (
              <form>
                <div className="w-full pt-0.5">
                  <label className="text-[rgba(153,153,153,1)] text-sm font-medium leading-none block mb-2">
                    Username
                  </label>
                  <div className="w-full text-base text-[rgba(230,230,230,1)] font-normal">
                    {user.username || user.name || ""}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Username cannot be changed
                  </p>
                </div>
                <div className="w-full mt-4 pt-0.5">
                  <label className="text-[rgba(153,153,153,1)] text-sm font-medium leading-none block mb-2">
                    Email
                  </label>
                  <div className="w-full text-base text-[rgba(230,230,230,1)] font-normal">
                    {user.email}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Email cannot be changed
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="w-full mt-8">
          <h3 className="w-full text-lg text-[rgba(242,242,242,1)] font-semibold leading-loose">
            Danger Zone
          </h3>
          <p className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none mt-2">
            Irreversible and destructive actions
          </p>

          <div className="bg-black border flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-2 pt-8 pb-6 px-6 rounded-lg border-[rgba(255,71,156,0.6)] border-solid">
            <div className="self-stretch w-[218px] my-auto">
              <h4 className="w-full text-base text-[rgba(242,242,242,1)] font-medium">
                Delete Account
              </h4>
              <p className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none mt-1">
                Permanently delete your account.
              </p>
            </div>

            <div className="self-stretch min-h-10 my-auto pl-4">
              <button
                onClick={openDeleteDialog}
                className="bg-black flex min-h-10 items-center gap-2 justify-center p-2.5 rounded-md hover:bg-red-900 transition-colors"
              >
                <div className="flex min-h-4 w-4 flex-col overflow-hidden items-center justify-center">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/f60683250b19aadde0b1152277cd6e5c45919b62?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-full flex-1"
                    alt="Delete icon"
                  />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Confirmation Dialog */}
        {showConfirmDialog && ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
            <div className="bg-black border border-[rgba(255,71,156,0.6)] rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl text-white font-semibold mb-4">
                Confirm Account Deletion
              </h3>
              <p className="text-[rgba(153,153,153,1)] mb-4">
                This action cannot be undone. This will permanently delete your
                account and remove all associated data.
              </p>
              <p className="text-[rgba(153,153,153,1)] mb-4">
                Please type <strong className="text-red-400">DELETE</strong> to
                confirm:
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteAccount();
                }}
              >
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full bg-transparent border border-[rgba(74,85,101,1)] rounded px-3 py-2 text-white focus:outline-none focus:border-[rgba(255,71,156,1)] transition-colors mb-4"
                  disabled={isDeleting}
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={confirmText !== "DELETE" || isDeleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDeleteDialog}
                    disabled={isDeleting}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-900 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};
