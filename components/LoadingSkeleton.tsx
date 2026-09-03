'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-secondary-200 rounded', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
      <LoadingSkeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-9 w-full mt-4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <LoadingSkeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
