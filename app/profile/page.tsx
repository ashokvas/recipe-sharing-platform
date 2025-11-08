import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateProfileButton } from '@/components/auth/CreateProfileButton';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Account Details
          </h1>

          {/* Authentication Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              🔐 Authentication Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">User ID:</span>
                <span className="text-gray-900 font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Email Confirmed:</span>
                <span className={user.email_confirmed_at ? "text-green-600" : "text-yellow-600"}>
                  {user.email_confirmed_at ? '✅ Yes' : '⚠️ Pending'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Account Created:</span>
                <span className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()} at {new Date(user.created_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Last Sign In:</span>
                <span className="text-gray-900">
                  {user.last_sign_in_at 
                    ? `${new Date(user.last_sign_in_at).toLocaleDateString()} at ${new Date(user.last_sign_in_at).toLocaleTimeString()}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              👤 Profile Information
            </h2>
            {profileError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">⚠️ Profile Not Found</p>
                <p className="text-sm mt-1">There was an error loading your profile data.</p>
                <p className="text-sm mt-1">Error: {profileError.message}</p>
              </div>
            ) : profile ? (
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Username:</span>
                  <span className="text-gray-900 font-semibold">{profile.username || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Full Name:</span>
                  <span className="text-gray-900">{profile.full_name || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Profile Created:</span>
                  <span className="text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Profile Updated:</span>
                  <span className="text-gray-900">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <p className="font-semibold">⚠️ No Profile Found</p>
                <p className="text-sm mt-1 mb-3">Your profile was not created in the database when you signed up.</p>
                <CreateProfileButton />
              </div>
            )}
          </div>

          {/* Raw Data (for debugging) */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <details className="cursor-pointer">
              <summary className="text-lg font-semibold text-gray-800 mb-4">
                🔍 View Raw Data (Technical Details)
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">User Metadata:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(user.user_metadata, null, 2)}
                  </pre>
                </div>
                {profile && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Profile Data:</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

