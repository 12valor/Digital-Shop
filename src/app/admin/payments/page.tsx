import {
  approvePaymentAction,
  requestResubmissionAction,
} from "@/app/admin/actions";
import { RejectPaymentForm } from "@/components/admin/AdminForms";
import { getAdminPaymentsData } from "@/lib/admin-data";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const data = await getAdminPaymentsData();

  if (!data) return null;

  const orderForProof = (orderId: string) => data.orders.find((order) => order.id === orderId);
  const customer = (userId: string) =>
    data.profiles.find((profile) => profile.id === userId)?.email ?? "Unknown customer";

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-orange-300">Payments</p>
        <h1 className="mt-1 text-3xl font-black text-white">Payment verification</h1>
      </div>
      <div className="grid gap-3">
        {data.proofs.map((proof) => {
          const order = orderForProof(proof.order_id);

          return (
            <article key={proof.id} className="grid gap-4 border border-zinc-800 bg-zinc-900 p-4 lg:grid-cols-[1fr_320px]">
              <div>
                <h2 className="font-black text-white">{order?.order_number ?? "Unknown order"}</h2>
                <div className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                  <p><span className="text-zinc-500">Customer:</span> {customer(proof.user_id)}</p>
                  <p><span className="text-zinc-500">Expected:</span> {order ? formatPeso(order.total_cents) : "-"}</p>
                  <p><span className="text-zinc-500">Submitted:</span> {formatPeso(proof.amount_paid_cents)}</p>
                  <p><span className="text-zinc-500">Sender:</span> {proof.sender_name}</p>
                  <p><span className="text-zinc-500">Reference:</span> {proof.gcash_reference_number}</p>
                  <p><span className="text-zinc-500">Status:</span> {proof.status}</p>
                </div>
                {data.proofUrls[proof.id] ? (
                  <a
                    href={data.proofUrls[proof.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-bold text-orange-300 hover:text-orange-200"
                  >
                    Open temporary receipt link
                  </a>
                ) : (
                  <p className="mt-3 break-all text-xs text-zinc-500">Receipt path: {proof.storage_path}</p>
                )}
              </div>
              <div className="grid gap-2">
                <form action={approvePaymentAction}>
                  <input type="hidden" name="proofId" value={proof.id} />
                  <button className="h-9 w-full bg-emerald-700 px-3 text-sm font-black text-white">
                    Approve
                  </button>
                </form>
                <form action={requestResubmissionAction}>
                  <input type="hidden" name="proofId" value={proof.id} />
                  <button className="h-9 w-full border border-orange-600 px-3 text-sm font-black text-orange-200">
                    Request resubmission
                  </button>
                </form>
                <RejectPaymentForm proofId={proof.id} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
