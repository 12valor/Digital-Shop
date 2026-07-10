import { RegisterForm } from "@/components/forms/AuthForms";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-black text-zinc-950">Create account</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Customer accounts start with the customer role and must be promoted server-side for staff access.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </>
  );
}
