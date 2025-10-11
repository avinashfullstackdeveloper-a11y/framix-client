// src/pages/Register.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { data: session, refetch } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Navigate to components page once session is established
  useEffect(() => {
    if (shouldNavigate && session?.user) {
      console.log("Session established, navigating to /components");
      navigate("/components", { replace: true });
    }
  }, [session, shouldNavigate, navigate]);

  // Handle Email/Password Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.register({
        name: username,
        email,
        password,
      });

      console.log("SignUp result:", result);

      if (!result.success) {
        setError(result.error || result.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Refetch session to get the newly created session
      await refetch();

      // Set flag to navigate once session is established
      setShouldNavigate(true);
    } catch (err: any) {
      console.error("SignUp error:", err);
      setError((err as Error).message || "An error occurred");
      setIsLoading(false);
    }
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-secondary border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground text-sm uppercase tracking-wide">CONFIRM PASSWORD</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-secondary border-border focus:ring-primary"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-primary hover:opacity-90 border-0 mt-6">
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

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