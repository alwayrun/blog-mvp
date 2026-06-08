export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Tag bar skeleton */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-7 bg-gray-100 rounded-full" style={{ width: `${48 + i * 12}px` }} />
        ))}
      </div>

      {/* Post card skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-8 border-b border-gray-100">
          <div className="h-5 bg-gray-100 rounded w-2/3 mb-3" />
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 bg-gray-100 rounded w-20" />
            <div className="h-3 bg-gray-100 rounded w-12" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
