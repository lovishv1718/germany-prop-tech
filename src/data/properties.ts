export type Intent = "Rent" | "Buy" | "Share";

export type PropertyType =
  | "Studio"
  | "1BHK"
  | "2BHK"
  | "3BHK"
  | "Apartment"
  | "Individual House"
  | "Room Share"
  | "Flat Share"
  | "Office Space"
  | "Store"
  | "Event Hall";

export type City = "Berlin" | "Munich" | "Hamburg" | "Frankfurt" | "Cologne" | "Stuttgart";

export type PublisherType = "Landlord" | "Agent" | "Flatmate" | "Referral" | "Partner";

export type ListingStatus = "Draft" | "Pending" | "Published" | "Rejected";

/** How the price should be read: monthly rent, per-day booking, or total sale price. */
export type PricePeriod = "month" | "day" | "total";

export interface Property {
  id: string;
  title: string;
  description: string;
  intent: Intent;
  type: PropertyType;
  city: City;
  state: string;
  locality: string;
  price: number;
  pricePeriod: PricePeriod;
  bedrooms: number;
  sizeSqm: number;
  furnished: boolean;
  amenities: string[];
  availableFrom: string;
  lat: number;
  lng: number;
  images: string[];
  publisherType: PublisherType;
  verified: boolean;
  status: ListingStatus;
  publisherName: string;
  publisherPhone: string;
  publisherEmail: string;
}

export const INTENTS: Intent[] = ["Rent", "Buy", "Share"];

export const PROPERTY_TYPES: PropertyType[] = [
  "Studio",
  "1BHK",
  "2BHK",
  "3BHK",
  "Apartment",
  "Individual House",
  "Room Share",
  "Flat Share",
  "Office Space",
  "Store",
  "Event Hall",
];

export const CITIES: City[] = ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart"];

export const CITY_STATE: Record<City, string> = {
  Berlin: "Berlin",
  Munich: "Bavaria",
  Hamburg: "Hamburg",
  Frankfurt: "Hesse",
  Cologne: "North Rhine-Westphalia",
  Stuttgart: "Baden-Württemberg",
};

export const PUBLISHER_TYPES: PublisherType[] = ["Landlord", "Agent", "Flatmate", "Referral", "Partner"];

export const LISTING_STATUSES: ListingStatus[] = ["Draft", "Pending", "Published", "Rejected"];

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const IMAGES = {
  living: [
    "1502672260266-1c1ef2d93688",
    "1522708323590-d24dbb6b0267",
    "1560448204-e02f11c3d0e2",
    "1493809842364-78817add7ffb",
    "1484154218962-a197022b5858",
    "1505691938895-1758d7feb511",
    "1540518614846-7eded433c457",
    "1556911220-bff31c812dba",
    "1586023492125-27b2c045efd7",
    "1600607687939-ce8a6c25118c",
    "1600566753190-17f0baa2a6c3",
    "1560185007-cde436f6a4d0",
  ].map(img),
  house: [
    "1512917774080-9991f1c4c750",
    "1600596542815-ffad4c1539a9",
    "1600585154340-be6161a56a0c",
    "1564013799919-ab600027ffc6",
  ].map(img),
  office: [
    "1497366216548-37526070297c",
    "1497366811353-6870744d04b2",
    "1524758631624-e2822e304c36",
    "1497215728101-856f4ea42174",
  ].map(img),
  store: [
    "1441986300917-64674bd600d8",
    "1604719312566-8912e9227c6a",
    "1555529669-e69e7aa0ba9a",
    "1567401893414-76b7b1e5a7a5",
  ].map(img),
  event: [
    "1519167758481-83f550bb49b3",
    "1464366400600-7168b8af9bc3",
    "1511795409834-ef04bbd61622",
    "1505236858219-8359eb29e329",
  ].map(img),
};

/** Picks 4 images for a listing, rotating through the pool so neighbours don't look identical. */
function imagesFor(type: PropertyType, seed: number): string[] {
  const pool =
    type === "Individual House"
      ? [...IMAGES.house, ...IMAGES.living]
      : type === "Office Space"
        ? IMAGES.office
        : type === "Store"
          ? IMAGES.store
          : type === "Event Hall"
            ? IMAGES.event
            : IMAGES.living;
  return Array.from({ length: 4 }, (_, i) => pool[(seed * 3 + i) % pool.length]);
}

type Seed = Omit<Property, "id" | "state" | "images" | "pricePeriod"> & { pricePeriod?: PricePeriod };

