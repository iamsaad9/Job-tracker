"use client";
import React, { useState, useEffect, useMemo } from "react";

import {
  PlusIcon,
  Trash2,
  TrendingUp,
  Calendar,
  Target,
  Award,
  MapPin,
  Pen,
  MoveRight,
  Eye,
  ExternalLink,
  Download,
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
  Checkbox,
} from "@heroui/react";
import { DynamicIcon } from "@/app/components/ui/DynamicIcons";
import { Upload, FileText } from "lucide-react";
import { useUser } from "@/app/hooks/useUser";

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

interface JobDocuments {
  cv?:
    | {
        _id: string;
        title: string;
        file: {
          fileName: string;
          fileId: string;
          size: number;
        };
      }
    | string; // Can be populated or just ID
  coverLetter?:
    | {
        _id: string;
        title: string;
        file: {
          fileName: string;
          fileId: string;
          size: number;
        };
      }
    | string;
  portfolio?:
    | {
        _id: string;
        title: string;
        file: {
          fileName: string;
          fileId: string;
          size: number;
        };
      }
    | string;
  other?: Array<
    | {
        _id: string;
        title: string;
        file: {
          fileName: string;
          fileId: string;
          size: number;
        };
      }
    | string
  >;
}

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
  documents?: JobDocuments;
}

