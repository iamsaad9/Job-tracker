"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Button, Spinner } from "@heroui/react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const ResetForm: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Calculate password strength score (0-5)
  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    // Check for special characters - any character that's not alphanumeric or space
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(pwd)) strength++;

    return strength;
  };

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid or missing reset token");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setTokenValid(true);
        } else {
          setError("This reset link has expired or is invalid");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err: unknown) {
        setError("Failed to verify reset link");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading State - Verifying Token
  if (verifying) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-foreground/60 mt-4">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid Token State
  if (!tokenValid) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-danger" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-foreground/60 mb-6">{error}</p>
          <Link href="/reset-password">
            <Button color="primary" size="lg" className="font-semibold">
              Request New Reset Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Password
          </h1>
          <p className="text-foreground/60">
            Enter a new password for your account
          </p>
        </div>

        {/* Card */}
        <Card className="bg-foreground/5 border border-foreground/10">
          <CardBody className="p-6">
            {success ? (
              // Success State
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-success" size={32} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Password Reset Successful!
                </h2>
                <p className="text-foreground/70 mb-6">
                  Your password has been updated. Redirecting to login...
                </p>
                <Spinner color="success" />
              </div>
            ) : (
              // Form State
              <>
                {error && (
                  <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <span className="text-danger text-lg">⚠️</span>
                    <p className="text-danger text-sm flex-1">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isRequired
                    autoFocus
                    description="Must be at least 8 characters long"
                    classNames={{
                      label: "text-foreground font-medium",
                      input: "text-foreground",
                      description: "text-foreground/50 text-xs",
                    }}
                    startContent={
                      <Lock className="text-foreground/40" size={18} />
                    }
                    endContent={
                      <button
                        className="focus:outline-none text-foreground/60 hover:text-foreground transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                  />

                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isRequired
                    classNames={{
                      label: "text-foreground font-medium",
                      input: "text-foreground",
                    }}
                    startContent={
                      <Lock className="text-foreground/40" size={18} />
                    }
                    endContent={
                      <button
                        className="focus:outline-none text-foreground/60 hover:text-foreground transition-colors"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                  />

                  {/* Password strength indicator */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-foreground/70">
                          Password Strength:
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            calculatePasswordStrength(password) <= 2
                              ? "text-danger"
                              : calculatePasswordStrength(password) <= 4
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {calculatePasswordStrength(password) <= 2
                            ? "Weak"
                            : calculatePasswordStrength(password) <= 4
                              ? "Fair"
                              : "Strong"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <div
                            key={index}
                            className={`h-2 flex-1 rounded transition-colors ${
                              index < calculatePasswordStrength(password)
                                ? calculatePasswordStrength(password) <= 2
                                  ? "bg-danger"
                                  : calculatePasswordStrength(password) <= 4
                                    ? "bg-warning"
                                    : "bg-success"
                                : "bg-foreground/20"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-foreground/60">
                        <p
                          className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-success" : ""}`}
                        >
                          <span>{/[a-z]/.test(password) ? "✓" : "○"}</span>{" "}
                          Lowercase letter
                        </p>
                        <p
                          className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-success" : ""}`}
                        >
                          <span>{/[A-Z]/.test(password) ? "✓" : "○"}</span>{" "}
                          Uppercase letter
                        </p>
                        <p
                          className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-success" : ""}`}
                        >
                          <span>{/[0-9]/.test(password) ? "✓" : "○"}</span>{" "}
                          Number
                        </p>
                        <p
                          className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(password) ? "text-success" : ""}`}
                        >
                          <span>
                            {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(
                              password,
                            )
                              ? "✓"
                              : "○"}
                          </span>{" "}
                          Special character
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    isDisabled={!password || !confirmPassword || loading}
                    className="w-full font-semibold"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </>
            )}
          </CardBody>
        </Card>

        {/* Footer */}
        {!success && (
          <p className="text-center text-foreground/60 text-sm mt-6">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-background flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
