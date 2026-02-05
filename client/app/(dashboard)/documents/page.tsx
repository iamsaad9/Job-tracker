"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Spinner,
} from "@heroui/react";

interface DocumentFile {
  fileId: string;
  fileName: string;
  mimeType: string;
  size: number;
}

interface Document {
  _id: string;
  user: string;
  type: "cv" | "cover_letter" | "portfolio" | "certificate";
  title: string;
  description?: string;
  file: DocumentFile;
  version: number;
  isDefault: boolean;
  lastUsedAt?: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentTypeConfig = {
  cv: {
    label: "CV/Resume",
    icon: "📄",
    color: "primary" as const,
  },
  cover_letter: {
    label: "Cover Letter",
    icon: "✉️",
    color: "secondary" as const,
  },
  portfolio: {
    label: "Portfolio",
    icon: "🎨",
    color: "success" as const,
  },
  certificate: {
    label: "Certificate",
    icon: "🏆",
    color: "warning" as const,
  },
};

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    type: "cv",
    title: "",
    description: "",
    isDefault: false,
  });

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/documents");
      const json = await response.json();
      const items = Array.isArray(json) ? json : json?.data || [];
      setDocuments(items);
    } catch (err: unknown) {
      console.error("Error fetching documents:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Failed to load documents");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isDefault", String(formData.isDefault));

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formDataToSend,
      });

      const json = await response.json();

      if (response.ok) {
        const newDoc = json?.data || json;
        setDocuments([newDoc, ...documents]);
        onClose();
        setFormData({
          type: "cv",
          title: "",
          description: "",
          isDefault: false,
        });
        setSelectedFile(null);
      } else {
        setError(json?.error || "Failed to upload document");
      }
    } catch (err: unknown) {
      console.error("Error uploading document:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Failed to upload document");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== docId));
      } else {
        const json = await response.json();
        setError(json?.error || "Failed to delete document");
      }
    } catch (err: unknown) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document");
    }
  };

  const handleSetDefault = async (docId: string, type: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        setDocuments(
          documents.map((doc) => ({
            ...doc,
            isDefault: doc._id === docId && doc.type === type,
          })),
        );
      }
    } catch (err: unknown) {
      console.error("Error setting default:", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredDocuments =
    filterType === "all"
      ? documents
      : documents.filter((doc) => doc.type === filterType);

  const groupedDocuments = filteredDocuments.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) acc[doc.type] = [];
      acc[doc.type].push(doc);
      return acc;
    },
    {} as Record<string, Document[]>,
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              My Documents
            </h1>
            <p className="text-foreground/60">
              Manage your CVs, cover letters, portfolios, and certificates
            </p>
          </div>
          <Button
            color="primary"
            size="lg"
            onPress={onOpen}
            className="font-semibold"
          >
            + Upload Document
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Chip
            variant={filterType === "all" ? "solid" : "bordered"}
            color={filterType === "all" ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setFilterType("all")}
          >
            All ({documents.length})
          </Chip>
          {Object.entries(documentTypeConfig).map(([type, config]) => {
            const count = documents.filter((doc) => doc.type === type).length;
            return (
              <Chip
                key={type}
                variant={filterType === type ? "solid" : "bordered"}
                color={filterType === type ? config.color : "default"}
                className="cursor-pointer"
                onClick={() => setFilterType(type)}
              >
                {config.icon} {config.label} ({count})
              </Chip>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-danger text-lg">{error}</p>
            <Button
              color="primary"
              variant="flat"
              onPress={fetchDocuments}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No documents yet
            </h2>
            <p className="text-foreground/60 mb-6">
              Upload your first document to get started
            </p>
            <Button color="primary" size="lg" onPress={onOpen}>
              Upload Document
            </Button>
          </div>
        ) : (
          /* Documents Grid - Grouped by Type */
          <div className="space-y-8">
            {Object.entries(groupedDocuments).map(([type, docs]) => {
              const config =
                documentTypeConfig[type as keyof typeof documentTypeConfig];
              return (
                <div key={type}>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    {config.label}
                    <Chip size="sm" variant="flat" color={config.color}>
                      {docs.length}
                    </Chip>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docs.map((doc) => (
                      <Card
                        key={doc._id}
                        className="bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all"
                      >
                        <CardBody className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {doc.title}
                              </h3>
                              {doc.isDefault && (
                                <Chip
                                  size="sm"
                                  color="success"
                                  variant="flat"
                                  className="mb-2"
                                >
                                  ⭐ Default
                                </Chip>
                              )}
                            </div>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  className="text-foreground"
                                >
                                  ⋮
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Document actions">
                                <DropdownItem
                                  key="download"
                                  className="text-foreground"
                                >
                                  Download
                                </DropdownItem>
                                {!doc.isDefault ? (
                                  <DropdownItem
                                    key="default"
                                    className="text-foreground"
                                    onPress={() =>
                                      handleSetDefault(doc._id, doc.type)
                                    }
                                  >
                                    Set as Default
                                  </DropdownItem>
                                ) : null}
                                <DropdownItem
                                  key="delete"
                                  className="text-danger"
                                  color="danger"
                                  onPress={() => handleDelete(doc._id)}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>

                          {doc.description && (
                            <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                              {doc.description}
                            </p>
                          )}

                          <div className="space-y-2 text-xs text-foreground/60">
                            <div className="flex items-center gap-2">
                              <span>📎</span>
                              <span className="truncate">
                                {doc.file.fileName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📊</span>
                              <span>{formatFileSize(doc.file.size)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span>
                                {new Date(doc.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {doc.version > 1 && (
                              <div className="flex items-center gap-2">
                                <span>🔄</span>
                                <span>Version {doc.version}</span>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="2xl"
          classNames={{
            base: "bg-background border border-foreground/10",
            header: "border-b border-foreground/10",
            body: "py-6",
            footer: "border-t border-foreground/10",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-foreground text-xl font-semibold">
              Upload New Document
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <Select
                  label="Document Type"
                  placeholder="Select document type"
                  selectedKeys={formData.type ? [formData.type] : []}
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0] as string;
                    setFormData({ ...formData, type: selectedValue });
                  }}
                  classNames={{
                    label: "text-foreground",
                    value: "text-foreground",
                    trigger: "text-foreground", // Added trigger to ensure the displayed text is visible
                  }}
                >
                  {Object.entries(documentTypeConfig).map(([type, config]) => (
                    <SelectItem
                      key={type}
                      textValue={config.label} // Crucial: gives the Select a string to show when selected
                      className="text-foreground"
                      startContent={config.icon} // Cleaner way to show icons in HeroUI
                    >
                      {config.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Title"
                  placeholder="e.g., Senior Developer Resume 2024"
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

                <Textarea
                  label="Description (Optional)"
                  placeholder="Add notes or details about this document"
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

                <div className="border-2 border-dashed border-foreground/20 rounded-lg p-6 text-center hover:border-foreground/40 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="text-4xl mb-2">📤</div>
                    {selectedFile ? (
                      <div>
                        <p className="text-foreground font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-foreground/60 text-sm">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-foreground font-medium mb-1">
                          Click to upload
                        </p>
                        <p className="text-foreground/60 text-sm">
                          PDF, DOC, or DOCX (Max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    Set as default{" "}
                    {documentTypeConfig[
                      formData.type as keyof typeof documentTypeConfig
                    ].label.toLowerCase()}
                  </label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleUpload}
                isLoading={uploading}
                isDisabled={!selectedFile || !formData.title || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default DocumentsPage;
