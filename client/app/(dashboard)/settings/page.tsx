"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const deleteModal = useDisclosure();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setSuccess("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(json.message || "Failed to change password");
      }
    } catch (err: unknown) {
      console.error("Error changing password:", err);
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      const json = await response.json();

      if (response.ok && json.success) {
        // Redirect to home or login page after successful deletion
        window.location.href = "/";
      } else {
        setError(json.message || "Failed to delete account");
      }
    } catch (err: unknown) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-foreground/60">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Security Section */}
        <Card className="bg-foreground/5 border border-foreground/10 mb-6">
          <CardHeader className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Security</h2>
                <p className="text-foreground/60 text-sm">
                  Update your password and secure your account
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-0">
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                <p className="text-success text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                isRequired
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
                endContent={
                  <button
                    className="focus:outline-none self-center cursor-pointer"
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                }
              />

              <Input
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                isRequired
                description="Must be at least 8 characters"
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
                endContent={
                  <button
                    className="focus:outline-none self-center cursor-pointer"
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                isRequired
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground",
                }}
                endContent={
                  <button
                    className="focus:outline-none self-center cursor-pointer"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                }
              />

              <div className="flex justify-end pt-2">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  isDisabled={
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                >
                  Change Password
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-foreground/5 border border-danger/30">
          <CardHeader className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-danger">Danger Zone</h2>
                <p className="text-foreground/60 text-sm">
                  Irreversible and destructive actions
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-0">
            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Delete Account
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={deleteModal.onOpen}
                  className="md:flex-shrink-0"
                >
                  Delete Account
                </Button>
              </div>
            </div>

            <Divider className="my-6 bg-foreground/10" />

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                What happens when you delete your account:
              </h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-0.5">•</span>
                  <span>
                    All your job applications and tracking data will be
                    permanently deleted
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-0.5">•</span>
                  <span>
                    Your profile, documents, and uploaded files will be removed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-0.5">•</span>
                  <span>
                    You will be immediately logged out and lose access to your
                    account
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-0.5">•</span>
                  <span>This action cannot be reversed or undone</span>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
          size="lg"
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
              Confirm Account Deletion
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-foreground">
                  This action is <strong>permanent</strong> and{" "}
                  <strong>cannot be undone</strong>. All your data will be
                  deleted immediately.
                </p>

                <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
                  <p className="text-foreground/80 text-sm mb-3">
                    To confirm, please type{" "}
                    <span className="font-mono font-bold text-danger">
                      DELETE
                    </span>{" "}
                    in the box below:
                  </p>
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    classNames={{
                      input: "text-foreground font-mono",
                    }}
                  />
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-warning text-sm flex items-start gap-2">
                    <span className="mt-0.5">⚡</span>
                    <span>
                      Make sure you&apos;ve downloaded any important data before
                      proceeding.
                    </span>
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  deleteModal.onClose();
                  setDeleteConfirmation("");
                  setError(null);
                }}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteAccount}
                isLoading={loading}
                isDisabled={deleteConfirmation !== "DELETE"}
              >
                Delete My Account
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default SettingsPage;
