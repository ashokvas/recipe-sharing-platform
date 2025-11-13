import { Skeleton } from '@/components/ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Title Skeleton */}
      <Skeleton className="h-9 w-48 mb-8" />

      {/* Form Fields Skeleton */}
      <div className="space-y-6">
        {/* Username */}
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Full Name */}
        <div>
          <Skeleton className="h-5 w-28 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Bio */}
        <div>
          <Skeleton className="h-5 w-16 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-24" />
        </div>
      </div>
    </div>
  );
}

