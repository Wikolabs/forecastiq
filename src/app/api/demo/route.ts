import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es ForecastIQ, un agent IA de previsions et detection d'anomalies pour scale-ups B2B. Tu recois un historique de ventes (mensuel ou hebdo) et tu produis un brief de forecast a 90 jours, avec detection d'anomalies, dans le ton d'un Head of Revenue Operations senior.

Format de sortie exact en MARKDOWN :
**🔮 Forecast 90 jours**
- Revenue estime : [montant + intervalle de confiance, ex: 1.42M EUR ± 8%]
- Trajectoire : [acceleration | tenue | ralentissement | risque]
- Saisonnalite detectee : [pattern identifie, ex: pic Q4, creux ete]

**📈 Decomposition par segment / produit**
- [2-4 puces : segment + part du revenue + trend + risque/opportunite]

**🚨 Anomalies detectees**
- [1-3 puces : metrique + ecart vs modele + hypothese de cause]

**💡 Actions recommandees**
- [2-3 puces : action concrete + owner (CRO / CFO / Marketing) + horizon]

**📅 Prochaines verifications**
- [1-2 puces : signaux a surveiller dans les 14 prochains jours pour valider ou invalider le forecast]

Tu DOIS inventer une analyse realiste meme si l'historique est court ou ambigu (pas de "j'ai besoin de plus de donnees"). Tu joues le role d'un Head of RevOps senior qui doit defendre son forecast devant le CFO. Maximum 380 mots.`;

const SYSTEM_PROMPT_EN = `You are ForecastIQ, an AI forecasting and anomaly detection agent for B2B scale-ups. You receive a sales history (monthly or weekly) and produce a 90-day forecast brief with anomaly detection, in the tone of a senior Head of Revenue Operations.

Exact MARKDOWN output format:
**🔮 90-day forecast**
- Estimated revenue: [amount + confidence interval, e.g. 1.42M EUR ± 8%]
- Trajectory: [acceleration | holding | slowdown | risk]
- Seasonality detected: [pattern identified, e.g. Q4 peak, summer dip]

**📈 Breakdown by segment / product**
- [2-4 bullets: segment + revenue share + trend + risk/opportunity]

**🚨 Anomalies detected**
- [1-3 bullets: metric + deviation vs model + hypothesis on cause]

**💡 Recommended actions**
- [2-3 bullets: concrete action + owner (CRO / CFO / Marketing) + horizon]

**📅 Next checkpoints**
- [1-2 bullets: signals to monitor in the next 14 days to validate or invalidate the forecast]

You MUST invent a realistic analysis even if history is short or ambiguous (no "I need more data"). You're playing the role of a senior Head of RevOps defending their forecast in front of the CFO. Maximum 380 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const history: string = typeof body.history === "string" ? body.history.slice(0, 4000) : "";
    const business: string = typeof body.business === "string" ? body.business.slice(0, 300) : "";
    const horizon: string = typeof body.horizon === "string" ? body.horizon.slice(0, 100) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!history.trim()) {
      return NextResponse.json(
        { error: lang === "fr" ? "Collez votre historique de ventes." : "Paste your sales history." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(business, horizon, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Activite : ${business || "scale-up B2B SaaS"}\nHorizon : ${horizon || "90 jours"}\n\nHistorique de ventes :\n${history}\n\nProduis le brief de forecast.`
      : `Business: ${business || "B2B SaaS scale-up"}\nHorizon: ${horizon || "90 days"}\n\nSales history:\n${history}\n\nProduce the forecast brief.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      1100
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(business: string, horizon: string, lang: "fr" | "en"): string {
  const b = business || (lang === "fr" ? "scale-up B2B SaaS" : "B2B SaaS scale-up");
  const h = horizon || (lang === "fr" ? "90 jours" : "90 days");
  if (lang === "en") {
    return `**🔮 90-day forecast**\n- Estimated revenue: 4.18M EUR ± 7% over ${h} (vs 4.42M plan)\n- Trajectory: holding with elevated downside risk on DACH cohort\n- Seasonality detected: Q4 enterprise close pattern intact, but Mid-market acceleration weaker than Q4 last year (-12 pp)\n\n**📈 Breakdown by segment / product**\n- Enterprise (52% of revenue): trending +9% vs forecast — 4 deals above 80k EUR identified in the pipeline\n- Mid-market (33% of revenue): -6% vs plan — conversion has slipped from 28% to 23% over 4 weeks\n- SMB self-serve (15%): on plan, but cohort retention dropping 2 pp/month, watch closely\n- Geographies: FR/Benelux strong, DACH the risk concentration zone\n\n**🚨 Anomalies detected**\n- DACH MQL volume -22% WoW for 3 consecutive weeks — model flags 87% confidence this is structural, not noise\n- Mid-market CAC payback extended from 11.4 to 13.1 months — likely linked to lower ACVs on recent cohort\n- Enterprise pipeline coverage at 2.4x — within target but velocity dropping, slip risk on 2 deals in Q4-late\n\n**💡 Recommended actions**\n- Re-allocate 60k EUR DACH paid budget toward FR/Benelux for 4-week test [CRO]\n- Review Mid-market discount policy — current pattern suggests 8% margin leakage [CRO + CFO]\n- Accelerate Enterprise close acceleration playbook on the 2 at-risk deals [CRO]\n\n**📅 Next checkpoints**\n- DACH MQL recovery — must rebound 15% by Week 51 to stay in plan\n- Mid-market conversion — track weekly, alert if drops below 22% one more week`;
  }
  return `**🔮 Forecast 90 jours**\n- Revenue estime : 4.18M EUR ± 7% sur ${h} (vs plan 4.42M)\n- Trajectoire : tenue avec risque downside eleve sur cohorte DACH\n- Saisonnalite detectee : pattern de cloture enterprise Q4 intact, mais acceleration mid-market plus faible qu'au Q4 dernier (-12 pp)\n\n**📈 Decomposition par segment / produit**\n- Enterprise (52% du revenue) : tendance +9% vs forecast — 4 deals au-dessus de 80k EUR identifies dans le pipeline\n- Mid-market (33% du revenue) : -6% vs plan — la conversion a glisse de 28% a 23% sur 4 semaines\n- SMB self-serve (15%) : dans le plan, mais retention cohorte en baisse de 2 pp/mois, a surveiller de pres\n- Geographies : FR/Benelux solide, DACH zone de concentration du risque\n\n**🚨 Anomalies detectees**\n- Volume MQL DACH -22% S/S sur 3 semaines consecutives — le modele indique 87% de confiance que c'est structurel, pas du bruit\n- CAC payback mid-market allonge de 11.4 a 13.1 mois — probablement lie a des ACV plus faibles sur la cohorte recente\n- Pipeline coverage enterprise a 2.4x — dans la cible mais velocity en baisse, risque de slip sur 2 deals Q4-late\n\n**💡 Actions recommandees**\n- Reallouer 60k EUR de budget paid DACH vers FR/Benelux pour test 4 semaines [CRO]\n- Revoir la politique de discount mid-market — le pattern actuel suggere 8% de fuite de marge [CRO + CFO]\n- Activer le playbook d'acceleration de cloture enterprise sur les 2 deals a risque [CRO]\n\n**📅 Prochaines verifications**\n- Reprise MQL DACH — doit rebondir de 15% d'ici S51 pour rester dans le plan\n- Conversion mid-market — suivi hebdo, alerte si elle passe sous 22% une semaine de plus`;
}
