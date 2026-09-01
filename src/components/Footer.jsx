const Footer = () => (
  <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-base leading-none">R</span>
            </div>
            <span className="font-bold text-lg">
              <span className="text-primary-500">Recipe</span>
              <span className="text-gray-800 dark:text-white">Finder</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            Discover thousands of recipes from around the world.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Recipe data powered by{' '}
            <a
              href="https://www.themealdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
            >
              TheMealDB
            </a>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Free to use for personal projects • Data subject to TheMealDB's terms
          </p>
        </div>

        {/* Social/Credits */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.themealdb.com/api.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
          >
            API Docs →
          </a>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} RecipeFinder
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
