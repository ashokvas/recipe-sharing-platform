'use client';

import { logout } from '@/app/actions/auth';
import { useState } from 'react';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logout();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium hover:shadow-sm active:scale-95"
    >
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}

