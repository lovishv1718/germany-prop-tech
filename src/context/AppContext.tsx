"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { properties as seedProperties, type ListingStatus, type Property } from "@/data/properties";

export type Role = "Guest" | "Tenant" | "Publisher" | "Admin";

export const ROLES: Role[] = ["Guest", "Tenant", "Publisher", "Admin"];

interface AppContextValue {
  role: Role;
  setRole: (role: Role) => void;
  listings: Property[];
  addListing: (listing: Omit<Property, "id">) => Property;
  updateListing: (id: string, patch: Partial<Omit<Property, "id">>) => void;
  setListingStatus: (id: string, status: ListingStatus) => void;
  removeListing: (id: string) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const ROLE_KEY = "ulivger.demo.role";

// The demo role is remembered across reloads. Storage can be unavailable (private mode),
// so an in-memory copy is kept as the fallback source of truth.
let memoryRole: Role = "Guest";
const roleListeners = new Set<() => void>();

function readRole(): Role {
  try {
    const saved = localStorage.getItem(ROLE_KEY) as Role | null;
    if (saved && ROLES.includes(saved)) return saved;
  } catch {}
  return memoryRole;
}

function writeRole(next: Role) {
  memoryRole = next;
  try {
    localStorage.setItem(ROLE_KEY, next);
  } catch {}
  roleListeners.forEach((notify) => notify());
}

function subscribeRole(notify: () => void) {
  roleListeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    roleListeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(subscribeRole, readRole, () => "Guest" as Role);
  const [listings, setListings] = useState<Property[]>(seedProperties);
  const setRole = useCallback((next: Role) => writeRole(next), []);

  const addListing = useCallback((listing: Omit<Property, "id">) => {
    const created: Property = { ...listing, id: `ulg-new-${Date.now()}` };
    setListings((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateListing = useCallback((id: string, patch: Partial<Omit<Property, "id">>) => {
    setListings((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const setListingStatus = useCallback(
    (id: string, status: ListingStatus) => updateListing(id, { status }),
    [updateListing],
  );

  const removeListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetDemo = useCallback(() => {
    setListings(seedProperties);
    setRole("Guest");
  }, [setRole]);

  const value = useMemo(
    () => ({ role, setRole, listings, addListing, updateListing, setListingStatus, removeListing, resetDemo }),
    [role, setRole, listings, addListing, updateListing, setListingStatus, removeListing, resetDemo],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/** Listings visible to the public: published only. */
export function usePublishedListings(): Property[] {
  const { listings } = useApp();
  return useMemo(() => listings.filter((p) => p.status === "Published"), [listings]);
}
