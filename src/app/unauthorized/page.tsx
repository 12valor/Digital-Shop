import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-4">
      <section className="w-full max-w-md border border-zinc-200 p-6 text-center">
        <p className="text-sm font-black uppercase tracking-wide text-orange-700">
          Access denied
        </p>
        <h1 className="mt-2 text-2xl font-black text-zinc-950">
          You cannot open this area
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Your account does not have permission to manage this part of the shop.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/account"
            className="inline-flex h-10 items-center justify-center bg-zinc-950 px-4 text-sm font-bold text-white hover:bg-zinc-800"
          >
            Go to account
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center border border-zinc-300 px-4 text-sm font-bold text-zinc-800 hover:border-orange-500 hover:text-orange-700"
          >
            Back to shop
          </Link>
        </div>
      </section>
    </main>
  );
}
