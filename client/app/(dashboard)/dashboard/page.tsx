"use client";
import React, { useState, useEffect, useMemo } from "react";

import {
  PlusIcon,
  Trash,
  TrendingUp,
  Calendar,
  Target,
  Award,
  MapPin,
  Pen,
  MoveRight,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Progress,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { DynamicIcon } from "@/app/components/ui/DynamicIcons";

interface Job {
  _id: string;
  title: string;
  company: string;
  jobUrl?: string;
  country: string;
  city: string;
  description?: string;
  status: string;
  applicationDate: Date;
  notes?: string;
}

type JobStatus = "wishlist" | "applied" | "interview" | "offered" | "accepted";

const statusConfig: Record<
  JobStatus,
  { title: string; color: string; bgColor: string; icon: string }
> = {
  wishlist: {
    title: "Wish List",
    color: "#429CFF",
    bgColor: "bg-blue-500",
    icon: "FaStar",
  },
  applied: {
    title: "Applied",
    color: "#8b5cf6",
    bgColor: "bg-purple-500",
    icon: "FaPaperPlane",
  },
  interview: {
    title: "Interview",
    color: "#F55858",
    bgColor: "bg-red-500",
    icon: "FaBriefcase",
  },
  offered: {
    title: "Offered",
    color: "#f97316",
    bgColor: "bg-orange-500",
    icon: "FaHeart",
  },
  accepted: {
    title: "Accepted",
    color: "#10b981",
    bgColor: "bg-green-500",
    icon: "FaHandshake",
  },
};

const JobTrackerHome: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [newJobStatus, setNewJobStatus] = useState<JobStatus>("wishlist");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    jobUrl: "",
    country: "",
    city: "",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Analytics calculations
  const analytics = useMemo(() => {
    const total = jobs.length;
    const wishlist = jobs.filter((j) => j.status === "wishlist").length;
    const applied = jobs.filter((j) => j.status === "applied").length;
    const interviews = jobs.filter((j) => j.status === "interview").length;
    const offers = jobs.filter((j) => j.status === "offered").length;
    const accepted = jobs.filter((j) => j.status === "accepted").length;

    const totalInProgress = applied + interviews + offers + accepted;

    const interviewRate =
      totalInProgress > 0
        ? ((interviews + offers + accepted) / totalInProgress) * 100
        : 0;
    const offerRate =
      totalInProgress > 0 ? ((offers + accepted) / totalInProgress) * 100 : 0;
    const acceptanceRate =
      offers + accepted > 0 ? (accepted / (offers + accepted)) * 100 : 0;

    const now = new Date();
    const thisMonth = jobs.filter((j) => {
      const appDate = new Date(j.applicationDate);
      return (
        appDate.getMonth() === now.getMonth() &&
        appDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = jobs.filter(
      (j) => new Date(j.applicationDate) >= oneWeekAgo,
    ).length;

    const companyCounts = jobs.reduce(
      (acc, job) => {
        acc[job.company] = (acc[job.company] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));

    const locationCounts = jobs.reduce(
      (acc, job) => {
        const location = `${job.city}, ${job.country}`;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    const successfulApplications = interviews + offers + accepted;
    const successRate =
      totalInProgress > 0
        ? (successfulApplications / totalInProgress) * 100
        : 0;

    return {
      total,
      wishlist,
      applied,
      interviews,
      offers,
      accepted,
      totalInProgress,
      interviewRate,
      offerRate,
      acceptanceRate,
      thisMonth,
      thisWeek,
      topCompanies,
      topLocations,
      successRate,
    };
  }, [jobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/jobs");
        const json = await response.json();
        const items = Array.isArray(json) ? json : json?.data || [];
        setJobs(items);
      } catch (err: unknown) {
        console.error("Error fetching jobs:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err) || "Failed to load jobs");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDragStart = (job: Job) => {
    setDraggedJob(job);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: JobStatus) => {
    if (!draggedJob) return;

    try {
      const response = await fetch(`/api/jobs/${draggedJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draggedJob, status }),
      });

      const json = await response.json();
      if (response.ok) {
        const updated = json?.data || { ...draggedJob, status };
        setJobs(
          jobs.map((job) => (job._id === draggedJob._id ? updated : job)),
        );
      } else {
        console.error("Update failed", json);
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }

    setDraggedJob(null);
  };

  const handleCreateJob = async () => {
    if (
      !formData.title ||
      !formData.company ||
      !formData.country ||
      !formData.city
    ) {
      return;
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: newJobStatus,
          applicationDate: new Date(),
        }),
      });

      const json = await response.json();
      if (response.ok) {
        const newJob = json?.data || json;
        setJobs([...jobs, newJob]);
        setShowModal(false);
        setFormData({
          title: "",
          company: "",
          jobUrl: "",
          country: "",
          city: "",
          description: "",
          notes: "",
        });
      } else {
        console.error("Create failed", json);
        setError(json?.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: "DELETE",
      });

      const json = await response.json();
      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== jobToDelete));
        setShowDeleteConfirm(false);
        setJobToDelete(null);
      } else {
        console.error("Delete failed", json);
        setError(json?.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setError("Failed to delete job");
    }
  };

  const openDeleteConfirm = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteConfirm(true);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const openModal = (status: JobStatus) => {
    setNewJobStatus(status);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <header className="text-foreground mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-foreground/60">
            Your personal job application tracker.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Status Tabs */}
              <div className="flex flex-wrap gap-4 mb-6">
                {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                  <Card
                    key={status}
                    className="min-w-[100px] rounded-xl p-4 flex-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 relative border-t-[6px] border-transparent"
                    style={{
                      borderTopColor: statusConfig[status].color,
                    }}
                  >
                    <CardBody>
                      <div className="flex items-start justify-start">
                        <span className="text-xl mr-2">
                          <DynamicIcon
                            iconName={statusConfig[status].icon}
                            color={statusConfig[status].color}
                          />
                        </span>
                        <div className="flex flex-col justify-start">
                          <span className="font-semibold text-sm md:text-base text-foreground/70">
                            {statusConfig[status].title}
                          </span>
                          <span className="block text-xl md:text-2xl font-bold text-foreground mt-1">
                            {getJobsByStatus(status).length}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {jobs.length === 0 ? (
                <div className="text-center text-foreground py-16">
                  <h2 className="text-2xl mb-2">No job applications yet</h2>
                  <p className="opacity-90 mb-4">
                    Start by adding your first job application.
                  </p>
                  <Button
                    color="primary"
                    size="lg"
                    className="font-semibold"
                    onPress={() => openModal("wishlist")}
                  >
                    Add first job
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                    <Card
                      key={status}
                      className="backdrop-blur-md rounded-2xl p-5 border border-white/20"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(status)}
                      style={{
                        backgroundColor: `${statusConfig[status].color}30`,
                        borderColor: `${statusConfig[status].color}`,
                      }}
                    >
                      <CardHeader className="flex items-center justify-between mb-4 pb-3 border-b-2 border-white/20">
                        <h2 className="text-foreground text-xl font-semibold flex items-center gap-2">
                          <span className="text-2xl">
                            <DynamicIcon
                              iconName={statusConfig[status].icon}
                              color={statusConfig[status].color}
                            />
                          </span>
                          {statusConfig[status].title}
                        </h2>
                        <div className="flex items-center gap-3">
                          <span className="bg-background/80 text-foreground px-3 py-1 rounded-lg text-sm">
                            {getJobsByStatus(status).length}
                          </span>
                          <button
                            className="bg-background/80 text-foreground w-8 h-8 rounded-lg text-xl hover:bg-background transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow"
                            onClick={() => openModal(status)}
                            aria-label={`Add job to ${statusConfig[status].title}`}
                          >
                            <PlusIcon size={18} />
                          </button>
                        </div>
                      </CardHeader>

                      <CardBody className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[100px]">
                        {getJobsByStatus(status).length === 0 ? (
                          <div className="col-span-full text-center text-foreground py-10">
                            No jobs in this stage
                          </div>
                        ) : (
                          getJobsByStatus(status).map((job) => (
                            <Card
                              key={job._id}
                              className="rounded-xl p-4 cursor-move transition-all hover:-translate-y-1"
                              draggable
                              onDragStart={() => handleDragStart(job)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg text-foreground font-semibold flex-1 mr-2">
                                  {job.title}
                                </h3>
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    className="bg-background/80 text-foreground w-7 h-7 rounded-lg hover:bg-background transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow"
                                    onClick={() => handleViewJob(job)}
                                    aria-label="View job details"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  <button
                                    className="bg-red-300/50 dark:bg-red-900/50 text-red-600 w-7 h-7 rounded-md hover:bg-red-200 transition-all hover:scale-110 flex items-center justify-center shrink-0 leading-none cursor-pointer"
                                    onClick={() => openDeleteConfirm(job._id)}
                                    aria-label="Delete job"
                                  >
                                    <Trash size={15} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-foreground/70 text-sm mb-2">
                                {job.company}
                              </p>
                              <p className="text-foreground/60 text-xs mb-2">
                                <MapPin
                                  size={12}
                                  color="red"
                                  className="inline"
                                />{" "}
                                {job.city}, {job.country}
                              </p>
                              {job.jobUrl && (
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-blue-500 text-sm font-medium my-2 hover:text-blue-600 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Job{" "}
                                  <MoveRight size={10} className="inline" />
                                </a>
                              )}
                              {job.notes && (
                                <p className="bg-background p-2 rounded-md text-xs text-foreground/80 my-2 italic">
                                  <Pen
                                    color="#ffffff"
                                    size={10}
                                    className="inline"
                                  />{" "}
                                  {job.notes}
                                </p>
                              )}
                              <p className="text-foreground text-xs mt-2">
                                {new Date(
                                  job.applicationDate,
                                ).toLocaleDateString()}
                              </p>
                            </Card>
                          ))
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Analytics Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-4 space-y-4 overflow-y-auto">
                {/* Overview Stats */}
                <Card className="border border-foreground/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-primary" size={20} />
                      <h3 className="text-lg font-semibold text-foreground">
                        Overview
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground/70 text-sm">
                          Total Applications
                        </span>
                        <span className="text-foreground font-bold text-xl">
                          {analytics.total}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-foreground/70 text-sm">
                          Success Rate
                        </span>
                        <span className="text-foreground font-semibold">
                          {analytics.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analytics.successRate}
                        color="success"
                        size="sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-foreground/5 rounded-lg p-3">
                        <div className="text-foreground/70 text-xs mb-1">
                          This Week
                        </div>
                        <div className="text-foreground font-bold text-lg">
                          {analytics.thisWeek}
                        </div>
                      </div>
                      <div className="bg-foreground/5 rounded-lg p-3">
                        <div className="text-foreground/70 text-xs mb-1">
                          This Month
                        </div>
                        <div className="text-foreground font-bold text-lg">
                          {analytics.thisMonth}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Conversion Rates */}
                <Card className="border border-foreground/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="text-warning" size={20} />
                      <h3 className="text-lg font-semibold text-foreground">
                        Conversion Rates
                      </h3>
                    </div>
                    <p className="text-foreground/60 text-xs mt-1 ml-2">
                      Based on {analytics.totalInProgress} active applications
                    </p>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-foreground/70 text-sm">
                          Interview Stage
                        </span>
                        <span className="text-foreground font-semibold">
                          {analytics.interviewRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analytics.interviewRate}
                        color="primary"
                        size="sm"
                      />
                      <p className="text-foreground/50 text-xs mt-1">
                        Jobs that reached interview or beyond
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-foreground/70 text-sm">
                          Offer Stage
                        </span>
                        <span className="text-foreground font-semibold">
                          {analytics.offerRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analytics.offerRate}
                        color="warning"
                        size="sm"
                      />
                      <p className="text-foreground/50 text-xs mt-1">
                        Jobs that received offers or were accepted
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-foreground/70 text-sm">
                          Acceptance Rate
                        </span>
                        <span className="text-foreground font-semibold">
                          {analytics.acceptanceRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analytics.acceptanceRate}
                        color="success"
                        size="sm"
                      />
                      <p className="text-foreground/50 text-xs mt-1">
                        Offers that were accepted
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Top Companies */}
                {analytics.topCompanies.length > 0 && (
                  <Card className="border border-foreground/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Award className="text-success" size={20} />
                        <h3 className="text-lg font-semibold text-foreground">
                          Top Companies
                        </h3>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-2">
                      {analytics.topCompanies.map(
                        ({ company, count }, index) => (
                          <div
                            key={company}
                            className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-foreground/50 text-xs font-medium">
                                #{index + 1}
                              </span>
                              <span className="text-foreground text-sm">
                                {company}
                              </span>
                            </div>
                            <Chip size="sm" variant="flat" color="primary">
                              {count}
                            </Chip>
                          </div>
                        ),
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* Top Locations */}
                {analytics.topLocations.length > 0 && (
                  <Card className="border border-foreground/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-secondary" size={20} />
                        <h3 className="text-lg font-semibold text-foreground">
                          Top Locations
                        </h3>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-2">
                      {analytics.topLocations.map(
                        ({ location, count }, index) => (
                          <div
                            key={location}
                            className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-foreground/50 text-xs font-medium">
                                #{index + 1}
                              </span>
                              <span className="text-foreground text-sm">
                                {location}
                              </span>
                            </div>
                            <Chip size="sm" variant="flat" color="secondary">
                              {count}
                            </Chip>
                          </div>
                        ),
                      )}
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          title="Add job"
          onClick={() => openModal("wishlist")}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gray-900 text-white text-3xl shadow-2xl hover:bg-gray-800 transition-all hover:scale-110 z-50"
        >
          +
        </button>

        {/* Add Job Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="2xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-background border border-foreground/10",
            header: "border-b border-foreground/10",
            body: "py-6",
            footer: "border-t border-foreground/10",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-foreground text-xl font-semibold">
              Add New Job
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Job Title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  isRequired
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />

                <Input
                  label="Company"
                  placeholder="e.g., Google"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  isRequired
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    placeholder="e.g., USA"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    isRequired
                    classNames={{
                      label: "text-foreground",
                      input: "text-foreground",
                    }}
                  />

                  <Input
                    label="City"
                    placeholder="e.g., San Francisco"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    isRequired
                    classNames={{
                      label: "text-foreground",
                      input: "text-foreground",
                    }}
                  />
                </div>

                <Input
                  label="Job URL"
                  type="url"
                  placeholder="https://..."
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />

                <Textarea
                  label="Description"
                  placeholder="Job description or requirements..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  minRows={3}
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />

                <Textarea
                  label="Notes"
                  placeholder="Add personal notes..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  minRows={2}
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />

                <Select
                  label="Status"
                  placeholder="Select status"
                  selectedKeys={[newJobStatus]}
                  onChange={(e) => setNewJobStatus(e.target.value as JobStatus)}
                  classNames={{
                    label: "text-foreground",
                    value: "text-foreground",
                  }}
                >
                  {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                    <SelectItem key={status} className="text-foreground">
                      {statusConfig[status].title}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setShowModal(false)}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleCreateJob}
                isDisabled={
                  !formData.title ||
                  !formData.company ||
                  !formData.country ||
                  !formData.city
                }
              >
                Add Job
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Job Details Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          size="2xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-background border border-foreground/10",
            header: "border-b border-foreground/10",
            body: "py-6",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-foreground text-xl font-semibold">
              Job Details
            </ModalHeader>
            <ModalBody>
              {selectedJob && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {selectedJob.title}
                    </h3>
                    <p className="text-lg text-foreground/80">
                      {selectedJob.company}
                    </p>
                  </div>

                  <Divider className="bg-foreground/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Status</p>
                      <Chip
                        variant="flat"
                        style={{
                          backgroundColor: `${statusConfig[selectedJob.status as JobStatus].color}30`,
                          color:
                            statusConfig[selectedJob.status as JobStatus].color,
                        }}
                      >
                        {statusConfig[selectedJob.status as JobStatus].title}
                      </Chip>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-sm mb-1">
                        Application Date
                      </p>
                      <p className="text-foreground font-medium">
                        {new Date(
                          selectedJob.applicationDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-foreground/60 text-sm mb-1">Location</p>
                    <p className="text-foreground flex items-center gap-1">
                      <MapPin size={16} className="text-red-500" />
                      {selectedJob.city}, {selectedJob.country}
                    </p>
                  </div>

                  {selectedJob.jobUrl && (
                    <div>
                      <p className="text-foreground/60 text-sm mb-1">
                        Job Posting
                      </p>
                      <a
                        href={selectedJob.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Job Posting
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}

                  {selectedJob.description && (
                    <div>
                      <p className="text-foreground/60 text-sm mb-2">
                        Description
                      </p>
                      <p className="text-foreground bg-foreground/5 p-3 rounded-lg">
                        {selectedJob.description}
                      </p>
                    </div>
                  )}

                  {selectedJob.notes && (
                    <div>
                      <p className="text-foreground/60 text-sm mb-2">Notes</p>
                      <p className="text-foreground bg-foreground/5 p-3 rounded-lg italic">
                        {selectedJob.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setShowViewModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setJobToDelete(null);
          }}
          size="md"
          classNames={{
            base: "bg-background border border-danger/30",
            header: "border-b border-danger/20",
            body: "py-6",
            footer: "border-t border-danger/20",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-danger text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Confirm Deletion
            </ModalHeader>
            <ModalBody>
              <p className="text-foreground">
                Are you sure you want to delete this job application? This
                action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setJobToDelete(null);
                }}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button color="danger" onPress={handleDeleteJob}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default JobTrackerHome;
