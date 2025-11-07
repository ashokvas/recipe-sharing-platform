import { createClient } from '@/lib/supabase/server';

export default async function TestPage() {
  const supabase = await createClient();
  
  // Test 1: Check connection by fetching profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  
  // Test 2: Check recipes table
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .limit(5);
  
  // Test 3: Check auth session
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🧪 Supabase Connection Test
        </h1>
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Connection Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {!profileError && !recipeError ? '✅' : '❌'}
              </span>
              <span className="text-lg">
                {!profileError && !recipeError 
                  ? 'Successfully connected to Supabase!' 
                  : 'Connection failed'}
              </span>
            </div>
          </div>
        </div>

        {/* Profiles Table Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📋 Profiles Table
          </h2>
          {profileError ? (
            <div className="text-red-600 bg-red-50 p-4 rounded">
              <p className="font-semibold">Error:</p>
              <p>{profileError.message}</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-3">
                Found {profiles?.length || 0} profile(s)
              </p>
              {profiles && profiles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profiles.map((profile) => (
                        <tr key={profile.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{profile.id.slice(0, 8)}...</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{profile.username || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{profile.full_name || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No profiles yet. Create a user to see data here.</p>
              )}
            </div>
          )}
        </div>

        {/* Recipes Table Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🍳 Recipes Table
          </h2>
          {recipeError ? (
            <div className="text-red-600 bg-red-50 p-4 rounded">
              <p className="font-semibold">Error:</p>
              <p>{recipeError.message}</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-3">
                Found {recipes?.length || 0} recipe(s)
              </p>
              {recipes && recipes.length > 0 ? (
                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg text-gray-900">{recipe.title}</h3>
                      {recipe.description && (
                        <p className="text-gray-600 mt-1">{recipe.description}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {recipe.difficulty && <span>Difficulty: {recipe.difficulty}</span>}
                        {recipe.cooking_time && <span>Time: {recipe.cooking_time} min</span>}
                        {recipe.category && <span>Category: {recipe.category}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No recipes yet. Create a recipe to see data here.</p>
              )}
            </div>
          )}
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🔐 Authentication Status
          </h2>
          <div className="space-y-2">
            {user ? (
              <div className="text-green-600 bg-green-50 p-4 rounded">
                <p className="font-semibold">✅ Logged in as:</p>
                <p className="mt-1">Email: {user.email}</p>
                <p>User ID: {user.id}</p>
              </div>
            ) : (
              <div className="text-gray-600 bg-gray-50 p-4 rounded">
                <p>Not logged in (this is expected for testing)</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            🚀 Next Steps
          </h2>
          <ul className="space-y-2">
            <li>✅ Supabase is connected and working</li>
            <li>✅ Database tables are accessible</li>
            <li>📝 Ready to build authentication pages</li>
            <li>📝 Ready to create recipe forms</li>
            <li>📝 Ready to build the main app features</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-white/20">
            <a 
              href="/"
              className="inline-block px-6 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

