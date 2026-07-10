import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-white px-4">
      <div className="max-w-md border border-zinc-200 p-6 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-orange-700">404</p>
        <h1 className="mt-2 text-2xl font-black text-zinc-950">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          The page you are looking for does not exist in this phase.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-10 items-center bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
