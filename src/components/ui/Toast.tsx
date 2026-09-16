"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

export type ToastVariant = "success" | "info" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

type ToastFn = (message: string, variant?: ToastVariant) => void;

const ToastContext = createContext<ToastFn | null>(null);

const ICONS = { success: CircleCheck, info: Info, error: CircleAlert };
const ICON_COLOR = { success: "text-sun", info: "text-white/80", error: "text-red-400" };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback<ToastFn>(
    (message, variant = "success") => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-20 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:items-start"
        aria-live="polite"
        role="status"
      >
        {toasts.map(({ id, message, variant }) => {
          const Icon = ICONS[variant];
          return (
            <div
              key={id}
              className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-card bg-navy px-4 py-3 text-sm text-white shadow-lift"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ICON_COLOR[variant]}`} />
              <p className="flex-1 leading-snug">{message}</p>
              <button type="button" onClick={() => dismiss(id)} className="text-white/50 hover:text-white" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
