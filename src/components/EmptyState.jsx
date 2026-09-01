import { motion } from 'framer-motion';

const EmptyState = ({ message = 'No recipes found', sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    {/* Illustration */}
    <div className="w-32 h-32 mb-6 text-gray-200 dark:text-gray-700">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="currentColor" />
        <path d="M60 80 Q100 50 140 80" stroke="#f97316" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <circle cx="76" cy="96" r="8" fill="#f97316" opacity="0.7"/>
        <circle cx="124" cy="96" r="8" fill="#f97316" opacity="0.7"/>
        <path d="M75 125 Q100 145 125 125" stroke="#f97316" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M55 60 Q50 40 65 35" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M145 60 Q150 40 135 35" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M100 55 Q100 30 100 20" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">{message}</h3>
    <p className="text-gray-400 dark:text-gray-500 max-w-xs">
      {sub || 'Try searching for a different ingredient, cuisine, or meal name.'}
    </p>
  </motion.div>
);

export default EmptyState;
