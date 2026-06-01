"use client";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Each LP customizes only this block
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  name: "ForecastIQ",
  waPhone: "261386626100",
  tools: [
    { name: "GoogleBigQuery", slug: "googlebigquery" },
    { name: "Snowflake", slug: "snowflake" },
    { name: "PowerBI", slug: "powerbi" },
    { name: "Slack", slug: "slack" },
    { name: "Groq", slug: "groq" },
  ],
  palette: {
    mode: "light" as "dark" | "light",
    bg: "#ECFEFF",
    bg2: "#CFFAFE",
    surface: "rgba(0,0,0,0.035)",
    border: "rgba(0,0,0,0.08)",
    txt1: "#0A1F22",
    txt2: "#3C5A60",
    txt3: "#7A92A0",
    accent: "#0E7490",
    accentSoft: "rgba(14,116,144,0.10)",
    accentBorder: "rgba(14,116,144,0.30)",
    accentGlow: "rgba(14,116,144,0.15)",
    navBg: "rgba(236,254,255,0.85)",
  },
  content: {
    fr: {
      langLabel: "FR",
      tagLabel: "Previsions IA · Anomalies · Alertes temps reel",
      taglines: ["Vos revenus modelises.", "Les anomalies detectees avant qu'elles arrivent.", "Pilotez a l'avance."],
      taglineAccentIdx: 1,
      desc: "ForecastIQ analyse votre historique de ventes, construit des modeles predictifs adaptatifs et vous alerte en temps reel des qu'une anomalie menace votre trajectoire de croissance.",
      navLinks: [
        { label: "Fonctionnalites", href: "#features" },
        { label: "Comment ca marche", href: "#process" },
        { label: "Pourquoi maintenant", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "92%", label: "precision previsions" },
        { value: "90j", label: "horizon de prediction" },
        { value: "48h", label: "detection anomalie" },
        { value: "100%", label: "automatise" },
      ],
      features: [
        { icon: "🧠", title: "Modeles ML adaptatifs", desc: "Nos algorithmes apprennent de votre historique et s'adaptent aux saisonnalites, campagnes et evenements inhabituels pour des previsions toujours pertinentes." },
        { icon: "🔔", title: "Alertes anomalies instantanees", desc: "Des qu'une metrique s'ecarte significativement de la prevision, ForecastIQ alerte votre equipe avant la fin de journee — avec le contexte et les recommandations." },
        { icon: "📈", title: "Previsions a 90 jours", desc: "Planifiez ressources, objectifs et tresorerie avec des previsions a 3 mois mises a jour en continu, desagregees par produit, region et canal." },
      ],
      steps: [
        { num: "01", title: "Connectez vos donnees de ventes", desc: "CRM, ERP, Stripe, Salesforce — ForecastIQ ingere votre historique de transactions en quelques minutes. Aucune preparation de donnees requise." },
        { num: "02", title: "L'IA calibre ses modeles", desc: "ForecastIQ detecte les saisonnalites, tendances et correlations. Les modeles se calibrent sur votre contexte specifique en moins de 24 heures." },
        { num: "03", title: "Previsions et alertes en continu", desc: "Chaque jour, vos previsions sont mises a jour. Si une anomalie est detectee, une alerte est envoyee immediatement a votre equipe avec l'analyse de cause." },
      ],
      persuasion: {
        sectionTag: "Pourquoi maintenant",
        title: "Vos previsions de revenus sont fausses. Vous le savez. Vous continuez quand meme.",
        paragraphs: [
          { type: "pathos", text: "Le 28 du mois. Votre CFO ouvre le forecast Q4 partage par Sales il y a trois semaines. 4.2M EUR. Mais lui voit que Stripe est a 3.1M, que deux gros deals enterprise ont slip-page sur Q1, et que la cohorte DACH est en decroissance silencieuse depuis 17 jours. Il va devoir reprevenir le board mardi, demander de revoir le hiring plan, et expliquer pourquoi personne n'a vu venir l'erosion. Le commercial qui a soumis le forecast est de bonne foi — il n'avait simplement pas les outils pour modeliser la vraie trajectoire." },
          { type: "logos", text: "PwC a mesure en 2025 que les forecasts manuels des equipes B2B sont en moyenne 28% au-dessus du realise sur les trimestres a forte saisonnalite. Gartner indique que les entreprises avec forecasting IA atteignent 92% de precision sur 90 jours contre 64% pour les forecasts manuels — et detectent les anomalies de revenue 4 semaines plus tot. Forrester estime la valeur d'un forecast precis a 8% du revenue total pour une scale-up post-Series B." },
          { type: "ethos", text: "Wikolabs construit des agents IA en production depuis 2023 pour des scale-ups B2B, family offices et fintechs reglementees. Nous avons brule nos doigts sur les memes problemes que vous : pipelines qui hallucinent, briefs ignores, dashboards desertes. ForecastIQ est ce que nous avons construit pour nos propres clients exigeants avant de le proposer au marche." },
          { type: "solution", text: "Concretement : ForecastIQ ingere votre historique Stripe, Salesforce ou ERP en quelques minutes, calibre ses modeles ML adaptatifs sur vos saisonnalites et campagnes en 24 heures, puis livre chaque jour une prevision a 90 jours desagregee par produit, region et canal — avec alerte automatique des qu'une cohorte s'ecarte significativement. Resultat : 92% de precision a 90 jours, detection des anomalies sous 48h, et un pilotage financier enfin proactif." },
        ],
      },
      ctaTitle: "Vos previsions de revenus, calibrees et fiables",
      ctaDesc: "Connexion en quelques minutes. Premieres previsions sous 24h. Aucune carte bancaire.",
      ctaPrimary: "Reserver un appel",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Demander une demo",
      ctaSoonBadge: "Bientot",
      footerTagline: "Previsions IA et detection d'anomalies pour scale-ups",
    },
    en: {
      langLabel: "EN",
      tagLabel: "AI forecasts · Anomalies · Real-time alerts",
      taglines: ["Your revenue modeled.", "Anomalies caught before they hit.", "Steer ahead."],
      taglineAccentIdx: 1,
      desc: "ForecastIQ analyzes your sales history, builds adaptive predictive models and alerts you in real time as soon as an anomaly threatens your growth trajectory.",
      navLinks: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#process" },
        { label: "Why now", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "92%", label: "forecast accuracy" },
        { value: "90d", label: "prediction horizon" },
        { value: "48h", label: "anomaly detection" },
        { value: "100%", label: "automated" },
      ],
      features: [
        { icon: "🧠", title: "Adaptive ML models", desc: "Our algorithms learn from your history and adapt to seasonalities, campaigns and unusual events for forecasts that stay relevant." },
        { icon: "🔔", title: "Instant anomaly alerts", desc: "As soon as a metric diverges significantly from forecast, ForecastIQ alerts your team before end of day — with context and recommendations." },
        { icon: "📈", title: "90-day forecasts", desc: "Plan resources, targets and cash with 3-month forecasts updated continuously, broken down by product, region and channel." },
      ],
      steps: [
        { num: "01", title: "Connect your sales data", desc: "CRM, ERP, Stripe, Salesforce — ForecastIQ ingests your transaction history in minutes. No data prep required." },
        { num: "02", title: "AI calibrates its models", desc: "ForecastIQ detects seasonalities, trends and correlations. Models calibrate to your specific context in under 24 hours." },
        { num: "03", title: "Continuous forecasts and alerts", desc: "Every day, your forecasts are updated. If an anomaly is detected, an alert is sent immediately to your team with root cause analysis." },
      ],
      persuasion: {
        sectionTag: "Why now",
        title: "Your revenue forecasts are wrong. You know it. You keep submitting them.",
        paragraphs: [
          { type: "pathos", text: "The 28th of the month. Your CFO opens the Q4 forecast Sales shared three weeks ago. 4.2M EUR. But he sees Stripe is at 3.1M, two enterprise deals slipped to Q1, and the DACH cohort has been quietly declining for 17 days. He'll have to re-warn the board Tuesday, ask to revisit the hiring plan, and explain why nobody saw the erosion coming. The rep who submitted the forecast is acting in good faith — they simply didn't have the tools to model the real trajectory." },
          { type: "logos", text: "PwC measured in 2025 that manual B2B forecasts are on average 28% above actuals on high-seasonality quarters. Gartner indicates that companies with AI forecasting reach 92% accuracy at 90 days versus 64% for manual forecasts — and detect revenue anomalies 4 weeks earlier. Forrester estimates the value of an accurate forecast at 8% of total revenue for a post-Series B scale-up." },
          { type: "ethos", text: "Wikolabs has been building production AI agents since 2023 for B2B scale-ups, family offices and regulated fintechs. We burned our fingers on the same problems you face: hallucinating pipelines, ignored briefs, abandoned dashboards. ForecastIQ is what we built for our own demanding customers before bringing it to market." },
          { type: "solution", text: "Concretely: ForecastIQ ingests your Stripe, Salesforce or ERP history in minutes, calibrates its adaptive ML models on your seasonalities and campaigns within 24 hours, then delivers daily a 90-day forecast broken down by product, region and channel — with automatic alerts as soon as a cohort diverges. Result: 92% accuracy at 90 days, anomaly detection under 48h, and financial steering finally proactive." },
        ],
      },
      ctaTitle: "Your revenue forecasts, calibrated and reliable",
      ctaDesc: "Connection in minutes. First forecasts within 24h. No credit card.",
      ctaPrimary: "Book a call",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Request a demo",
      ctaSoonBadge: "Soon",
      footerTagline: "AI forecasting and anomaly detection for scale-ups",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — identical for all LPs
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = P.content[lang];
  const pal = P.palette;
  const isDark = pal.mode === "dark";
  const cardOverlayHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";

  const waLink = `https://wa.me/${P.waPhone}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaite discuter de ${P.name} avec Wikolabs.`
      : `Hello, I'd like to discuss ${P.name} with Wikolabs.`
  )}`;

  return (
    <div style={{ minHeight: "100vh", background: pal.bg, color: pal.txt1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes wkBgShift { 0% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-2%, 1.5%, 0) rotate(180deg); } 100% { transform: translate3d(0,0,0) rotate(360deg); } }
        .wk-bg-fx { position: fixed; inset: -10%; pointer-events: none; z-index: 0; opacity: .55; will-change: transform; animation: wkBgShift 38s linear infinite; }
        .wk-bg-fx::before, .wk-bg-fx::after { content: ""; position: absolute; inset: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: ${cardOverlayHover} !important; border-color: ${pal.accentBorder} !important; transform: translateY(-6px); }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.92; transform:translateY(-2px); box-shadow:0 12px 32px ${pal.accentGlow}; }
        .wk-btn-wa { transition: opacity .2s, transform .2s; }
        .wk-btn-wa:hover { opacity:.92; transform:translateY(-2px); }
        .wk-btn-demo { opacity:.78; transition: opacity .2s, transform .2s, background .2s; }
        .wk-btn-demo:hover { opacity:1; transform:translateY(-2px); background:${pal.accentSoft}!important; }
        .wk-nav-link { color:${pal.txt2}; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
        .wk-nav-link:hover { color:${pal.txt1}; }
        .wk-lang { display:inline-flex; border:1px solid ${pal.border}; border-radius:100px; padding:2px; background:${pal.surface}; }
        .wk-lang button { background:transparent; border:none; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:100px; color:${pal.txt2}; transition: background .2s, color .2s; font-family:inherit; }
        .wk-lang button.active { background:${pal.accent}; color:${isDark ? "#04080F" : "#FFFFFF"}; }
        @media(max-width:768px){
          .wk-hide-sm{ display:none!important; }
          .wk-hero-title{ font-size:2.4rem!important; }
          .wk-section{ padding-left:20px!important; padding-right:20px!important; }
          .wk-cards-grid{ grid-template-columns: 1fr !important; max-width:380px; margin-left:auto; margin-right:auto; }
          .wk-metrics-row{ justify-content:center; }
          .wk-cta-row{ flex-direction:column; align-items:stretch; max-width:340px; margin-left:auto; margin-right:auto; }
          .wk-cta-row > *{ width:100%; justify-content:center; }
          .wk-persuasion{ padding:60px 20px!important; }
          .wk-foot{ flex-direction:column; gap:12px; text-align:center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="wk-section" style={{ position:"sticky", top:0, zIndex:100, background:pal.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${pal.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:pal.txt1 }}>
          {P.name}<span style={{ color:pal.accent }}>.</span>
        </span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <div className="wk-hide-sm" style={{ display:"flex", gap:22 }}>
            {t.navLinks.map(l => <a key={l.label} href={l.href} className="wk-nav-link">{l.label}</a>)}
          </div>
          <div className="wk-lang" role="group" aria-label="language">
            <button type="button" className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>FR</button>
            <button type="button" className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
            style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
            {t.ctaPrimary} →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="wk-section" style={{ padding:"100px 40px 80px", maxWidth:1040, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:720, height:600, background:`radial-gradient(ellipse at 50% 30%, ${pal.accentGlow} 0%, transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:100, padding:"6px 18px", animation:"fadeUp .5s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:pal.accent, display:"inline-block", animation:"pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color:pal.accent, fontSize:11.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{t.tagLabel}</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28, fontFamily:"'Instrument Serif',Georgia,serif", animation:"fadeUp .5s .08s ease both" }}>
          {t.taglines.map((line, i) => (
            <span key={i} style={{ display:"block", color:i===t.taglineAccentIdx?pal.accent:pal.txt1, fontStyle:i===t.taglineAccentIdx?"italic":"normal" }}>{line}</span>
          ))}
        </h1>
        <p style={{ fontSize:"1.1rem", color:pal.txt2, lineHeight:1.72, maxWidth:600, margin:"0 auto 44px", animation:"fadeUp .5s .16s ease both" }}>{t.desc}</p>
        <div className="wk-metrics-row" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:14, marginBottom:44, animation:"fadeUp .5s .24s ease both" }}>
          {t.metrics.map(m => (
            <div key={m.label} style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"14px 22px", textAlign:"center", minWidth:118 }}>
              <div style={{ fontSize:"1.7rem", fontWeight:800, color:pal.txt1, letterSpacing:"-1.5px", lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:"0.62rem", color:pal.txt3, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:5 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
      </section>

      {/* FEATURES */}
      <section id="features" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Fonctionnalites":"Features"} title={lang==="fr"?"Tout automatise, <em>rien a gerer</em>":"Fully automated, <em>nothing to manage</em>"} />
        <div className="wk-cards-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {t.features.map((f, i) => (
            <div key={f.title} className="wk-card" style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:20, padding:"28px 28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, opacity:.55 }} />
              <div style={{ fontSize:"2rem", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:pal.txt1, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:"0.88rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="wk-section" style={{ padding:"80px 40px", background:pal.bg2 }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionHead pal={pal} tag={lang==="fr"?"Comment ca marche":"How it works"} title={lang==="fr"?"En place en <em>10 minutes</em>":"Live in <em>10 minutes</em>"} />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {t.steps.map((s, i) => (
              <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:22, background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"22px 26px" }}>
                <div style={{ flexShrink:0, width:46, height:46, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:pal.accent, fontWeight:800, fontSize:15 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:700, color:pal.txt1, marginBottom:6, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontSize:"0.87rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS INTEGRATED — logos of the stack we operate for you */}
      <section id="tools" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Outils integres":"Tools we operate"} title={lang==="fr"?"On opere <em>votre stack</em>, vous n'avez rien a apprendre":"We operate <em>your stack</em>, you don't have to learn it"} />
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:12 }}>
          {P.tools.map(tool => (
            <div key={tool.slug} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 16px", background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:100, fontSize:13, color:pal.txt1, fontWeight:600, transition:"transform .2s, border-color .2s" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://cdn.simpleicons.org/${tool.slug}/${pal.accent.replace('#','')}`} alt={tool.name} width={18} height={18} style={{ flexShrink:0 }} />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", color:pal.txt3, fontSize:12, marginTop:24, maxWidth:540, marginLeft:"auto", marginRight:"auto" }}>
          {lang==="fr" ? "Vous n'avez pas a apprendre ces outils — on les opere pour vous. Vous payez l'abonnement, c'est dans votre Slack demain matin." : "You don't have to learn these tools — we operate them for you. You pay the subscription, it's in your Slack tomorrow morning."}
        </p>
      </section>

      {/* PERSUASION — pathos / logos / ethos / solution */}
      <section id="why" className="wk-persuasion wk-section" style={{ padding:"100px 40px", maxWidth:860, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={t.persuasion.sectionTag} title={t.persuasion.title} />
        <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
          {t.persuasion.paragraphs.map((p, i) => {
            const labelMap: Record<string, { fr: string; en: string }> = {
              pathos:   { fr: "L'enjeu humain",  en: "What's at stake" },
              logos:    { fr: "Les faits",       en: "The facts" },
              ethos:    { fr: "Notre legitimite", en: "Our credibility" },
              solution: { fr: "Notre reponse",   en: "Our answer" },
            };
            const label = labelMap[p.type]?.[lang] ?? "";
            return (
              <div key={i} style={{ borderLeft:`2px solid ${pal.accentBorder}`, paddingLeft:22 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:pal.accent, marginBottom:10 }}>{label}</div>
                <p style={{ fontSize:"1.02rem", color:pal.txt2, lineHeight:1.85, margin:0 }}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="wk-section" style={{ padding:"0 40px 100px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ background:pal.surface, border:`1px solid ${pal.accentBorder}`, borderRadius:24, padding:"64px 48px", textAlign:"center", backgroundImage:`radial-gradient(ellipse at 50% 0%, ${pal.accentSoft} 0%, transparent 65%)` }}>
          <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>{lang==="fr"?"Demarrer":"Get started"}</p>
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, marginBottom:14, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif" }}>{t.ctaTitle}</h2>
          <p style={{ color:pal.txt2, fontSize:"1rem", marginBottom:36, lineHeight:1.7, maxWidth:540, margin:"0 auto 36px" }}>{t.ctaDesc}</p>
          <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wk-section" style={{ borderTop:`1px solid ${pal.border}`, padding:"32px 40px" }}>
        <div className="wk-foot" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:pal.txt1 }}>{P.name}</span><span style={{ color:pal.accent }}>.</span>
            <span style={{ display:"block", fontSize:12, color:pal.txt3, marginTop:3 }}>{t.footerTagline}</span>
          </div>
          <p style={{ fontSize:13, color:pal.txt3, margin:0 }}>© 2026 {P.name} — {lang==="fr"?"Un produit":"A product by"} <a href="https://wikolabs.com" style={{ color:pal.txt2, textDecoration:"none" }}>Wikolabs</a></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:13, alignItems:"center" }}>
            <a href="mailto:team@wikolabs.com" style={{ color:pal.txt3, textDecoration:"none" }}>team@wikolabs.com</a>
            <span style={{ color:pal.txt3 }}>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' style={{ background:"none", border:"none", color:pal.txt3, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0 }}>{t.ctaPrimary}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SectionHead({ pal, tag, title }: { pal: typeof P.palette; tag: string; title: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>{tag}</p>
      <h2
        style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif", lineHeight:1.15, margin:0 }}
        dangerouslySetInnerHTML={{ __html: title.replace(/<em>/g, `<em style="font-style:italic;color:${pal.accent}">`) }}
      />
    </div>
  );
}

function CtaRow({ t, pal, isDark, waLink }: { t: typeof P.content.fr; pal: typeof P.palette; isDark: boolean; waLink: string }) {
  return (
    <div className="wk-cta-row" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", animation:"fadeUp .5s .32s ease both" }}>
      <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
        style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
        📅 {t.ctaPrimary}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wk-btn-wa"
        style={{ background:"#25d366", color:"#FFFFFF", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
        💬 {t.ctaWhatsApp}
      </a>
      <a href="/demo" className="wk-btn-demo" data-orig-btn="1"
        style={{ background:"transparent", color:pal.txt2, border:`1px solid ${pal.border}`, borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, display:"inline-flex", alignItems:"center", gap:10, fontFamily:"inherit", position:"relative" }}>
        ✨ {t.ctaDemo}
      </a>
    </div>
  );
}
