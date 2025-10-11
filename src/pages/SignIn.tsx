// src/pages/SignIn.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // Handle Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      console.log("SignIn result:", result);

      if (result.error) {
        setError(result.error.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Set flag to navigate once session is established
      setShouldNavigate(true);
    } catch (err: any) {
      console.error("SignIn error:", err);
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-secondary border-border focus:ring-primary"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-primary text-sm hover:underline">Forgot password ?</Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-primary hover:opacity-90 border-0 mt-6">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

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
