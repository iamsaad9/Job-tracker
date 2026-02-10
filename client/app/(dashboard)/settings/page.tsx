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
  Toast,
  addToast,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/app/hooks/useUser";

const SettingsPage: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { user } = useUser();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailForm, setEmailForm] = useState({
    newEmail: user?.email || "",
    password: "",
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showCurrentEmail, setShowCurrentEmail] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const deleteModal = useDisclosure();

  // Calculate password strength score (0-5)
  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    // Check for special characters - any character that's not alphanumeric or space
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(pwd)) strength++;

    return strength;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        addToast({
          title: "Password Updated",
          description: "Your password has been updated successfully.",
          color: "success",
          variant: "bordered",
        });
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

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update email");

      addToast({
        title: "Email Updated",
        description: "Your email address has been updated successfully.",
        color: "success",
        variant: "bordered",
      });

      setEmailForm({ newEmail: "", password: "" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update email";
      setError(message);
    } finally {
      setEmailLoading(false);
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

        {/* Security Section - Password */}
        <Card className="bg-foreground/5 border border-foreground/10 mb-6">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                🔒
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Change Password
                </h2>
                <p className="text-foreground/60 text-sm mt-0.5">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
          </CardHeader>

          <Divider className="bg-foreground/10" />

          <CardBody className="p-6">
            {user?.provider === "google" ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Google Account
                  </p>
                  <p className="text-foreground/70 text-sm">
                    You signed in with Google. To change your password, please
                    visit your{" "}
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Google Account Settings
                    </a>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-5">
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
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none text-foreground/60 hover:text-foreground transition-colors"
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
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
                  description="Must be at least 8 characters long"
                  classNames={{
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                    description: "text-foreground/50 text-xs",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none text-foreground/60 hover:text-foreground transition-colors"
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
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
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none text-foreground/60 hover:text-foreground transition-colors"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  }
                />

                {/* Password strength indicator */}
                {passwordForm.newPassword && (
                  <div className="space-y-2 p-3 bg-foreground/5 rounded-lg border border-foreground/10">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground/70">
                        Password Strength:
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          calculatePasswordStrength(passwordForm.newPassword) <=
                          2
                            ? "text-danger"
                            : calculatePasswordStrength(
                                  passwordForm.newPassword,
                                ) <= 4
                              ? "text-warning"
                              : "text-success"
                        }`}
                      >
                        {calculatePasswordStrength(passwordForm.newPassword) <=
                        2
                          ? "Weak"
                          : calculatePasswordStrength(
                                passwordForm.newPassword,
                              ) <= 4
                            ? "Fair"
                            : "Strong"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-2 flex-1 rounded transition-colors ${
                            index <
                            calculatePasswordStrength(passwordForm.newPassword)
                              ? calculatePasswordStrength(
                                  passwordForm.newPassword,
                                ) <= 2
                                ? "bg-danger"
                                : calculatePasswordStrength(
                                      passwordForm.newPassword,
                                    ) <= 4
                                  ? "bg-warning"
                                  : "bg-success"
                              : "bg-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-foreground/60">
                      <p
                        className={`flex items-center gap-2 ${
                          /[a-z]/.test(passwordForm.newPassword)
                            ? "text-success"
                            : ""
                        }`}
                      >
                        <span>
                          {/[a-z]/.test(passwordForm.newPassword) ? "✓" : "○"}
                        </span>{" "}
                        Lowercase letter
                      </p>
                      <p
                        className={`flex items-center gap-2 ${
                          /[A-Z]/.test(passwordForm.newPassword)
                            ? "text-success"
                            : ""
                        }`}
                      >
                        <span>
                          {/[A-Z]/.test(passwordForm.newPassword) ? "✓" : "○"}
                        </span>{" "}
                        Uppercase letter
                      </p>
                      <p
                        className={`flex items-center gap-2 ${
                          /[0-9]/.test(passwordForm.newPassword)
                            ? "text-success"
                            : ""
                        }`}
                      >
                        <span>
                          {/[0-9]/.test(passwordForm.newPassword) ? "✓" : "○"}
                        </span>{" "}
                        Number
                      </p>
                      <p
                        className={`flex items-center gap-2 ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(
                            passwordForm.newPassword,
                          )
                            ? "text-success"
                            : ""
                        }`}
                      >
                        <span>
                          {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(
                            passwordForm.newPassword,
                          )
                            ? "✓"
                            : "○"}
                        </span>{" "}
                        Special character
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    isDisabled={
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      !passwordForm.confirmPassword
                    }
                    className="font-semibold"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>

        {/* Email Section */}
        <Card className="bg-foreground/5 border border-foreground/10 mb-6">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                📧
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Email Address
                </h2>
                <p className="text-foreground/60 text-sm mt-0.5">
                  Update the email address associated with your account
                </p>
              </div>
            </div>
          </CardHeader>

          <Divider className="bg-foreground/10" />

          <CardBody className="p-6">
            {user?.provider === "google" ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Google Account
                  </p>
                  <p className="text-foreground/70 text-sm">
                    Your email is managed by Google and cannot be changed here.
                    To update your email, please visit your{" "}
                    <a
                      href="https://myaccount.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Google Account Settings
                    </a>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailChange} className="space-y-5">
                <div className="bg-foreground/5 rounded-lg p-4 border border-foreground/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground/60 text-sm font-medium">
                      Current Email
                    </span>
                  </div>
                  <p className="text-foreground font-medium">{user?.email}</p>
                </div>

                <Input
                  label="New Email Address"
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, newEmail: e.target.value })
                  }
                  isRequired
                  classNames={{
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                  }}
                />

                <Input
                  label="Confirm with Password"
                  type={showCurrentEmail ? "text" : "password"}
                  value={emailForm.password}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, password: e.target.value })
                  }
                  isRequired
                  description="For security, please enter your password to confirm this change"
                  classNames={{
                    label: "text-foreground font-medium",
                    input: "text-foreground",
                    description: "text-foreground/50 text-xs",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none text-foreground/60 hover:text-foreground transition-colors"
                      type="button"
                      onClick={() => setShowCurrentEmail(!showCurrentEmail)}
                    >
                      {showCurrentPassword ? (
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
                    size="lg"
                    isLoading={emailLoading}
                    isDisabled={!emailForm.newEmail || !emailForm.password}
                    className="font-semibold"
                  >
                    {emailLoading ? "Updating..." : "Update Email"}
                  </Button>
                </div>
              </form>
            )}
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
                    Permanently delete your Trackee account and all associated
                    data. This action cannot be undone.
                  </p>
                </div>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={deleteModal.onOpen}
                  className="md:shrink-0"
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
