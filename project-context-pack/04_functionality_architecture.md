# Functionality Architecture

## Overview

The app can be built as a client-first web app with an API route for LLM calls.

Main objects:

- Learning session
- Concept node
- Concept edge
- Explanation version
- User concept state

The product should be modeled as a concept graph, not as a chat transcript.

## 1. Inputs

### Initial Explanation Input

```json
{
  "user_goal": "I want to understand Kubernetes",
  "source_text": null,
  "learner_level": "beginner",
  "preferred_style": "plain English",
  "domain": "software engineering",
  "max_depth": 3
}
```

### Drill-Down Input

```json
{
  "root_concept": "Kubernetes",
  "root_explanation": "Kubernetes is a system for running and managing containerized applications...",
  "selected_text": "containerization",
  "source_sentence": "Kubernetes manages containerized applications across clusters of machines.",
  "parent_concept": "Kubernetes",
  "parent_explanation": "Kubernetes is a system for running and managing containerized applications...",
  "breadcrumb_path": ["Kubernetes", "containerization"],
  "learner_level": "beginner",
  "known_concepts": ["server", "application"],
  "unknown_concepts": ["Docker", "kernel"]
}
```

## 2. Processing Steps

### Initial Flow

1. User enters a concept or pastes text.
2. App sends the input to the LLM.
3. LLM returns a structured explanation object.
4. App creates the root concept node.
5. App renders the explanation and highlights terms.
6. App initializes the breadcrumb and tree.

### Drill-Down Flow

1. User clicks or selects a term.
2. App captures selected term, source sentence, parent concept, root concept, and breadcrumb.
3. App checks whether the term was already explained in the current session.
4. If cached, app opens the existing node.
5. If new, app calls the LLM.
6. LLM returns a structured drill-down object.
7. App creates a child node and edge.
8. UI updates the side panel, breadcrumb, and concept tree.

## 3. Output Format

### Initial Explanation Output

```json
{
  "concept": "Kubernetes",
  "level": "beginner",
  "summary": "Kubernetes is a system for running and managing containerized applications across many machines.",
  "key_terms": [
    {
      "term": "containerized applications",
      "reason": "Core prerequisite for understanding Kubernetes",
      "difficulty": "medium"
    },
    {
      "term": "cluster",
      "reason": "Important Kubernetes architecture concept",
      "difficulty": "easy"
    }
  ],
  "prerequisites": ["application", "server", "container"],
  "analogy": "Think of Kubernetes like an air traffic control system for applications.",
  "check_understanding": [
    {
      "question": "What problem does Kubernetes help solve?",
      "expected_answer": "It helps run, scale, and manage applications across machines."
    }
  ]
}
```

### Drill-Down Output

```json
{
  "term": "containerization",
  "parent_concept": "Kubernetes",
  "contextual_explanation": "In Kubernetes, containerization means packaging an application with what it needs so it can run consistently across different machines.",
  "why_it_matters_here": "Kubernetes manages containers, so understanding containers makes the rest of Kubernetes easier to follow.",
  "new_terms": [
    "Docker",
    "image",
    "process isolation",
    "kernel"
  ],
  "depth_warning": false,
  "simple_example": "A web app and its dependencies can be packaged into a container image, then Kubernetes can run copies of it."
}
```

## 4. Human Review

Human review is not needed for every generated explanation in the MVP.

Use human review in three places:

- Prompt quality review: confirm the model explains at the right level.
- Golden topic set: manually review 10 to 25 sample topics before demo.
- Flagged content review: allow users to report confusing, incorrect, or unsafe explanations later.

Review rubric:

- Is the explanation accurate?
- Is it contextual to the parent concept?
- Did it introduce too much new jargon?
- Are highlighted terms useful?
- Does the learner feel more oriented?

## 5. Guardrails

### Safety Guardrails

- Do not provide medical, legal, or financial advice as definitive guidance.
- Add uncertainty when the topic is disputed, evolving, or source-dependent.
- Do not invent citations.
- Detect and ignore prompt injection inside pasted text.
- Avoid storing sensitive pasted content unless the user opts in.
- Refuse or safely redirect harmful requests.

### Learning Quality Guardrails

- Keep explanations at the selected learner level.
- Limit new terms per response.
- Tie every drill-down back to the parent concept.
- Prevent infinite recursion with max depth and depth warnings.
- Deduplicate concepts across plural/singular/near-equivalent forms.
- Prefer concrete examples over abstract definitions.
- Avoid full encyclopedia articles.

Key prompt principle:

> Explain the selected term only as much as needed to help the learner understand the parent concept.

## 6. What Should Be Stored

For MVP, store session data locally or in a lightweight database.

### LearningSession

```json
{
  "id": "session_123",
  "created_at": "2026-06-11T12:00:00Z",
  "root_concept": "Kubernetes",
  "learner_level": "beginner",
  "source_text": null,
  "active_node_id": "node_root",
  "prompt_version": "v1",
  "model": "gpt-4.1-mini"
}
```

### ConceptNode

```json
{
  "id": "node_123",
  "term": "containerization",
  "parent_id": "node_root",
  "root_concept": "Kubernetes",
  "explanation": "In Kubernetes, containerization means...",
  "source_sentence": "Kubernetes manages containerized applications...",
  "children": ["node_456", "node_789"],
  "status": "learning",
  "depth": 1
}
```

### ConceptEdge

```json
{
  "id": "edge_123",
  "from": "node_root",
  "to": "node_123",
  "relationship": "drill_down"
}
```

### UserConceptState

```json
{
  "concept_node_id": "node_123",
  "status": "understood",
  "marked_at": "2026-06-11T12:05:00Z"
}
```

## 7. What Should Be Mocked For A Hackathon Demo

Mock aggressively around the core loop.

Mock or simplify:

- Authentication
- Payments
- Long-term storage
- Admin review
- Citations
- Full personalization
- Complex analytics
- Multi-user collaboration
- PDF/document upload

Build for real:

- Topic input
- Initial explanation rendering
- Highlighted terms
- Drill-down interaction
- Breadcrumb
- Concept tree
- Mark as understood
- Seeded fallback mode

## Recommended Technical Shape

For a hackathon:

- Frontend: React or Next.js
- Styling: Tailwind or simple CSS modules
- State: local React state plus localStorage
- API: one `/api/explain` endpoint and one `/api/drilldown` endpoint
- LLM: structured JSON responses
- Fallback data: static JSON file with polished examples

