import { Skeleton } from '@/components/ui/Skeleton';

export function RecipeDetailSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-5/6" />
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      {/* Ingredients Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Instructions Skeleton */}
      <div>
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

