'use client';

import { createMissingProfile } from '@/app/actions/profile';
import { useState } from 'react';

export function CreateProfileButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    
    const result = await createMissingProfile();
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  if (success) {
    return (
      <div className="text-green-700 font-medium">
        ✅ Profile created! Refreshing...
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Creating Profile...' : 'Create Profile Now'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">Error: {error}</p>
      )}
    </div>
  );
}

