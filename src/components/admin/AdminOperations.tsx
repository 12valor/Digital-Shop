"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { IconType } from "react-icons";
import {
  MdArchive,
  MdCheckCircle,
  MdClose,
  MdReplay,
  MdWarning,
} from "react-icons/md";

import {
  approvePaymentAction,
  archiveProductAction,
  requestResubmissionAction,
} from "@/app/admin/actions";

function PendingButton({
  label,
  icon: Icon,
  className,
}: {
  label: string;
  icon: IconType;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      <Icon className={pending ? "size-5 animate-pulse" : "size-5"} aria-hidden="true" />
      {pending ? "Working..." : label}
    </button>
  );
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone,
  action,
  fieldName,
  fieldValue,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone: "primary" | "danger";
  action: (formData: FormData) => void | Promise<void>;
  fieldName: string;
  fieldValue: string;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] grid place-items-center px-4">
          <motion.button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 bg-slate-950/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="relative z-10 w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              <MdClose className="size-5" />
            </button>
            <span className={`grid size-11 place-items-center rounded-full ${tone === "danger" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
              <MdWarning className="size-6" aria-hidden="true" />
            </span>
            <h2 id="admin-confirm-title" className="mt-4 text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <form action={action}>
                <input type="hidden" name={fieldName} value={fieldValue} />
                <PendingButton
                  label={confirmLabel}
                  icon={tone === "danger" ? MdArchive : MdCheckCircle}
                  className={tone === "danger"
                    ? "inline-flex h-10 items-center gap-2 rounded-md bg-red-700 px-4 text-sm font-black text-white hover:bg-red-800 disabled:opacity-60"
                    : "inline-flex h-10 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-black text-white hover:bg-blue-800 disabled:opacity-60"}
                />
              </form>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export function ArchiveProductButton({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 bg-white px-3 text-sm font-black text-red-700 transition hover:bg-red-50 active:scale-[0.98]"
      >
        <MdArchive className="size-5" aria-hidden="true" /> Archive product
      </button>
      <ConfirmDialog
        open={open}
        title="Archive this product?"
        description="The product will leave the active storefront but remain available in historical orders."
        confirmLabel="Archive"
        tone="danger"
        action={archiveProductAction}
        fieldName="productId"
        fieldValue={productId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function ApprovePaymentButton({ proofId }: { proofId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800 active:scale-[0.98]"
      >
        <MdCheckCircle className="size-5" aria-hidden="true" /> Approve payment
      </button>
      <ConfirmDialog
        open={open}
        title="Approve this payment?"
        description="This marks the order as paid, moves it to processing, updates inventory once, and records your approval."
        confirmLabel="Approve payment"
        tone="primary"
        action={approvePaymentAction}
        fieldName="proofId"
        fieldValue={proofId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function RequestResubmissionButton({ proofId }: { proofId: string }) {
  return (
    <form action={requestResubmissionAction}>
      <input type="hidden" name="proofId" value={proofId} />
      <PendingButton
        label="Request resubmission"
        icon={MdReplay}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-orange-200 bg-white px-4 text-sm font-black text-orange-700 transition hover:bg-orange-50 active:scale-[0.98] disabled:opacity-60"
      />
    </form>
  );
}
