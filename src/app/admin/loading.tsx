export default function AdminLoading() {
  return (
    <div className="grid gap-6" aria-label="Loading admin content" aria-busy="true">
      <div className="flex items-start gap-3">
        <div className="size-10 animate-pulse rounded-lg bg-slate-200" />
        <div className="flex-1">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white" />
        <div className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white" />
      </div>
    </div>
  );
}