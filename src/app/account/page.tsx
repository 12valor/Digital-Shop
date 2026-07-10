import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await requireAuth("/account");
  const params = await searchParams;

  return (
    <div className="border border-zinc-200 bg-white p-6">
      <h1 className="text-2xl font-black text-zinc-950">Account</h1>
      {params.error === "unauthorized" ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Your account does not have access to that area.
        </p>
      ) : null}
      <dl className="mt-6 grid gap-4 text-sm">
        <div>
          <dt className="font-bold text-zinc-950">Email</dt>
          <dd className="mt-1 text-zinc-700">{profile.email}</dd>
        </div>
        <div>
          <dt className="font-bold text-zinc-950">Role</dt>
          <dd className="mt-1 text-zinc-700">{profile.role}</dd>
        </div>
      </dl>
    </div>
  );
}
