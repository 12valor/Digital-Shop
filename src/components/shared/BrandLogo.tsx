import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Digital Shop home"
      className="inline-flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
    >
      <Image
        src="/brand/digital-shop-mark.svg"
        width={48}
        height={48}
        priority
        alt=""
        className="size-10 shrink-0 sm:size-11"
      />
      {compact ? null : (
        <span className="leading-none">
          <span className={`block text-lg font-black ${inverse ? "text-white" : "text-blue-950"}`}>
            DIGITAL
          </span>
          <span className="mt-0.5 block text-xs font-black text-orange-500">SHOP</span>
        </span>
      )}
    </Link>
  );
}
