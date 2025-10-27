// src/pages/SignIn.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, refetchUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  // Show welcome toast after OAuth login when user becomes available
  React.useEffect(() => {
    // Wait for auth to finish loading before showing toast
    if (authLoading) return;

    if (
      localStorage.getItem("showWelcomeBackToast") === "1" &&
      user &&
      user.role &&
      !toastShown
    ) {
      toast({
        title: "Welcome back!",
        description: "You have signed in successfully.",
        variant: "default",
      });
      localStorage.removeItem("showWelcomeBackToast");
      setToastShown(true);
    }
    if (user && user.role) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/components", { replace: true });
      }
    }
  }, [user, navigate, toast, authLoading, toastShown]);

  // Handle Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      await refetchUser();
      // Navigation is now handled by useEffect when user updates
    } catch (err) {
      console.error("SignIn error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Handle OAuth Login
  const handleOAuthLogin = (provider: 'google' | 'github') => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    // Set a flag in localStorage to show welcome back toast after OAuth redirect
    localStorage.setItem("showWelcomeBackToast", "1");
    window.location.href = `${apiUrl}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Sign In Card */}
      <Card className="w-full max-w-md bg-gradient-card border-border shadow-glow">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold mb-2">Sign in</CardTitle>
          <p className="text-muted-foreground">Sign in with open account</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          {/* Toast notifications are used for errors */}

          {/* OAuth Buttons Above Form */}
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              className="h-12 bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              className="h-12 bg-transparent border-neutral-700 text-white hover:bg-neutral-800"
            >
              <FaGithub className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-sm uppercase tracking-wide">EMAIL</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-sm uppercase tracking-wide">PASSWORD</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-secondary border-border focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-primary text-sm hover:underline">Forgot password ?</Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-black rounded-full border border-neutral-300 shadow mt-6 transition hover:bg-neutral-100"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1a1a] px-2 text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          {/* Removed: now above the form */}

          {/* Sign Up Link */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account yet ?{" "}
            <Link to="/register" className="text-primary hover:underline">Register here</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
