import type { Metadata } from "next";
import { Alfa_Slab_One, Mulish } from "next/font/google";
import "./globals.css";

const alfaSlab = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ForecastIQ — Anticipez les pannes de revenus avant qu'elles arrivent",
  description:
    "Prédictions de ventes, détection d'anomalies et alertes préventives pour piloter votre business à l'avance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${alfaSlab.variable} ${mulish.variable}`}>
      <body style={{ background: "#f0fdf4", fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
