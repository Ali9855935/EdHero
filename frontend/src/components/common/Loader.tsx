export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => {
  return (
    <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-xl overflow-hidden animate-pulse">
      {/* Table Header skeleton */}
      <div className="bg-neutralDark-950/40 px-6 py-4 border-b border-neutralDark-800 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-neutralDark-800 rounded flex-1 shimmer" />
        ))}
      </div>
      
      {/* Table Rows skeleton */}
      <div className="divide-y divide-neutralDark-800/40">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-neutralDark-800 rounded flex-1 shimmer" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-10 w-10 bg-neutralDark-800 rounded-lg shimmer" />
        <div className="h-6 w-16 bg-neutralDark-800 rounded-md shimmer" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-neutralDark-800 rounded w-1/3 shimmer" />
        <div className="h-8 bg-neutralDark-800 rounded w-2/3 shimmer" />
      </div>
    </div>
  );
};
