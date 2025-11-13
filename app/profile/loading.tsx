import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';

export default function ProfileLoading() {
  return (
    <PageSkeleton>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <ProfileSkeleton />
      </div>
    </PageSkeleton>
  );
}

