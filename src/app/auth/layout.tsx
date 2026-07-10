import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-screen bg-orange-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md self-center border border-orange-100 bg-white p-6 shadow-sm">
        <Link href="/" className="text-lg font-black text-orange-600">
          Digital Shop
        </Link>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
