export default function Home() {
  const chartPoints = [
    { x: 0, actual: 42, forecast: 40 },
    { x: 1, actual: 47, forecast: 45 },
    { x: 2, actual: 44, forecast: 48 },
    { x: 3, actual: 51, forecast: 51 },
    { x: 4, actual: 48, forecast: 54 },
    { x: 5, actual: 38, forecast: 57, anomaly: true },
    { x: 6, actual: null, forecast: 60 },
    { x: 7, actual: null, forecast: 63 },
  ];
  const w = 360, h = 140, pad = 20;
  const toX = (i: number) => pad + i * ((w - pad * 2) / 7);
  const toY = (v: number) => h - pad - ((v - 30) / 40) * (h - pad * 2);

  const actualPath = chartPoints
    .filter((p) => p.actual !== null)
    .map((p, i, arr) => `${i === 0 ? "M" : "L"}${toX(p.x)},${toY(p.actual!)}`)
    .join(" ");

  const forecastPath = chartPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x)},${toY(p.forecast)}`)
    .join(" ");

  return (
    <main style={{ fontFamily: "var(--font-body)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
        <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-green-800 tracking-wide">
          ForecastIQ
        </span>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="bg-green-700 text-white px-5 py-2 rounded text-sm font-bold hover:bg-green-800 transition">
            📅 Réserver un créneau →
          </a>
          <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20ForecastIQ%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" className="bg-green-700 text-white px-5 py-2 rounded text-sm font-bold hover:bg-green-800 transition" style={{ background: "#25d366", borderColor: "#25d366" }}>
            💬 WhatsApp →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-6">
          Prédiction · Anomalies · Alertes
        </span>
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-5xl md:text-6xl text-green-900 leading-tight mb-6">
          Anticipez les pannes de revenus avant qu&rsquo;elles arrivent.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          ForecastIQ modélise vos prévisions de ventes, détecte les anomalies en temps réel et vous alerte avant que le problème devienne une crise.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-700 text-white px-8 py-4 rounded font-bold text-base hover:bg-green-800 transition shadow-lg">
            📅 Réserver un créneau →
          </a>
          <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20ForecastIQ%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" className="inline-block bg-green-700 text-white px-8 py-4 rounded font-bold text-base hover:bg-green-800 transition shadow-lg" style={{ background: "#25d366", borderColor: "#25d366" }}>
            💬 WhatsApp →
          </a>
        </div>
      </section>

      {/* Chart Mockup */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Prévisions vs Réalisé — CA mensuel (K€)</p>
              <p className="font-bold text-green-900 text-lg">Jan – Août 2024</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-green-600" />Réalisé</span>
              <span className="flex items-center gap-1"><span className="inline-block w-6 border-t-2 border-dashed border-green-400" />Prévision</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500" />Anomalie</span>
            </div>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
            {/* Grid lines */}
            {[40, 50, 60, 70].map((v) => (
              <line key={v} x1={pad} x2={w - pad} y1={toY(v)} y2={toY(v)} stroke="#dcfce7" strokeWidth="1" />
            ))}
            {/* Forecast (dashed) */}
            <path d={forecastPath} fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="6,3" />
            {/* Actual (solid) */}
            <path d={actualPath} fill="none" stroke="#166534" strokeWidth="2.5" />
            {/* Anomaly dot */}
            {chartPoints.filter((p) => p.anomaly).map((p) => (
              <g key={p.x}>
                <circle cx={toX(p.x)} cy={toY(p.actual!)} r="6" fill="#ef4444" />
                <circle cx={toX(p.x)} cy={toY(p.actual!)} r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
              </g>
            ))}
          </svg>
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠</span>
            <div>
              <p className="text-sm font-bold text-red-700">Anomalie détectée — Juin 2024</p>
              <p className="text-xs text-red-600">CA 33% en dessous de la prévision. Alerte envoyée à Sophie M. (CFO) le 03/06 à 08:14.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-green-800 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl text-white text-center mb-12">
            Piloter à l&rsquo;avance, pas dans le rétroviseur
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "Modèles ML adaptatifs", desc: "Nos algorithmes apprennent de votre historique et s'adaptent aux saisonnalités, campagnes et événements inhabituels." },
              { icon: "🔔", title: "Alertes anomalies", desc: "Dès qu'une métrique s'écarte significativement de la prévision, ForecastIQ alerte votre équipe avant la fin de journée." },
              { icon: "📅", title: "Prévisions 90 jours", desc: "Planifiez vos ressources, vos objectifs et votre trésorerie avec des prévisions à 3 mois mises à jour en continu." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-green-700/50 rounded-xl p-6 border border-green-600">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)" }} className="text-white text-xl mb-2">{title}</h3>
                <p className="text-green-100 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 py-14 text-center px-6">
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl text-white mb-4">
          Anticipez. N&rsquo;attendez plus.
        </h2>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-green-800 px-8 py-4 rounded font-bold hover:bg-green-50 transition shadow">
            📅 Réserver un créneau →
          </a>
          <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20ForecastIQ%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-green-800 px-8 py-4 rounded font-bold hover:bg-green-50 transition shadow" style={{ background: "#25d366", borderColor: "#25d366" }}>
            💬 WhatsApp →
          </a>
        </div>
      </section>

      <footer className="text-center py-5 text-slate-400 text-sm bg-white border-t border-green-100">
        <p>&copy; 2025 ForecastIQ &mdash; Un produit Wikolabs</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-slate-400">
          <a href="mailto:team@wikolabs.com" className="hover:text-slate-600 transition-colors">team@wikolabs.com</a>
          <span>&middot;</span>
          <a href="tel:+261386626100" className="hover:text-slate-600 transition-colors">+261 38 66 261 00</a>
          <span>&middot;</span>
          <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Prendre RDV</a>
        </div>
      </footer>
    </main>
  );
}
