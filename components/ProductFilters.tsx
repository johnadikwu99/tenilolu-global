'use client';

import React from 'react';
import { ChevronDown } from 'react-icons/fa';
import { cn } from '@/lib/cn';

interface FilterGroupProps {
  title: string;
  options: Array<{ label: string; value: string; count?: number }>,
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export function FilterGroup({ title, options, selectedValues, onToggle }: FilterGroupProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="border-b border-secondary-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 font-semibold text-secondary-900 hover:text-primary-600 transition-colors"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn('transition-transform', isOpen ? 'rotate-180' : '')}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onToggle(option.value)}
                className="w-4 h-4 rounded border-secondary-300 text-primary-600 cursor-pointer"
              />
              <span className="text-sm text-secondary-600 group-hover:text-secondary-900 transition-colors">
                {option.label}
              </span>
              {option.count !== undefined && (
                <span className="text-xs text-secondary-500 ml-auto">({option.count})</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

export function SortSelect({ value, onChange, options }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-secondary-300 rounded text-sm text-secondary-700 hover:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
