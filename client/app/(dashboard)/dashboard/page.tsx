"use client";
import React, { useState, useEffect } from "react";
import "./home.css";

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

const statusConfig: Record<JobStatus, { title: string; color: string }> = {
  wishlist: { title: "Wishlist", color: "#6366f1" },
  applied: { title: "Applied", color: "#3b82f6" },
  interview: { title: "Interview", color: "#f59e0b" },
  offered: { title: "Offered", color: "#10b981" },
  accepted: { title: "Accepted", color: "#059669" },
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
        // Backend sometimes returns { success: true, data: [...] }
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
    <div className="job-tracker">
      <header className="header">
        <h1>Job Application Tracker</h1>
        <p className="subtitle">Manage your job search journey</p>
      </header>

      {loading ? (
        <div style={{ color: "white", textAlign: "center", padding: 40 }}>
          Loading jobs…
        </div>
      ) : error ? (
        <div style={{ color: "white", textAlign: "center", padding: 40 }}>
          Error: {error}
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", color: "white", padding: 60 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>
            No job applications yet
          </h2>
          <p style={{ opacity: 0.9, marginBottom: 16 }}>
            Start by adding your first job application.
          </p>
          <button className="btn-submit" onClick={() => openModal("wishlist")}>
            Add first job
          </button>
        </div>
      ) : (
        <div className="board">
          {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
            <div
              key={status}
              className="column"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              <div
                className="column-header"
                style={{ borderTopColor: statusConfig[status].color }}
              >
                <h2>{statusConfig[status].title}</h2>
                <span className="count">{getJobsByStatus(status).length}</span>
                <button
                  className="add-btn"
                  onClick={() => openModal(status)}
                  aria-label={`Add job to ${statusConfig[status].title}`}
                >
                  +
                </button>
              </div>

              <div className="cards-container">
                {getJobsByStatus(status).map((job) => (
                  <div
                    key={job._id}
                    className="job-card"
                    draggable
                    onDragStart={() => handleDragStart(job)}
                  >
                    <div className="card-header">
                      <h3>{job.title}</h3>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteJob(job._id)}
                        aria-label="Delete job"
                      >
                        ×
                      </button>
                    </div>
                    <p className="company">{job.company}</p>
                    <p className="location">
                      📍 {job.city}, {job.country}
                    </p>
                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="job-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Job →
                      </a>
                    )}
                    {job.notes && <p className="notes">💬 {job.notes}</p>}
                    <p className="date">
                      {new Date(job.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating add button */}
      <button
        title="Add job"
        onClick={() => openModal("wishlist")}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#111827",
          color: "#fff",
          border: "none",
          fontSize: 28,
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        +
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Job</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g., Google"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    type="text"
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="e.g., USA"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g., San Francisco"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="jobUrl">Job URL</label>
                <input
                  type="url"
                  id="jobUrl"
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Job description or requirements..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add personal notes..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  value={newJobStatus}
                  onChange={(e) => setNewJobStatus(e.target.value as JobStatus)}
                >
                  {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTrackerHome;
