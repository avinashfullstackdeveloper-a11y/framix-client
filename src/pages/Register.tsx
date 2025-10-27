// src/pages/Register.tsx
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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  // Show welcome toast after OAuth registration redirect
  React.useEffect(() => {
    // Wait for auth to finish loading before showing toast
    if (authLoading) return;

    if (
      localStorage.getItem("showWelcomeToast") === "1" &&
      user &&
      user.role &&
      !toastShown
    ) {
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      localStorage.removeItem("showWelcomeToast");
      setToastShown(true);
      
      // Navigate to appropriate page based on role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/components", { replace: true });
      }
    }
  }, [toast, user, authLoading, toastShown, navigate]);

  // Handle Email/Password Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Username must be at least 4 characters
    if (username.trim().length < 4) {
      toast({
        title: "Invalid Username",
        description: "Username must be at least 4 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Email: check if part before @ is at least 4 characters
    const emailParts = email.split("@");
    if (
      emailParts.length !== 2 ||
      emailParts[0].length < 4
    ) {
      toast({
        title: "Invalid Email",
        description: "The part before '@' in your email must be at least 4 characters.",
        variant: "destructive",
      });
      return;
    }

    // Password strength recommendation
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    // eslint-disable-next-line no-useless-escape
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      toast({
        title: "Weak Password",
        description:
          "Password should be at least 8 characters and include uppercase, lowercase, number, and special character.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, username);

      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
        variant: "default",
      });

      // Navigate immediately after successful registration
      navigate("/components", { replace: true });
    } catch (err: unknown) {
      console.error("SignUp error:", err);
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
    // Set a flag in localStorage to show welcome toast after OAuth redirect
    localStorage.setItem("showWelcomeToast", "1");
    window.location.href = `${apiUrl}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Registration Card */}
      <Card className="w-full max-w-md bg-gradient-card border-border shadow-glow">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold mb-2">Create account</CardTitle>
          <p className="text-muted-foreground">Sign up with open account</p>
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

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground text-sm uppercase tracking-wide">USERNAME</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-secondary border-border focus:ring-primary"
              />
            </div>

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
              {/* Password strength visual */}
              {password.length > 0 && (
                <div className="mt-2">
                  {(() => {
                    // eslint-disable-next-line no-useless-escape
                    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
                    if (strongPasswordRegex.test(password)) {
                      return (
                        <div className="text-green-600 text-xs font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                          Strong password
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-red-500 text-xs font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                          Weak password
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground text-sm uppercase tracking-wide">CONFIRM PASSWORD</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-secondary border-border focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Confirm password match/mismatch visual */}
              {confirmPassword.length > 0 && (
                <div className="mt-2">
                  {confirmPassword === password ? (
                    <div className="text-green-600 text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                      Passwords match
                    </div>
                  ) : (
                    <div className="text-red-500 text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-black rounded-full border border-neutral-300 shadow mt-6 transition hover:bg-neutral-100"
            >
              {isLoading ? "Creating account..." : "Create account"}
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

          {/* Sign In Link */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account ?{" "}
            <Link to="/signin" className="text-primary hover:underline">Sign in here</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;