const JobTrackerHome: React.FC = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [documentToRemove, setDocumentToRemove] = useState({
    docId: "",
    docType: "",
  });
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
  const [selectedDocuments, setSelectedDocuments] = useState({
    cv: null as string | null,
    coverLetter: null as string | null,
    portfolio: null as string | null,
  });
  const [uploadingNewDoc, setUploadingNewDoc] = useState(false);
  const [pendingDocuments, setPendingDocuments] = useState<{
    cv: {
      file?: File;
      title?: string;
      description?: string;
      isDefault?: boolean;
    } | null;
    coverLetter: {
      file?: File;
      title?: string;
      description?: string;
      isDefault?: boolean;
    } | null;
    portfolio: {
      file?: File;
      title?: string;
      description?: string;
      isDefault?: boolean;
    } | null;
  }>({
    cv: null,
    coverLetter: null,
    portfolio: null,
  });
  const [availableDocuments, setAvailableDocuments] = useState<
    { _id: string; type: string; title: string; isDefault: boolean }[]
  >([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alsoDeletePermanent, setAlsoDeletePermanent] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

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

  /* Add these helper functions */

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDownloadJobDocument = async (docId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}/download`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download document");
      }
    } catch (err: unknown) {
      console.error("Error downloading document:", err);
      setError("Failed to download document");
    }
  };

  const fetchAvailableDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await fetch("/api/documents");
      const json = await response.json();
      const items = Array.isArray(json) ? json : json?.data || [];
      setAvailableDocuments(items);

      // Auto-select default documents
      const defaultCV = items.find(
        (doc: {
          _id: string;
          type: string;
          title: string;
          isDefault: boolean;
        }) => doc.type === "cv" && doc.isDefault,
      );
      const defaultCoverLetter = items.find(
        (doc: {
          _id: string;
          type: string;
          title: string;
          isDefault: boolean;
        }) => doc.type === "cover_letter" && doc.isDefault,
      );
      const defaultPortfolio = items.find(
        (doc: {
          _id: string;
          type: string;
          title: string;
          isDefault: boolean;
        }) => doc.type === "portfolio" && doc.isDefault,
      );

      setSelectedDocuments({
        cv: defaultCV?._id || null,
        coverLetter: defaultCoverLetter?._id || null,
        portfolio: defaultPortfolio?._id || null,
      });
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

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

  const handleFileSelect = (
    type: "cv" | "coverLetter" | "portfolio",
    file: File,
  ) => {
    const docType =
      type === "coverLetter"
        ? "Cover Letter"
        : type.charAt(0).toUpperCase() + type.slice(1);
    const defaultTitle = formData.company
      ? `${docType} for ${formData.company}`
      : `${docType} - ${new Date().toLocaleDateString()}`;

    setPendingDocuments({
      ...pendingDocuments,
      [type]: {
        file,
        title: defaultTitle,
        description: "",
        isDefault: false,
      },
    });
  };

  const handleRemovePendingDocument = (
    type: "cv" | "coverLetter" | "portfolio",
  ) => {
    setPendingDocuments({
      ...pendingDocuments,
      [type]: null,
    });
  };

  const handleRemove = async (
    jobId: string,
    docId: string,
    docType: string,
  ) => {
    setIsDeleting(true);
    console.log("Document to remove: ", documentToRemove);
    console.log("Job ID: ", jobId);
    console.log("Doc ID: ", docId);
    console.log("Doc Type: ", docType);
    try {
      const jobResponse = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          removeDocument: {
            docType: docType, // "cv", "coverLetter", etc.
            docId: docId,
          },
        }),
      });

      if (!jobResponse.ok)
        throw new Error("Failed to unlink document from job");

      setSelectedJob((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: null, // This removes the document from the UI list
          },
        };
      });

      // 2. Update your main 'jobs' list so the change persists if you close/reopen
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? { ...job, documents: { ...job.documents, [docType]: null } }
            : job,
        ),
      );

      // 2. If the user checked the "Delete permanently" checkbox
      if (alsoDeletePermanent) {
        const docResponse = await fetch(`/api/documents/${docId}`, {
          method: "DELETE",
        });

        if (docResponse.ok) {
          console.log("Document removed successfully");
          // Update your local Documents state if you're on a page that lists them
          // setDocuments(prev => prev.filter(d => d._id !== docId));
        } else {
          console.error("Unlinked from job, but failed to delete from storage");
          // Note: We don't throw here because the unlinking part actually succeeded
        }
      }

      // 3. Refresh your UI (e.g., refresh job list or close modal)
      // fetchJobs();
      setShowRemoveConfirm(false);
      setAlsoDeletePermanent(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove document",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateJob = async () => {
    // Validation
    if (
      !formData.title ||
      !formData.company ||
      !formData.country ||
      !formData.city
    ) {
      return;
    }

    setUploadingNewDoc(true);
    setError(null);

    try {
      // Normalize IDs (handle both string and object formats)
      const getDocId = (
        doc: string | { _id: string } | null | undefined,
      ): string | null => {
        if (typeof doc === "string") return doc;
        if (doc && typeof doc === "object" && "_id" in doc) return doc._id;
        return null;
      };

      let cvId = getDocId(
        selectedDocuments.cv || (isEditing ? editJob?.documents?.cv : null),
      );
      let clId = getDocId(
        selectedDocuments.coverLetter ||
          (isEditing ? editJob?.documents?.coverLetter : null),
      );
      let pfId = getDocId(
        selectedDocuments.portfolio ||
          (isEditing ? editJob?.documents?.portfolio : null),
      );

      // Helper to handle individual file uploads
      const uploadDoc = async (
        docObj: {
          file?: File;
          title?: string;
          description?: string;
          isDefault?: boolean;
        },
        type: string,
      ) => {
        const fd = new FormData();
        fd.append("user", user?._id || "");
        fd.append("file", docObj.file!);
        fd.append("type", type);
        fd.append(
          "title",
          docObj.title || `${type.toUpperCase()} - ${formData.company}`,
        );

        const res = await fetch("/api/documents", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(`${type} Upload failed`);
        return json.data._id;
      };

      // 1. Handle New Uploads (only if files are pending)
      if (pendingDocuments.cv)
        cvId = await uploadDoc(pendingDocuments.cv, "cv");
      if (pendingDocuments.coverLetter)
        clId = await uploadDoc(pendingDocuments.coverLetter, "cover_letter");
      if (pendingDocuments.portfolio)
        pfId = await uploadDoc(pendingDocuments.portfolio, "portfolio");

      // 2. Prepare Request Configuration
      // If editing, we use PUT and append the job ID to the URL
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `/api/jobs/${editJob?._id}` : "/api/jobs";

      const jobPayload = {
        ...formData,
        status: newJobStatus,
        // Only set applicationDate on create, or preserve it on edit
        applicationDate: isEditing ? editJob?.applicationDate : new Date(),
        documents: {
          cv: cvId,
          coverLetter: clId,
          portfolio: pfId,
          other: isEditing ? editJob?.documents?.other || [] : [],
        },
      };

      // 3. Send Job Request
      const jobResponse = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });

      const json = await jobResponse.json();
      if (!jobResponse.ok)
        throw new Error(
          json?.message || `Failed to ${isEditing ? "edit" : "create"} job`,
        );

      const updatedOrNewJob = json?.data || json;

      // 4. Update UI State
      console.log("Received job response:", updatedOrNewJob);
      if (isEditing) {
        // For editing, update the existing job
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j._id === updatedOrNewJob._id ? updatedOrNewJob : j,
          ),
        );
        // Update selectedJob if viewing the job that was just edited
        if (selectedJob?._id === updatedOrNewJob._id) {
          setSelectedJob(updatedOrNewJob);
        }
      } else {
        // For creating, add the new job to the beginning of the list
        setJobs((prevJobs) => [updatedOrNewJob, ...prevJobs]);
      }

      // 5. Cleanup
      setShowModal(false);
      resetForm(); // Move reset logic to a helper function
    } catch (error) {
      console.error(`Error ${isEditing ? "editing" : "creating"} job:`, error);
      setError(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setIsEditing(false);
      setUploadingNewDoc(false);
    }
  };

  // Separate helper to keep things tidy
  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      jobUrl: "",
      country: "",
      city: "",
      description: "",
      notes: "",
    });
    setSelectedDocuments({ cv: null, coverLetter: null, portfolio: null });
    setPendingDocuments({ cv: null, coverLetter: null, portfolio: null });
    setNewJobStatus("wishlist");
    setIsEditing(false);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);

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
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteConfirm = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteConfirm(true);
  };

  const handleViewJob = async (job: Job) => {
    try {
      // Fetch the latest job data to ensure documents are populated
      const response = await fetch(`/api/jobs/${job._id}`);
      const json = await response.json();
      const jobData = json?.data || json;
      setSelectedJob(jobData);
    } catch (err) {
      console.error("Error fetching job details:", err);
      setSelectedJob(job);
    }
    setShowViewModal(true);
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const openModal = (status: JobStatus) => {
    setNewJobStatus(status);
    setShowModal(true);
    fetchAvailableDocuments(); // Fetch documents when modal opens
  };

  const handleEditClick = (job: Job) => {
    setEditJob(job);
    setIsEditing(true);
    setFormData({
      title: job.title,
      company: job.company,
      jobUrl: job.jobUrl || "",
      country: job.country,
      city: job.city,
      description: job.description || "",
      notes: job.notes || "",
    });

    // Helper to safely get document ID
    const getDocId = (
      doc: string | { _id: string } | null | undefined,
    ): string | null => {
      if (typeof doc === "string") return doc;
      if (doc && typeof doc === "object" && "_id" in doc) return doc._id;
      return null;
    };

    setSelectedDocuments({
      cv: getDocId(job.documents?.cv),
      coverLetter: getDocId(job.documents?.coverLetter),
      portfolio: getDocId(job.documents?.portfolio),
    });
    setNewJobStatus(job.status as JobStatus);
    setShowModal(true);
    fetchAvailableDocuments();
  };
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-450 mx-auto">
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
                    className="min-w-25 rounded-xl p-4 flex-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 relative border-t-[6px] border-transparent"
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
                    aria-label="Add first job application"
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

                      <CardBody className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-25">
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
                                <h3 className="text-lg text-foreground font-semibold flex-1 mr-2 line-clamp-1">
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
                                    className="bg-background/80 text-foreground w-7 h-7 rounded-lg hover:bg-background transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow"
                                    onClick={() => handleEditClick(job)}
                                    aria-label="View job details"
                                  >
                                    <Pen size={15} />
                                  </button>
                                  <button
                                    className="bg-red-300/50 dark:bg-red-900/50 text-red-600 w-7 h-7 rounded-md hover:bg-red-200 transition-all hover:scale-110 flex items-center justify-center shrink-0 leading-none cursor-pointer"
                                    onClick={() => openDeleteConfirm(job._id)}
                                    aria-label="Delete job"
                                  >
                                    <Trash2 size={15} />
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
                        aria-label="Success rate progress"
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
                        aria-label="Interview stage conversion rate"
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
                        aria-label="Offer stage conversion rate"
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
                        aria-label="Acceptance rate progress"
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

        {/* Add Job Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
            setIsEditing(false);
            setEditJob(null);
          }}
          size="3xl"
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
              {isEditing ? "Edit Job" : "Add New Job"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {error && (
                  <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                    <p className="text-danger text-sm">{error}</p>
                  </div>
                )}

                <Input
                  label="JobTitle"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, title: value }))
                  }
                  isRequired
                  classNames={{
                    input: "text-foreground",
                  }}
                />

                <Input
                  label="Company"
                  placeholder="e.g., Google"
                  value={formData.company}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, company: value }))
                  }
                  isRequired
                  classNames={{
                    input: "text-foreground",
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    placeholder="e.g., USA"
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
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
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, city: value }))
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
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, jobUrl: value }))
                  }
                  classNames={{
                    input: "text-foreground",
                  }}
                />

                <Textarea
                  label="Description"
                  placeholder="Job description or requirements..."
                  value={formData.description}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                  minRows={3}
                  classNames={{
                    input: "text-foreground",
                  }}
                />

                <Textarea
                  label="Notes"
                  placeholder="Add personal notes..."
                  value={formData.notes}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, notes: value }))
                  }
                  minRows={2}
                  classNames={{
                    input: "text-foreground",
                  }}
                />
                {!isEditing && (
                  <Select
                    label="Status"
                    placeholder="Select status"
                    selectedKeys={[newJobStatus]}
                    onChange={(e) =>
                      setNewJobStatus(e.target.value as JobStatus)
                    }
                    className={isEditing ? "hidden" : ""}
                    classNames={{
                      value: "text-foreground",
                    }}
                  >
                    {(Object.keys(statusConfig) as JobStatus[]).map(
                      (status) => (
                        <SelectItem key={status} className="text-foreground">
                          {statusConfig[status].title}
                        </SelectItem>
                      ),
                    )}
                  </Select>
                )}

                <Divider className="my-4 bg-foreground/10" />

                {/* Documents Section */}
                <div>
                  <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Attach Documents (Optional)
                  </h3>

                  {loadingDocuments ? (
                    <div className="flex justify-center py-4">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* CV Selection */}
                      <div>
                        <label className="text-foreground/70 text-sm mb-2 block">
                          CV/Resume
                        </label>
                        {!pendingDocuments.cv ? (
                          <div>
                            <div className="flex gap-2">
                              <Select
                                aria-label="Select CV or resume"
                                placeholder="Select CV"
                                selectedKeys={
                                  selectedDocuments.cv
                                    ? [selectedDocuments.cv]
                                    : []
                                }
                                onSelectionChange={(keys) => {
                                  const selected = Array.from(
                                    keys,
                                  )[0] as string;
                                  setSelectedDocuments({
                                    ...selectedDocuments,
                                    cv: selected || null,
                                  });
                                }}
                                classNames={{
                                  trigger: "bg-foreground/5",
                                  value: "text-foreground",
                                }}
                                className="flex-1"
                                disallowEmptySelection
                              >
                                {availableDocuments
                                  .filter((doc) => doc.type === "cv")
                                  .map((doc) => (
                                    <SelectItem
                                      key={doc._id}
                                      textValue={doc.title}
                                      className="text-foreground"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{doc.title}</span>
                                        {doc.isDefault && (
                                          <Chip
                                            size="sm"
                                            color="success"
                                            variant="flat"
                                          >
                                            Default
                                          </Chip>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </Select>
                              <input
                                aria-label="Upload new CV or resume file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileSelect("cv", file);
                                  }
                                  e.target.value = ""; // Reset input
                                }}
                                className="hidden"
                                id="cv-upload"
                              />
                              <label htmlFor="cv-upload">
                                <Button
                                  aria-label="Upload new CV or resume file"
                                  as="span"
                                  variant="bordered"
                                  startContent={<Upload size={16} />}
                                >
                                  Upload New
                                </Button>
                              </label>
                            </div>
                          </div>
                        ) : pendingDocuments.cv && pendingDocuments.cv.file ? (
                          /* Expanded form for pending document */
                          <div className="mt-3 p-4 border border-foreground/20 rounded-lg bg-foreground/5 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-foreground">
                                📎 {pendingDocuments.cv.file.name}
                              </p>
                              <Button
                                aria-label="Remove CV file"
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() =>
                                  handleRemovePendingDocument("cv")
                                }
                              >
                                ✕ Remove
                              </Button>
                            </div>

                            <Input
                              label="Document Title"
                              value={pendingDocuments.cv.title}
                              onChange={(e) =>
                                setPendingDocuments({
                                  ...pendingDocuments,
                                  cv: {
                                    ...pendingDocuments.cv,
                                    title: e.target.value,
                                  },
                                })
                              }
                              size="sm"
                            />

                            <Textarea
                              label="Description (Optional)"
                              value={pendingDocuments.cv.description}
                              onChange={(e) =>
                                setPendingDocuments({
                                  ...pendingDocuments,
                                  cv: {
                                    ...pendingDocuments.cv,
                                    description: e.target.value,
                                  },
                                })
                              }
                              minRows={2}
                              size="sm"
                            />

                            <div className="flex items-center gap-2">
                              <input
                                aria-label="Set as default CV"
                                type="checkbox"
                                id="cv-default"
                                checked={pendingDocuments.cv.isDefault}
                                onChange={(e) =>
                                  setPendingDocuments({
                                    ...pendingDocuments,
                                    cv: {
                                      ...pendingDocuments.cv,
                                      isDefault: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label
                                htmlFor="cv-default"
                                className="text-sm text-foreground"
                              >
                                Set as default CV
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* Cover Letter Selection */}
                      <div>
                        <label className="text-foreground/70 text-sm mb-2 block">
                          Cover Letter
                        </label>
                        {!pendingDocuments.coverLetter ? (
                          <div>
                            <div className="flex gap-2">
                              <Select
                                aria-label="Select Cover Letter"
                                placeholder="Select Cover Letter"
                                selectedKeys={
                                  selectedDocuments.coverLetter
                                    ? [selectedDocuments.coverLetter]
                                    : []
                                }
                                onSelectionChange={(keys) => {
                                  const selected = Array.from(
                                    keys,
                                  )[0] as string;
                                  setSelectedDocuments({
                                    ...selectedDocuments,
                                    coverLetter: selected || null,
                                  });
                                }}
                                classNames={{
                                  trigger: "bg-foreground/5",
                                  value: "text-foreground",
                                }}
                                className="flex-1"
                                disallowEmptySelection
                              >
                                {availableDocuments
                                  .filter((doc) => doc.type === "cover_letter")
                                  .map((doc) => (
                                    <SelectItem
                                      key={doc._id}
                                      textValue={doc.title}
                                      className="text-foreground"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{doc.title}</span>
                                        {doc.isDefault && (
                                          <Chip
                                            size="sm"
                                            color="success"
                                            variant="flat"
                                          >
                                            Default
                                          </Chip>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </Select>
                              <input
                                aria-label="Upload new cover letter file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileSelect("coverLetter", file);
                                  }
                                  e.target.value = ""; // Reset input
                                }}
                                className="hidden"
                                id="coverLetter-upload"
                              />
                              <label htmlFor="coverLetter-upload">
                                <Button
                                  as="span"
                                  variant="bordered"
                                  startContent={<Upload size={16} />}
                                >
                                  Upload New
                                </Button>
                              </label>
                            </div>
                          </div>
                        ) : pendingDocuments.coverLetter &&
                          pendingDocuments.coverLetter.file ? (
                          /* Expanded form for pending document */
                          <div className="mt-3 p-4 border border-foreground/20 rounded-lg bg-foreground/5 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-foreground">
                                📎 {pendingDocuments.coverLetter.file.name}
                              </p>
                              <Button
                                aria-label="Remove Cover Letter file"
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() =>
                                  handleRemovePendingDocument("coverLetter")
                                }
                              >
                                ✕ Remove
                              </Button>
                            </div>

                            <Input
                              label="Document Title"
                              value={pendingDocuments.coverLetter.title}
                              onChange={(e) =>
                                setPendingDocuments({
                                  ...pendingDocuments,
                                  coverLetter: {
                                    ...pendingDocuments.coverLetter,
                                    title: e.target.value,
                                  },
                                })
                              }
                              size="sm"
                            />

                            <Textarea
                              label="Description (Optional)"
                              value={pendingDocuments.coverLetter.description}
                              onChange={(e) =>
                                setPendingDocuments({
                                  ...pendingDocuments,
                                  coverLetter: {
                                    ...pendingDocuments.coverLetter,
                                    description: e.target.value,
                                  },
                                })
                              }
                              minRows={2}
                              size="sm"
                            />

                            <div className="flex items-center gap-2">
                              <input
                                aria-label="Set as default Cover Letter"
                                type="checkbox"
                                id="coverLetter-default"
                                checked={pendingDocuments.coverLetter.isDefault}
                                onChange={(e) =>
                                  setPendingDocuments({
                                    ...pendingDocuments,
                                    coverLetter: {
                                      ...pendingDocuments.coverLetter,
                                      isDefault: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label
                                htmlFor="coverLetter-default"
                                className="text-sm text-foreground"
                              >
                                Set as default Cover Letter
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* Portfolio Selection */}
                      <div>
                        <label className="text-foreground/70 text-sm mb-2 block">
                          Portfolio
                        </label>
                        {!pendingDocuments.portfolio ? (
                          <div>
                            <div className="flex gap-2">
                              <Select
                                aria-label="Select Portfolio"
                                placeholder="Select Portfolio"
                                selectedKeys={
                                  selectedDocuments.portfolio
                                    ? [selectedDocuments.portfolio]
                                    : []
                                }
                                onSelectionChange={(keys) => {
                                  const selected = Array.from(
                                    keys,
                                  )[0] as string;
                                  setSelectedDocuments({
                                    ...selectedDocuments,
                                    portfolio: selected || null,
                                  });
                                }}
                                classNames={{
                                  trigger: "bg-foreground/5",
                                  value: "text-foreground",
                                }}
                                className="flex-1"
                                disallowEmptySelection
                              >
                                {availableDocuments
                                  .filter((doc) => doc.type === "portfolio")
                                  .map((doc) => (
                                    <SelectItem
                                      key={doc._id}
                                      textValue={doc.title}
                                      className="text-foreground"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{doc.title}</span>
                                        {doc.isDefault && (
                                          <Chip
                                            size="sm"
                                            color="success"
                                            variant="flat"
                                          >
                                            Default
                                          </Chip>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </Select>
                              <input
                                aria-label="Upload new portfolio file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileSelect("portfolio", file);
                                  }
                                  e.target.value = ""; // Reset input
                                }}
                                className="hidden"
                                id="portfolio-upload"
                              />
                              <label htmlFor="portfolio-upload">
                                <Button
                                  as="span"
                                  variant="bordered"
                                  startContent={<Upload size={16} />}
                                >
                                  Upload New
                                </Button>
                              </label>
                            </div>
                          </div>
                        ) : pendingDocuments.portfolio &&
                          pendingDocuments.portfolio.file ? (
                          /* Expanded form for pending document */
                          <div className="mt-3 p-4 border border-foreground/20 rounded-lg bg-foreground/5 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-foreground">
                                📎 {pendingDocuments.portfolio.file.name}
                              </p>
                              <Button
                                aria-label="Remove Portfolio file"
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() =>
                                  handleRemovePendingDocument("portfolio")
                                }
                              >
                                ✕ Remove
                              </Button>
                            </div>

                            <Input
                              label="Document Title"
                              value={pendingDocuments.portfolio.title}
                              onChange={(e) =>
                                setPendingDocuments({
                                  ...pendingDocuments,
                                  portfolio: {
                                    ...pendingDocuments.portfolio,
                                    title: e.target.value,
                                  },
                                })
                              }
                              size="sm"
                            />

                            <Textarea
                              label="Description (Optional)"
                              value={pendingDocuments.portfolio.description}
                              onChange={(e) =>
                                setPendingDocuments({
                                  ...pendingDocuments,
                                  portfolio: {
                                    ...pendingDocuments.portfolio,
                                    description: e.target.value,
                                  },
                                })
                              }
                              minRows={2}
                              size="sm"
                            />

                            <div className="flex items-center gap-2">
                              <input
                                aria-label="Set as default Portfolio"
                                type="checkbox"
                                id="portfolio-default"
                                checked={pendingDocuments.portfolio.isDefault}
                                onChange={(e) =>
                                  setPendingDocuments({
                                    ...pendingDocuments,
                                    portfolio: {
                                      ...pendingDocuments.portfolio,
                                      isDefault: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label
                                htmlFor="portfolio-default"
                                className="text-sm text-foreground"
                              >
                                Set as default Portfolio
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                aria-label="modal-button"
                variant="light"
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                  setIsEditing(false);
                  setEditJob(null);
                }}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleCreateJob}
                isLoading={uploadingNewDoc}
                isDisabled={
                  !formData.title ||
                  !formData.company ||
                  !formData.country ||
                  !formData.city ||
                  uploadingNewDoc
                }
              >
                {isEditing
                  ? uploadingNewDoc
                    ? "Saving..."
                    : "Save Changes"
                  : uploadingNewDoc
                    ? "Creating..."
                    : "Add Job"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Job Details Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => (setShowViewModal(false), setIsEditing(false))}
          size="3xl"
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

                  {/* Attached Documents Section */}
                  {selectedJob.documents && (
                    <>
                      <Divider className="bg-foreground/10" />
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <FileText size={18} />
                          Attached Documents
                        </h4>
                        <div className="space-y-3">
                          {/* CV */}
                          {selectedJob.documents.cv &&
                            typeof selectedJob.documents.cv === "object" &&
                            selectedJob.documents.cv?.title && (
                              <Card className="bg-foreground/5 border border-foreground/10">
                                <CardBody className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="text-lg">📄</span>
                                      </div>
                                      <div>
                                        <p className="text-foreground font-medium text-sm">
                                          {selectedJob.documents.cv.title}
                                        </p>
                                        <p className="text-foreground/60 text-xs">
                                          {
                                            selectedJob.documents.cv.file
                                              ?.fileName
                                          }{" "}
                                          •{" "}
                                          {formatFileSize(
                                            selectedJob.documents.cv.file?.size,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        size="sm"
                                        aria-label="remove"
                                        variant="flat"
                                        color="danger"
                                        startContent={<Trash2 size={14} />}
                                        onPress={() => (
                                          setShowRemoveConfirm(true),
                                          setDocumentToRemove({
                                            docId:
                                              (typeof selectedJob?.documents
                                                ?.cv === "object"
                                                ? selectedJob.documents.cv._id
                                                : null) || "",
                                            docType: "cv",
                                          })
                                        )}
                                      >
                                        Remove
                                      </Button>
                                      <Button
                                        size="sm"
                                        aria-label="download"
                                        variant="flat"
                                        color="primary"
                                        startContent={<Download size={14} />}
                                        onPress={() => {
                                          if (
                                            typeof selectedJob?.documents
                                              ?.cv === "object" &&
                                            selectedJob.documents.cv?._id &&
                                            selectedJob.documents.cv?.file
                                              ?.fileName
                                          ) {
                                            handleDownloadJobDocument(
                                              selectedJob.documents.cv._id,
                                              selectedJob.documents.cv.file
                                                .fileName,
                                            );
                                          }
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            )}

                          {/* Cover Letter */}
                          {selectedJob.documents.coverLetter &&
                            typeof selectedJob.documents.coverLetter ===
                              "object" &&
                            selectedJob.documents.coverLetter?.title && (
                              <Card className="bg-foreground/5 border border-foreground/10">
                                <CardBody className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                        <span className="text-lg">✉️</span>
                                      </div>
                                      <div>
                                        <p className="text-foreground font-medium text-sm">
                                          {
                                            selectedJob.documents.coverLetter
                                              .title
                                          }
                                        </p>
                                        <p className="text-foreground/60 text-xs">
                                          {
                                            selectedJob.documents.coverLetter
                                              .file?.fileName
                                          }{" "}
                                          •{" "}
                                          {formatFileSize(
                                            selectedJob.documents.coverLetter
                                              .file?.size,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        size="sm"
                                        aria-label="remove"
                                        variant="flat"
                                        color="danger"
                                        startContent={<Trash2 size={14} />}
                                        onPress={() => (
                                          setShowRemoveConfirm(true),
                                          setDocumentToRemove({
                                            docId:
                                              (typeof selectedJob?.documents
                                                ?.coverLetter === "object"
                                                ? selectedJob.documents
                                                    .coverLetter._id
                                                : null) || "",
                                            docType: "coverLetter",
                                          })
                                        )}
                                      >
                                        Remove
                                      </Button>
                                      <Button
                                        size="sm"
                                        aria-label="download"
                                        variant="flat"
                                        color="primary"
                                        startContent={<Download size={14} />}
                                        onPress={() => {
                                          if (
                                            typeof selectedJob?.documents
                                              ?.coverLetter === "object" &&
                                            selectedJob.documents.coverLetter
                                              ?._id &&
                                            selectedJob.documents.coverLetter
                                              ?.file?.fileName
                                          ) {
                                            handleDownloadJobDocument(
                                              selectedJob.documents.coverLetter
                                                ._id,
                                              selectedJob.documents.coverLetter
                                                .file.fileName,
                                            );
                                          }
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            )}

                          {/* Portfolio */}
                          {selectedJob.documents.portfolio &&
                            typeof selectedJob.documents.portfolio ===
                              "object" &&
                            selectedJob.documents.portfolio?.title && (
                              <Card className="bg-foreground/5 border border-foreground/10">
                                <CardBody className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                        <span className="text-lg">🎨</span>
                                      </div>
                                      <div>
                                        <p className="text-foreground font-medium text-sm">
                                          {
                                            selectedJob.documents.portfolio
                                              .title
                                          }
                                        </p>
                                        <p className="text-foreground/60 text-xs">
                                          {
                                            selectedJob.documents.portfolio.file
                                              ?.fileName
                                          }{" "}
                                          •{" "}
                                          {formatFileSize(
                                            selectedJob.documents.portfolio.file
                                              ?.size,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        size="sm"
                                        aria-label="remove"
                                        variant="flat"
                                        color="danger"
                                        startContent={<Trash2 size={14} />}
                                        onPress={() => (
                                          setShowRemoveConfirm(true),
                                          setDocumentToRemove({
                                            docId:
                                              (typeof selectedJob?.documents
                                                ?.portfolio === "object"
                                                ? selectedJob.documents
                                                    .portfolio._id
                                                : null) || "",
                                            docType: "portfolio",
                                          })
                                        )}
                                      >
                                        Remove
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="flat"
                                        aria-label="download-button"
                                        color="success"
                                        startContent={<Download size={14} />}
                                        onPress={() => {
                                          if (
                                            typeof selectedJob?.documents
                                              ?.portfolio === "object" &&
                                            selectedJob.documents.portfolio
                                              ?._id &&
                                            selectedJob.documents.portfolio
                                              ?.file?.fileName
                                          ) {
                                            handleDownloadJobDocument(
                                              selectedJob.documents.portfolio
                                                ._id,
                                              selectedJob.documents.portfolio
                                                .file.fileName,
                                            );
                                          }
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            )}

                          {/* Show message if no documents */}
                          {!selectedJob.documents.cv &&
                            !selectedJob.documents.coverLetter &&
                            !selectedJob.documents.portfolio && (
                              <p className="text-foreground/60 text-sm text-center py-4">
                                No documents attached to this application
                              </p>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                aria-label="close-button"
                color="primary"
                onPress={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Document Remove Confirmation Modal */}
        <Modal
          isOpen={showRemoveConfirm}
          onClose={() => setShowRemoveConfirm(false)}
        >
          <ModalContent>
            <ModalHeader>Remove Document</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to remove this document from this job
                application?
              </p>

              {/* The "Double Delete" Checkbox */}
              <div className="flex items-center gap-2 mt-4 p-3 bg-danger-50 rounded-lg border border-danger-200">
                <Checkbox
                  color="danger"
                  isSelected={alsoDeletePermanent}
                  onValueChange={setAlsoDeletePermanent}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-danger">
                    Delete from library too?
                  </span>
                  <span className="text-xs text-danger-500 italic">
                    Warning: This will delete the actual file permanently.
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setShowRemoveConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isDeleting}
                onPress={() =>
                  selectedJob?._id &&
                  handleRemove(
                    selectedJob._id,
                    documentToRemove.docId,
                    documentToRemove.docType,
                  )
                }
              >
                Confirm Removal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Job Delete Confirmation Modal */}
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
                aria-label="cancel-button"
                variant="light"
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setJobToDelete(null);
                }}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                aria-label="delete-button"
                isLoading={isDeleting}
                color="danger"
                onPress={handleDeleteJob}
              >
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
