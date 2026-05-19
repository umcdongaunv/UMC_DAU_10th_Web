export const LpCardSkeleton = () => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg animate-pulse bg-neutral-800">
      <div className="w-full h-48 bg-neutral-700" />
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-80 p-2 space-y-1">
        <div className="bg-neutral-600 h-4 w-3/4 rounded-sm" />
        <div className="bg-neutral-700 h-3 w-1/2 rounded-sm" />
      </div>
    </div>
  )
}