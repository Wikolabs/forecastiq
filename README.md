# ForecastIQ — Prévision de revenus et forecasting business par ML

> Plus de fin de trimestre surprenant. Votre forecast est précis à 5% dès la semaine 6.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![Prophet](https://img.shields.io/badge/Prophet-1.1-blue?style=flat)](https://facebook.github.io/prophet)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)

---

## Vue d'ensemble

ForecastIQ est une plateforme de prévision de revenus et de business forecasting par machine learning. Elle utilise Prophet (Facebook) pour les séries temporelles, combine avec les données de pipeline ScoreFlow, et produit des forecasts hebdomadaires avec intervalles de confiance. Les équipes Revenue Ops ajustent les prévisions manuellement et trackent l'écart actuel vs forecast.

**Domaine :** Revenue Operations / Financial Planning  
**Port VM :** 3014 | **Sous-domaine :** forecastiq.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts | Courbes forecast, drill-down, ajustements |
| Backend | FastAPI (Python 3.11), Uvicorn | API forecast, actualisation, variance |
| Time Series | **Prophet** 1.1 (Facebook) | Décomposition saisonnalité + tendance |
| Pipeline ML | scikit-learn (Ridge) | Forecast bottom-up (deals × conversion) |
| Base de données | PostgreSQL 16 | Historique revenus, forecasts, actuals |
| Cache | Redis 7 | Cache modèles entraînés |
| Scheduler | APScheduler | Recalcul hebdomadaire |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3014) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
prophet==1.1.5
scikit-learn==1.4.2
pandas==2.2.2
numpy==1.26.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
redis==5.0.4
apscheduler==3.10.4
pydantic==2.7.1
matplotlib==3.9.0
```

---

## Architecture mono-repo

```
forecastiq/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Dashboard forecast vs actuals
│   │   ├── scenarios/            # Scénarios optimiste/pessimiste/base
│   │   ├── variance/             # Analyse écarts forecast vs réel
│   │   └── model/                # Performance modèle Prophet
│   └── src/components/
│       ├── ForecastChart.tsx     # Recharts : actual + forecast + CI
│       ├── ScenarioSlider.tsx    # Slider assumptions (croissance, churn)
│       ├── VarianceTable.tsx     # Tableau écarts semaine par semaine
│       ├── CallAccuracy.tsx      # Précision historique des forecasts
│       └── WaterfallBridge.tsx   # Waterfall : forecast → actual
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── forecasts.py      # GET forecast, POST adjust
│   │   │   ├── actuals.py        # POST /actuals (revenus réels)
│   │   │   └── scenarios.py      # GET scenarios (optimiste/base/pessimiste)
│   │   ├── services/
│   │   │   ├── prophet_engine.py # Prophet training + inference
│   │   │   ├── bottom_up.py      # Pipeline-based forecast
│   │   │   ├── variance.py       # Analyse écarts forecast vs actuals
│   │   │   └── scenario.py       # Monte Carlo simulations
│   │   └── models/
│   │       ├── forecast.py
│   │       └── actual.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#7c3aed', 'primaryTextColor': '#fff', 'primaryBorderColor': '#6d28d9', 'lineColor': '#374151', 'secondaryColor': '#f3e8ff'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3014)"]
        NEXT["Next.js 14\nForecast Dashboard"]
        API["FastAPI"]
        SCHED["APScheduler\nWeekly recalculation"]

        subgraph ML["📈 Forecast Engine"]
            PROPHET["Prophet\nTime-series decomposition"]
            BOTTOMUP["Bottom-up\nPipeline × conversion"]
            SCENARIO["Monte Carlo\nScenario simulation"]
        end

        PG[("PostgreSQL\nRevenue + Forecasts")]
        REDIS[("Redis\nModel cache")]
    end

    ACTUALS["Actuals\nRevenue data"] --> API
    PIPELINE["Pipeline\nScoreFlow data"] --> BOTTOMUP
    SCHED --> ML
```

### Séquence — Calcul du forecast trimestriel

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#7c3aed', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant REVOPS as Revenue Ops
    participant API as FastAPI
    participant PROPHET as Prophet
    participant BOTTOMUP as Bottom-up
    participant SCENARIO as Monte Carlo

    REVOPS->>API: GET /forecasts/quarter?q=Q2-2024

    API->>PROPHET: fit(revenue_history_24months)
    PROPHET-->>API: forecast={date, yhat, yhat_lower, yhat_upper}

    API->>BOTTOMUP: compute(pipeline_deals, avg_conversion_rate)
    Note over BOTTOMUP: Σ(deal_amount × conversion_prob) par semaine
    BOTTOMUP-->>API: bottom_up_forecast=[{week, expected_revenue}]

    API->>API: blend_forecasts(prophet=0.6, bottom_up=0.4)
    Note over API: Pondération configurable

    API->>SCENARIO: simulate(base_forecast, n=1000)
    SCENARIO-->>API: {p10: 380000, p50: 450000, p90: 520000}

    API-->>REVOPS: {base: 450000, range: [380000, 520000], week_breakdown: [...]}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#7c3aed', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    REVENUE_ACTUAL {
        uuid id PK
        date period_date
        string granularity
        float amount
        string segment
        string source
        timestamp recorded_at
    }
    FORECAST {
        uuid id PK
        date forecast_date
        string method
        float yhat
        float yhat_lower
        float yhat_upper
        float actual_amount
        float variance_pct
        timestamp generated_at
    }
    FORECAST_ADJUSTMENT {
        uuid id PK
        uuid forecast_id FK
        float adjusted_amount
        string reason
        string adjusted_by
        timestamp adjusted_at
    }
    SCENARIO {
        uuid id PK
        string name
        float growth_assumption_pct
        float churn_assumption_pct
        float p10
        float p50
        float p90
        timestamp computed_at
    }

    REVENUE_ACTUAL ||--o{ FORECAST : "feeds"
    FORECAST ||--o{ FORECAST_ADJUSTMENT : "has"
```

