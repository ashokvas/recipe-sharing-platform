import { Skeleton } from '@/components/ui/Skeleton';

export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category & Time Skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Author & Date Skeleton */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

