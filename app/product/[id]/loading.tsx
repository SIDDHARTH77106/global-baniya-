export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-40 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
