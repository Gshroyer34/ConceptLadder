# Concept Ladder App

This is the Next.js MVP for Concept Ladder, an interactive learning tool that explains a topic, highlights important terms, and lets learners drill into those terms in context.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run typecheck
npm run build
npm run start
```

## Core Flow

1. Enter a topic such as `Kubernetes`, `Neural networks`, or `OAuth`.
2. Select a learner level.
3. Generate the initial explanation.
4. Click a highlighted term.
5. Drill deeper while the breadcrumb and concept tree update.
6. Mark concepts as understood.

## Demo Reliability

The app works without AI credentials through the fallback provider:

```text
AI_PROVIDER=fallback
```

Seeded content includes:

- `Kubernetes -> containers -> container image -> runtime`
- `Kubernetes -> cluster -> node -> pod`
- Neural networks root drilldowns
- OAuth root drilldowns

## Architecture

```text
app/
  page.tsx              App entry
  api/explain/route.ts  Initial explanation API
  api/drilldown/route.ts Contextual drill-down API
components/             UI components
lib/
  ai/                   Provider abstraction and validation
  demoData.ts           Seeded fallback content
  conceptGraph.ts       Session and graph helpers
  storage.ts            localStorage persistence
types/learning.ts       Shared data model
```

## Provider Boundary

The app calls internal API routes instead of talking directly to a model from the UI. `lib/ai/index.ts` selects a provider and falls back to seeded data if a provider fails.

Current providers:

- `fallback`: implemented
- `oci`: placeholder for OCI Generative AI
