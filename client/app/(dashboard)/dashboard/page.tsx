"use client";
import React, { useState, useEffect } from "react";

import { PlusIcon, Trash } from "lucide-react";
import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";
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

  // Fetch jobs from API
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

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      const json = await response.json();
      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== jobId));
      } else {
        console.error("Delete failed", json);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const openModal = (status: JobStatus) => {
    setNewJobStatus(status);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-8">
      <div className=" mx-auto">
        {/* Header */}
        <header className=" text-foreground mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Job Application Tracker
          </h1>
          <p className="text-foreground/60">
            Your personal job application tracker.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : error ? (
          <div className="text-white text-center py-10">Error: {error}</div>
        ) : (
          <>
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-10 mb-6 justify-between ">
              {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                <Card
                  key={status}
                  className="min-w-[100px] rounded-xl p-4 flex-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 relative border-t-[6px] border-transparent"
                  style={{
                    borderTopColor:
                      status === "wishlist"
                        ? "#429CFF"
                        : status === "applied"
                          ? "#8b5cf6"
                          : status === "interview"
                            ? "#F55858"
                            : status === "offered"
                              ? "#f97316"
                              : "#10b981",
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
                      <div className="flex flex-col  justify-start">
                        <span className="font-semibold text-lg text-foreground/70">
                          {statusConfig[status].title}
                        </span>
                        <span className="block text-2xl font-bold text-foreground mt-1">
                          {getJobsByStatus(status).length}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {jobs.length === 0 ? (
              <div className="text-center text-white py-16">
                <h2 className="text-2xl mb-2">No job applications yet</h2>
                <p className="opacity-90 mb-4">
                  Start by adding your first job application.
                </p>
                <button
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={() => openModal("wishlist")}
                >
                  Add first job
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                  <Card
                    key={status}
                    className=" backdrop-blur-md rounded-2xl p-5 border border-white/20"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(status)}
                    style={{
                      backgroundColor:
                        status === "wishlist"
                          ? "#429CFF30"
                          : status === "applied"
                            ? "#8b5cf630"
                            : status === "interview"
                              ? "#F5585830"
                              : status === "offered"
                                ? "#f9731630"
                                : "#10b98130",
                    }}
                  >
                    {/* Column Header */}
                    <CardHeader className="flex items-center justify-between mb-4 pb-3 border-b-2 border-white/20">
                      <h2 className="text-foregrund text-xl font-semibold flex items-center gap-2">
                        <span className="text-2xl">
                          <DynamicIcon
                            iconName={statusConfig[status].icon}
                            color={statusConfig[status].color}
                          />
                        </span>
                        {statusConfig[status].title}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="bg-background/80 text-foreground px-3 py-1 rounded-lg text-sm ">
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

                    {/* Cards Container */}
                    <CardBody className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[100px]">
                      {getJobsByStatus(status).length === 0 ? (
                        <div className="col-span-full text-center text-foreground py-10">
                          No jobs in this stage
                        </div>
                      ) : (
                        getJobsByStatus(status).map((job) => (
                          <Card
                            key={job._id}
                            className=" rounded-xl p-4 cursor-move transition-all hover:-translate-y-1"
                            draggable
                            onDragStart={() => handleDragStart(job)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg text-foreground font-semibold flex-1 mr-2">
                                {job.title}
                              </h3>
                              <Button
                                className="bg-red-100 text-red-600 w-7 h-7 rounded-md text-xl hover:bg-red-200 transition-all hover:scale-110 flex items-center justify-center shrink-0 leading-none"
                                onPress={() => handleDeleteJob(job._id)}
                                aria-label="Delete job"
                              >
                                <Trash size={15} />
                              </Button>
                            </div>
                            <p className="text-foreground/70 text-sm  mb-2">
                              {job.company}
                            </p>
                            <p className="text-foreground/60 text-xs mb-2">
                              📍 {job.city}, {job.country}
                            </p>
                            {job.jobUrl && (
                              <a
                                href={job.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-blue-500 text-sm font-medium my-2 hover:text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Job →
                              </a>
                            )}
                            {job.notes && (
                              <p className="bg-background p-2 rounded-md text-xs text-foreground/80 my-2 italic">
                                💬 {job.notes}
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
          </>
        )}

        {/* Floating Add Button */}
        <button
          title="Add job"
          onClick={() => openModal("wishlist")}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gray-900 text-white text-3xl shadow-2xl hover:bg-gray-800 transition-all hover:scale-110"
        >
          +
        </button>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl text-gray-900 font-semibold">
                  Add New Job
                </h2>
                <button
                  className="bg-gray-100 w-9 h-9 rounded-lg text-2xl text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center leading-none"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateJob} className="p-6">
                <div className="mb-5">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="company"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="e.g., Google"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-gray-700 font-medium mb-2 text-sm"
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="e.g., USA"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-gray-700 font-medium mb-2 text-sm"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="e.g., San Francisco"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="jobUrl"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Job URL
                  </label>
                  <input
                    type="url"
                    id="jobUrl"
                    value={formData.jobUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, jobUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Job description or requirements..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-y"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="notes"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add personal notes..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-y"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="status"
                    className="block text-gray-700 font-medium mb-2 text-sm"
                  >
                    Status *
                  </label>
                  <select
                    id="status"
                    value={newJobStatus}
                    onChange={(e) =>
                      setNewJobStatus(e.target.value as JobStatus)
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {(Object.keys(statusConfig) as JobStatus[]).map(
                      (status) => (
                        <option key={status} value={status}>
                          {statusConfig[status].title}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Add Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTrackerHome;
