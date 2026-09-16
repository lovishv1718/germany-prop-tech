"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, CreditCard, Landmark, Loader, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { formatEUR } from "@/data/properties";
import type { PaymentMethod } from "@/data/demo";
import { newTransactionId } from "@/context/AppContext";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  productName: string;
  productDetail: string;
  /** Called once the simulated payment succeeds, before the success screen shows. */
  onPaid: (transactionId: string, method: PaymentMethod) => void;
  successTitle?: string;
  successText?: string;
  successCta?: string;
}

const METHODS: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: "Card", label: "Card", icon: CreditCard },
  { id: "PayPal", label: "PayPal", icon: Wallet },
  { id: "SEPA", label: "SEPA", icon: Landmark },
  { id: "Klarna", label: "Klarna", icon: Wallet },
];

type Step = "form" | "processing" | "success";

export default function CheckoutModal({
  open,
  onClose,
  amount,
  productName,
  productDetail,
  onPaid,
  successTitle = "Payment successful",
  successText,
  successCta = "Done",
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [method, setMethod] = useState<PaymentMethod>("Card");
  const [transactionId, setTransactionId] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const close = () => {
    onClose();
    // Reset after the modal has closed so the next checkout starts fresh.
    window.setTimeout(() => {
      setStep("form");
      setMethod("Card");
    }, 200);
  };

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    timer.current = window.setTimeout(() => {
      const id = newTransactionId();
      setTransactionId(id);
      onPaid(id, method);
      setStep("success");
    }, 1500);
  };

  if (step === "success") {
    return (
      <Modal open={open} onClose={close} title="Checkout complete" size="sm">
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid h-16 w-16 animate-pop-in place-items-center rounded-full bg-verified-soft">
            <CircleCheck className="h-9 w-9 text-verified" strokeWidth={2.2} />
          </span>
          <h3 className="mt-5 text-2xl font-bold text-navy">{successTitle}</h3>
          {successText && <p className="mt-2 text-slate-600">{successText}</p>}
          <dl className="mt-6 w-full divide-y divide-line rounded-card border border-line text-left text-sm">
            <div className="flex justify-between px-4 py-3">
              <dt className="text-slate-500">Transaction ID</dt>
              <dd className="font-mono font-semibold text-navy">{transactionId}</dd>
            </div>
            <div className="flex justify-between px-4 py-3">
              <dt className="text-slate-500">Amount paid</dt>
              <dd className="font-semibold text-navy">{formatEUR(amount, true)}</dd>
            </div>
            <div className="flex justify-between px-4 py-3">
              <dt className="text-slate-500">Method</dt>
              <dd className="font-semibold text-navy">{method}</dd>
            </div>
          </dl>
          <Button variant="navy" className="mt-6 w-full" onClick={close}>
            {successCta}
          </Button>
        </div>
      </Modal>
    );
  }

  const processing = step === "processing";

  return (
    <Modal open={open} onClose={close} title="Secure checkout" description={productName} size="sm" locked={processing}>
      <form onSubmit={pay} className="space-y-5">
        <div className="flex items-center justify-between rounded-card bg-sand px-4 py-3">
          <div className="min-w-0">
            <p className="font-semibold text-navy">{productName}</p>
            <p className="truncate text-sm text-slate-500">{productDetail}</p>
          </div>
          <p className="shrink-0 font-display text-xl font-bold text-navy">{formatEUR(amount, true)}</p>
        </div>

        <div>
          <Label>Payment method</Label>
          <div className="grid grid-cols-4 gap-2">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                disabled={processing}
                aria-pressed={method === id}
                onClick={() => setMethod(id)}
                className={`flex h-14 flex-col items-center justify-center gap-1 rounded-btn border text-xs font-semibold transition ${
                  method === id ? "border-navy bg-navy text-white" : "border-line text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {method === "Card" ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor="cc-number">Card number</Label>
              <Input id="cc-number" defaultValue="4242 4242 4242 4242" inputMode="numeric" disabled={processing} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cc-exp">Expiry</Label>
                <Input id="cc-exp" defaultValue="12 / 28" disabled={processing} />
              </div>
              <div>
                <Label htmlFor="cc-cvc">CVC</Label>
                <Input id="cc-cvc" defaultValue="123" disabled={processing} />
              </div>
            </div>
            <div>
              <Label htmlFor="cc-name">Name on card</Label>
              <Input id="cc-name" defaultValue="Lukas Meyer" disabled={processing} />
            </div>
          </div>
        ) : (
          <p className="rounded-card border border-line px-4 py-3 text-sm text-slate-600">
            In the live product you would be redirected to {method} to confirm. In this prototype the payment is simulated.
          </p>
        )}

        <p className="flex items-start gap-2 rounded-btn bg-sun-soft px-3 py-2.5 text-sm text-[#6b4e00]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Test mode. No real payment is taken and the card details above are Stripe test values.
        </p>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={processing}>
          {processing ? (
            <>
              <Loader className="h-5 w-5 animate-spin" /> Processing payment
            </>
          ) : (
            <>
              <LockKeyhole className="h-4 w-4" /> Pay {formatEUR(amount, true)}
            </>
          )}
        </Button>
      </form>
    </Modal>
  );
}
