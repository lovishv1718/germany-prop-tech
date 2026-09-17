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

export type Category = "Residential" | "Commercial";

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
  publisherId: string;
  /** ISO date the listing was submitted or published; drives "newest" sorting. */
  listedAt: string;
  views: number;
  /** A published listing the publisher has temporarily hidden from search. */
  paused: boolean;
  rejectReason?: string;
}

export const INTENTS: Intent[] = ["Rent", "Buy", "Share"];

export const RESIDENTIAL_TYPES: PropertyType[] = [
  "Studio",
  "1BHK",
  "2BHK",
  "3BHK",
  "Apartment",
  "Individual House",
  "Room Share",
  "Flat Share",
];

export const COMMERCIAL_TYPES: PropertyType[] = ["Office Space", "Store", "Event Hall"];

export const PROPERTY_TYPES: PropertyType[] = [...RESIDENTIAL_TYPES, ...COMMERCIAL_TYPES];

export const categoryOf = (type: PropertyType): Category =>
  COMMERCIAL_TYPES.includes(type) ? "Commercial" : "Residential";

export const TYPE_DESCRIPTIONS: Record<PropertyType, string> = {
  Studio: "Open-plan living for one, ideal for relocations",
  "1BHK": "One bedroom with a separate living area",
  "2BHK": "Two bedrooms for couples and small families",
  "3BHK": "Three bedrooms with room to grow",
  Apartment: "Classic Altbau and modern flats of every size",
  "Individual House": "Detached houses, townhouses and villas",
  "Room Share": "A private room in a shared apartment",
  "Flat Share": "Join a WG with like-minded flatmates",
  "Office Space": "Serviced desks to full office floors",
  Store: "High-street retail and boutique units",
  "Event Hall": "Venues for conferences, weddings and launches",
};

export const CITIES: City[] = ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart"];

export const CITY_STATE: Record<City, string> = {
  Berlin: "Berlin",
  Munich: "Bavaria",
  Hamburg: "Hamburg",
  Frankfurt: "Hesse",
  Cologne: "North Rhine-Westphalia",
  Stuttgart: "Baden-Württemberg",
};

/** Districts offered in the listing form, with an approximate centre point for the map. */
export const DISTRICTS: Record<City, { name: string; lat: number; lng: number }[]> = {
  Berlin: [
    { name: "Mitte", lat: 52.52, lng: 13.405 },
    { name: "Prenzlauer Berg", lat: 52.5362, lng: 13.4178 },
    { name: "Kreuzberg", lat: 52.4986, lng: 13.4034 },
    { name: "Friedrichshain", lat: 52.5155, lng: 13.454 },
    { name: "Charlottenburg", lat: 52.5167, lng: 13.3041 },
    { name: "Neukölln", lat: 52.4811, lng: 13.4353 },
  ],
  Munich: [
    { name: "Altstadt", lat: 48.1372, lng: 11.5756 },
    { name: "Schwabing", lat: 48.165, lng: 11.586 },
    { name: "Maxvorstadt", lat: 48.1508, lng: 11.5705 },
    { name: "Bogenhausen", lat: 48.15, lng: 11.62 },
    { name: "Haidhausen", lat: 48.1296, lng: 11.5947 },
    { name: "Sendling", lat: 48.1177, lng: 11.5456 },
  ],
  Hamburg: [
    { name: "HafenCity", lat: 53.5413, lng: 9.997 },
    { name: "Eimsbüttel", lat: 53.575, lng: 9.953 },
    { name: "Sternschanze", lat: 53.5635, lng: 9.9655 },
    { name: "Ottensen", lat: 53.552, lng: 9.928 },
    { name: "Winterhude", lat: 53.5967, lng: 10.0006 },
    { name: "St. Georg", lat: 53.5534, lng: 10.0144 },
  ],
  Frankfurt: [
    { name: "Innenstadt", lat: 50.1109, lng: 8.682 },
    { name: "Westend", lat: 50.118, lng: 8.66 },
    { name: "Nordend", lat: 50.126, lng: 8.692 },
    { name: "Sachsenhausen", lat: 50.1, lng: 8.685 },
    { name: "Bornheim", lat: 50.1295, lng: 8.7111 },
    { name: "Bockenheim", lat: 50.1219, lng: 8.6474 },
  ],
  Cologne: [
    { name: "Altstadt-Nord", lat: 50.9413, lng: 6.9583 },
    { name: "Neustadt-Nord", lat: 50.94, lng: 6.938 },
    { name: "Ehrenfeld", lat: 50.95, lng: 6.918 },
    { name: "Deutz", lat: 50.938, lng: 6.975 },
    { name: "Lindenthal", lat: 50.93, lng: 6.905 },
    { name: "Nippes", lat: 50.9661, lng: 6.9525 },
  ],
  Stuttgart: [
    { name: "Mitte", lat: 48.7784, lng: 9.18 },
    { name: "West", lat: 48.775, lng: 9.155 },
    { name: "Nord", lat: 48.796, lng: 9.17 },
    { name: "Degerloch", lat: 48.748, lng: 9.17 },
    { name: "Bad Cannstatt", lat: 48.8049, lng: 9.2148 },
    { name: "Vaihingen", lat: 48.7298, lng: 9.1087 },
  ],
};

