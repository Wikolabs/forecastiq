import type { Metadata } from "next";
import { Alfa_Slab_One, Mulish } from "next/font/google";
import Script from "next/script";
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
      <Script id="cal-embed" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: '(function(C,A,L){var p=function(a,ar){a.q.push(ar);};var d=C.document;C.Cal=C.Cal||function(){var cal=C.Cal;var ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}if(ar[0]===L){const api=function(){p(api,arguments);};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["-",namespace,ar[2]]);}else p(cal,ar);return;}p(cal,ar);};})(window,"https://app.cal.com/embed/embed.js","init");Cal("init","wk30min",{origin:"https://app.cal.com"});Cal.ns["wk30min"]("ui",{"theme":"light","hideEventTypeDetails":false,"layout":"month_view"});' }} />
      </body>
    </html>
  );
}
