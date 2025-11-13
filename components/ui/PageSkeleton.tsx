import React from 'react';
import { Skeleton } from './Skeleton';

interface PageSkeletonProps {
  showHeader?: boolean;
  children: React.ReactNode;
}

export function PageSkeleton({ showHeader = true, children }: PageSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      {showHeader && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-6">
                <Skeleton className="h-8 w-32" />
                <div className="hidden md:flex items-center gap-6">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24 hidden md:block" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