---

## PRD

### Problème
Les forecasts commerciaux sont basés sur l'intuition du Sales Manager ("je sens qu'on va faire 450k ce mois"). L'écart moyen forecast/réel est de 25-35%. Les décisions de recrutement, marketing et trésorerie prises sur ces forecasts sont mauvaises.

### Solution
ForecastIQ combine Prophet (décomposition saisonnalité + tendance sur 24 mois d'historique) avec un forecast bottom-up depuis le pipeline pondéré par les probabilités de conversion ScoreFlow. L'erreur moyenne de forecast tombe à < 8%.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Revenue Ops | Forecast précis pour planification ressources |
| CFO / Finance | Prévision trésorerie + budget opérationnel |
| Sales Manager | Savoir où en est l'équipe vs objectif du trimestre |

### OKRs
- Erreur de forecast mensuel < 8% (vs 30% sans ML)
- Forecast disponible chaque lundi matin à 8h
- Scénarios optimiste/base/pessimiste avec intervalles de confiance

---

## User Stories

```
US-01 [RevOps] En tant que Revenue Ops,
      je veux voir le forecast du trimestre en cours
      avec l'intervalle de confiance (P10-P90)
      afin de partager une fourchette crédible avec le CFO.

US-02 [Sales Manager] En tant que Sales Manager,
      je veux voir l'écart entre le forecast de semaine 1 et les revenus réels
      au fil du trimestre
      afin d'identifier les semaines sous-performantes rapidement.

US-03 [RevOps] En tant que Revenue Ops,
      je veux pouvoir ajuster le forecast manuellement
      (événement exceptionnel, deal one-shot)
      avec une note explicative
      afin que le modèle ne soit pas la seule source de vérité.

US-04 [CFO] En tant que CFO,
      je veux 3 scénarios (pessimiste, base, optimiste)
      avec les hypothèses explicites (taux de churn, croissance acquisition)
      afin de planifier la trésorerie dans chaque cas.

US-05 [Analyst] En tant qu'analyste,
      je veux voir la précision historique des forecasts sur 12 mois
      afin de valider la fiabilité du modèle avant de l'adopter.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Prophet training | 24 mois minimum d'historique requis | ✅ Data requirement |
| R2 | Blend pondéré | 60% Prophet + 40% bottom-up (configurable) | ✅ Weight slider |
| R3 | Intervalles confiance | P10/P50/P90 via Monte Carlo (1000 simulations) | ✅ Confidence bands |
| R4 | Ajustement manuel | Override humain tracé avec reason obligatoire | ✅ Adjustment form |
| R5 | Variance tracking | Écart forecast vs actual calculé semaine par semaine | ✅ Variance table |
| R6 | Seasonality | Prophet détecte hebdomadaire + annuelle | ✅ Components chart |
| R7 | Recalcul auto | Nouveau forecast chaque lundi 7h | ✅ Last updated |
| R8 | Segment forecast | Forecast par segment (New ARR, Expansion, Churned MRR) | ✅ Waterfall |
| R9 | Alert variance | Écart > 15% sur 2 semaines consécutives → alerte | ✅ Alert badge |
| R10 | Export | Export tableau Excel + graphique PNG | ✅ Export button |

---

## Spécification API

**Base URL :** `http://forecastiq.wikolabs.com/api/v1`

### GET /forecasts/quarter
```json
// GET /forecasts/quarter?q=Q2-2024
// Response: {"base": 450000, "p10": 380000, "p90": 520000, "by_week": [{"week": "2024-W14", "yhat": 38500, "actual": null}]}
```

### POST /actuals
```json
{"date": "2024-04-07", "amount": 41200, "segment": "new_arr"}
// Response: {"actual_id": "a_xyz", "variance_from_forecast": -0.07}
```

### GET /scenarios
```json
// Response: {"pessimistic": {"growth": 0.05, "p50": 380000}, "base": {"growth": 0.15, "p50": 450000}, "optimistic": {"growth": 0.25, "p50": 520000}}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Forecast Chart** | Recharts area chart : actual (ligne pleine) + forecast (pointillé) + CI shaded |
| **Scenario Sliders** | Sliders croissance/churn → mise à jour forecast en temps réel |
| **Variance Table** | Tableau semaine par semaine : forecast, actual, écart% |
| **Call Accuracy** | Barre de précision historique par mois |
| **Waterfall Bridge** | Décomposition New ARR / Expansion / Churn |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: forecastiq, POSTGRES_USER: fi_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://fi_user:${POSTGRES_PASSWORD}@postgres/forecastiq
      REDIS_URL: redis://redis:6379
    depends_on: [postgres, redis]
    expose: ["8000"]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3014:80"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] Prophet time-series forecasting
- [ ] Dashboard actual vs forecast
- [ ] Variance tracking

### Phase 2 — Precision
- [ ] Bottom-up forecast (pipeline)
- [ ] Blend Prophet + bottom-up
- [ ] Scénarios P10/P50/P90

### Phase 3 — Integration
- [ ] Sync ScoreFlow (deals conversion probabilities)
- [ ] Export CFO report automatique
- [ ] Intégration Salesforce / HubSpot

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
