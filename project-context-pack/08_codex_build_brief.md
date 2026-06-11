# Codex Build Brief

Use this file as the build instruction context when asking Codex to create the app.

## Product To Build

Build `Concept Ladder`, a web app that helps users understand complex concepts by drilling into unfamiliar terms in context.

## Core User Story

As a learner, I want to enter a complex concept, receive a clear explanation, click unfamiliar terms, and drill down into contextual explanations so I can understand the concept without losing the original thread.

## MVP Requirements

Build a polished demo app with:

- Topic input
- Learner level selector
- Initial explanation view
- Highlighted clickable terms
- Drill-down side panel or detail area
- Breadcrumb path
- Concept tree
- Mark as understood
- Real AI mode if API configuration exists
- Seeded fallback data if no API key or API call fails

## Recommended UX

Layout:

- Top: compact app header with product name and level selector
- Center-left: main explanation
- Right: drill-down panel
- Bottom or left rail: concept tree/path

Interaction:

- User enters topic and clicks generate.
- Explanation appears with highlighted terms.
- Clicking a term opens contextual explanation.
- New drillable terms appear inside the panel.
- Breadcrumb updates as the user drills deeper.
- Concept tree shows explored nodes.
- Mark-understood button changes node status.

Design direction:

- Calm, clear, learning-focused
- Not a marketing landing page
- No huge hero section
- Prioritize the actual tool as the first screen
- Avoid clutter and excessive decorative elements
- Use restrained colors and strong readability

## Data Model

Use these TypeScript-style shapes if building in React/Next.js.

```ts
type LearnerLevel = "beginner" | "intermediate" | "expert";

type DrillableTerm = {
  term: string;
  reason?: string;
  difficulty?: "easy" | "medium" | "hard";
};

type ConceptNode = {
  id: string;
  term: string;
  parentId: string | null;
  rootConcept: string;
  summary?: string;
  contextualExplanation?: string;
  whyItMattersHere?: string;
  simpleExample?: string;
  terms: DrillableTerm[];
  sourceSentence?: string;
  status: "new" | "learning" | "understood";
  depth: number;
  children: string[];
};

type LearningSession = {
  id: string;
  rootConcept: string;
  learnerLevel: LearnerLevel;
  activeNodeId: string;
  nodes: Record<string, ConceptNode>;
  rootNodeId: string;
  createdAt: string;
};
```

## API Shape

Use either real API calls or mocked functions with the same contract.

### `POST /api/explain`

Input:

```json
{
  "user_goal": "Kubernetes",
  "source_text": null,
  "learner_level": "beginner"
}
```

Output:

```json
{
  "concept": "Kubernetes",
  "level": "beginner",
  "summary": "string",
  "key_terms": [
    {
      "term": "containers",
      "reason": "string",
      "difficulty": "medium"
    }
  ],
  "prerequisites": ["string"],
  "analogy": "string",
  "check_understanding": [
    {
      "question": "string",
      "expected_answer": "string"
    }
  ],
  "safety_note": null
}
```

### `POST /api/drilldown`

Input:

```json
{
  "root_concept": "Kubernetes",
  "parent_concept": "Kubernetes",
  "parent_explanation": "string",
  "selected_text": "containers",
  "source_sentence": "string",
  "breadcrumb_path": ["Kubernetes", "containers"],
  "learner_level": "beginner"
}
```

Output:

```json
{
  "term": "containers",
  "parent_concept": "Kubernetes",
  "contextual_explanation": "string",
  "why_it_matters_here": "string",
  "new_terms": ["container image", "Docker", "runtime"],
  "depth_warning": false,
  "simple_example": "string",
  "safety_note": null
}
```

## Seeded Demo Data

Include seeded fallback data for at least:

- Kubernetes
- Neural networks
- OAuth

Kubernetes should support this path:

`Kubernetes -> containers -> container image -> runtime`

Also include:

`Kubernetes -> cluster -> node -> pod`

## Implementation Notes

- If building quickly, keep all data in React state and localStorage.
- Do not require authentication.
- Do not build payments.
- Do not build a landing page.
- Make the actual tool the first screen.
- Keep the LLM response parser defensive.
- If a live API call fails, show fallback content with a small non-blocking notice.
- Make seeded fallback responses look realistic, not obviously canned.

## Demo Acceptance Checklist

- App opens to the working tool.
- User can enter a concept.
- Explanation renders clearly.
- Highlighted terms are clickable.
- Clicking a term creates or opens a concept node.
- Breadcrumb updates.
- Concept tree updates.
- Mark as understood changes visible state.
- App works without network via seeded fallback.
- App can use real AI when configured.

## Build Priority

1. Beautiful and reliable core loop
2. Seeded fallback data
3. Concept tree and breadcrumb
4. Real AI integration
5. Polishing states: loading, errors, empty state
6. Optional extras

Do not let optional features weaken the demo path.

