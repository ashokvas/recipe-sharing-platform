import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from './actions/auth';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🍳</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RecipeShare</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#recipes" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse Recipes
              </a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all hidden md:inline"
                  >
                    {user.profile?.username || user.email}
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Discover & Share
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Amazing Recipes
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join our community of food lovers. Share your culinary creations, discover new favorites, and bring delicious meals to your table.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium">
                  Get Started Free
                </button>
                <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Browse Recipes
                </button>
              </div>
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Recipes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">5K+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 p-8">
                <div className="w-full h-full rounded-xl bg-white shadow-2xl flex items-center justify-center">
                  <span className="text-8xl">👨‍🍳</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl">
                    🥘
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Trending Now</div>
                    <div className="text-sm text-gray-600">250+ new recipes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section id="recipes" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Recipes
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most popular recipes from the community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Classic Pasta Carbonara", category: "Main Course", time: "30 min", emoji: "🍝" },
              { title: "Chocolate Lava Cake", category: "Dessert", time: "45 min", emoji: "🍰" },
              { title: "Fresh Summer Salad", category: "Appetizer", time: "15 min", emoji: "🥗" },
            ].map((recipe, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform">{recipe.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {recipe.category}
                    </span>
                    <span className="text-sm text-gray-500">⏱️ {recipe.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A delicious and easy-to-follow recipe that will impress your family and friends.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">+120</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold text-gray-900">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
              View All Recipes
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose RecipeShare?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to discover, save, and share recipes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📤",
                title: "Easy Upload",
                description: "Share your recipes with our simple upload interface. Add images, ingredients, and step-by-step instructions.",
              },
              {
                icon: "🔍",
                title: "Smart Search",
                description: "Find exactly what you're looking for with our powerful search and filtering by category, ingredients, and more.",
              },
              {
                icon: "💝",
                title: "Save Favorites",
                description: "Build your personal cookbook by saving recipes you love. Access them anytime, anywhere.",
              },
              {
                icon: "👥",
                title: "Community",
                description: "Connect with food enthusiasts worldwide. Share tips, variations, and cooking experiences.",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                description: "Cook with ease using our responsive design. Access recipes from your phone, tablet, or desktop.",
              },
              {
                icon: "🏆",
                title: "Top Rated",
                description: "Discover the best recipes based on community ratings and reviews. Quality guaranteed.",
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors hover:shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-3xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of food lovers sharing and discovering amazing recipes every day.
          </p>
          <button className="px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg shadow-xl">
            Create Your Free Account
          </button>
          <p className="text-white/80 mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🍳</span>
                </div>
                <span className="text-xl font-bold">RecipeShare</span>
              </div>
              <p className="text-gray-400">
                Share your culinary passion with the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Recipes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Upload Recipe</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RecipeShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
