import { RecipeCardSkeleton } from './RecipeCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export function RecipeListSkeleton() {
  return (
    <>
      {/* Search Bar Skeleton */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Recipe Cards Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}

