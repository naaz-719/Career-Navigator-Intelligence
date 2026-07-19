import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignInPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Backend seam: POST /api/auth/sign-in
      // const res = await fetch('/api/auth/sign-in', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // Store token: localStorage.setItem('token', data.token);

      // Simulated delay for UX
      await new Promise((r) => setTimeout(r, 600));
      navigate("/settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your HirePilot AI account"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[44px] bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:opacity-90 transition-all"
        >
          {isLoading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
