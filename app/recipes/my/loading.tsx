import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { RecipeListSkeleton } from '@/components/recipes/RecipeListSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function MyRecipesLoading() {
  return (
    <PageSkeleton>
      {/* Title Section Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Recipes Section Skeleton */}
      <RecipeListSkeleton />
    </PageSkeleton>
  );
}

