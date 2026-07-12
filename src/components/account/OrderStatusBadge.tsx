const colorByStatus: Record<string, string> = {
  awaiting_payment: "border-amber-200 bg-amber-50 text-amber-800",
  proof_submitted: "border-blue-200 bg-blue-50 text-blue-800",
  under_review: "border-blue-200 bg-blue-50 text-blue-800",
  for_verification: "border-blue-200 bg-blue-50 text-blue-800",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  processing: "border-indigo-200 bg-indigo-50 text-indigo-800",
  packed: "border-violet-200 bg-violet-50 text-violet-800",
  shipped: "border-cyan-200 bg-cyan-50 text-cyan-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-zinc-200 bg-zinc-100 text-zinc-700",
  rejected: "border-red-200 bg-red-50 text-red-800",
  expired: "border-zinc-200 bg-zinc-100 text-zinc-700",
  refunded: "border-purple-200 bg-purple-50 text-purple-800",
};

export function formatStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center border px-2.5 py-1 text-xs font-bold ${
        colorByStatus[status] ?? "border-zinc-200 bg-zinc-50 text-zinc-700"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}
