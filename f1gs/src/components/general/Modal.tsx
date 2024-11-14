"use client";
import React from "react";
import { createPortal } from "react-dom";

import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Modal is hidden
    visible: { opacity: 1, scale: 1 }, // Modal is visible
    exit: { opacity: 0, scale: 0.8 }, // Modal goes back to hidden state
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        transition={{ duration: 0.3, type: "spring" }}
        className="bg-white rounded-lg p-6 w-full max-w-xl fixed z-[100]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 z-[100]">
          {title && (
            <h2 className="text-2xl text-center mx-auto font-bold w-[80%]">
              {title}
            </h2>
          )}
          <button className="text-brand_black text-4xl" onClick={onClose}>
            &times;
          </button>
        </div>
        {children}
      </motion.div>
    </div>,
    document.body
  );
}
