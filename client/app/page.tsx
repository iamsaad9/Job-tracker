"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Chip, Image } from "@heroui/react";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Upload,
  Search,
  Target,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import Link from "next/link";

const LandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Briefcase className="text-primary" size={32} />,
      title: "Smart Job Tracking",
      description:
        "Organize applications across 5 stages: Wishlist, Applied, Interview, Offered, and Accepted. Drag and drop to update status instantly.",
      color: "primary",
      stats: "Track unlimited jobs",
    },
    {
      icon: <FileText className="text-secondary" size={32} />,
      title: "Document Management",
      description:
        "Store CVs, cover letters, and portfolios in one place. Set defaults and attach them to applications with a single click.",
      color: "secondary",
      stats: "Unlimited document storage",
    },
    {
      icon: <TrendingUp className="text-success" size={32} />,
      title: "Real-Time Analytics",
      description:
        "Track success rates, conversion metrics, and application trends. Identify top companies and locations at a glance.",
      color: "success",
      stats: "Live performance insights",
    },
    {
      icon: <Lock className="text-warning" size={32} />,
      title: "Secure & Private",
      description:
        "Your data is encrypted and never shared. We don't sell your information. You're in complete control.",
      color: "warning",
      stats: "Bank-level encryption",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <Upload className="text-primary" size={24} />,
      title: "Upload Your Documents",
      description:
        "Add your CV, cover letters, and portfolio. Set defaults for quick access.",
    },
    {
      step: 2,
      icon: <Search className="text-secondary" size={24} />,
      title: "Add Job Applications",
      description:
        "Track jobs you're interested in or have applied to. Include details, URLs, and notes.",
    },
    {
      step: 3,
      icon: <Target className="text-success" size={24} />,
      title: "Move Through Stages",
      description:
        "Drag jobs between columns as you progress. From wishlist to accepted.",
    },
    {
      step: 4,
      icon: <BarChart3 className="text-warning" size={24} />,
      title: "Analyze Your Progress",
      description:
        "View success rates, conversion metrics, and identify patterns in your search.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      image: "https://i.pravatar.cc/150?img=1",
      quote:
        "Trackee helped me organize 50+ applications and land my dream job at Google. The analytics showed me exactly where to focus my efforts.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      image: "https://i.pravatar.cc/150?img=33",
      quote:
        "The document management feature is a game-changer. I can customize cover letters for each company and never lose track of versions.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Specialist",
      image: "https://i.pravatar.cc/150?img=5",
      quote:
        "I was applying to 10+ jobs weekly. This tool kept me sane and helped me see which strategies actually worked. Got 3 offers in 2 months!",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Jobs Tracked" },
    { number: "8,500+", label: "Success Stories" },
    { number: "4.9/5", label: "User Rating" },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 w-40">
              <Image
                src={"/assets/logo.png"}
                className="rounded-none w-full h-10"
                alt="logo"
              />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
              <Link href="/help-feedback">
                <span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">
                  Help
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  color="primary"
                  className="w-40"
                  endContent={<ArrowRight size={18} />}
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <Chip
                variant="flat"
                color="primary"
                className="mb-6"
                startContent={<Zap size={16} />}
              >
                Free Forever • No Credit Card Required
              </Chip>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Track Every Job Application,
                <span className="text-primary"> Land Your Dream Role</span>
              </h1>

              <p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto lg:mx-0">
                Stop losing track of applications in spreadsheets and email
                threads. Organize, analyze, and optimize your job search with
                the most intuitive job tracking platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/login">
                  <Button
                    color="primary"
                    size="lg"
                    className="font-semibold text-base px-8"
                    endContent={<ArrowRight size={20} />}
                  >
                    Start Tracking Jobs Free
                  </Button>
                </Link>
                <Button
                  variant="bordered"
                  size="lg"
                  className="font-semibold text-base"
                  onPress={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-foreground/60">
                <div className="flex items-center gap-1">
                  <CheckCircle className="text-success" size={16} />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="text-success" size={16} />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="text-success" size={16} />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>

            {/* Right: Visual/Screenshot */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-foreground/10">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
                {/* Overlay with feature highlight */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Floating stats cards */}
              <Card className="absolute -left-4 top-1/4 bg-background/95 backdrop-blur-md border border-foreground/10 shadow-lg hidden lg:block">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <TrendingUp className="text-success" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Success Rate</p>
                      <p className="text-2xl font-bold text-foreground">73%</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="absolute -right-4 bottom-1/4 bg-background/95 backdrop-blur-md border border-foreground/10 shadow-lg hidden lg:block">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Active Jobs</p>
                      <p className="text-2xl font-bold text-foreground">42</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-foreground/10 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                  {stat.number}
                </p>
                <p className="text-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Chip variant="flat" color="primary" className="mb-4">
              Features
            </Chip>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You Need to
              <br />
              <span className="text-primary">Organize Your Job Search</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              From tracking applications to analyzing success rates, Trackee
              gives you the tools to land your next role faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-foreground/5 border transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "border-primary shadow-lg scale-105"
                    : "border-foreground/10 hover:border-foreground/20"
                }`}
                isPressable
                onPress={() => setActiveFeature(index)}
              >
                <CardBody className="p-6">
                  <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    {feature.description}
                  </p>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      feature.color as
                        | "primary"
                        | "secondary"
                        | "success"
                        | "warning"
                    }
                  >
                    {feature.stats}
                  </Chip>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Additional Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Calendar className="text-secondary" size={20} />,
                title: "Application Timeline",
                desc: "See when you applied and track response times",
              },
              {
                icon: <MapPin className="text-success" size={20} />,
                title: "Location Insights",
                desc: "Discover top cities and remote opportunities",
              },
              {
                icon: <Award className="text-warning" size={20} />,
                title: "Top Companies",
                desc: "Track which companies you're targeting most",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-foreground/5 border border-foreground/10"
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h4>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Chip variant="flat" color="secondary" className="mb-4">
              How It Works
            </Chip>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Start Tracking in
              <span className="text-secondary"> 4 Simple Steps</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Get organized in minutes. No complicated setup, no learning curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-foreground/10 z-0" />
                )}

                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-2xl bg-background border-4 border-foreground/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 text-sm text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/login">
              <Button
                color="primary"
                size="lg"
                className="font-semibold"
                endContent={<ArrowRight size={20} />}
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Chip variant="flat" color="success" className="mb-4">
              Testimonials
            </Chip>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Loved by Job Seekers
              <br />
              <span className="text-success">Around the World</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join thousands of professionals who landed their dream jobs with
              Trackee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-foreground/5 border border-foreground/10"
              >
                <CardBody className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-warning fill-warning"
                        size={16}
                      />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-foreground/60 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-success/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Take Control of
            <br />
            <span className="text-primary">Your Job Search?</span>
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who are tracking smarter, not harder.
            Get started in less than 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/login">
              <Button
                color="primary"
                size="lg"
                className="font-semibold text-base px-8"
                endContent={<ArrowRight size={20} />}
              >
                Start Free Today
              </Button>
            </Link>
            <Link href="/help-feedback">
              <Button
                variant="bordered"
                size="lg"
                className="font-semibold text-base"
              >
                Learn More
              </Button>
            </Link>
          </div>
          <p className="text-sm text-foreground/60">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/help-feedback"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/60 hover:text-foreground text-sm"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={"/assets/logoMini.png"}
                className="w-5 h-5 rounded-none"
                alt="logo"
              />
              <span className="font-bold text-foreground">Trackee</span>
            </div>
            <p className="text-foreground/60 text-sm">
              © 2026 Trackee. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
