'use client';

import { useState } from 'react';
import { ProfileEditForm } from './ProfileEditForm';
import type { Profile } from '@/lib/supabase/types';

interface ProfileDisplayProps {
  profile: Profile;
}

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Email:</span>
          <span className="text-gray-900">{profile.email || 'Not set'}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Username:</span>
          <span className="text-gray-900 font-semibold">{profile.username || 'Not set'}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Full Name:</span>
          <span className="text-gray-900">{profile.full_name || 'Not set'}</span>
        </div>
        <div className="flex justify-between py-2 items-start">
          <span className="text-gray-600 font-medium">Bio:</span>
          <div className="w-1/2 ml-4">
            {profile.bio ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[80px]">
                <p className="text-gray-900 whitespace-pre-wrap text-left">
                  {profile.bio}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[80px]">
                <p className="text-gray-400 italic text-left">
                  No bio added yet
                </p>
              </div>
            )}
          </div>
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

      {/* Edit Button */}
      {!isEditing && (
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              ✏️ Edit Profile
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
          </div>
          <ProfileEditForm 
            profile={profile} 
            onSuccess={() => {
              setIsEditing(false);
              // Refresh the page to show updated data
              window.location.reload();
            }}
          />
        </div>
      )}
    </>
  );
}

