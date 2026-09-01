import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const HeartIcon = ({ filled }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const RecipeCard = ({ meal, onClick }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const [imgError, setImgError] = useState(false);
  const favorited = isFavorite(meal.idMeal);

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(meal);
    if (!favorited) {
      toast.success(`Added "${meal.strMeal}" to favorites!`, {
        icon: '❤️',
        duration: 2000,
      });
    } else {
      toast(`Removed from favorites`, {
        icon: '💔',
        duration: 1500,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="card cursor-pointer group"
      onClick={() => onClick(meal.idMeal)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(meal.idMeal)}
      aria-label={`View recipe for ${meal.strMeal}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {!imgError ? (
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            favorited
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 dark:bg-gray-900/90 text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon filled={favorited} />
        </button>

        {/* Category badge on image */}
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
        <div className="flex items-center gap-2 flex-wrap">
          {meal.strArea && (
            <span className="badge-blue">{meal.strArea}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