const seeds: Seed[] = [
  // Berlin
  {
    title: "Bright 2BHK near Kollwitzplatz",
    description:
      "Sunny Altbau apartment with high ceilings, oak floors and a quiet courtyard-facing bedroom. Five minutes to the U2 and the Saturday farmers' market.",
    intent: "Rent", type: "2BHK", city: "Berlin", locality: "Prenzlauer Berg",
    price: 1850, bedrooms: 2, sizeSqm: 78, furnished: true,
    amenities: ["Balcony", "Elevator", "Washing machine", "Fibre internet", "Bike storage"],
    availableFrom: "2026-10-01", lat: 52.5362, lng: 13.4178,
    publisherType: "Landlord", verified: true, status: "Published",
    publisherName: "Katrin Hoffmann", publisherPhone: "+49 30 5501 2231", publisherEmail: "k.hoffmann@example.com",
  },
  {
    title: "Furnished Studio in Kreuzberg",
    description:
      "Compact, fully furnished studio by the Landwehrkanal. Ideal for professionals relocating to Berlin, with Anmeldung possible.",
    intent: "Rent", type: "Studio", city: "Berlin", locality: "Kreuzberg",
    price: 1150, bedrooms: 0, sizeSqm: 34, furnished: true,
    amenities: ["Anmeldung possible", "Fibre internet", "Fitted kitchen"],
    availableFrom: "2026-09-20", lat: 52.4986, lng: 13.4034,
    publisherType: "Agent", verified: true, status: "Published",
    publisherName: "Spree Homes GmbH", publisherPhone: "+49 30 4412 8890", publisherEmail: "lettings@example.com",
  },
  {
    title: "Room in Creative Flat Share, Friedrichshain",
    description:
      "Join three friendly flatmates (designer, developer, PhD student) in a spacious WG near Boxhagener Platz. Shared living room and large kitchen.",
    intent: "Share", type: "Flat Share", city: "Berlin", locality: "Friedrichshain",
    price: 690, bedrooms: 1, sizeSqm: 18, furnished: true,
    amenities: ["Shared kitchen", "Wi-Fi included", "Washing machine", "Balcony"],
    availableFrom: "2026-10-15", lat: 52.5155, lng: 13.454,
    publisherType: "Flatmate", verified: true, status: "Published",
    publisherName: "Jonas Weber", publisherPhone: "+49 176 2210 4478", publisherEmail: "jonas.weber@example.com",
  },
  {
    title: "Modern Office Space at Potsdamer Platz",
    description:
      "Turn-key office floor with 24 desks, two meeting rooms and a skyline terrace. Flexible lease terms from 12 months.",
    intent: "Rent", type: "Office Space", city: "Berlin", locality: "Mitte",
    price: 6400, bedrooms: 0, sizeSqm: 220, furnished: true,
    amenities: ["Meeting rooms", "24/7 access", "Reception", "Air conditioning", "Parking"],
    availableFrom: "2026-11-01", lat: 52.5096, lng: 13.376,
    publisherType: "Partner", verified: true, status: "Published",
    publisherName: "Urban Workspace Partners", publisherPhone: "+49 30 9900 1200", publisherEmail: "berlin@example.com",
  },

  // Munich
  {
    title: "Family House with Garden in Bogenhausen",
    description:
      "Detached family home on a quiet, tree-lined street near the Isar. Renovated in 2022 with underfloor heating and a south-facing garden.",
    intent: "Buy", type: "Individual House", city: "Munich", locality: "Bogenhausen",
    price: 1890000, bedrooms: 5, sizeSqm: 210, furnished: false,
    amenities: ["Garden", "Garage", "Underfloor heating", "Cellar", "Solar panels"],
    availableFrom: "2027-01-01", lat: 48.15, lng: 11.62,
    publisherType: "Agent", verified: true, status: "Published",
    publisherName: "Isar Immobilien", publisherPhone: "+49 89 2233 4100", publisherEmail: "sales@example.com",
  },
  {
    title: "3BHK with Balcony in Schwabing",
    description:
      "Spacious family apartment steps from the English Garden. Three bedrooms, two bathrooms and a west-facing balcony for evening sun.",
    intent: "Rent", type: "3BHK", city: "Munich", locality: "Schwabing",
    price: 3200, bedrooms: 3, sizeSqm: 105, furnished: false,
    amenities: ["Balcony", "Elevator", "Two bathrooms", "Cellar", "Underground parking"],
    availableFrom: "2026-11-01", lat: 48.165, lng: 11.586,
    publisherType: "Landlord", verified: true, status: "Published",
    publisherName: "Michael Bauer", publisherPhone: "+49 89 6612 7730", publisherEmail: "m.bauer@example.com",
  },
  {
    title: "Room Share near LMU",
    description:
      "Furnished room in a two-person apartment, a short walk from the university. Perfect for students or young professionals.",
    intent: "Share", type: "Room Share", city: "Munich", locality: "Maxvorstadt",
    price: 820, bedrooms: 1, sizeSqm: 22, furnished: true,
    amenities: ["Wi-Fi included", "Shared kitchen", "Near U-Bahn"],
    availableFrom: "2026-10-01", lat: 48.1508, lng: 11.5805,
    publisherType: "Flatmate", verified: false, status: "Pending",
    publisherName: "Lena Fischer", publisherPhone: "+49 157 3344 9021", publisherEmail: "lena.fischer@example.com",
  },
  {
    title: "Retail Store on Sendlinger Straße",
    description:
      "High-footfall retail unit in Munich's old town with large display windows, storage room and a staff kitchen.",
    intent: "Rent", type: "Store", city: "Munich", locality: "Altstadt",
    price: 9800, bedrooms: 0, sizeSqm: 140, furnished: false,
    amenities: ["Display windows", "Storage room", "Air conditioning", "Accessible entrance"],
    availableFrom: "2027-02-01", lat: 48.1352, lng: 11.57,
    publisherType: "Partner", verified: true, status: "Published",
    publisherName: "Bavaria Retail Estates", publisherPhone: "+49 89 5500 3300", publisherEmail: "retail@example.com",
  },

  // Hamburg
  {
    title: "Harbour-view Apartment in HafenCity",
    description:
      "Contemporary apartment with floor-to-ceiling windows overlooking the Elbe. Concierge service and underground parking included.",
    intent: "Buy", type: "Apartment", city: "Hamburg", locality: "HafenCity",
    price: 875000, bedrooms: 2, sizeSqm: 92, furnished: false,
    amenities: ["Water view", "Concierge", "Elevator", "Underground parking", "Loggia"],
    availableFrom: "2026-12-01", lat: 53.5413, lng: 9.997,
    publisherType: "Agent", verified: true, status: "Published",
    publisherName: "Nordhafen Makler", publisherPhone: "+49 40 3300 7812", publisherEmail: "info@example.com",
  },
  {
    title: "Cosy 1BHK in Eimsbüttel",
    description:
      "Well-kept one-bedroom apartment in a leafy residential area with cafés, parks and excellent U-Bahn connections.",
    intent: "Rent", type: "1BHK", city: "Hamburg", locality: "Eimsbüttel",
    price: 1290, bedrooms: 1, sizeSqm: 48, furnished: false,
    amenities: ["Fitted kitchen", "Bathtub", "Bike storage", "Cellar"],
    availableFrom: "2026-10-15", lat: 53.575, lng: 9.953,
    publisherType: "Landlord", verified: true, status: "Published",
    publisherName: "Sabine Krüger", publisherPhone: "+49 40 8812 4455", publisherEmail: "s.krueger@example.com",
  },
  {
    title: "Industrial Event Hall in Sternschanze",
    description:
      "Converted warehouse for up to 250 guests. In-house sound system, lighting rig and catering kitchen. Priced per day.",
    intent: "Rent", type: "Event Hall", city: "Hamburg", locality: "Sternschanze",
    price: 2400, pricePeriod: "day", bedrooms: 0, sizeSqm: 380, furnished: true,
    amenities: ["Sound system", "Lighting rig", "Catering kitchen", "Capacity 250"],
    availableFrom: "2026-09-25", lat: 53.5635, lng: 9.9655,
    publisherType: "Referral", verified: true, status: "Published",
    publisherName: "Tim Albers", publisherPhone: "+49 171 5566 2201", publisherEmail: "tim.albers@example.com",
  },
  {
    title: "Flat Share Room in Ottensen",
    description:
      "Bright room in a relaxed three-person WG close to the Elbe beach. Looking for a tidy, sociable flatmate.",
    intent: "Share", type: "Flat Share", city: "Hamburg", locality: "Ottensen",
    price: 750, bedrooms: 1, sizeSqm: 20, furnished: false,
    amenities: ["Shared kitchen", "Balcony", "Wi-Fi included"],
    availableFrom: "2026-11-01", lat: 53.552, lng: 9.928,
    publisherType: "Flatmate", verified: false, status: "Draft",
    publisherName: "Mia Schulz", publisherPhone: "+49 152 7781 3390", publisherEmail: "mia.schulz@example.com",
  },

  // Frankfurt
  {
    title: "Executive 2BHK in Westend",
    description:
      "Elegant furnished apartment for executives, walking distance to the banking district. Includes weekly cleaning.",
    intent: "Rent", type: "2BHK", city: "Frankfurt", locality: "Westend",
    price: 2450, bedrooms: 2, sizeSqm: 85, furnished: true,
    amenities: ["Weekly cleaning", "Elevator", "Balcony", "Fibre internet", "Parking"],
    availableFrom: "2026-10-01", lat: 50.118, lng: 8.66,
    publisherType: "Agent", verified: true, status: "Published",
    publisherName: "Main Residential", publisherPhone: "+49 69 2455 1180", publisherEmail: "rentals@example.com",
  },
  {
    title: "Office Floor near Bankenviertel",
    description:
      "Full office floor in a Class A tower with panoramic views, 60 workstations and direct S-Bahn access.",
    intent: "Rent", type: "Office Space", city: "Frankfurt", locality: "Innenstadt",
    price: 14500, bedrooms: 0, sizeSqm: 480, furnished: true,
    amenities: ["Meeting rooms", "24/7 access", "Reception", "Air conditioning", "Canteen"],
    availableFrom: "2027-01-01", lat: 50.1109, lng: 8.672,
    publisherType: "Partner", verified: true, status: "Published",
    publisherName: "Skyline Commercial", publisherPhone: "+49 69 7700 4400", publisherEmail: "office@example.com",
  },
  {
    title: "Investor Studio in Sachsenhausen",
    description:
      "Rented-out studio with stable yield in a popular neighbourhood near the Museumsufer.",
    intent: "Buy", type: "Studio", city: "Frankfurt", locality: "Sachsenhausen",
    price: 289000, bedrooms: 0, sizeSqm: 32, furnished: false,
    amenities: ["Currently rented", "Cellar", "Near tram"],
    availableFrom: "2026-12-15", lat: 50.1, lng: 8.685,
    publisherType: "Landlord", verified: false, status: "Rejected",
    publisherName: "Peter Wagner", publisherPhone: "+49 69 3321 9087", publisherEmail: "p.wagner@example.com",
  },
  {
    title: "Renovated 3BHK in Nordend",
    description:
      "Fully renovated Gründerzeit apartment with stucco ceilings, new bathroom and a sunny balcony over a quiet street.",
    intent: "Buy", type: "3BHK", city: "Frankfurt", locality: "Nordend",
    price: 749000, bedrooms: 3, sizeSqm: 110, furnished: false,
    amenities: ["Balcony", "Stucco ceilings", "New bathroom", "Cellar"],
    availableFrom: "2026-11-15", lat: 50.126, lng: 8.692,
    publisherType: "Referral", verified: true, status: "Published",
    publisherName: "Anna Becker", publisherPhone: "+49 160 4432 1876", publisherEmail: "anna.becker@example.com",
  },

  // Cologne
  {
    title: "Altbau Apartment in Belgisches Viertel",
    description:
      "Charming apartment in Cologne's trendiest quarter, surrounded by boutiques and cafés. Original wooden floors and tall windows.",
    intent: "Rent", type: "Apartment", city: "Cologne", locality: "Neustadt-Nord",
    price: 1650, bedrooms: 2, sizeSqm: 74, furnished: false,
    amenities: ["Wooden floors", "Fitted kitchen", "Bike storage", "Cellar"],
    availableFrom: "2026-10-01", lat: 50.94, lng: 6.938,
    publisherType: "Landlord", verified: true, status: "Published",
    publisherName: "Thomas Richter", publisherPhone: "+49 221 7788 2210", publisherEmail: "t.richter@example.com",
  },
  {
    title: "Room Share in Ehrenfeld",
    description:
      "Affordable furnished room in a lively neighbourhood full of street art, bars and studios.",
    intent: "Share", type: "Room Share", city: "Cologne", locality: "Ehrenfeld",
    price: 560, bedrooms: 1, sizeSqm: 16, furnished: true,
    amenities: ["Wi-Fi included", "Shared kitchen", "Near S-Bahn"],
    availableFrom: "2026-09-30", lat: 50.95, lng: 6.918,
    publisherType: "Flatmate", verified: false, status: "Published",
    publisherName: "Elif Yilmaz", publisherPhone: "+49 178 9900 3312", publisherEmail: "elif.yilmaz@example.com",
  },
  {
    title: "Townhouse in Lindenthal",
    description:
      "Elegant townhouse near the Stadtwald with a private garden, fireplace and converted attic office.",
    intent: "Buy", type: "Individual House", city: "Cologne", locality: "Lindenthal",
    price: 1190000, bedrooms: 4, sizeSqm: 175, furnished: false,
    amenities: ["Garden", "Fireplace", "Attic office", "Garage"],
    availableFrom: "2027-03-01", lat: 50.93, lng: 6.905,
    publisherType: "Agent", verified: true, status: "Pending",
    publisherName: "Rheinland Estates", publisherPhone: "+49 221 4400 5500", publisherEmail: "koeln@example.com",
  },
  {
    title: "Riverside Event Hall in Deutz",
    description:
      "Glass-fronted venue on the Rhine with Cathedral views. Suited to conferences, weddings and product launches. Priced per day.",
    intent: "Rent", type: "Event Hall", city: "Cologne", locality: "Deutz",
    price: 3900, pricePeriod: "day", bedrooms: 0, sizeSqm: 520, furnished: true,
    amenities: ["River view", "AV equipment", "Catering kitchen", "Capacity 400", "Parking"],
    availableFrom: "2026-10-10", lat: 50.938, lng: 6.975,
    publisherType: "Partner", verified: true, status: "Published",
    publisherName: "Rhein Venues", publisherPhone: "+49 221 1200 8800", publisherEmail: "events@example.com",
  },

  // Stuttgart
  {
    title: "Central 1BHK near Schlossplatz",
    description:
      "Modern one-bedroom apartment in the heart of Stuttgart, steps from Königstraße shopping and the main station.",
    intent: "Rent", type: "1BHK", city: "Stuttgart", locality: "Mitte",
    price: 1180, bedrooms: 1, sizeSqm: 45, furnished: true,
    amenities: ["Elevator", "Fitted kitchen", "Fibre internet"],
    availableFrom: "2026-10-01", lat: 48.7784, lng: 9.18,
    publisherType: "Landlord", verified: true, status: "Published",
    publisherName: "Julia Neumann", publisherPhone: "+49 711 2233 6600", publisherEmail: "j.neumann@example.com",
  },
  {
    title: "Boutique Store in Stuttgart-West",
    description:
      "Corner shop unit with a large window front on a busy neighbourhood street. Previously a concept store.",
    intent: "Rent", type: "Store", city: "Stuttgart", locality: "West",
    price: 3200, bedrooms: 0, sizeSqm: 85, furnished: false,
    amenities: ["Corner unit", "Display windows", "Storage room"],
    availableFrom: "2026-12-01", lat: 48.775, lng: 9.155,
    publisherType: "Referral", verified: true, status: "Published",
    publisherName: "Felix Braun", publisherPhone: "+49 162 5543 7719", publisherEmail: "felix.braun@example.com",
  },
  {
    title: "2BHK with Garden in Degerloch",
    description:
      "Ground-floor apartment with private garden in a green, family-friendly district above the city.",
    intent: "Buy", type: "2BHK", city: "Stuttgart", locality: "Degerloch",
    price: 545000, bedrooms: 2, sizeSqm: 80, furnished: false,
    amenities: ["Private garden", "Parking space", "Cellar", "Accessible"],
    availableFrom: "2027-01-15", lat: 48.748, lng: 9.17,
    publisherType: "Agent", verified: true, status: "Draft",
    publisherName: "Schwaben Wohnen", publisherPhone: "+49 711 9988 1100", publisherEmail: "verkauf@example.com",
  },
  {
    title: "Hillside Villa in Killesberg",
    description:
      "Architect-designed villa with panoramic city views, a pool and a large terrace in one of Stuttgart's most exclusive areas.",
    intent: "Buy", type: "Individual House", city: "Stuttgart", locality: "Killesberg",
    price: 2350000, bedrooms: 5, sizeSqm: 240, furnished: false,
    amenities: ["City view", "Pool", "Terrace", "Double garage", "Smart home"],
    availableFrom: "2027-02-01", lat: 48.796, lng: 9.17,
    publisherType: "Partner", verified: true, status: "Published",
    publisherName: "Premium Estates Süd", publisherPhone: "+49 711 5000 2020", publisherEmail: "premium@example.com",
  },
];

export const properties: Property[] = seeds.map((seed, i) => ({
  ...seed,
  id: `ulg-${String(i + 1).padStart(3, "0")}`,
  state: CITY_STATE[seed.city],
  pricePeriod: seed.pricePeriod ?? (seed.intent === "Buy" ? "total" : "month"),
  images: imagesFor(seed.type, i),
}));

export function formatPrice(p: Pick<Property, "price" | "pricePeriod">): string {
  const amount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(p.price);
  return p.pricePeriod === "month" ? `${amount} / month` : p.pricePeriod === "day" ? `${amount} / day` : amount;
}
