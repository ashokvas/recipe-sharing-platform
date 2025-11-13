import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { RecipeListSkeleton } from '@/components/recipes/RecipeListSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <PageSkeleton>
      {/* Welcome Section Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>

      {/* Recipes Section Skeleton */}
      <RecipeListSkeleton />
    </PageSkeleton>
  );
}

