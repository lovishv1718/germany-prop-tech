import { daysAgo, DEMO_TENANT } from "./properties";

export type EnquiryStatus = "New" | "Replied";

export interface Enquiry {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
  reply?: string;
  /** Sent by the demo tenant (shown in the Tenant dashboard). */
  mine: boolean;
}

export interface Unlock {
  propertyId: string;
  transactionId: string;
  amount: number;
  createdAt: string;
  expiresAt: string;
}

export type PaymentMethod = "Card" | "PayPal" | "SEPA" | "Klarna";

export interface Payment {
  id: string;
  customer: string;
  product: string;
  method: PaymentMethod;
  amount: number;
  createdAt: string;
  status: "Succeeded" | "Refunded" | "Failed";
  /** Created during this demo session rather than seeded. */
  session?: boolean;
}

export interface Report {
  id: string;
  propertyId: string;
  reason: string;
  details: string;
  createdAt: string;
}

export type PlanId = "monthly" | "quarterly";

export interface AlertSubscription {
  plan: PlanId;
  intent: "Rent" | "Buy" | "Share";
  cities: string[];
  types: string[];
  maxBudget: number | null;
  whatsapp: string;
  startedAt: string;
  transactionId: string;
}

export interface Settings {
  unlockPrice: number;
  monthlyPrice: number;
  quarterlyPrice: number;
}

export const DEFAULT_SETTINGS: Settings = { unlockPrice: 4.99, monthlyPrice: 9.99, quarterlyPrice: 24.99 };

export const SEED_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-101",
    propertyId: "ulg-001",
    name: "Sophie Lange",
    email: "sophie.lange@example.com",
    phone: "+49 000 000 000",
    message: "Hello, is the apartment still available from October? I work in Mitte and could view it any evening this week.",
    createdAt: daysAgo(0),
    status: "New",
    mine: false,
  },
  {
    id: "enq-102",
    propertyId: "ulg-001",
    name: "Daniel Okafor",
    email: "d.okafor@example.com",
    phone: "+49 000 000 000",
    message: "We are a couple relocating from Amsterdam. Would a 24-month lease be possible? Schufa and payslips ready.",
    createdAt: daysAgo(1),
    status: "Replied",
    reply: "Thanks Daniel, a 24-month lease works. Could you do Thursday at 18:30 for a viewing?",
    mine: false,
  },
  {
    id: "enq-103",
    propertyId: "ulg-010",
    name: "Marta Kowalska",
    email: "marta.k@example.com",
    phone: "+49 000 000 000",
    message: "Is the kitchen fully fitted and are pets allowed? I have a small, quiet cat.",
    createdAt: daysAgo(2),
    status: "New",
    mine: false,
  },
  {
    id: "enq-104",
    propertyId: "ulg-017",
    name: "Felix Hartmann",
    email: "felix.hartmann@example.com",
    phone: "+49 000 000 000",
    message: "Could you share the energy certificate and the approximate utility costs per month?",
    createdAt: daysAgo(3),
    status: "New",
    mine: false,
  },
  {
    id: "enq-105",
    propertyId: "ulg-002",
    name: DEMO_TENANT.name,
    email: DEMO_TENANT.email,
    phone: DEMO_TENANT.phone,
    message: "Hi, I start a new job in Berlin on 1 October. Is Anmeldung definitely possible at this address?",
    createdAt: daysAgo(4),
    status: "Replied",
    reply: "Yes, Anmeldung is possible and we provide the Wohnungsgeberbestätigung at move-in.",
    mine: true,
  },
];

export const SEED_UNLOCKS: Unlock[] = [
  {
    propertyId: "ulg-009",
    transactionId: "UFT-317604",
    amount: 4.99,
    createdAt: daysAgo(5),
    expiresAt: daysAgo(-25),
  },
];

export const SEED_SAVED = ["ulg-002", "ulg-009", "ulg-017"];

export const PAYMENTS: Payment[] = [
  { id: "UFT-918273", customer: "Sophie Lange", product: "Contact unlock", method: "Card", amount: 4.99, createdAt: daysAgo(0), status: "Succeeded" },
  { id: "UFT-918102", customer: "Arjun Mehta", product: "WhatsApp alerts, Quarterly", method: "PayPal", amount: 24.99, createdAt: daysAgo(0), status: "Succeeded" },
  { id: "UFT-917885", customer: "Hanna Vogel", product: "Contact unlock", method: "Klarna", amount: 4.99, createdAt: daysAgo(1), status: "Succeeded" },
  { id: "UFT-917640", customer: "Spree Homes GmbH", product: "Featured listing, 14 days", method: "SEPA", amount: 49.0, createdAt: daysAgo(1), status: "Succeeded" },
  { id: "UFT-917311", customer: "Daniel Okafor", product: "WhatsApp alerts, Monthly", method: "Card", amount: 9.99, createdAt: daysAgo(2), status: "Succeeded" },
  { id: "UFT-916998", customer: "Leonie Schmitt", product: "Contact unlock", method: "PayPal", amount: 4.99, createdAt: daysAgo(2), status: "Refunded" },
  { id: "UFT-916540", customer: "Isar Immobilien", product: "Partner fee, September", method: "SEPA", amount: 390.0, createdAt: daysAgo(3), status: "Succeeded" },
  { id: "UFT-916201", customer: "Mehmet Aydin", product: "Contact unlock", method: "Card", amount: 4.99, createdAt: daysAgo(3), status: "Failed" },
  { id: "UFT-915876", customer: "Clara Neumann", product: "WhatsApp alerts, Quarterly", method: "Klarna", amount: 24.99, createdAt: daysAgo(4), status: "Succeeded" },
  { id: "UFT-915432", customer: "Tom Richter", product: "Contact unlock", method: "SEPA", amount: 4.99, createdAt: daysAgo(5), status: "Succeeded" },
];

