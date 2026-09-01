import { useState, useEffect } from 'react';
import { getCategories, getAreas } from '../api/mealdb';
import { motion } from 'framer-motion';

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

const FilterBar = ({ filters, onFilterChange, onClearFilters, resultCount }) => {
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, areaList] = await Promise.all([getCategories(), getAreas()]);
        setCategories(cats.map((c) => c.strCategory).sort());
        setAreas(areaList.map((a) => a.strArea).sort());
      } catch {
        // silently fail – filters just won't populate
      } finally {
        setLoadingFilters(false);
      }
    };
    load();
  }, []);

  const hasActiveFilters = filters.category || filters.area;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <FilterIcon />
            <span className="hidden sm:inline">Filter:</span>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ category: e.target.value || null, area: filters.area })}
              disabled={loadingFilters}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronIcon />
            </div>
          </div>

          {/* Area Dropdown */}
          <div className="relative">
            <select
              value={filters.area || ''}
              onChange={(e) => onFilterChange({ category: filters.category, area: e.target.value || null })}
              disabled={loadingFilters}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="">All Cuisines</option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronIcon />
            </div>
          </div>

          {/* Active filter tags */}
          {filters.category && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {filters.category}
              <button onClick={() => onFilterChange({ category: null, area: filters.area })}>
                <XIcon />
              </button>
            </motion.span>
          )}
          {filters.area && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {filters.area}
              <button onClick={() => onFilterChange({ category: filters.category, area: null })}>
                <XIcon />
              </button>
            </motion.span>
          )}

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors flex items-center gap-1"
            >
              <XIcon />
              Clear all
            </button>
          )}

          {/* Result count */}
          {resultCount !== null && (
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-medium">
              {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'} found
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