export const PUBLISHER_TYPES: PublisherType[] = ["Landlord", "Agent", "Flatmate", "Referral", "Partner"];

export const LISTING_STATUSES: ListingStatus[] = ["Draft", "Pending", "Published", "Rejected"];

export const AMENITY_OPTIONS = [
  "Balcony",
  "Elevator",
  "Fitted kitchen",
  "Washing machine",
  "Fibre internet",
  "Parking",
  "Cellar",
  "Garden",
  "Bike storage",
  "Air conditioning",
  "Pets allowed",
  "Accessible",
  "Anmeldung possible",
  "Meeting rooms",
  "24/7 access",
  "Display windows",
];

/** The signed-in demo publisher. Listings with this publisherId appear in the Publisher dashboard. */
export const DEMO_PUBLISHER = {
  id: "pub-katrin-hoffmann",
  name: "Katrin Hoffmann",
  type: "Landlord" as PublisherType,
  phone: "+49 30 5501 2231",
  email: "k.hoffmann@example.com",
};

export const DEMO_TENANT = {
  name: "Lukas Meyer",
  email: "lukas.meyer@example.com",
  phone: "+49 151 2345 6789",
};

const img = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

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
  ].map((id) => img(id)),
  house: [
    "1512917774080-9991f1c4c750",
    "1600596542815-ffad4c1539a9",
    "1600585154340-be6161a56a0c",
    "1564013799919-ab600027ffc6",
  ].map((id) => img(id)),
  office: [
    "1497366216548-37526070297c",
    "1497366811353-6870744d04b2",
    "1524758631624-e2822e304c36",
    "1497215728101-856f4ea42174",
  ].map((id) => img(id)),
  store: [
    "1441986300917-64674bd600d8",
    "1604719312566-8912e9227c6a",
    "1555529669-e69e7aa0ba9a",
    "1567401893414-76b7b1e5a7a5",
  ].map((id) => img(id)),
  event: [
    "1519167758481-83f550bb49b3",
    "1464366400600-7168b8af9bc3",
    "1511795409834-ef04bbd61622",
    "1505236858219-8359eb29e329",
  ].map((id) => img(id)),
};

export const CITY_IMAGES: Record<City, string> = {
  Berlin: img("1560969184-10fe8719e047", 800),
  Munich: img("1595867818082-083862f3d630", 800),
  Hamburg: img("1553547274-0df401ae03c9", 800),
  Frankfurt: img("1577185816322-21f2a92b1342", 800),
  Cologne: img("1600081925754-e32c08c14c19", 800),
  Stuttgart: img("1621978766642-2d64b83eed24", 800),
};

export const HERO_IMAGE = img("1649429710616-dad56ce9a076", 1600);
export const HERO_BACK_IMAGE = img("1759743918954-f373b0d8a891", 900);

const portrait = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=160&h=160&q=80`;
export const TESTIMONIAL_AVATAR = portrait("1580489944761-15a19d654956");
export const RATING_AVATARS = ["1594756154841-ac5d160dbf46", "1507003211169-0a1dd7228f2d", "1500648767791-00dcc994a43e"].map(portrait);

/** Picks 4 images for a listing, rotating through the pool so neighbours don't look identical. */
export function imagesFor(type: PropertyType, seed: number): string[] {
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

export const TYPE_IMAGES: Record<PropertyType, string> = Object.fromEntries(
  PROPERTY_TYPES.map((t, i) => [t, imagesFor(t, i + 1)[0]]),
) as Record<PropertyType, string>;

type Seed = Omit<Property, "id" | "state" | "images" | "pricePeriod" | "publisherId" | "listedAt" | "views" | "paused"> & {
  pricePeriod?: PricePeriod;
};

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
    publisherName: "Katrin Hoffmann", publisherPhone: "+49 30 5501 2231", publisherEmail: "k.hoffmann@example.com",
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
    publisherName: "Katrin Hoffmann", publisherPhone: "+49 30 5501 2231", publisherEmail: "k.hoffmann@example.com",
    rejectReason: "Photos appear to show a different building. Please upload current photos of the unit.",
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
    publisherType: "Landlord", verified: true, status: "Pending",
    publisherName: "Katrin Hoffmann", publisherPhone: "+49 30 5501 2231", publisherEmail: "k.hoffmann@example.com",
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

// Days before 16 Sep 2026 each seed was listed, and its view count, in seed order.
const LISTED_DAYS_AGO = [2, 1, 4, 9, 3, 12, 1, 6, 5, 8, 2, 3, 6, 14, 10, 4, 7, 11, 2, 18, 1, 13, 5, 20];
const VIEWS = [1248, 986, 642, 311, 2104, 877, 45, 402, 1533, 690, 268, 0, 915, 188, 36, 1120, 745, 530, 22, 344, 18, 207, 0, 1890];

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const TODAY = "2026-09-16";

export function daysAgo(n: number): string {
  const d = new Date(`${TODAY}T10:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

