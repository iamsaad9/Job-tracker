"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = "/api/auth/login"; // Adjust path to match your file structure
      const email = loginData.email;
      const password = loginData.password;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = "/api/auth/signup"; // Adjust path to match your file structure
      const name = signUpData.name;
      const email = signUpData.email;
      const password = signUpData.password;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      alert("Account created successfully! (Demo)");
    }
  };

  const handleGoogleSignIn = () => {
    // Add your Google OAuth logic here
    alert("Google Sign In clicked! Integrate with your OAuth provider.");
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap");
        .heading-font {
          font-family: "Playfair Display", serif;
        }

        /* Animated gradient background */
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .gradient-bg {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #4facfe 75%,
            #00f2fe 100%
          );
          background-size: 400% 400%;
          animation: gradientFlow 15s ease infinite;
        }

        /* Floating animation */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .float {
          animation: float 6s ease-in-out infinite;
        }

        /* Slide animations */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }

        .animate-slide-in-right,
        .animate-slide-in-left,
        .animate-fade-in {
          opacity: 0;
        }

        /* Image carousel */
        @keyframes carouselFade {
          0%,
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
          10%,
          40% {
            opacity: 1;
            transform: scale(1);
          }
          50%,
          90% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        .carousel-image {
          animation: carouselFade 15s ease-in-out infinite;
        }

        .carousel-image:nth-child(2) {
          animation-delay: 5s;
        }

        .carousel-image:nth-child(3) {
          animation-delay: 10s;
        }

        /* Button effects */
        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-primary::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition:
            width 0.6s,
            height 0.6s;
        }

        .btn-primary:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
        }

        .social-btn {
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Decorative circles */
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="flex w-full h-screen overflow-hidden">
        {/* Left Side - Animated Image Section */}
        <div className="hidden lg:flex lg:w-1/2 h-full gradient-bg relative overflow-hidden">
          {" "}
          {/* Decorative floating circles */}
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          {/* Image Carousel Container */}
          <div className="relative w-full h-full flex items-center justify-center p-12">
            <div className="relative w-full max-w-lg">
              {/* Carousel Images */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1000&fit=crop"
                  alt="Team collaboration"
                  className="absolute inset-0 w-full h-full object-cover carousel-image"
                />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=1000&fit=crop"
                  alt="Workspace"
                  className="absolute inset-0 w-full h-full object-cover carousel-image"
                />
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=1000&fit=crop"
                  alt="Professional meeting"
                  className="absolute inset-0 w-full h-full object-cover carousel-image"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
              </div>

              {/* Floating text overlay */}
              <div className="absolute bottom-8 left-8 right-8 text-white float">
                <h2 className="heading-font text-4xl font-bold mb-3 drop-shadow-lg">
                  Welcome to Your Journey
                </h2>
                <p className="text-lg opacity-90 drop-shadow">
                  Join thousands of professionals advancing their careers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-start lg:justify-center p-6 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
          {" "}
          <div className="w-full max-w-md">
            <div className="w-full max-w-md my-auto">
              {" "}
              {/* Logo/Brand */}
              <div className="text-center mb-8 animate-fade-in flex items-center justify-center gap-5">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl  shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-col items-start justify-center">
                  <h1 className="heading-font text-3xl font-bold text-gray-800">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Sign in to continue your journey
                  </p>
                </div>
              </div>
              {/* Tab Switcher */}
              <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl animate-fade-in delay-100">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === "login"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="animate-fade-in delay-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 input-glow"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="animate-fade-in delay-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="password"
                        className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 input-glow pr-12"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between animate-fade-in delay-400">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl btn-primary animate-fade-in delay-500 disabled:opacity-70 cursor-pointer"
                  >
                    {isLoading ? (
                      <svg
                        className="spinner w-5 h-5 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              )}
              {/* Signup Form */}
              {activeTab === "signup" && (
                <form onSubmit={handleSignup} className="space-y-2">
                  <div className="animate-fade-in delay-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={signUpData.name}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 input-glow"
                      required
                    />
                  </div>

                  <div className="animate-fade-in delay-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 input-glow"
                      required
                    />
                  </div>

                  <div className="animate-fade-in delay-400">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={signUpData.password}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
                            password: e.target.value,
                          })
                        }
                        placeholder="password"
                        className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 input-glow pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignupPassword(!showSignupPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="animate-fade-in delay-500">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-purple-600 hover:text-purple-700 font-semibold"
                        >
                          Terms & Conditions
                        </a>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl btn-primary disabled:opacity-70"
                  >
                    {isLoading ? (
                      <svg
                        className="spinner w-5 h-5 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}
              {/* Divider */}
              <div className="relative my-5 animate-fade-in delay-500">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>
              {/* Social Login Buttons */}
              <div className="space-y-3 animate-fade-in delay-500">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 social-btn"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
              {/* Footer Text */}
              <p className="text-center text-sm text-gray-600 mt-5 animate-fade-in delay-500">
                Protected by reCAPTCHA and subject to the{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
