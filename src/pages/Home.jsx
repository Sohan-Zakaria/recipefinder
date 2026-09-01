import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import RecipeGrid from '../components/RecipeGrid';
import RecipeModal from '../components/RecipeModal';
import {
  searchByName,
  filterByCategory,
  filterByArea,
} from '../api/mealdb';

const Home = ({ externalSearch, externalModalId, onModalClose }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState(null);
  const [filters, setFilters] = useState({ category: null, area: null });
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [gridTitle, setGridTitle] = useState('Explore Recipes');

  // Sync external search from Header
  useEffect(() => {
    if (externalSearch && externalSearch.trim()) {
      setSearchQuery(externalSearch.trim());
      setQuickFilter(null);
      setFilters({ category: null, area: null });
    }
  }, [externalSearch]);

  // Sync external modal (Random button in Header)
  useEffect(() => {
    if (externalModalId) {
      setSelectedMealId(externalModalId);
    }
  }, [externalModalId]);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      let results = [];

      if (searchQuery && searchQuery.trim()) {
        results = await searchByName(searchQuery.trim());
        setGridTitle(`Results for "${searchQuery.trim()}"`);
      } else if (quickFilter) {
        results = await filterByCategory(quickFilter);
        setGridTitle(`${quickFilter} Recipes`);
      } else if (filters.category && filters.area) {
        const [catResults, areaResults] = await Promise.all([
          filterByCategory(filters.category),
          filterByArea(filters.area),
        ]);
        const areaIds = new Set(areaResults.map((m) => m.idMeal));
        results = catResults.filter((m) => areaIds.has(m.idMeal));
        setGridTitle(`${filters.category} · ${filters.area}`);
      } else if (filters.category) {
        results = await filterByCategory(filters.category);
        setGridTitle(`${filters.category} Recipes`);
      } else if (filters.area) {
        results = await filterByArea(filters.area);
        setGridTitle(`${filters.area} Cuisine`);
      } else {
        // Default landing: show a curated mix of categories
        const [chicken, beef, seafood, dessert] = await Promise.all([
          filterByCategory('Chicken'),
          filterByCategory('Beef'),
          filterByCategory('Seafood'),
          filterByCategory('Dessert'),
        ]);
        const merged = [];
        const maxEach = 6;
        [chicken, beef, seafood, dessert].forEach((arr) => {
          merged.push(...arr.slice(0, maxEach));
        });
        results = merged;
        setGridTitle('Explore Recipes');
      }

      setMeals(results);
    } catch {
      setError(true);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, quickFilter, filters]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setQuickFilter(null);
      setFilters({ category: null, area: null });
    }
  };

  const handleQuickFilter = (value) => {
    setQuickFilter(value);
    setSearchQuery('');
    setFilters({ category: null, area: null });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSearchQuery('');
    setQuickFilter(null);
  };

  const handleClearFilters = () => {
    setFilters({ category: null, area: null });
    setQuickFilter(null);
    setSearchQuery('');
  };

  const handleCloseModal = () => {
    setSelectedMealId(null);
    if (onModalClose) onModalClose();
  };

  return (
    <>
      <Hero
        onSearch={handleSearch}
        onQuickFilter={handleQuickFilter}
        activeQuickFilter={quickFilter}
      />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={!loading && !error ? meals.length : null}
      />

      <RecipeGrid
        meals={meals}
        loading={loading}
        error={error}
        onCardClick={setSelectedMealId}
        title={gridTitle}
      />

      <AnimatePresence>
        {selectedMealId && (
          <RecipeModal
            key={selectedMealId}
            mealId={selectedMealId}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
