import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateProfileButton } from '@/components/auth/CreateProfileButton';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/auth/login');
  }

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🍳</span>
                </div>
                <span className="text-xl font-bold text-gray-900">RecipeShare</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/recipes/new" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Upload Recipe
                </Link>
                <Link href="/recipes/my" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Recipes
                </Link>
                <Link href="/recipes/saved" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Saved Recipes
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all hidden md:inline"
              >
                {profile?.username || user.email}
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Edit Profile
          </h1>

          {profileError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ Profile Not Found</p>
              <p className="text-sm mt-1">There was an error loading your profile data.</p>
              <p className="text-sm mt-1">Error: {profileError.message}</p>
            </div>
          ) : profile ? (
            <ProfileEditForm profile={profile} />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ No Profile Found</p>
              <p className="text-sm mt-1 mb-3">Your profile was not created in the database when you signed up.</p>
              <CreateProfileButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

