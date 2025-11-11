'use client';

import { updateProfile } from '@/app/actions/profile';
import { useState } from 'react';
import type { Profile } from '@/lib/supabase/types';

interface ProfileEditFormProps {
  profile: Profile;
  onSuccess?: () => void;
}

export function ProfileEditForm({ profile, onSuccess }: ProfileEditFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Profile updated successfully! ✨
        </div>
      )}

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          defaultValue={profile.username || ''}
          minLength={3}
          maxLength={50}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="johndoe"
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Must be between 3 and 50 characters
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          defaultValue={profile.full_name || ''}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="John Doe"
          disabled={loading}
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio || ''}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          placeholder="Tell us a little about yourself..."
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum 500 characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

