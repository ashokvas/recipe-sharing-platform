import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { RecipeDetailSkeleton } from '@/components/recipes/RecipeDetailSkeleton';

export default function RecipeDetailLoading() {
  return (
    <PageSkeleton>
      <div className="max-w-4xl mx-auto">
        <RecipeDetailSkeleton />
      </div>
    </PageSkeleton>
  );
}

