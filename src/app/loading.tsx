export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-6">
      <div className="mx-auto grid max-w-6xl gap-4">
        <div className="h-12 animate-pulse border border-zinc-200 bg-white" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse border border-zinc-200 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
