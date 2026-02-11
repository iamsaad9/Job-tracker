"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addToast, Image, Spinner } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AutoSlideshow from "@/app/components/ui/AutoSlideshow";
import { AnimatePresence, motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setIsLoading(false); // Set to false only on failure
        addToast({
          title: "Error",
          description: data.message || "Login failed",
          color: "danger",
          variant: "bordered",
        });
      }
    } catch (err) {
      setIsLoading(false); // Set to false only on error
      console.error("Auth error:", err);
      addToast({
        title: "Error",
        description: "Server Error",
        color: "danger",
        variant: "bordered",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${signUpData.firstName} ${signUpData.lastName}`,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addToast({
          title: "Success",
          description: "Account created successfully. Please log in.",
          color: "success",
          variant: "bordered",
        });
        setIsSignup(false);
        setSignUpData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
      } else {
        addToast({
          title: "Error",
          description: data.message || "Failed to create account",
          color: "danger",
          variant: "bordered",
        });
      }
    } catch (err) {
      console.error("Auth error:", err);
      addToast({
        title: "Error",
        description: "An unexpected error occurred.",
        color: "danger",
        variant: "bordered",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    if (!clientId) {
      console.error("Client ID is missing!");
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${baseUrl}/api/auth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  // Calculate password strength score (0-5)
  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(pwd)) strength++;

    return strength;
  };

  return (
    <div className=" h-screen w-full overflow-hidden flex bg-linear-to-br from-primary/10 via-secondary/10 to-success/10">
      {/* Left Side - Artistic Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-b from-black to-silver-500 m-5 overflow-hidden rounded-4xl">
        <AutoSlideshow />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2  flex items-center justify-center lg:justify-start p-8 lg:p-16 xl:ml-20">
        <AnimatePresence mode="wait">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-start gap-5 ">
              {/* Heading */}
              <div className="mb-8 relative">
                {isSignup && (
                  <button
                    onClick={() => setIsSignup(false)}
                    className="mb-5 p-2 hover:bg-white/10 rounded-lg transition-colors inline-flex md:absolute md:-left-15 md:top-1/2 md:-translate-y-1/2 cursor-pointer"
                  >
                    <ArrowLeft size={24} className="text-foreground" />
                  </button>
                )}
                <div className="flex flex-col">
                  {!isSignup && (
                    <Image
                      src={"/assets/logo.png"}
                      alt="dark_logo"
                      className="h-14 rounded-none mb-10 bg-transparent"
                    />
                  )}
                  <h1 className="text-4xl font-semibold text-foreground mb-2">
                    {isSignup
                      ? "Start to Your Journey"
                      : "Back to Your Journey"}
                  </h1>
                  <p className="text-foreground/60">
                    {isSignup ? (
                      <>
                        Join thousands of professionals advancing their careers
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          onClick={() => setIsSignup(true)}
                          className="text-foreground/80 font-medium cursor-pointer hover:underline"
                        >
                          Sign up
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Signup Form */}

            {isSignup ? (
              <motion.form
                onSubmit={handleSignup}
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isSignup ? 1 : 0,
                  y: isSignup ? 0 : 20,
                  display: isSignup ? "block" : "none",
                }}
                key="signup-form"
                transition={{ duration: 0.5 }}
              >
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground/90  mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={signUpData.firstName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3  border border-gray-500 rounded-full text-foreground/80 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground/90  mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={signUpData.lastName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3  border border-gray-500 rounded-full text-foreground/80 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-foreground/90  mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    className="w-full px-4 py-3  border border-gray-500 rounded-full text-foreground/80 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-foreground/90  mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3  border border-gray-500 rounded-full text-foreground/80 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password strength indicator for signup */}
                  {signUpData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-foreground/90">
                          Password Strength:
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            calculatePasswordStrength(signUpData.password) <= 2
                              ? "text-red-500"
                              : calculatePasswordStrength(
                                    signUpData.password,
                                  ) <= 4
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          {calculatePasswordStrength(signUpData.password) <= 2
                            ? "Weak"
                            : calculatePasswordStrength(signUpData.password) <=
                                4
                              ? "Fair"
                              : "Strong"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <div
                            key={index}
                            className={`h-2 flex-1 rounded transition-colors ${
                              index <
                              calculatePasswordStrength(signUpData.password)
                                ? calculatePasswordStrength(
                                    signUpData.password,
                                  ) <= 2
                                  ? "bg-red-500"
                                  : calculatePasswordStrength(
                                        signUpData.password,
                                      ) <= 4
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="space-y-1 text-xs text-foreground/70 mt-2 sm:flex gap-5">
                        <p
                          className={`flex items-center gap-2 ${
                            /[a-z]/.test(signUpData.password)
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          <span>
                            {/[a-z]/.test(signUpData.password) ? "✓" : "○"}
                          </span>{" "}
                          Lowercase letter
                        </p>
                        <p
                          className={`flex items-center gap-2 ${
                            /[A-Z]/.test(signUpData.password)
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          <span>
                            {/[A-Z]/.test(signUpData.password) ? "✓" : "○"}
                          </span>{" "}
                          Uppercase letter
                        </p>
                        <p
                          className={`flex items-center gap-2 ${
                            /[0-9]/.test(signUpData.password)
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          <span>
                            {/[0-9]/.test(signUpData.password) ? "✓" : "○"}
                          </span>{" "}
                          Number
                        </p>
                        <p
                          className={`flex items-center gap-2 ${
                            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(
                              signUpData.password,
                            )
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          <span>
                            {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(
                              signUpData.password,
                            )
                              ? "✓"
                              : "○"}
                          </span>{" "}
                          Special character
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  className="w-full py-3 m-0 bg-linear-to-br from-purple-600 to-blue-500 hover:scale-102 text-white hover:shadow-lg font-medium rounded-xl cursor-pointer transition-all disabled:opacity-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" color="white" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Terms Checkbox */}
                {/* <label className="flex mt-3 items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signUpData.agreedToTerms}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        agreedToTerms: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-black font-medium underline">
                      Terms & Condition
                    </a>
                  </span>
                </label> */}

                {/* Divider */}
                <div className="relative my-3 flex justify-center items-center gap-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-gray-950 flex justify-center text-sm">
                    <span className="px-4 bg-transparent white">or</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors shadow"
                >
                  <FcGoogle size={20} />
                  <span className="font-medium text-sm">
                    Continue with Google
                  </span>
                </button>
              </motion.form>
            ) : (
              // Login Form
              <motion.form
                onSubmit={handleLogin}
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isSignup ? 0 : 1,
                  y: isSignup ? 20 : 0,
                  display: isSignup ? "none" : "block",
                }}
                transition={{ duration: 0.5 }}
                key="login-form"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm text-foreground/90 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full px-4 py-3  border border-gray-500 rounded-full text-foreground/80 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-foreground/90">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full px-4 py-3  border border-gray-500 rounded-full text-foreground/80 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <Link
                    href="/reset-password"
                    className="text-sm  rounded-xl text-primary hover:underline  inline-block mt-5"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3 m-0 bg-linear-to-br from-purple-600 to-blue-500 hover:scale-102 text-white hover:shadow-lg font-medium rounded-xl cursor-pointer transition-all disabled:opacity-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" color="white" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-3 flex justify-center items-center gap-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-gray-950 flex justify-center text-sm">
                    <span className="px-4 bg-transparent white">or</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors shadow"
                >
                  <FcGoogle size={20} />
                  <span className="font-medium text-sm">
                    Continue with Google
                  </span>
                </button>
              </motion.form>
            )}
            <p className="text-center text-sm text-foreground mt-5 animate-fade-in delay-500">
              Protected by reCAPTCHA and subject to the{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;
