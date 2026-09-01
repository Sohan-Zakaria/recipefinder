import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import RecipeModal from '../components/RecipeModal';
import EmptyState from '../components/EmptyState';

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Favorites = () => {
  const { favorites, removeFavorite } = useApp();
  const [selectedMealId, setSelectedMealId] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="btn-ghost">
            <ArrowLeftIcon />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-red-500"><HeartIcon /></span>
              My Favorites
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {favorites.length === 0
                ? 'No saved recipes yet'
                : `${favorites.length} saved ${favorites.length === 1 ? 'recipe' : 'recipes'}`}
            </p>
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <EmptyState
            message="No favorites yet"
            sub="Browse recipes and tap the heart icon to save your favorites here."
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {favorites.map((meal) => (
                <motion.div
                  key={meal.idMeal}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedMealId(meal.idMeal)}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(meal.idMeal);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
                      aria-label="Remove from favorites"
                    >
                      <TrashIcon />
                    </button>

                    {meal.strCategory && (
                      <span className="absolute bottom-3 left-3 bg-primary-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {meal.strCategory}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
                      {meal.strMeal}
                    </h3>
                    {meal.strArea && (
                      <span className="badge-blue">{meal.strArea}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedMealId && (
          <RecipeModal
            key={selectedMealId}
            mealId={selectedMealId}
            onClose={() => setSelectedMealId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;
