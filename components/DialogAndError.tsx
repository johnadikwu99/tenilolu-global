'use client';

import React from 'react';
import { AlertCircle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  details?: string;
}

export function ErrorMessage({ message, details }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-semibold text-red-800">{message}</h3>
          {details && <p className="text-red-700 text-sm mt-1">{details}</p>}
        </div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h2>
          <p className="text-secondary-600 text-sm mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded hover:bg-secondary-50 transition-colors text-sm font-medium"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded text-sm font-medium text-white transition-colors ${
                isDangerous
                  ? 'bg-error hover:bg-red-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
