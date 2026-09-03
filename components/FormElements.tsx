'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
}

export function FormField({ label, error, required, children, helperText }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-secondary-700 mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-secondary-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
}

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <FormField label={label} error={error} helperText={helperText}>
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          error && 'border-error focus:ring-error',
          className
        )}
        {...props}
      />
    </FormField>
  )
);

TextInput.displayName = 'TextInput';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <FormField label={label} error={error} helperText={helperText}>
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          error && 'border-error focus:ring-error',
          className
        )}
        {...props}
      />
    </FormField>
  )
);

TextArea.displayName = 'TextArea';

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  options: Array<{ label: string; value: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, ...props }, ref) => (
    <FormField label={label} error={error} helperText={helperText}>
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border border-secondary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          error && 'border-error focus:ring-error',
          className
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  )
);

Select.displayName = 'Select';
