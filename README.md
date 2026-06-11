# Concept Ladder

Concept Ladder is a hackathon MVP that turns hard topics into clickable learning paths. A learner enters a concept, gets a plain-English explanation, clicks unfamiliar highlighted terms, and drills into contextual explanations without losing the original thread.

The app is built as a context-preserving concept graph rather than a chat transcript.

## Live Demo

Current OCI VM demo:

```text
http://143.47.120.198
```

## MVP Features

- Topic input for a concept, question, or pasted text
- Beginner, intermediate, and expert learner levels
- Initial explanation with highlighted drillable terms
- Contextual drill-down panel for clicked terms
- Breadcrumb path so learners stay oriented
- Concept tree showing explored nodes
- Mark-as-understood state for learning progress
- Seeded fallback data so the demo works without AI credentials
- API route boundaries for future AI provider integrations

## Seeded Demo Paths

The fallback provider includes polished seeded content for:

- Kubernetes
- Neural networks
- OAuth

Recommended demo paths:

```text
Kubernetes -> containers -> container image -> runtime
Kubernetes -> cluster -> node -> pod
```

## Repository Layout

```text
concept-ladder/
  app/                  Next.js App Router pages and API routes
  components/           React UI components
  lib/
    ai/                 Provider abstraction, schemas, prompts
    conceptGraph.ts     Session and graph helpers
    demoData.ts         Seeded fallback content
    storage.ts          localStorage helpers
  types/                Shared TypeScript types
project-context-pack/   Product, scope, architecture, and demo context
```

## Tech Stack

- Next.js
- React
- TypeScript
- Plain CSS
- Local React state plus `localStorage`
- Next API routes for `/api/explain` and `/api/drilldown`

## Local Development

```bash
cd concept-ladder
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Production build:

```bash
npm run typecheck
npm run build
npm run start
```

## AI Provider Mode

Fallback mode is the reliable default:

```text
AI_PROVIDER=fallback
```

The provider boundary lives in `concept-ladder/lib/ai/`.

Implemented now:

- `fallback`: seeded deterministic content

Prepared for later:

- `oci`: OCI Generative AI integration placeholder

If a configured provider fails, the API layer falls back to seeded data so the demo flow remains usable.

## Deployment Notes

The current VM deployment runs:

- App directory: `/opt/concept-ladder`
- Runtime: `/opt/concept-ladder-node`
- Service: `concept-ladder.service`
- Public proxy: nginx on port `80`

Useful server commands:

```bash
sudo systemctl status concept-ladder
sudo systemctl restart concept-ladder
sudo journalctl -u concept-ladder -f
sudo systemctl status nginx
```

## Hackathon Pitch

People learning complex topics often get blocked by unfamiliar terms inside explanations. Concept Ladder turns those terms into an interactive ladder of contextual explanations, helping learners go deeper exactly where they need to while keeping the original concept visible.
