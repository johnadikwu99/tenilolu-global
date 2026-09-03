'use client';

import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-secondary-400 mb-4 text-5xl">{icon}</div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      {description && (
        <p className="text-secondary-600 text-sm mb-6 text-center max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
