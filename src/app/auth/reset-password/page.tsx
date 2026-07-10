import { ResetPasswordForm } from "@/components/forms/AuthForms";

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-black text-zinc-950">Choose new password</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Use the link from your email, then set a new password here.
      </p>
      <div className="mt-6">
        <ResetPasswordForm />
      </div>
    </>
  );
}
