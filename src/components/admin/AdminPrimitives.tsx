import type { IconType } from "react-icons";
import { MdInbox } from "react-icons/md";

const statusColors: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  shipped: "border-cyan-200 bg-cyan-50 text-cyan-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  packed: "border-violet-200 bg-violet-50 text-violet-700",
  proof_submitted: "border-amber-200 bg-amber-50 text-amber-700",
  under_review: "border-amber-200 bg-amber-50 text-amber-700",
  for_verification: "border-amber-200 bg-amber-50 text-amber-700",
  awaiting_payment: "border-orange-200 bg-orange-50 text-orange-700",
  low_stock: "border-amber-200 bg-amber-50 text-amber-700",
  out_of_stock: "border-red-200 bg-red-50 text-red-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-slate-200 bg-slate-100 text-slate-600",
  expired: "border-slate-200 bg-slate-100 text-slate-600",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
  draft: "border-slate-200 bg-slate-50 text-slate-600",
  refunded: "border-purple-200 bg-purple-50 text-purple-700",
  hidden: "border-slate-200 bg-slate-100 text-slate-600",
  visible: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function formatAdminStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-black ${
        statusColors[status] ?? "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {formatAdminStatus(status)}
    </span>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconType;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3">
        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-800">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase text-orange-600">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminSection({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-black text-slate-950">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon = MdInbox,
}: {
  title: string;
  description: string;
  icon?: IconType;
}) {
  return (
    <div className="grid place-items-center px-5 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-3 font-black text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export const adminInputClass =
  "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export const adminButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-black text-white transition duration-200 hover:bg-blue-800 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60";
