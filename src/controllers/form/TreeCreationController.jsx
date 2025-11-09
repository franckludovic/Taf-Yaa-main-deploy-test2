// src/controllers/TreeCreationController.jsx
import React, { useState, useRef } from "react";
import TreeCreationForm from "../../components/AddTree/TreeCreationForm.jsx";
import { addTree } from "../tree/addTree.js";

import useToastStore from "../../store/useToastStore.js";
import useModalStore from "../../store/useModalStore.js";
import LottieLoader from "../../components/LottieLoader";

const TreeCreationController = ({ onSuccess, onCancel, createdBy, isEdit = false, treeToEdit = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const hasSubmitted = useRef(false);

  const addToast = useToastStore((state) => state.addToast);
  const { closeModal } = useModalStore();

  const handleSubmit = async (formData) => {
    if (isSubmitting || hasSubmitted.current) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (isEdit && treeToEdit) {
        addToast("Editing trees via creation modal is disabled. Please use the Settings page to edit your tree.", "info");
        closeModal("treeModal");
        return;
      } else {
        result = await addTree(formData, {
          createdBy,
          onError: (msg, type) => addToast(msg, type || "error"),
        });

        if (result && !hasSubmitted.current) {
          hasSubmitted.current = true;
          addToast("Tree created successfully!", "success");
          onSuccess?.(result);
          closeModal("treeModal");
        }
      }

      if (!result && !hasSubmitted.current) {
        setError("Operation could not be completed. Please check inputs.");
        setIsSubmitting(false);
        closeModal("treeModal");
      }
    } catch (err) {
      if (!hasSubmitted.current) {
        setError(err.message || "Failed to create tree");
        addToast(err.message || "Unexpected error", "error");
      }
      console.error("TreeCreationController.handleSubmit:", err);
    } finally {
      if (!hasSubmitted.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      {isSubmitting ? (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div style={{ width: 220, maxWidth: '60vw' }}>
            <LottieLoader name="treeCreationLoader" aspectRatio={3} loop autoplay />
          </div>
          <div style={{ marginTop: 12, color: 'var(--color-text-muted)', fontSize: 14 }}>
            Creating Tree...
          </div>
        </div>
      ) : null}
      <TreeCreationForm
        key={isEdit ? 'edit' : 'create'}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isEdit={isEdit}
        treeToEdit={treeToEdit}
      />
    </>
  );
};

export default TreeCreationController;
