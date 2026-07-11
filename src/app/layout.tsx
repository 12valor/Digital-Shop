import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/components/shared/QueryProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Shop",
  description: "A mobile-first digital shop foundation built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-950">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
