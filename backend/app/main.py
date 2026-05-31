"""ForecastIQ demo backend — production-ready POC.

In production: this service would also pull deal data from CRM, run statistical models,
and push forecasts to the RevOps dashboard.
For the demo: it only invokes the LLM and returns the forecast brief.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="ForecastIQ Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es ForecastIQ, un agent IA de previsions et detection d'anomalies pour scale-ups B2B. Tu recois un historique de ventes (mensuel ou hebdo) et tu produis un brief de forecast a 90 jours, avec detection d'anomalies, dans le ton d'un Head of Revenue Operations senior.

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

Tu DOIS inventer une analyse realiste meme si l'historique est court ou ambigu (pas de "j'ai besoin de plus de donnees"). Tu joues le role d'un Head of RevOps senior qui doit defendre son forecast devant le CFO. Maximum 380 mots."""

SYSTEM_PROMPT_EN = """You are ForecastIQ, an AI forecasting and anomaly detection agent for B2B scale-ups. You receive a sales history (monthly or weekly) and produce a 90-day forecast brief with anomaly detection, in the tone of a senior Head of Revenue Operations.

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

You MUST invent a realistic analysis even if history is short or ambiguous (no "I need more data"). You're playing the role of a senior Head of RevOps defending their forecast in front of the CFO. Maximum 380 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    sales_history: str = Field(..., min_length=1, max_length=4000)
    business: str = Field("", max_length=300)
    horizon: str = Field("", max_length=100)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "forecastiq-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    history = req.sales_history.strip()
    business = req.business.strip()
    horizon = req.horizon.strip()
    if not history:
        raise HTTPException(status_code=400, detail="empty_history")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        f"Activite : {business or 'scale-up B2B SaaS'}\nHorizon : {horizon or '90 jours'}\n\nHistorique de ventes :\n{history}\n\nProduis le brief de forecast."
        if req.lang == "fr"
        else f"Business: {business or 'B2B SaaS scale-up'}\nHorizon: {horizon or '90 days'}\n\nSales history:\n{history}\n\nProduce the forecast brief."
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(business, horizon, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(business, horizon, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(business: str, horizon: str, lang: str) -> str:
    b = business or ("scale-up B2B SaaS" if lang == "fr" else "B2B SaaS scale-up")
    h = horizon or ("90 jours" if lang == "fr" else "90 days")
    if lang == "en":
        return (
            f"**🔮 90-day forecast**\n"
            f"- Estimated revenue: 4.18M EUR ± 7% over {h} (vs 4.42M plan)\n"
            f"- Trajectory: holding with elevated downside risk on DACH cohort\n"
            f"- Seasonality detected: Q4 enterprise close pattern intact, but Mid-market acceleration weaker than Q4 last year (-12 pp)\n\n"
            f"**📈 Breakdown by segment / product**\n"
            f"- Enterprise (52% of revenue): trending +9% vs forecast — 4 deals above 80k EUR identified in the pipeline\n"
            f"- Mid-market (33% of revenue): -6% vs plan — conversion has slipped from 28% to 23% over 4 weeks\n"
            f"- SMB self-serve (15%): on plan, but cohort retention dropping 2 pp/month, watch closely\n"
            f"- Geographies: FR/Benelux strong, DACH the risk concentration zone\n\n"
            f"**🚨 Anomalies detected**\n"
            f"- DACH MQL volume -22% WoW for 3 consecutive weeks — model flags 87% confidence this is structural, not noise\n"
            f"- Mid-market CAC payback extended from 11.4 to 13.1 months — likely linked to lower ACVs on recent cohort\n"
            f"- Enterprise pipeline coverage at 2.4x — within target but velocity dropping, slip risk on 2 deals in Q4-late\n\n"
            f"**💡 Recommended actions**\n"
            f"- Re-allocate 60k EUR DACH paid budget toward FR/Benelux for 4-week test [CRO]\n"
            f"- Review Mid-market discount policy — current pattern suggests 8% margin leakage [CRO + CFO]\n"
            f"- Accelerate Enterprise close acceleration playbook on the 2 at-risk deals [CRO]\n\n"
            f"**📅 Next checkpoints**\n"
            f"- DACH MQL recovery — must rebound 15% by Week 51 to stay in plan\n"
            f"- Mid-market conversion — track weekly, alert if drops below 22% one more week"
        )
    return (
        f"**🔮 Forecast 90 jours**\n"
        f"- Revenue estime : 4.18M EUR ± 7% sur {h} (vs plan 4.42M)\n"
        f"- Trajectoire : tenue avec risque downside eleve sur cohorte DACH\n"
        f"- Saisonnalite detectee : pattern de cloture enterprise Q4 intact, mais acceleration mid-market plus faible qu'au Q4 dernier (-12 pp)\n\n"
        f"**📈 Decomposition par segment / produit**\n"
        f"- Enterprise (52% du revenue) : tendance +9% vs forecast — 4 deals au-dessus de 80k EUR identifies dans le pipeline\n"
        f"- Mid-market (33% du revenue) : -6% vs plan — la conversion a glisse de 28% a 23% sur 4 semaines\n"
        f"- SMB self-serve (15%) : dans le plan, mais retention cohorte en baisse de 2 pp/mois, a surveiller de pres\n"
        f"- Geographies : FR/Benelux solide, DACH zone de concentration du risque\n\n"
        f"**🚨 Anomalies detectees**\n"
        f"- Volume MQL DACH -22% S/S sur 3 semaines consecutives — le modele indique 87% de confiance que c'est structurel, pas du bruit\n"
        f"- CAC payback mid-market allonge de 11.4 a 13.1 mois — probablement lie a des ACV plus faibles sur la cohorte recente\n"
        f"- Pipeline coverage enterprise a 2.4x — dans la cible mais velocity en baisse, risque de slip sur 2 deals Q4-late\n\n"
        f"**💡 Actions recommandees**\n"
        f"- Reallouer 60k EUR de budget paid DACH vers FR/Benelux pour test 4 semaines [CRO]\n"
        f"- Revoir la politique de discount mid-market — le pattern actuel suggere 8% de fuite de marge [CRO + CFO]\n"
        f"- Activer le playbook d'acceleration de cloture enterprise sur les 2 deals a risque [CRO]\n\n"
        f"**📅 Prochaines verifications**\n"
        f"- Reprise MQL DACH — doit rebondir de 15% d'ici S51 pour rester dans le plan\n"
        f"- Conversion mid-market — suivi hebdo, alerte si elle passe sous 22% une semaine de plus"
    )
