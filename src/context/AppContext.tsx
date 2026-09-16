"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  DEMO_PUBLISHER,
  DEMO_TENANT,
  NEW_LISTING_SLOTS,
  properties as seedProperties,
  type Property,
} from "@/data/properties";
import {
  DEFAULT_SETTINGS,
  SEED_ENQUIRIES,
  SEED_SAVED,
  SEED_UNLOCKS,
  type AlertSubscription,
  type Enquiry,
  type Payment,
  type PaymentMethod,
  type Report,
  type Settings,
  type Unlock,
} from "@/data/demo";

export type Role = "Guest" | "Tenant" | "Publisher" | "Admin";

export const ROLES: Role[] = ["Guest", "Tenant", "Publisher", "Admin"];

export function dashboardPath(role: Role): string {
  return role === "Guest" ? "/login" : `/dashboard/${role.toLowerCase()}`;
}

export interface DemoState {
  role: Role;
  listings: Property[];
  savedIds: string[];
  enquiries: Enquiry[];
  unlocks: Unlock[];
  payments: Payment[];
  reports: Report[];
  subscription: AlertSubscription | null;
  settings: Settings;
}

export type NewListingInput = Omit<
  Property,
  "id" | "status" | "publisherId" | "publisherName" | "publisherPhone" | "publisherEmail" | "listedAt" | "views" | "paused" | "verified" | "rejectReason"
>;

/* ------------------------------------------------------------------ */
/* External store: the whole demo lives in localStorage so it survives  */
/* reloads and new tabs. Storage can be unavailable (private mode or    */
/* quota), in which case the in-memory copy remains the source of truth. */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "ulivger.demo.v2";

function initialState(): DemoState {
  return {
    role: "Guest",
    listings: seedProperties,
    savedIds: SEED_SAVED,
    enquiries: SEED_ENQUIRIES,
    unlocks: SEED_UNLOCKS,
    payments: [],
    reports: [],
    subscription: null,
    settings: DEFAULT_SETTINGS,
  };
}

const SERVER_STATE = initialState();
let clientState: DemoState | null = null;
const listeners = new Set<() => void>();

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...(JSON.parse(raw) as Partial<DemoState>) };
  } catch {}
  return SERVER_STATE;
}

function getSnapshot(): DemoState {
  if (clientState === null) clientState = load();
  return clientState;
}

function setState(updater: (prev: DemoState) => DemoState) {
  clientState = updater(getSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientState));
  } catch {}
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    clientState = load();
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

const nowIso = () => new Date().toISOString();
export const newTransactionId = () => `UFT-${Math.floor(100000 + Math.random() * 900000)}`;

/* ------------------------------------------------------------------ */

