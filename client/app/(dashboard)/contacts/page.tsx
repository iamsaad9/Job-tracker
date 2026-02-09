"use client";
import { Button, Input } from "@heroui/react";
import React from "react";
import { Modal, ModalContent } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";

const Contacts = () => {
  const [formData, setFormData] = React.useState({
    title: "",
  });
  const [newJobStatus, setNewJobStatus] = React.useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = React.useState(false);
  return (
    <div>
      <Button onPress={() => setShowRemoveConfirm(true)}>Open Modal</Button>

      <Modal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
      >
        <ModalContent>
          <Input
            aria-label="Job Title"
            placeholder="e.g., Senior Software Engineer"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            isRequired
            classNames={{
              input: "text-foreground",
            }}
          />

          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={[newJobStatus]}
            onChange={(e) => setNewJobStatus(e.target.value)}
            // Add this to prevent the focus/aria-hidden conflict
            popoverProps={{
              shouldCloseOnInteractOutside: (element) => true,
            }}
            classNames={{
              label: "text-foreground",
              value: "text-foreground",
            }}
          >
            <SelectItem className="text-foreground">abc</SelectItem>
            <SelectItem className="text-foreground">open</SelectItem>
          </Select>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Contacts;
