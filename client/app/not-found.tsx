"use client";
import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import {
  Home,
  ArrowLeft,
  Briefcase,
  FileText,
  HelpCircle,
  Settings,
  MapPin,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const popularPages = [
    {
      icon: <Briefcase size={20} />,
      title: "Dashboard",
      description: "Track your job applications",
      href: "/dashboard",
      color: "primary",
    },
    {
      icon: <FileText size={20} />,
      title: "Documents",
      description: "Manage your CVs and cover letters",
      href: "/documents",
      color: "secondary",
    },
    {
      icon: <HelpCircle size={20} />,
      title: "Help Center",
      description: "Get answers to your questions",
      href: "/help",
      color: "success",
    },
    {
      icon: <Settings size={20} />,
      title: "Settings",
      description: "Manage your account",
      href: "/settings",
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main 404 Content */}
        <div className="text-center mb-12">
          {/* Animated 404 Illustration */}
          <div className="relative mb-8">
            {/* Large 404 Text */}
            <div className="relative inline-block">
              <h1 className="text-[150px] md:text-[200px] font-bold text-foreground/20 leading-none select-none">
                404
              </h1>
              {/* Floating icon animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                    <MapPin className="text-primary" size={48} />
                  </div>
                  {/* Orbiting compass */}
                  <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center animate-spin-slow">
                    <Compass className="text-secondary" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-foreground/70 mb-2 max-w-md mx-auto">
            Looks like this job posting has been filled... or the page
            you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="text-foreground/60 mb-8">
            Error 404 - The page you requested could not be found
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button
              color="primary"
              size="lg"
              startContent={<Home size={20} />}
              onPress={() => router.push("/")}
              className="font-semibold"
            >
              Go to Homepage
            </Button>
            <Button
              variant="bordered"
              size="lg"
              startContent={<ArrowLeft size={20} />}
              onPress={() => router.back()}
              className="font-semibold"
            >
              Go Back
            </Button>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground text-center mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularPages.map((page, index) => (
              <Link key={index} href={page.href}>
                <Card
                  isPressable
                  className="bg-foreground/5 border w-full border-foreground/10 hover:border-primary/50 transition-all h-full"
                >
                  <CardBody className="p-5">
                    <div
                      className={`w-12 h-12 rounded-lg bg-${page.color}/10 flex items-center justify-center mb-3`}
                    >
                      {page.icon}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {page.title}
                    </h4>
                    <p className="text-foreground/60 text-sm">
                      {page.description}
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <Card className="bg-primary/5 border border-primary/10">
          <CardBody className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Still Can&apos;t Find What You&apos;re Looking For?
            </h3>
            <p className="text-foreground/70 mb-4 max-w-md mx-auto">
              Our help center has answers to common questions, or you can reach
              out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/help-feedback">
                <Button variant="flat" color="primary">
                  Visit Help Center
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <p className="text-foreground/50 text-sm">
            💡 <span className="font-medium">Did you know?</span> The average
            job seeker applies to 27 positions before landing an offer. Keep
            tracking with JobTracker!
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