export const USERS = [
  { name: "Lukas Meyer", email: "lukas.meyer@example.com", role: "Tenant", city: "Berlin", joined: daysAgo(40), status: "Active", verified: true },
  { name: "Katrin Hoffmann", email: "k.hoffmann@example.com", role: "Landlord", city: "Berlin", joined: daysAgo(210), status: "Active", verified: true },
  { name: "Spree Homes GmbH", email: "lettings@example.com", role: "Agent", city: "Berlin", joined: daysAgo(380), status: "Active", verified: true },
  { name: "Lena Fischer", email: "lena.fischer@example.com", role: "Flatmate", city: "Munich", joined: daysAgo(6), status: "ID check pending", verified: false },
  { name: "Isar Immobilien", email: "sales@example.com", role: "Agent", city: "Munich", joined: daysAgo(520), status: "Active", verified: true },
  { name: "Arjun Mehta", email: "arjun.mehta@example.com", role: "Tenant", city: "Frankfurt", joined: daysAgo(18), status: "Active", verified: true },
  { name: "Rhein Venues", email: "events@example.com", role: "Partner", city: "Cologne", joined: daysAgo(290), status: "Active", verified: true },
  { name: "Mehmet Aydin", email: "m.aydin@example.com", role: "Tenant", city: "Hamburg", joined: daysAgo(3), status: "Suspended", verified: false },
  { name: "Tim Albers", email: "tim.albers@example.com", role: "Referral", city: "Hamburg", joined: daysAgo(75), status: "Active", verified: true },
  { name: "Elif Yilmaz", email: "elif.yilmaz@example.com", role: "Flatmate", city: "Cologne", joined: daysAgo(22), status: "ID check pending", verified: false },
] as const;

export const WHATSAPP_TEMPLATES = [
  { name: "new_listing_match", category: "Utility", languages: "German, English", status: "Approved", sent: 18420, delivered: 97.8, read: 81.2 },
  { name: "price_drop_alert", category: "Utility", languages: "German, English", status: "Approved", sent: 6310, delivered: 98.1, read: 76.4 },
  { name: "viewing_reminder", category: "Utility", languages: "German", status: "Approved", sent: 2944, delivered: 99.0, read: 88.9 },
  { name: "subscription_renewal", category: "Utility", languages: "German, English", status: "Approved", sent: 1187, delivered: 96.5, read: 70.3 },
  { name: "weekend_open_house", category: "Marketing", languages: "German", status: "In review", sent: 0, delivered: 0, read: 0 },
] as const;

export const PARTNERS = [
  { name: "Isar Immobilien", method: "REST API", listings: 214, lastSync: "4 minutes ago", status: "Healthy" },
  { name: "Urban Workspace Partners", method: "REST API", listings: 87, lastSync: "12 minutes ago", status: "Healthy" },
  { name: "Nordhafen Makler", method: "OpenImmo XML feed", listings: 132, lastSync: "1 hour ago", status: "Healthy" },
  { name: "Rhein Venues", method: "CSV upload", listings: 19, lastSync: "2 days ago", status: "Delayed" },
  { name: "Skyline Commercial", method: "OpenImmo XML feed", listings: 58, lastSync: "6 hours ago", status: "Error" },
] as const;

/** Month-to-date September figure; session payments are added on top in the dashboard. */
export const REVENUE_MONTHS = [
  { month: "Apr", amount: 18420 },
  { month: "May", amount: 21960 },
  { month: "Jun", amount: 24310 },
  { month: "Jul", amount: 27850 },
  { month: "Aug", amount: 31240 },
  { month: "Sep", amount: 19870 },
];

export const REVENUE_SOURCES = [
  { source: "Contact unlocks", share: 0.41 },
  { source: "WhatsApp alerts", share: 0.27 },
  { source: "Featured listings", share: 0.19 },
  { source: "Partner fees", share: 0.13 },
];

export const PLATFORM_TOTALS = {
  users: 12480,
  contactUnlocksThisMonth: 1284,
  openReports: 7,
};

export const REPORT_REASONS = [
  "Listing looks like a scam",
  "Property is no longer available",
  "Photos or details are misleading",
  "Publisher asked for payment outside the platform",
  "Other",
];

export const REJECT_REASONS = [
  "Photos do not match the property",
  "Price looks unrealistic for the area",
  "Missing or incomplete address details",
  "Publisher identity could not be verified",
  "Duplicate of an existing listing",
];