interface AppContextValue extends DemoState {
  setRole: (role: Role) => void;
  addListing: (input: NewListingInput) => Property;
  updateListing: (id: string, patch: Partial<Omit<Property, "id">>) => void;
  approveListing: (id: string) => void;
  rejectListing: (id: string, reason: string) => void;
  togglePaused: (id: string) => void;
  toggleSaved: (id: string) => boolean;
  addEnquiry: (input: Pick<Enquiry, "propertyId" | "name" | "email" | "phone" | "message">) => void;
  replyToEnquiry: (id: string, reply: string) => void;
  unlockContact: (propertyId: string, method: PaymentMethod, transactionId: string) => void;
  subscribeAlerts: (sub: Omit<AlertSubscription, "startedAt">, method: PaymentMethod, amount: number) => void;
  addReport: (input: Pick<Report, "propertyId" | "reason" | "details">) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);

  const setRole = useCallback((role: Role) => setState((s) => ({ ...s, role })), []);

  const addListing = useCallback((input: NewListingInput) => {
    const taken = new Set(getSnapshot().listings.map((l) => l.id));
    const id = NEW_LISTING_SLOTS.find((slot) => !taken.has(slot)) ?? `new-${Date.now()}`;
    const created: Property = {
      ...input,
      id,
      status: "Pending",
      verified: false,
      publisherId: DEMO_PUBLISHER.id,
      publisherName: DEMO_PUBLISHER.name,
      publisherPhone: DEMO_PUBLISHER.phone,
      publisherEmail: DEMO_PUBLISHER.email,
      listedAt: nowIso(),
      views: 0,
      paused: false,
    };
    setState((s) => ({ ...s, listings: [created, ...s.listings] }));
    return created;
  }, []);

  const updateListing = useCallback((id: string, patch: Partial<Omit<Property, "id">>) => {
    setState((s) => ({ ...s, listings: s.listings.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);

  const approveListing = useCallback(
    (id: string) => updateListing(id, { status: "Published", verified: true, rejectReason: undefined, paused: false, listedAt: nowIso() }),
    [updateListing],
  );

  const rejectListing = useCallback(
    (id: string, reason: string) => updateListing(id, { status: "Rejected", rejectReason: reason }),
    [updateListing],
  );

  const togglePaused = useCallback((id: string) => {
    setState((s) => ({ ...s, listings: s.listings.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p)) }));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    const saved = !getSnapshot().savedIds.includes(id);
    setState((s) => ({ ...s, savedIds: saved ? [id, ...s.savedIds] : s.savedIds.filter((x) => x !== id) }));
    return saved;
  }, []);

  const addEnquiry = useCallback((input: Pick<Enquiry, "propertyId" | "name" | "email" | "phone" | "message">) => {
    const enquiry: Enquiry = { ...input, id: `enq-${Date.now()}`, createdAt: nowIso(), status: "New", mine: true };
    setState((s) => ({ ...s, enquiries: [enquiry, ...s.enquiries] }));
  }, []);

  const replyToEnquiry = useCallback((id: string, reply: string) => {
    setState((s) => ({ ...s, enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, reply, status: "Replied" } : e)) }));
  }, []);

  const unlockContact = useCallback((propertyId: string, method: PaymentMethod, transactionId: string) => {
    setState((s) => {
      const createdAt = nowIso();
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      const unlock: Unlock = { propertyId, transactionId, amount: s.settings.unlockPrice, createdAt, expiresAt: expires.toISOString() };
      const payment: Payment = {
        id: transactionId,
        customer: DEMO_TENANT.name,
        product: "Contact unlock",
        method,
        amount: s.settings.unlockPrice,
        createdAt,
        status: "Succeeded",
        session: true,
      };
      return {
        ...s,
        unlocks: [unlock, ...s.unlocks.filter((u) => u.propertyId !== propertyId)],
        payments: [payment, ...s.payments],
      };
    });
  }, []);

  const subscribeAlerts = useCallback((sub: Omit<AlertSubscription, "startedAt">, method: PaymentMethod, amount: number) => {
    setState((s) => {
      const createdAt = nowIso();
      const payment: Payment = {
        id: sub.transactionId,
        customer: DEMO_TENANT.name,
        product: `WhatsApp alerts, ${sub.plan === "monthly" ? "Monthly" : "Quarterly"}`,
        method,
        amount,
        createdAt,
        status: "Succeeded",
        session: true,
      };
      return { ...s, subscription: { ...sub, startedAt: createdAt }, payments: [payment, ...s.payments] };
    });
  }, []);

  const addReport = useCallback((input: Pick<Report, "propertyId" | "reason" | "details">) => {
    setState((s) => ({ ...s, reports: [{ ...input, id: `rep-${Date.now()}`, createdAt: nowIso() }, ...s.reports] }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(() => initialState());
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      setRole,
      addListing,
      updateListing,
      approveListing,
      rejectListing,
      togglePaused,
      toggleSaved,
      addEnquiry,
      replyToEnquiry,
      unlockContact,
      subscribeAlerts,
      addReport,
      updateSettings,
      resetDemo,
    }),
    [state, setRole, addListing, updateListing, approveListing, rejectListing, togglePaused, toggleSaved, addEnquiry, replyToEnquiry, unlockContact, subscribeAlerts, addReport, updateSettings, resetDemo],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/** Listings visible to the public: published and not paused. */
export function usePublishedListings(): Property[] {
  const { listings } = useApp();
  return useMemo(() => listings.filter((p) => p.status === "Published" && !p.paused), [listings]);
}

/** Active unlock for a property, if the demo tenant has paid for it and it hasn't expired. */
export function useUnlock(propertyId: string): Unlock | undefined {
  const { unlocks } = useApp();
  return unlocks.find((u) => u.propertyId === propertyId && new Date(u.expiresAt) > new Date());
}