export const properties: Property[] = seeds.map((seed, i) => ({
  ...seed,
  id: `ulg-${String(i + 1).padStart(3, "0")}`,
  state: CITY_STATE[seed.city],
  pricePeriod: seed.pricePeriod ?? (seed.intent === "Buy" ? "total" : "month"),
  images: imagesFor(seed.type, i),
  publisherId: seed.publisherName === DEMO_PUBLISHER.name ? DEMO_PUBLISHER.id : `pub-${slug(seed.publisherName)}`,
  listedAt: daysAgo(LISTED_DAYS_AGO[i]),
  views: VIEWS[i],
  paused: false,
}));

/**
 * Static export can only serve pre-rendered routes, so new listings created in the demo
 * are assigned one of these reserved ids, each of which has a pre-rendered detail page.
 */
export const NEW_LISTING_SLOTS = Array.from({ length: 30 }, (_, i) => `new-${String(i + 1).padStart(2, "0")}`);

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eurCents = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export const formatEUR = (amount: number, cents = false) => (cents ? eurCents : eur).format(amount);

export const PERIOD_LABEL: Record<PricePeriod, string> = { month: "/ month", day: "/ day", total: "" };

/** Price with its period, e.g. "1.850 € / month". */
export function formatPrice(p: Pick<Property, "price" | "pricePeriod">): string {
  return `${formatEUR(p.price)} ${PERIOD_LABEL[p.pricePeriod]}`.trim();
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "Europe/Berlin" }).format(new Date(iso));
}

/** People are addressed by first name; agencies and partners by their company name. */
export function publisherShortName(p: Pick<Property, "publisherName" | "publisherType">): string {
  return ["Landlord", "Flatmate", "Referral"].includes(p.publisherType) ? p.publisherName.split(" ")[0] : p.publisherName;
}

export function bedroomsLabel(p: Pick<Property, "bedrooms" | "type">): string | null {
  if (COMMERCIAL_TYPES.includes(p.type) || p.type === "Studio") return null;
  if (p.bedrooms === 0) return "Studio layout";
  return `${p.bedrooms} ${p.bedrooms === 1 ? "bed" : "beds"}`;
}

const TRANSFER_TAX: Record<City, number> = {
  Berlin: 6,
  Munich: 3.5,
  Hamburg: 5.5,
  Frankfurt: 6,
  Cologne: 6.5,
  Stuttgart: 5,
};

/** Lease or purchase terms shown on the detail page, derived from the listing. */
export function termsFor(p: Property): { label: string; value: string }[] {
  if (p.intent === "Buy") {
    return [
      { label: "Buyer commission", value: p.publisherType === "Agent" ? "3.57% incl. VAT" : "None, direct sale" },
      { label: `Property transfer tax (${p.state})`, value: `${TRANSFER_TAX[p.city]}%` },
      { label: "Handover", value: `From ${formatDate(p.availableFrom)}` },
      { label: "Energy certificate", value: "Available on request" },
    ];
  }
  if (p.pricePeriod === "day") {
    return [
      { label: "Minimum booking", value: "1 day" },
      { label: "Security deposit", value: formatEUR(500) },
      { label: "Cleaning", value: "Included" },
      { label: "Earliest date", value: formatDate(p.availableFrom) },
    ];
  }
  const commercial = categoryOf(p.type) === "Commercial";
  const months = p.intent === "Share" ? 2 : 3;
  return [
    { label: "Deposit", value: `${formatEUR(p.price * months)} (${months} months)` },
    { label: "Minimum term", value: commercial ? "3 years" : p.intent === "Share" ? "6 months" : "12 months" },
    { label: "Utilities", value: p.intent === "Share" ? "Included in rent" : "Approx. 15% of rent, billed monthly" },
    { label: "Available from", value: formatDate(p.availableFrom) },
  ];
}
