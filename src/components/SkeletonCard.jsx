const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="skeleton w-full h-52" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded-lg" />
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
