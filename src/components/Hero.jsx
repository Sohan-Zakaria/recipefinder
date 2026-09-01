import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';

const QUICK_FILTERS = [
  { label: '🍗 Chicken', value: 'Chicken' },
  { label: '🦐 Seafood', value: 'Seafood' },
  { label: '🥩 Beef', value: 'Beef' },
  { label: '🥗 Vegetarian', value: 'Vegetarian' },
  { label: '🍰 Dessert', value: 'Dessert' },
];

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Hero = ({ onSearch, onQuickFilter, activeQuickFilter }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleQuickFilter = (value) => {
    setQuery('');
    onQuickFilter(value === activeQuickFilter ? null : value);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16 md:py-24">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span>🍳</span>
            <span>Powered by TheMealDB</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            Find Your Next{' '}
            <span className="text-primary-500 relative">
              Favorite Meal
              <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 7 Q50 0 100 7 Q150 14 200 7" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Explore thousands of recipes from around the world. Search by name,
            filter by cuisine or category, and discover something delicious.
          </p>

          {/* Search Input */}
          <div className="relative max-w-xl mx-auto mb-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pasta, curry, tacos..."
              className="input-base pl-12 py-4 text-base shadow-lg"
              autoFocus
            />
            {query && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setQuery('')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Quick filters:</span>
            {QUICK_FILTERS.map((f) => (
              <motion.button
                key={f.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickFilter(f.value)}
                className={activeQuickFilter === f.value ? 'chip-active' : 'chip-inactive'}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
