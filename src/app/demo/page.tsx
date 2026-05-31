"use client";
import { useState } from "react";

const PRODUCT = "ForecastIQ";

const PAL = {
  bg: "#ECFEFF",
  bg2: "#CFFAFE",
  surface: "rgba(0,0,0,0.035)",
  surfaceHover: "rgba(0,0,0,0.06)",
  border: "rgba(0,0,0,0.08)",
  txt1: "#0A1F22",
  txt2: "#3C5A60",
  txt3: "#7A92A0",
  accent: "#0E7490",
  accentSoft: "rgba(14,116,144,0.10)",
  accentBorder: "rgba(14,116,144,0.30)",
  accentGlow: "rgba(14,116,144,0.15)",
  navBg: "rgba(236,254,255,0.85)",
};

const EXAMPLE_FR = `Historique MRR mensuel (12 derniers mois)
Dec 2025 : 312k EUR
Jan 2026 : 318k EUR
Fev 2026 : 327k EUR
Mar 2026 : 335k EUR
Avr 2026 : 348k EUR
Mai 2026 : 361k EUR
Jun 2026 : 367k EUR
Jul 2026 : 372k EUR (creux saisonnier observe en aout 2025 aussi)
Aout 2026 : 369k EUR
Sept 2026 : 384k EUR
Oct 2026 : 398k EUR
Nov 2026 : 412k EUR (au 24/11)

Mix : Enterprise 52% / Mid-market 33% / SMB 15%
Geographies : FR/Benelux 45% / DACH 32% / Reste EU 23%

Plan Q4 : 1.35M EUR cumul Oct-Dec`;

const EXAMPLE_EN = `Monthly MRR history (last 12 months)
Dec 2025: 312k EUR
Jan 2026: 318k EUR
Feb 2026: 327k EUR
Mar 2026: 335k EUR
Apr 2026: 348k EUR
May 2026: 361k EUR
Jun 2026: 367k EUR
Jul 2026: 372k EUR (seasonal dip in Aug 2025 too)
Aug 2026: 369k EUR
Sep 2026: 384k EUR
Oct 2026: 398k EUR
Nov 2026: 412k EUR (as of Nov 24)

Mix: Enterprise 52% / Mid-market 33% / SMB 15%
Geographies: FR/Benelux 45% / DACH 32% / Rest of EU 23%

Q4 plan: 1.35M EUR cumulative Oct-Dec`;

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [business, setBusiness] = useState("");
  const [horizon, setHorizon] = useState("");
  const [history, setHistory] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — forecast IA + detection d'anomalies",
    desc: "Collez votre historique de ventes. L'agent IA produit un forecast a 90 jours, identifie les anomalies et recommande des actions. Aucune source de donnees reelle interrogee — c'est un POC qui montre la logique de production.",
    inputLabel: "Historique de ventes",
    businessPh: "Activite (ex: SaaS B2B sales prospecting)",
    horizonPh: "Horizon (ex: 90 jours, T1 2027)",
    historyPh: "Collez votre historique : MRR, deals, conversions, segments...",
    loadExample: "Charger un exemple",
    generate: "Generer le forecast", generating: "Calcul en cours...",
    briefTitle: "Forecast et anomalies", emptyHint: "Le brief s'affiche ici une fois genere.",
    pushSalesforce: "Pousser dans Salesforce", alertPagerduty: "Lever une alerte PagerDuty",
    notifySlack: "Notifier Slack #revops",
    salesforceMock: "Forecast pousse dans Salesforce + champs anomalie crees (mode demo, pas de connexion reelle Salesforce)",
    pdMock: "Alerte PagerDuty levee pour l'equipe RevOps (mode demo, pas de connexion reelle PagerDuty)",
    slackMock: "Notification envoyee dans #revops (mode demo, pas de connexion reelle Slack)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — aucune connexion reelle a Salesforce, HubSpot, Stripe, PagerDuty ou Slack. L'IA modelise pour la demonstration.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — AI forecast + anomaly detection",
    desc: "Paste your sales history. The AI agent produces a 90-day forecast, identifies anomalies and recommends actions. No real data source queried — this is a POC showing the production logic.",
    inputLabel: "Sales history",
    businessPh: "Business (e.g. B2B SaaS sales prospecting)",
    horizonPh: "Horizon (e.g. 90 days, Q1 2027)",
    historyPh: "Paste your history: MRR, deals, conversions, segments...",
    loadExample: "Load example",
    generate: "Generate forecast", generating: "Computing...",
    briefTitle: "Forecast and anomalies", emptyHint: "The brief will appear here once generated.",
    pushSalesforce: "Push to Salesforce", alertPagerduty: "Raise PagerDuty alert",
    notifySlack: "Notify Slack #revops",
    salesforceMock: "Forecast pushed to Salesforce + anomaly fields created (demo mode, no real Salesforce connection)",
    pdMock: "PagerDuty alert raised for the RevOps team (demo mode, no real PagerDuty connection)",
    slackMock: "Notification sent to #revops (demo mode, no real Slack connection)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no real connection to Salesforce, HubSpot, Stripe, PagerDuty or Slack. The AI models for demonstration.",
  };

  async function generate() {
    setError(""); setBrief(""); setModel(""); setStaticMode(false);
    if (!history.trim()) {
      setError(lang === "fr" ? "Collez l'historique." : "Paste the history.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, business, horizon, lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-textarea { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: monospace; font-size: 12px; resize: vertical; min-height: 220px; line-height: 1.55; }
        .wk-textarea:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #FFFFFF; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        @media (max-width: 768px) { .demo-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.inputLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              <input className="wk-input" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder={t.businessPh} />
              <input className="wk-input" value={horizon} onChange={(e) => setHorizon(e.target.value)} placeholder={t.horizonPh} />
              <textarea className="wk-textarea" value={history} onChange={(e) => setHistory(e.target.value)} placeholder={t.historyPh} />
              <button type="button" onClick={() => setHistory(lang === "fr" ? EXAMPLE_FR : EXAMPLE_EN)} style={{ background: "transparent", border: "none", color: PAL.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "inherit" }}>↳ {t.loadExample}</button>
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? `⏳ ${t.generating}` : `🔮 ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#B91C1C", fontSize: 13, padding: "8px 12px", background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#15803D" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>{t.emptyHint}</div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.salesforceMock)}>☁️ {t.pushSalesforce}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.pdMock)}>🚨 {t.alertPagerduty}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.slackMock)}>💬 {t.notifySlack}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: PAL.bg2, border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}
