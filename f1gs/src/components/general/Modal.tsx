import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children } : ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-xl fixed z-[100]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 z-[100]">
          {title && <h2 className="text-2xl text-center mx-auto font-bold">{title}</h2>}
          <button
            className="text-brand_black text-4xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
