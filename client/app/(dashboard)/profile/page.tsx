"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Chip,
  Avatar,
  Divider,
  useDisclosure,
  Spinner,
  Tabs,
  Tab,
} from "@heroui/react";
import { useUser } from "@/app/hooks/useUser";
import { Pen, Plus, Trash2 } from "lucide-react";

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

interface Education {
  _id?: string;
  degree: string;
  institution: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}

interface Resume {
  fileId: string;
  fileName: string;
  createdAt: Date;
}

interface UserProfile {
  _id: string;
  user: string;
  name?: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resumes: Resume[];
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  // Modal states
  const basicInfoModal = useDisclosure();
  const experienceModal = useDisclosure();
  const educationModal = useDisclosure();
  const skillsModal = useDisclosure();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState({
    title: "",
    id: "",
    status: false,
  });

  // Form states
  const [basicInfoForm, setBasicInfoForm] = useState({
    name: "",
    headline: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  });

  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [educationForm, setEducationForm] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  });

  const [newSkills, setNewSkills] = useState("");

  // Editing states
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null,
  );

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile/${user?._id}`);
      const json = await response.json();

      if (response.ok && json.success) {
        setProfile(json.data);
        // Populate basic info form
        setBasicInfoForm({
          name: json.data.name || "",
          headline: json.data.headline || "",
          summary: json.data.summary || "",
          email: json.data.email || "",
          phone: json.data.phone || "",
          location: json.data.location || "",
          website: json.data.website || "",
          linkedin: json.data.linkedin || "",
          github: json.data.github || "",
        });
      } else {
        setError(json.message || "Failed to load profile");
      }
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveBasicInfo = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile/${user?._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basicInfoForm),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setProfile(json.data);
        basicInfoModal.onClose();
      } else {
        setError(json.message || "Failed to save profile");
      }
    } catch (err: unknown) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = async () => {
    setSaving(true);
    setError(null);
    try {
      // If editingExperience exists, use PUT. If not, use POST.

      const endpoint = `/api/profile/${profile?._id}/experiences`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...experienceForm,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setProfile(json.data);
        experienceModal.onClose();
        setExperienceForm({
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        });
        setEditingExperience(null);
      } else {
        setError(
          json.message ||
            `Failed to ${editingExperience ? "update" : "add"} experience`,
        );
      }
    } catch (err: unknown) {
      console.error(
        `Error ${editingExperience ? "updating" : "adding"} experience:`,
        err,
      );
      setError(`Failed to ${editingExperience ? "update" : "add"} experience`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setExperienceForm({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      startDate: exp.startDate
        ? new Date(exp.startDate).toISOString().split("T")[0]
        : "",
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : "",
      current: exp.current,
      description: exp.description || "",
    });
    experienceModal.onOpen();
  };

  const handleDeleteExperience = async (expId: string | undefined) => {
    if (!expId) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/profile/${profile?._id}/experiences/`,
        {
          method: "DELETE",
          body: JSON.stringify({ experienceId: expId }),
        },
      );

      const json = await response.json();

      if (response.ok && json.success) {
        setProfile(json.data);
      } else {
        setError(json.message || "Failed to delete experience");
      }
    } catch (err: unknown) {
      console.error("Error deleting experience:", err);
      setError("Failed to delete experience");
    } finally {
      setShowRemoveConfirm({ title: "", id: "", status: false });
      setSaving(false);
    }
  };

  const handleAddEducation = async () => {
    setSaving(true);
    setError(null);
    try {
      // 1. Use PATCH for updates, PUT for adding new
      const method = editingEducation ? "PATCH" : "PUT";

      // 2. Consistent endpoint (only profile ID is dynamic in URL)
      const endpoint = `/api/profile/${profile?._id}/educations`;

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...educationForm,
          // 3. Inject the ID into the JSON body
          educationId: editingEducation?._id,
          startDate: new Date(educationForm.startDate),
          endDate: educationForm.endDate
            ? new Date(educationForm.endDate)
            : undefined,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setProfile(json.data);
        educationModal.onClose();
        setEditingEducation(null);
      } else {
        setError(
          json.message ||
            `Failed to ${editingEducation ? "update" : "add"} education`,
        );
      }
    } catch (err) {
      console.error("Education Error:", err);
      setError("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setEducationForm({
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.startDate
        ? new Date(edu.startDate).toISOString().split("T")[0]
        : "",
      endDate: edu.endDate
        ? new Date(edu.endDate).toISOString().split("T")[0]
        : "",
      grade: edu.grade || "",
      description: edu.description || "",
    });
    educationModal.onOpen();
  };

  const handleDeleteEducation = async (eduId: string | undefined) => {
    if (!eduId) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile/${profile?._id}/educations/`, {
        method: "DELETE",
        body: JSON.stringify({ educationId: eduId }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setProfile(json.data);
      } else {
        setError(json.message || "Failed to delete education");
      }
    } catch (err: unknown) {
      console.error("Error deleting education:", err);
      setError("Failed to delete education");
    } finally {
      setShowRemoveConfirm({ title: "", id: "", status: false });
      setSaving(false);
    }
  };

  // Reset handlers for adding new items
  const handleOpenAddExperience = () => {
    setEditingExperience(null);
    setExperienceForm({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    experienceModal.onOpen();
  };

  const handleOpenAddEducation = () => {
    setEditingEducation(null);
    setEducationForm({
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    });
    educationModal.onOpen();
  };

  // Modal close handlers to reset state
  const handleCloseExperienceModal = () => {
    setEditingExperience(null);
    setExperienceForm({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    experienceModal.onClose();
  };

  const handleCloseEducationModal = () => {
    setEditingEducation(null);
    setEducationForm({
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    });
    educationModal.onClose();
  };

  const handleDeleteSkill = async (skillToDelete: string) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile/${profile?._id}/skills`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: skillToDelete }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        if (profile) {
          setProfile({ ...profile, skills: json.data });
        }
      } else {
        setError(json.message || "Failed to delete skill");
      }
    } catch (err: unknown) {
      console.error("Error deleting skill:", err);
      setError("Failed to delete skill");
    } finally {
      setShowRemoveConfirm({ title: "", id: "", status: false });
      setSaving(false);
    }
  };

  const handleAddSkills = async () => {
    const skillsArray = newSkills
      .split(",")
      .map((s) => s.trim().toLowerCase()) // Normalize to lowercase to prevent "React" vs "react" duplicates
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) {
      setError("Please enter at least one skill");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile/${profile?._id}/skills`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillsArray }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        if (profile) {
          setProfile({ ...profile, skills: json.data });
        }
        skillsModal.onClose();
        setNewSkills("");
      } else {
        setError(json.message || "Failed to add skills");
      }
    } catch (err: unknown) {
      console.error("Error adding skills:", err);
      setError("Failed to add skills");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-lg mb-4">
            {error || "Profile not found"}
          </p>
          <Button color="primary" onPress={fetchProfile}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <Card className="bg-foreground/5 border border-foreground/10 mb-6">
          <CardBody className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar
                className="w-24 h-24 md:w-32 md:h-32"
                name={`${profile.name || ""}`.trim() || "U"}
                classNames={{
                  base: "bg-primary text-white text-3xl",
                }}
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {profile.name}
                  </h1>
                  <Button
                    color="primary"
                    size="sm"
                    onPress={basicInfoModal.onOpen}
                  >
                    <Pen size={12} /> Edit Profile
                  </Button>
                </div>
                {profile.headline && (
                  <p className="text-lg text-foreground/80 mb-2">
                    {profile.headline}
                  </p>
                )}
                {profile.location && (
                  <p className="text-foreground/60 mb-3">
                    📍 {profile.location}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {profile.email && (
                    <Chip
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<span>📧</span>}
                    >
                      {profile.email}
                    </Chip>
                  )}
                  {profile.phone && (
                    <Chip
                      variant="flat"
                      color="secondary"
                      size="sm"
                      startContent={<span>📱</span>}
                    >
                      {profile.phone}
                    </Chip>
                  )}
                  {profile.website && (
                    <Chip
                      variant="flat"
                      color="success"
                      size="sm"
                      startContent={<span>🌐</span>}
                      as="a"
                      href={profile.website}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      Website
                    </Chip>
                  )}
                  {profile.linkedin && (
                    <Chip
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<span>💼</span>}
                      as="a"
                      href={profile.linkedin}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      LinkedIn
                    </Chip>
                  )}
                  {profile.github && (
                    <Chip
                      variant="flat"
                      color="default"
                      size="sm"
                      startContent={<span>💻</span>}
                      as="a"
                      href={profile.github}
                      target="_blank"
                      className="cursor-pointer"
                    >
                      GitHub
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            {profile.summary && (
              <>
                <Divider className="my-6 bg-foreground/10" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    About
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {profile.summary}
                  </p>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Main Content - Tabs */}
        <Tabs
          aria-label="Profile sections"
          color="primary"
          classNames={{
            tabList: "bg-foreground/5 border border-foreground/10",
            cursor: "bg-primary",
            tab: "text-foreground",
            tabContent: "group-data-[selected=true]:text-white",
          }}
        >
          {/* Skills Tab */}
          <Tab key="skills" title="Skills">
            <Card className="bg-foreground/5 border border-foreground/10 mt-4">
              <CardHeader className="flex justify-between items-center p-6">
                <h2 className="text-2xl font-bold text-foreground">Skills</h2>
                <Button color="primary" size="sm" onPress={skillsModal.onOpen}>
                  <Plus size={12} /> Add Skills
                </Button>
              </CardHeader>
              <CardBody className="p-6 pt-0">
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        color="primary"
                        variant="flat"
                        size="md"
                        onClose={() =>
                          setShowRemoveConfirm({
                            title: "Skill",
                            id: skill || "",
                            status: true,
                          })
                        }
                        className="cursor-pointer"
                      >
                        {skill}
                      </Chip>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60 text-center py-8">
                    No skills added yet
                  </p>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Experience Tab */}
          <Tab key="experience" title="Experience">
            <Card className="bg-foreground/5 border border-foreground/10 mt-4">
              <CardHeader className="flex justify-between items-center p-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Work Experience
                </h2>
                <Button
                  color="primary"
                  size="sm"
                  onPress={handleOpenAddExperience}
                >
                  <Plus size={12} /> Add Experience
                </Button>
              </CardHeader>
              <CardBody className="p-6 pt-0">
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, index) => (
                      <div key={index}>
                        {index > 0 && (
                          <Divider className="my-6 bg-foreground/10" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            💼
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {exp.title}
                            </h3>
                            <p className="text-foreground/80 font-medium">
                              {exp.company}
                            </p>
                            {exp.location && (
                              <p className="text-foreground/60 text-sm">
                                📍 {exp.location}
                              </p>
                            )}
                            <p className="text-foreground/60 text-sm mt-1">
                              {formatDate(exp.startDate)} -{" "}
                              {exp.current
                                ? "Present"
                                : formatDate(exp.endDate)}
                            </p>
                            {exp.description && (
                              <p className="text-foreground/80 mt-3 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="primary"
                              onPress={() => handleEditExperience(exp)}
                            >
                              <Pen size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="danger"
                              onPress={() =>
                                setShowRemoveConfirm({
                                  title: "Experience",
                                  id: exp._id || "",
                                  status: true,
                                })
                              }
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60 text-center py-8">
                    No experience added yet
                  </p>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Education Tab */}
          <Tab key="education" title="Education">
            <Card className="bg-foreground/5 border border-foreground/10 mt-4">
              <CardHeader className="flex justify-between items-center p-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Education
                </h2>
                <Button
                  color="primary"
                  size="sm"
                  onPress={handleOpenAddEducation}
                >
                  <Plus size={12} /> Add Education
                </Button>
              </CardHeader>
              <CardBody className="p-6 pt-0">
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <div key={index}>
                        {index > 0 && (
                          <Divider className="my-6 bg-foreground/10" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-2xl">
                            🎓
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {edu.degree}
                            </h3>
                            <p className="text-foreground/80 font-medium">
                              {edu.institution}
                            </p>
                            <p className="text-foreground/60 text-sm mt-1">
                              {formatDate(edu.startDate)} -{" "}
                              {formatDate(edu.endDate)}
                            </p>
                            {edu.grade && (
                              <p className="text-foreground/70 text-sm mt-1">
                                Grade: {edu.grade}
                              </p>
                            )}
                            {edu.description && (
                              <p className="text-foreground/80 mt-3 leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="primary"
                              onPress={() => handleEditEducation(edu)}
                            >
                              <Pen size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="danger"
                              onPress={() =>
                                setShowRemoveConfirm({
                                  title: "Education",
                                  id: edu._id || "",
                                  status: true,
                                })
                              }
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60 text-center py-8">
                    No education added yet
                  </p>
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>

        {/* Modals */}
        {/* Basic Info Modal */}
        <Modal
          isOpen={basicInfoModal.isOpen}
          onClose={basicInfoModal.onClose}
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
              Edit Profile Information
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Name"
                value={basicInfoForm.name}
                onChange={(e) =>
                  setBasicInfoForm({
                    ...basicInfoForm,
                    name: e.target.value,
                  })
                }
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <Input
                label="Headline"
                placeholder="e.g., Senior Software Engineer"
                value={basicInfoForm.headline}
                onChange={(e) =>
                  setBasicInfoForm({
                    ...basicInfoForm,
                    headline: e.target.value,
                  })
                }
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <Textarea
                label="Summary"
                placeholder="Tell us about yourself..."
                value={basicInfoForm.summary}
                onChange={(e) =>
                  setBasicInfoForm({
                    ...basicInfoForm,
                    summary: e.target.value,
                  })
                }
                minRows={4}
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={basicInfoForm.email}
                  isDisabled
                  onChange={(e) =>
                    setBasicInfoForm({
                      ...basicInfoForm,
                      email: e.target.value,
                    })
                  }
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="Phone"
                  value={basicInfoForm.phone}
                  onChange={(e) =>
                    setBasicInfoForm({
                      ...basicInfoForm,
                      phone: e.target.value,
                    })
                  }
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
              </div>

              <Input
                label="Location"
                placeholder="e.g., San Francisco, CA"
                value={basicInfoForm.location}
                onChange={(e) =>
                  setBasicInfoForm({
                    ...basicInfoForm,
                    location: e.target.value,
                  })
                }
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <Input
                label="Website"
                type="url"
                placeholder="https://..."
                value={basicInfoForm.website}
                onChange={(e) =>
                  setBasicInfoForm({
                    ...basicInfoForm,
                    website: e.target.value,
                  })
                }
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/..."
                  value={basicInfoForm.linkedin}
                  onChange={(e) =>
                    setBasicInfoForm({
                      ...basicInfoForm,
                      linkedin: e.target.value,
                    })
                  }
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="GitHub"
                  placeholder="https://github.com/..."
                  value={basicInfoForm.github}
                  onChange={(e) =>
                    setBasicInfoForm({
                      ...basicInfoForm,
                      github: e.target.value,
                    })
                  }
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={basicInfoModal.onClose}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSaveBasicInfo}
                isLoading={saving}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Experience Modal */}
        <Modal
          isOpen={experienceModal.isOpen}
          onClose={handleCloseExperienceModal}
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
              {editingExperience
                ? "Edit Work Experience"
                : "Add Work Experience"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Job Title"
                placeholder="e.g., Senior Software Engineer"
                value={experienceForm.title}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    title: e.target.value,
                  })
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
                value={experienceForm.company}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    company: e.target.value,
                  })
                }
                isRequired
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <Input
                label="Location"
                placeholder="e.g., San Francisco, CA"
                value={experienceForm.location}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    location: e.target.value,
                  })
                }
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={experienceForm.startDate}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      startDate: e.target.value,
                    })
                  }
                  isRequired
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={experienceForm.endDate}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      endDate: e.target.value,
                    })
                  }
                  isDisabled={experienceForm.current}
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={experienceForm.current}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : experienceForm.endDate,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="current" className="text-foreground text-sm">
                  I currently work here
                </label>
              </div>

              <Textarea
                label="Description"
                placeholder="Describe your responsibilities and achievements..."
                value={experienceForm.description}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    description: e.target.value,
                  })
                }
                minRows={4}
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={handleCloseExperienceModal}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleAddExperience}
                isLoading={saving}
                isDisabled={
                  !experienceForm.title ||
                  !experienceForm.company ||
                  !experienceForm.startDate
                }
              >
                {editingExperience ? "Update Experience" : "Add Experience"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Education Modal */}
        <Modal
          isOpen={educationModal.isOpen}
          onClose={handleCloseEducationModal}
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
              {editingEducation ? "Edit Education" : "Add Education"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="Degree"
                placeholder="e.g., Bachelor of Science in Computer Science"
                value={educationForm.degree}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    degree: e.target.value,
                  })
                }
                isRequired
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <Input
                label="Institution"
                placeholder="e.g., Stanford University"
                value={educationForm.institution}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    institution: e.target.value,
                  })
                }
                isRequired
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={educationForm.startDate}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      startDate: e.target.value,
                    })
                  }
                  isRequired
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={educationForm.endDate}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      endDate: e.target.value,
                    })
                  }
                  classNames={{
                    label: "text-foreground",
                    input: "text-foreground",
                  }}
                />
              </div>

              <Input
                label="Grade/GPA"
                placeholder="e.g., 3.8/4.0"
                value={educationForm.grade}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    grade: e.target.value,
                  })
                }
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />

              <Textarea
                label="Description"
                placeholder="Additional details, achievements, relevant coursework..."
                value={educationForm.description}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    description: e.target.value,
                  })
                }
                minRows={3}
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={handleCloseEducationModal}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleAddEducation}
                isLoading={saving}
                isDisabled={
                  !educationForm.degree ||
                  !educationForm.institution ||
                  !educationForm.startDate
                }
              >
                {editingEducation ? "Update Education" : "Add Education"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Skills Modal */}
        <Modal
          isOpen={skillsModal.isOpen}
          onClose={skillsModal.onClose}
          size="lg"
          classNames={{
            base: "bg-background border border-foreground/10",
            header: "border-b border-foreground/10",
            body: "py-6",
            footer: "border-t border-foreground/10",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-foreground text-xl font-semibold">
              Add Skills
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <Textarea
                label="Skills"
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                minRows={3}
                description="Separate multiple skills with commas"
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={skillsModal.onClose}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleAddSkills}
                isLoading={saving}
                isDisabled={!newSkills.trim()}
              >
                Add Skills
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Remove Confirmation Modal */}
        <Modal
          isOpen={showRemoveConfirm.status}
          onClose={() =>
            setShowRemoveConfirm({
              ...showRemoveConfirm,
              status: false,
            })
          }
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
              Remove {showRemoveConfirm.title}
            </ModalHeader>
            <ModalBody>
              <p className="text-foreground">
                Are you sure you want to remove this {showRemoveConfirm.title}{" "}
                from your profile?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() =>
                  setShowRemoveConfirm({
                    ...showRemoveConfirm,
                    status: false,
                  })
                }
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={saving}
                onPress={() => {
                  if (showRemoveConfirm.title === "Education") {
                    handleDeleteEducation(showRemoveConfirm.id);
                  } else if (showRemoveConfirm.title === "Experience") {
                    handleDeleteExperience(showRemoveConfirm.id);
                  } else {
                    handleDeleteSkill(showRemoveConfirm.id);
                  }
                }}
              >
                Confirm Removal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
