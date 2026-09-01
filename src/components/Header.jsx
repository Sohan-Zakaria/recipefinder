import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import { getRandomMeal } from '../api/mealdb';
import toast from 'react-hot-toast';

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShuffleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Header = ({ onSearch, onOpenModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const { favorites } = useApp();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/');
      onSearch(searchQuery.trim());
    }
  };

  const handleRandom = async () => {
    setRandomLoading(true);
    try {
      const meal = await getRandomMeal();
      if (meal) {
        navigate('/');
        onOpenModal(meal.idMeal);
      }
    } catch {
      toast.error('Could not fetch a random recipe. Try again!');
    } finally {
      setRandomLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg leading-none">R</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">
              <span className="text-primary-500">Recipe</span>
              <span className="text-gray-800 dark:text-white">Finder</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="input-base pl-9 pr-4 py-2.5 text-sm"
            />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandom}
              disabled={randomLoading}
              className="btn-primary text-sm py-2 px-3 hidden sm:flex"
              title="Get a random recipe"
            >
              <ShuffleIcon />
              <span className="hidden lg:inline">Random</span>
            </button>

            <Link to="/favorites" className="relative btn-ghost text-sm">
              <HeartIcon />
              <span className="hidden lg:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden pb-4 space-y-3"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="input-base pl-9 text-sm"
              />
            </form>
            <button
              onClick={() => { handleRandom(); setMobileMenuOpen(false); }}
              disabled={randomLoading}
              className="btn-primary w-full justify-center text-sm"
            >
              <ShuffleIcon />
              {randomLoading ? 'Loading...' : 'Random Recipe'}
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
