import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EditRecipeLoading() {
  return (
    <PageSkeleton>
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Title Section Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        {/* Form Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>

            {/* Description */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Ingredients */}
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking Time, Difficulty, Category */}
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Skeleton className="h-12 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
}

