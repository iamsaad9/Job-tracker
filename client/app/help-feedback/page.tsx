"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Button,
  Accordion,
  AccordionItem,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  Search,
  MessageCircle,
  BookOpen,
  Video,
  Mail,
  FileText,
  Briefcase,
  Settings,
  Upload,
  TrendingUp,
  CheckCircle,
  Send,
  X,
} from "lucide-react";

interface Tutorials {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  link: string;
}

const HelpAndFeedbackPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFeedbackForm({
        name: "",
        email: "",
        category: "general",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const faqs = [
    {
      category: "Getting Started",
      icon: <Briefcase size={20} />,
      color: "primary" as const,
      questions: [
        {
          q: "How do I add my first job application?",
          a: "Click the '+' button on any status column (Wishlist, Applied, Interview, Offered, Accepted) or use the floating '+' button at the bottom right of the dashboard. Fill in the job details like title, company, location, and optionally attach documents.",
        },
        {
          q: "What are the different status columns?",
          a: "The tracker has 5 status columns: Wishlist (jobs you're interested in), Applied (jobs you've applied to), Interview (jobs where you have an interview), Offered (jobs that made you an offer), and Accepted (jobs you've accepted). You can drag and drop jobs between these columns.",
        },
        {
          q: "Can I track multiple job applications at once?",
          a: "Yes! There's no limit to how many job applications you can track. The analytics sidebar will automatically update to show your success rates, top companies, and locations.",
        },
      ],
    },
    {
      category: "Job Management",
      icon: <FileText size={20} />,
      color: "secondary" as const,
      questions: [
        {
          q: "How do I move a job to a different status?",
          a: "Simply drag and drop the job card from one column to another. For example, when you get an interview, drag the job from 'Applied' to 'Interview'. The analytics will automatically update.",
        },
        {
          q: "Can I edit job details after creating it?",
          a: "Yes! Click the eye icon on any job card to view details, where you can see all information including attached documents. To edit, you'll need to delete and recreate (edit functionality coming soon!).",
        },
        {
          q: "How do I delete a job application?",
          a: "Click the trash icon on the job card. A confirmation modal will appear to prevent accidental deletions. This action cannot be undone.",
        },
        {
          q: "What information can I add to a job application?",
          a: "You can add: Job Title, Company, Country, City, Job URL, Description, Notes, Application Date (auto-set), and attach documents (CV, Cover Letter, Portfolio).",
        },
      ],
    },
    {
      category: "Documents",
      icon: <Upload size={20} />,
      color: "success" as const,
      questions: [
        {
          q: "How do I attach documents to a job application?",
          a: "When creating a new job, scroll down to the 'Attach Documents' section. You can either select from previously uploaded documents or upload new ones. You can attach a CV, Cover Letter, and Portfolio to each application.",
        },
        {
          q: "What is a default document?",
          a: "Default documents are automatically selected when creating new job applications. For example, if you set your main CV as default, it will be pre-selected for every new job you add. You can change this in the Documents page.",
        },
        {
          q: "How do I upload documents to my library?",
          a: "Go to the Documents page and click 'Upload Document'. Choose the document type (CV, Cover Letter, Portfolio, or Certificate), add a title and description, upload the file, and optionally set it as default.",
        },
        {
          q: "Can I download my documents?",
          a: "Yes! In the Documents page or when viewing job details, click the 'Download' button next to any document to save it to your device.",
        },
        {
          q: "What file formats are supported?",
          a: "We support PDF, DOC, and DOCX files. Maximum file size is 10MB per document.",
        },
      ],
    },
    {
      category: "Analytics",
      icon: <TrendingUp size={20} />,
      color: "warning" as const,
      questions: [
        {
          q: "What does the Success Rate mean?",
          a: "Success Rate shows the percentage of your active applications (Applied, Interview, Offered, Accepted) that progressed beyond the initial application stage. Higher is better!",
        },
        {
          q: "How are conversion rates calculated?",
          a: "Interview Stage Rate = (Interviews + Offers + Accepted) / Total Active Applications. Offer Stage Rate = (Offers + Accepted) / Total Active Applications. Acceptance Rate = Accepted / (Offers + Accepted).",
        },
        {
          q: "What are 'This Week' and 'This Month' numbers?",
          a: "These show how many job applications you've added in the past 7 days and the current month. Great for tracking your application momentum!",
        },
        {
          q: "How does the Top Companies list work?",
          a: "It shows the 5 companies you've applied to most frequently, helping you see where you're focusing your efforts.",
        },
      ],
    },
    {
      category: "Account Settings",
      icon: <Settings size={20} />,
      color: "danger" as const,
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Settings page, enter your current password, new password, and confirm it. Note: If you signed up with Google, you'll need to change your password in Google Account Settings.",
        },
        {
          q: "Can I change my email address?",
          a: "Yes! In Settings, enter your new email and your current password to confirm. Google users cannot change email here - update it in Google Account Settings instead.",
        },
        {
          q: "How do I delete my account?",
          a: "In Settings, scroll to the 'Danger Zone' section. Click 'Delete Account', type 'DELETE' to confirm, and your account and all data will be permanently removed. This cannot be undone.",
        },
        {
          q: "I forgot my password. What do I do?",
          a: "On the login page, click 'Forgot password?'. Enter your email and we'll send you a reset link. The link expires in 1 hour for security.",
        },
      ],
    },
  ];

  const quickTips = [
    {
      icon: <CheckCircle className="text-success" size={20} />,
      title: "Set Default Documents",
      description:
        "Upload your main CV, cover letter, and portfolio, then set them as defaults to save time when applying to jobs.",
    },
    {
      icon: <CheckCircle className="text-success" size={20} />,
      title: "Use Job Notes",
      description:
        "Add notes to jobs like recruiter names, salary ranges, or interview dates. They'll appear on the job card for quick reference.",
    },
    {
      icon: <CheckCircle className="text-success" size={20} />,
      title: "Track Wishlists",
      description:
        "Use the Wishlist column for jobs you're researching. Move them to Applied when ready to submit your application.",
    },
    {
      icon: <CheckCircle className="text-success" size={20} />,
      title: "Monitor Analytics",
      description:
        "Check your conversion rates weekly to understand which strategies are working and where to improve.",
    },
    {
      icon: <CheckCircle className="text-success" size={20} />,
      title: "Add Job URLs",
      description:
        "Always include the job posting URL so you can quickly reference requirements or re-read the description.",
    },
  ];

  const tutorials: Tutorials[] = [];

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Help & Feedback
          </h1>
          <p className="text-foreground/60 text-lg">
            Get answers to your questions or share your thoughts with us
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
            startContent={<Search className="text-foreground/40" size={20} />}
            endContent={
              <X
                className="text-foreground/40 cursor-pointer"
                size={16}
                onClick={() => setSearchQuery("")}
              />
            }
            classNames={{
              input: "text-foreground",
              inputWrapper: "bg-foreground/5 border-foreground/10",
            }}
          />
        </div>

        {/* Main Tabs */}
        <Tabs
          aria-label="Help sections"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-x-6 gap-y-2 w-full relative rounded-none p-0 border-b border-foreground/10 flex-wrap",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary",
          }}
        >
          {/* FAQ Tab */}
          <Tab
            key="faq"
            textValue="Frequently Asked Questions"
            title={
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>Frequently Asked Questions</span>
              </div>
            }
          >
            <div className="py-6 space-y-6">
              {/* Quick Tips */}
              {searchQuery === "" && (
                <Card className="bg-primary/5 border border-primary/10">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle className="text-primary" size={20} />
                      Quick Tips
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickTips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex gap-3 p-3 bg-background rounded-lg"
                        >
                          {tip.icon}
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">
                              {tip.title}
                            </h4>
                            <p className="text-foreground/60 text-xs">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* FAQ Accordions by Category */}
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foreground/60">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                filteredFaqs.map((category, catIndex) => (
                  <Card
                    key={catIndex}
                    className="bg-foreground/5 border border-foreground/10"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-background">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {category.category}
                          </h3>
                          <p className="text-foreground/60 text-sm">
                            {category.questions.length} questions
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Accordion variant="bordered">
                        {category.questions.map((item, qIndex) => (
                          <AccordionItem
                            key={qIndex}
                            textValue={item.q}
                            title={
                              <span className="font-semibold text-foreground">
                                {item.q}
                              </span>
                            }
                            classNames={{
                              title: "text-foreground",
                              content: "text-foreground/70",
                            }}
                          >
                            {item.a}
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>

          {/* Video Tutorials Tab */}
          <Tab
            key="tutorials"
            textValue="Video Tutorials"
            title={
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>Video Tutorials</span>
              </div>
            }
          >
            <div className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!tutorials.length && (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-foreground/60">No tutorials available</p>
                  </div>
                )}
                {tutorials.map((tutorial, index) => (
                  <Card
                    key={index}
                    isPressable
                    className="bg-foreground/5 border border-foreground/10 hover:border-primary/50 transition-colors"
                  >
                    <CardBody className="p-0">
                      <div className="relative aspect-video rounded-t-lg overflow-hidden">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                            <Video className="text-primary" size={28} />
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          className="absolute bottom-2 right-2"
                          variant="flat"
                        >
                          {tutorial.duration}
                        </Chip>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">
                          {tutorial.title}
                        </h3>
                        <p className="text-foreground/60 text-sm">
                          {tutorial.description}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>

          {/* Contact & Feedback Tab */}
          <Tab
            key="feedback"
            textValue="Send Feedback"
            title={
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span>Send Feedback</span>
              </div>
            }
          >
            <div className="py-6">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-foreground/5 border border-foreground/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          We&apos;d Love to Hear From You
                        </h3>
                        <p className="text-foreground/60 text-sm">
                          Share your feedback, report bugs, or request features
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider className="bg-foreground/10" />
                  <CardBody className="p-6">
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="text-success" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          Thank You!
                        </h3>
                        <p className="text-foreground/70">
                          We&apos;ve received your feedback and will get back to
                          you soon.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleFeedbackSubmit}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Your Name"
                            placeholder="John Doe"
                            value={feedbackForm.name}
                            onChange={(e) =>
                              setFeedbackForm({
                                ...feedbackForm,
                                name: e.target.value,
                              })
                            }
                            isRequired
                            classNames={{
                              label: "text-foreground font-medium",
                              input: "text-foreground",
                            }}
                          />
                          <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={feedbackForm.email}
                            onChange={(e) =>
                              setFeedbackForm({
                                ...feedbackForm,
                                email: e.target.value,
                              })
                            }
                            isRequired
                            classNames={{
                              label: "text-foreground font-medium",
                              input: "text-foreground",
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-foreground font-medium text-sm mb-2 block">
                            Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { value: "general", label: "General Feedback" },
                              { value: "bug", label: "Bug Report" },
                              { value: "feature", label: "Feature Request" },
                              { value: "help", label: "Need Help" },
                            ].map((cat) => (
                              <Chip
                                key={cat.value}
                                variant={
                                  feedbackForm.category === cat.value
                                    ? "solid"
                                    : "bordered"
                                }
                                color={
                                  feedbackForm.category === cat.value
                                    ? "primary"
                                    : "default"
                                }
                                className="cursor-pointer"
                                onClick={() =>
                                  setFeedbackForm({
                                    ...feedbackForm,
                                    category: cat.value,
                                  })
                                }
                              >
                                {cat.label}
                              </Chip>
                            ))}
                          </div>
                        </div>

                        <Textarea
                          label="Your Message"
                          placeholder="Tell us what's on your mind..."
                          value={feedbackForm.message}
                          onChange={(e) =>
                            setFeedbackForm({
                              ...feedbackForm,
                              message: e.target.value,
                            })
                          }
                          isRequired
                          minRows={6}
                          classNames={{
                            label: "text-foreground font-medium",
                            input: "text-foreground",
                          }}
                        />

                        <Button
                          type="submit"
                          color="primary"
                          size="lg"
                          className="w-full font-semibold"
                          isLoading={isSubmitting}
                          startContent={!isSubmitting && <Send size={18} />}
                        >
                          {isSubmitting ? "Sending..." : "Send Feedback"}
                        </Button>
                      </form>
                    )}
                  </CardBody>
                </Card>

                {/* Contact Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-foreground/5 border border-foreground/10">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs">Email Us</p>
                          <p className="text-foreground font-medium">
                            support@jobtracker.com
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-foreground/5 border border-foreground/10">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <MessageCircle className="text-success" size={20} />
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs">
                            Response Time
                          </p>
                          <p className="text-foreground font-medium">
                            Within 24 hours
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpAndFeedbackPage;
