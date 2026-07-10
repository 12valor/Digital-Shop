import { ForgotPasswordForm } from "@/components/forms/AuthForms";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-black text-zinc-950">Reset password</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Enter your account email and Supabase will send a secure reset link.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
