"use client";
import React from "react";
import { Card, CardBody, CardHeader, Divider, Chip } from "@heroui/react";
import {
  Shield,
  Lock,
  Eye,
  Cookie,
  Database,
  Users,
  Mail,
  FileText,
  Calendar,
  Globe,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react";

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = "February 10, 2026";

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Shield className="text-primary" size={24} />,
      content: (
        <div className="space-y-4 text-foreground/80">
          <p>
            Welcome to Trackee. We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our
            website and use our services, and tell you about your privacy rights
            and how the law protects you.
          </p>
          <p>
            This privacy policy applies to information we collect when you use
            our job application tracking platform (&quot;Service&quot) or when
            you otherwise interact with us.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle
              className="text-primary flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="font-semibold text-foreground mb-1">
                Important Notice
              </p>
              <p className="text-sm text-foreground/70">
                By using our Service, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with our policies and practices, please do not use our Service.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Database className="text-secondary" size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users size={18} className="text-secondary" />
              Account Information
            </h4>
            <p className="text-foreground/80 mb-3">
              When you create an account, we collect:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-foreground/80 list-disc">
                <strong>Name:</strong> Your full name for personalization
              </li>
              <li className="text-foreground/80 list-disc">
                <strong>Email Address:</strong> For account creation,
                authentication, and communication
              </li>
              <li className="text-foreground/80 list-disc">
                <strong>Password:</strong> Encrypted and stored securely (never
                stored in plain text)
              </li>
              <li className="text-foreground/80 list-disc">
                <strong>Profile Information:</strong> Skills, experience,
                education details you choose to add
              </li>
            </ul>
          </div>

          <Divider className="bg-foreground/10" />

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText size={18} className="text-secondary" />
              Job Application Data
            </h4>
            <p className="text-foreground/80 mb-3">
              Information you provide about your job search:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-foreground/80 list-disc">
                Job titles, company names, locations
              </li>
              <li className="text-foreground/80 list-disc">
                Application dates and status updates
              </li>
              <li className="text-foreground/80 list-disc">
                Job descriptions, URLs, and personal notes
              </li>
              <li className="text-foreground/80 list-disc">
                Documents (CVs, cover letters, portfolios, certificates)
              </li>
            </ul>
          </div>

          <Divider className="bg-foreground/10" />

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe size={18} className="text-secondary" />
              Automatically Collected Information
            </h4>
            <ul className="space-y-2 ml-6">
              <li className="text-foreground/80 list-disc">
                <strong>Usage Data:</strong> Pages visited, features used, time
                spent on platform
              </li>
              <li className="text-foreground/80 list-disc">
                <strong>Device Information:</strong> Browser type, operating
                system, IP address
              </li>
              <li className="text-foreground/80 list-disc">
                <strong>Cookies:</strong> To maintain your session and improve
                user experience
              </li>
            </ul>
          </div>

          <Divider className="bg-foreground/10" />

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield size={18} className="text-secondary" />
              Third-Party Authentication
            </h4>
            <p className="text-foreground/80">
              When you sign in with Google, we receive your name, email address,
              and profile picture from Google. We do not have access to your
              Google password.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <Eye className="text-success" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80">
            We use the information we collect for the following purposes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Provide Services",
                desc: "To create and manage your account, track job applications, and store your documents",
              },
              {
                title: "Analytics & Insights",
                desc: "To calculate success rates, conversion metrics, and provide personalized insights",
              },
              {
                title: "Communication",
                desc: "To send password reset emails, important updates, and respond to your inquiries",
              },
              {
                title: "Improve Platform",
                desc: "To understand how you use our Service and make improvements",
              },
              {
                title: "Security",
                desc: "To detect, prevent, and address fraud, abuse, and security issues",
              },
              {
                title: "Compliance",
                desc: "To comply with legal obligations and enforce our terms of service",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-success/5 border border-success/10"
              >
                <CardBody className="p-4">
                  <h5 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h5>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "data-storage",
      title: "Data Storage & Security",
      icon: <Lock className="text-warning" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80">
            We take the security of your data seriously and implement
            industry-standard measures to protect it:
          </p>

          <div className="space-y-4">
            <Card className="bg-warning/5 border border-warning/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock size={18} className="text-warning" />
                  Encryption
                </h5>
                <p className="text-foreground/80 text-sm">
                  All data transmitted between your browser and our servers is
                  encrypted using SSL/TLS. Passwords are hashed using bcrypt
                  with salt rounds, never stored in plain text.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-warning/5 border border-warning/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Database size={18} className="text-warning" />
                  Secure Storage
                </h5>
                <p className="text-foreground/80 text-sm">
                  Your documents are stored on secure cloud infrastructure
                  (Appwrite) with restricted access. Database records are stored
                  on MongoDB with authentication and encryption at rest.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-warning/5 border border-warning/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield size={18} className="text-warning" />
                  Access Controls
                </h5>
                <p className="text-foreground/80 text-sm">
                  Only you can access your job applications and documents. Our
                  team members have limited access to user data, only when
                  necessary for support or maintenance, and are bound by
                  confidentiality agreements.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle
              className="text-danger flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="font-semibold text-foreground mb-1">
                Important Security Notice
              </p>
              <p className="text-sm text-foreground/70">
                While we implement strong security measures, no method of
                transmission over the Internet is 100% secure. We cannot
                guarantee absolute security of your data.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Information Sharing & Disclosure",
      icon: <Users className="text-danger" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80 font-semibold">
            We do NOT sell, rent, or trade your personal information to third
            parties.
          </p>
          <p className="text-foreground/80">
            We may share your information only in the following circumstances:
          </p>

          <div className="space-y-3">
            <Card className="bg-foreground/5 border border-foreground/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2">
                  Service Providers
                </h5>
                <p className="text-foreground/80 text-sm">
                  We may share data with trusted third-party service providers
                  who assist us in operating our platform (e.g., cloud hosting,
                  email delivery). These providers are contractually obligated
                  to keep your information confidential.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip size="sm" variant="flat">
                    Google OAuth
                  </Chip>
                  <Chip size="sm" variant="flat">
                    Appwrite (Storage)
                  </Chip>
                  <Chip size="sm" variant="flat">
                    MongoDB (Database)
                  </Chip>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-foreground/5 border border-foreground/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2">
                  Legal Requirements
                </h5>
                <p className="text-foreground/80 text-sm">
                  We may disclose your information if required by law, court
                  order, or government regulation, or if we believe disclosure
                  is necessary to protect our rights or the safety of others.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-foreground/5 border border-foreground/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2">
                  Business Transfers
                </h5>
                <p className="text-foreground/80 text-sm">
                  If we are involved in a merger, acquisition, or sale of
                  assets, your information may be transferred. We will provide
                  notice before your information becomes subject to a different
                  privacy policy.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Tracking Technologies",
      icon: <Cookie className="text-primary" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80">
            We use cookies and similar tracking technologies to track activity
            on our Service and hold certain information.
          </p>

          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-foreground mb-2">
                Types of Cookies We Use:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-3">
                  <p className="font-medium text-foreground text-sm mb-1">
                    Essential Cookies
                  </p>
                  <p className="text-foreground/70 text-xs">
                    Required for authentication and basic functionality
                  </p>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-3">
                  <p className="font-medium text-foreground text-sm mb-1">
                    Preference Cookies
                  </p>
                  <p className="text-foreground/70 text-xs">
                    Remember your settings and preferences
                  </p>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-3">
                  <p className="font-medium text-foreground text-sm mb-1">
                    Analytics Cookies
                  </p>
                  <p className="text-foreground/70 text-xs">
                    Help us understand how you use our Service
                  </p>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-3">
                  <p className="font-medium text-foreground text-sm mb-1">
                    Security Cookies
                  </p>
                  <p className="text-foreground/70 text-xs">
                    Detect fraud and protect your account
                  </p>
                </div>
              </div>
            </div>

            <p className="text-foreground/80 text-sm">
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some portions of our Service.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: <Shield className="text-success" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80">
            You have the following rights regarding your personal data:
          </p>

          <div className="space-y-3">
            {[
              {
                icon: <Eye size={18} />,
                title: "Right to Access",
                desc: "You can request a copy of all personal data we hold about you",
              },
              {
                icon: <FileText size={18} />,
                title: "Right to Rectification",
                desc: "You can update or correct your information in your account settings",
              },
              {
                icon: <Trash2 size={18} />,
                title: "Right to Erasure",
                desc: "You can delete your account and all associated data at any time from Settings",
              },
              {
                icon: <Lock size={18} />,
                title: "Right to Restriction",
                desc: "You can request that we limit how we use your personal data",
              },
              {
                icon: <Download size={18} />,
                title: "Right to Data Portability",
                desc: "You can export your data in a machine-readable format",
              },
              {
                icon: <AlertCircle size={18} />,
                title: "Right to Object",
                desc: "You can object to certain types of processing of your data",
              },
            ].map((right, index) => (
              <Card
                key={index}
                className="bg-success/5 border border-success/10"
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      {right.icon}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">
                        {right.title}
                      </h5>
                      <p className="text-foreground/70 text-sm">{right.desc}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-foreground/80 text-sm">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:lonetech09@gmail.com"
                className="text-primary font-medium hover:underline"
              >
                lonetech09@gmail.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <Calendar className="text-secondary" size={24} />,
      content: (
        <div className="space-y-4 text-foreground/80">
          <p>
            We retain your personal information for as long as necessary to
            provide you with our Service and fulfill the purposes described in
            this policy.
          </p>

          <div className="space-y-3">
            <Card className="bg-foreground/5 border border-foreground/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2">
                  Active Accounts
                </h5>
                <p className="text-sm">
                  While your account is active, we retain all your data to
                  provide continuous service.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-foreground/5 border border-foreground/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2">
                  Account Deletion
                </h5>
                <p className="text-sm">
                  When you delete your account, we permanently delete all your
                  personal data, job applications, and documents within 30 days.
                  Some data may be retained for legal compliance (e.g., fraud
                  prevention) for up to 7 years.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-foreground/5 border border-foreground/10">
              <CardBody className="p-4">
                <h5 className="font-semibold text-foreground mb-2">
                  Inactive Accounts
                </h5>
                <p className="text-sm">
                  If your account remains inactive for 3 years, we may delete it
                  and associated data after notifying you via email.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: <Users className="text-warning" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80">
            Our Service is not intended for children under the age of 18. We do
            not knowingly collect personally identifiable information from
            children under 18.
          </p>
          <p className="text-foreground/80">
            If you are a parent or guardian and you are aware that your child
            has provided us with personal data, please contact us. If we become
            aware that we have collected personal data from children without
            verification of parental consent, we will take steps to remove that
            information from our servers.
          </p>
        </div>
      ),
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: <FileText className="text-danger" size={24} />,
      content: (
        <div className="space-y-4 text-foreground/80">
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="list-disc">
              Posting the new Privacy Policy on this page
            </li>
            <li className="list-disc">
              Updating the &quot;Last Updated&quot; date at the top of this
              policy
            </li>
            <li className="list-disc">
              Sending you an email notification for material changes
            </li>
            <li className="list-disc">
              Displaying an in-app notification when you log in
            </li>
          </ul>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <Mail className="text-primary" size={24} />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/80">
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border border-primary/10">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Email</p>
                    <a
                      href="mailto:lonetech09@gmail.com"
                      className="text-foreground font-medium hover:text-primary"
                    >
                      lonetech09@gmail.com
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-primary/5 border border-primary/10">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Website</p>
                    <a
                      href="https://trackee-project.vercel.app"
                      className="text-foreground font-medium hover:text-primary"
                    >
                      https://trackee-project.vercel.app
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-foreground/60">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

        {/* Quick Summary */}
        <Card className="bg-primary/5 border border-primary/10 mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-foreground">
              Privacy at a Glance
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="text-success" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    Your Data is Secure
                  </p>
                  <p className="text-foreground/70 text-xs">
                    We use industry-standard encryption and security measures
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-success" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    We Don&apos;t Sell Data
                  </p>
                  <p className="text-foreground/70 text-xs">
                    Your information is never sold or shared for marketing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="text-success" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    You&apos;re in Control
                  </p>
                  <p className="text-foreground/70 text-xs">
                    Access, update, or delete your data anytime
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Table of Contents */}
        <Card className="bg-foreground/5 border border-foreground/10 mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-foreground">
              Table of Contents
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-foreground/5 transition-colors "
                >
                  <span className="text-foreground/40 text-sm font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground text-sm">
                    {section.title}
                  </span>
                </a>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className="bg-foreground/5 border border-foreground/10 scroll-mt-8"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
              </CardHeader>
              <Divider className="bg-foreground/10" />
              <CardBody className="p-6">{section.content}</CardBody>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-foreground/60 text-sm">
          <p>
            This Privacy Policy is effective as of {lastUpdated} and will remain
            in effect except with respect to any changes in its provisions in
            the future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
