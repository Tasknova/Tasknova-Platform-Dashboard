// Skeleton loaders for different components

export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="w-16 h-5 bg-gray-200 rounded" />
      </div>
      <div className="w-20 h-8 bg-gray-200 rounded mb-2" />
      <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
      <div className="w-full h-2 bg-gray-200 rounded" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="w-48 h-4 bg-gray-200 rounded mb-2" />
        <div className="w-32 h-3 bg-gray-200 rounded" />
      </div>
      <div className="w-24 h-4 bg-gray-200 rounded" />
      <div className="w-20 h-6 bg-gray-200 rounded" />
    </div>
  );
}

export function MeetingCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="h-1 bg-gray-200" />
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="w-24 h-5 bg-gray-200 rounded" />
          <div className="w-12 h-5 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="w-3/4 h-5 bg-gray-200 rounded mb-3" />
        <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
        <div className="w-40 h-4 bg-gray-200 rounded mb-4" />
        <div className="space-y-2 mb-4">
          <div className="w-full h-8 bg-gray-200 rounded" />
          <div className="w-full h-8 bg-gray-200 rounded" />
        </div>
        <div className="w-full h-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="animate-pulse">
        <div className="w-64 h-8 bg-gray-200 rounded mb-2" />
        <div className="w-96 h-5 bg-gray-200 rounded" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Meeting Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <MeetingCardSkeleton key={i} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-gray-600 mt-4">Loading...</p>
    </div>
  );
}
