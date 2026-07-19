import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";

const SECTORS = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Energy & Oil & Gas",
  "Construction & Real Estate",
  "Retail & E-commerce",
  "Telecommunications",
  "Hospitality & Tourism",
  "Education",
  "Government & Public Sector",
  "Other",
];

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpPage() {
  const [, navigate] = useLocation();
  const { setProfile } = useProfile();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [sector, setSector] = useState("Technology");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Backend seam: POST /api/auth/sign-up
      // const res = await fetch('/api/auth/sign-up', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fullName, email, password, role, sector, yearsExperience }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // localStorage.setItem('token', data.token);

      await new Promise((r) => setTimeout(r, 600));

      // Pre-populate ProfileContext with sign-up values
      setProfile((prev) => ({
        ...prev,
        name: fullName.trim(),
        currentRole: role.trim() || prev.currentRole,
        sector: sector || prev.sector,
        yearsExperience:
          yearsExperience > 0 ? yearsExperience : prev.yearsExperience,
      }));

      navigate("/settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your GCC career intelligence journey"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Ahmed Al-Rashid"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={
              errors.fullName
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.fullName}
            </p>
          )}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
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

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirm-error" : undefined
              }
              className={`pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirm-error"
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label htmlFor="role">
            Current role / job title{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Input
            id="role"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        {/* Sector + Experience row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <select
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="yearsExperience">Years of exp.</Label>
            <Input
              id="yearsExperience"
              type="number"
              min={0}
              max={50}
              placeholder="0"
              value={yearsExperience === 0 ? "" : yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[44px] mt-2 bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
        >
          {isLoading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
