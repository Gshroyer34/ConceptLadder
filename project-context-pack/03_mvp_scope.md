# MVP Scope

## MVP Goal

Prove that a learner can start with a complex topic, drill into unfamiliar terms, and stay oriented through a visible concept path.

The MVP should make judges feel: "This is how learning complicated things should work."

## Core MVP Features

### 1. Topic Input

The user can enter a short topic, question, or pasted paragraph.

Examples:

- "Kubernetes"
- "OAuth"
- "How do neural networks learn?"
- A paragraph from documentation or an article

### 2. Initial Explanation

The app generates a clear explanation using the selected learner level.

Supported learner levels for MVP:

- Beginner
- Intermediate
- Expert

Beginner should be the default.

### 3. Highlighted Drillable Terms

The app highlights important terms in the explanation that are likely to block understanding.

Rules:

- Highlight 4 to 8 terms in the initial explanation.
- Avoid highlighting every noun.
- Prioritize prerequisite concepts, domain terms, and terms needed to understand the parent concept.
- Allow users to select or click terms.

### 4. Contextual Drill-Down

When a user clicks a term, the app generates a short explanation of that term in the context of the parent concept.

Example:

If the root concept is Kubernetes and the clicked term is "containerization", explain what containerization means specifically for understanding Kubernetes.

### 5. Concept Path / Breadcrumb

The app shows the user's current path.

Example:

`Kubernetes -> containerization -> kernel`

This prevents the user from losing the thread.

### 6. Concept Tree

The app shows a lightweight tree of explored concepts.

For MVP, this can be simple:

- Root node
- Child drill-down nodes
- Selected node state
- Understood state

### 7. Mark As Understood

The user can mark a concept as understood.

This is useful for the demo because it shows learning progress, not just content generation.

### 8. Demo Fallback

The app should support real AI, cached AI, and hardcoded fallback data.

Recommended modes:

- Real AI: for audience-suggested concepts
- Cached AI: for rehearsed concepts like Kubernetes or neural networks
- Fallback demo: a polished hardcoded path if API or network fails

## Nice-To-Have Features

Only add these if the core loop is already polished:

- "Explain simpler"
- "Give an example"
- "Quiz me"
- Search within concept tree
- Export learning path
- User profile of known concepts
- Citations
- Source-aware explanation from pasted documents

## Non-Goals For Hackathon MVP

Do not spend hackathon time on:

- Full course creation
- User accounts
- Payments
- Team collaboration
- Teacher dashboards
- Long-term analytics
- Complex spaced repetition
- Browser extension
- Mobile-native app
- Multi-document ingestion
- Full citation pipeline

## Demo-First Acceptance Criteria

The MVP is successful if the team can:

1. Enter a live concept from a judge.
2. Generate a useful explanation.
3. Click a highlighted term.
4. Show a contextual drill-down.
5. Drill down again.
6. Show the breadcrumb/tree updating.
7. Mark a concept as understood.
8. Switch to a seeded fallback if the live API path fails.

