"use client";
import React, { useState } from "react";
import { Card, CardBody, Input, Button, Divider } from "@heroui/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background  w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reset Password
          </h1>
          <p className="text-foreground/60">
            Enter your email address and we&apos;ll send you a link to reset
            your password
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
                  Check Your Email
                </h2>
                <p className="text-foreground/70 mb-6">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 mb-6">
                  <p className="text-foreground/60 text-sm">
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setEmail("");
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      try another email address
                    </button>
                  </p>
                </div>
                <Link href="/login">
                  <Button
                    variant="flat"
                    startContent={<ArrowLeft size={18} />}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              // Form State
              <>
                {error && (
                  <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <span className="text-danger text-lg">⚠️</span>
                    <p className="text-danger text-sm flex-1">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                    autoFocus
                    classNames={{
                      label: "text-foreground font-medium",
                      input: "text-foreground",
                    }}
                    startContent={
                      <Mail className="text-foreground/40" size={18} />
                    }
                  />

                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    isDisabled={!email || loading}
                    className="w-full font-semibold"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <Divider className="my-6 bg-foreground/10" />

                <div className="text-center">
                  <Link href="/login">
                    <Button
                      variant="light"
                      startContent={<ArrowLeft size={18} />}
                      className="text-foreground/70 hover:text-foreground"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Footer */}
        <p className="text-center text-foreground/60 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
