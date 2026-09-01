import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lookupById, parseIngredients, toYouTubeEmbed } from '../api/mealdb';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);
const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-500 rounded-full animate-spin" />
  </div>
);

const RecipeModal = ({ mealId, onClose }) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const { isFavorite, toggleFavorite } = useApp();

  const favorited = meal ? isFavorite(meal.idMeal) : false;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await lookupById(mealId);
        if (!data) throw new Error('Not found');
        setMeal(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mealId]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFavorite = () => {
    if (!meal) return;
    toggleFavorite(meal);
    if (!favorited) {
      toast.success(`Added to favorites!`, { icon: '❤️', duration: 2000 });
    } else {
      toast(`Removed from favorites`, { icon: '💔', duration: 1500 });
    }
  };

  const handleShare = async () => {
    if (!meal) return;
    const shareData = {
      title: meal.strMeal,
      text: `Check out this recipe: ${meal.strMeal}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!', { icon: '🔗' });
      }
    } catch {
      // user cancelled share
    }
  };

  const toggleIngredient = (key) => {
    setCheckedIngredients((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatInstructions = (text) => {
    if (!text) return [];
    return text
      .split(/\r\n|\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const ingredients = meal ? parseIngredients(meal) : [];
  const embedUrl = meal ? toYouTubeEmbed(meal.strYoutube) : null;
  const steps = meal ? formatInstructions(meal.strInstructions) : [];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative bg-white dark:bg-gray-900 w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Close modal"
          >
            <XIcon />
          </button>

          {loading ? (
            <Spinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
              <span className="text-5xl mb-4">😕</span>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Couldn't load recipe</h3>
              <p className="text-gray-400 dark:text-gray-500 mb-6">There was a problem fetching this recipe. Please try again.</p>
              <button onClick={onClose} className="btn-primary">Go Back</button>
            </div>
          ) : meal ? (
            <div className="overflow-y-auto flex-1">
              {/* Hero image */}
              <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden flex-shrink-0">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {meal.strCategory && <span className="badge-orange">{meal.strCategory}</span>}
                    {meal.strArea && <span className="badge-blue">{meal.strArea}</span>}
                    {meal.strTags &&
                      meal.strTags.split(',').filter(Boolean).map((tag) => (
                        <span key={tag} className="badge bg-white/20 text-white">
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {meal.strMeal}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    favorited
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800'
                      : 'btn-primary'
                  }`}
                >
                  <HeartIcon filled={favorited} />
                  {favorited ? 'Saved to Favorites' : 'Add to Favorites'}
                </button>
                <button onClick={handleShare} className="btn-secondary py-2.5 px-4 text-sm">
                  <ShareIcon />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {meal.strSource && (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-2.5 px-4 text-sm"
                  >
                    <LinkIcon />
                    <span className="hidden sm:inline">Source</span>
                  </a>
                )}
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">🛒</span> Ingredients
                    <span className="text-sm font-normal text-gray-400 ml-1">({ingredients.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ingredients.map(({ ingredient, measure }, i) => {
                      const key = `${ingredient}-${i}`;
                      return (
                        <button
                          key={key}
                          onClick={() => toggleIngredient(key)}
                          className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 border ${
                            checkedIngredients[key]
                              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 opacity-60'
                              : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            checkedIngredients[key] ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {checkedIngredients[key] && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm block truncate">
                              {ingredient}
                            </span>
                            {measure && (
                              <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                                {measure}
                              </span>
                            )}
                          </div>
                          <img
                            src={`https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient)}-Small.png`}
                            alt={ingredient}
                            className="w-8 h-8 object-contain flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Instructions
                  </h3>
                  <ol className="space-y-4">
                    {steps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* YouTube Video */}
                {embedUrl && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">▶️</span> Video Tutorial
                    </h3>
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <iframe
                        src={embedUrl}
                        title={`${meal.strMeal} video tutorial`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeModal;
