import { ForgotPasswordForm } from "@/components/forms/AuthForms";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const invalidLink = params.error === "invalid_link";

  return (
    <>
      <h1 className="text-2xl font-black text-zinc-950">Reset password</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Enter your account email and Supabase will send a secure reset link.
      </p>
      {invalidLink ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          That reset link is invalid or expired. Request a new link below and use it only once.
        </p>
      ) : null}
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
