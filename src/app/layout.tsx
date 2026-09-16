import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoleSwitcher from "@/components/layout/RoleSwitcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UFT Living Germany | Rent, Buy & Share Properties",
  description: "Rent, buy and share verified properties across Berlin, Munich, Hamburg, Frankfurt, Cologne and Stuttgart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-navy">
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <RoleSwitcher />
        </AppProvider>
      </body>
    </html>
  );
}
