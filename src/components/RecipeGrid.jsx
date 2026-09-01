import { AnimatePresence, motion } from 'framer-motion';
import RecipeCard from './RecipeCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';

const SKELETON_COUNT = 8;

const RecipeGrid = ({ meals, loading, error, onCardClick, title }) => {
  if (error) {
    return (
      <EmptyState
        message="Something went wrong"
        sub="We couldn't fetch recipes right now. Check your connection and try again."
      />
    );
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="skeleton h-7 w-48 rounded-lg mb-6" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!meals || meals.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {title && (
        <h2 className="section-title mb-6">{title}</h2>
      )}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {meals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              meal={meal}
              onClick={onCardClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default RecipeGrid;
