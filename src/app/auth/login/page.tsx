import { LoginForm } from "@/components/forms/AuthForms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/account";

  return (
    <>
      <h1 className="text-2xl font-black text-zinc-950">Sign in</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Access your account, saved addresses, and protected shop pages.
      </p>
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
    </>
  );
}
