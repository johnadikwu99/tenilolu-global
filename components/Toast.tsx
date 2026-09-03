'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info } from 'react-icons/fa';

export function showSuccess(message: string) {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded shadow-lg transform transition-all ${
          t.visible ? 'animate-in' : 'animate-out'
        }`}
      >
        <CheckCircle size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    ),
    { duration: 4000 }
  );
}

export function showError(message: string) {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded shadow-lg transform transition-all ${
          t.visible ? 'animate-in' : 'animate-out'
        }`}
      >
        <AlertCircle size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    ),
    { duration: 4000 }
  );
}

export function showInfo(message: string) {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded shadow-lg transform transition-all ${
          t.visible ? 'animate-in' : 'animate-out'
        }`}
      >
        <Info size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    ),
    { duration: 4000 }
  );
}
