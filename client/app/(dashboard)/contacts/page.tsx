"use client";
import { Button, Input } from "@heroui/react";
import React from "react";
import { Modal, ModalContent } from "@heroui/react";

const Contacts = () => {
  const [formData, setFormData] = React.useState({
    title: "",
  });
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
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Contacts;
