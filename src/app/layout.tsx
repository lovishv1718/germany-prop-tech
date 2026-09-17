import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat, Figtree } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ToastProvider } from "@/components/ui/Toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoleSwitcher from "@/components/layout/RoleSwitcher";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ulivger.com"),
  title: {
    default: "UFT Living Germany | Rent, buy and share verified properties",
    template: "%s | UFT Living Germany",
  },
  description:
    "Rent, buy and share verified homes, rooms and commercial spaces across Berlin, Munich, Hamburg, Frankfurt, Cologne and Stuttgart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-navy">
        <AppProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <RoleSwitcher />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
