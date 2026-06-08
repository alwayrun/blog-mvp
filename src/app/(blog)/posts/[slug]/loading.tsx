export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-20 bg-gray-100 rounded mb-8" />

      <div className="mb-10">
        <div className="h-8 bg-gray-100 rounded w-3/4 mb-3" />
        <div className="h-8 bg-gray-100 rounded w-1/2 mb-4" />
        <div className="flex gap-3">
          <div className="h-3 bg-gray-100 rounded w-20" />
          <div className="h-3 bg-gray-100 rounded w-12" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-100 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
          />
        ))}
        <div className="h-4 w-0" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i + 10}
            className={`h-4 bg-gray-100 rounded ${i % 3 === 2 ? "w-3/4" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}
