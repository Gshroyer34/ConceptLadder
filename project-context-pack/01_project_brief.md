# Project Brief

## Product

`Concept Ladder` is an AI-powered learning app for understanding complex concepts.

A user enters a topic or pastes a dense explanation. The app generates a plain-English summary, highlights important terms, and lets the user click any term to drill down into a contextual explanation. The user can keep drilling down until the concept becomes clear.

## Problem

Learning hard topics often requires understanding many prerequisite concepts. A single explanation of Kubernetes, neural networks, CRISPR, inflation, or OAuth can contain unfamiliar terms that each require separate research.

Today, learners open multiple tabs, bounce between sources, ask disconnected follow-up questions, and lose the thread of what they originally wanted to understand.

## Insight

The problem is not lack of information. The problem is that information is not organized around the learner's current context.

When a learner clicks "containerization" inside a Kubernetes explanation, they do not need a generic encyclopedia article. They need to know what containerization means in the context of Kubernetes and why it matters to the thing they are learning.

## Target User

The best first user is a technical learner or career switcher learning software, cloud, AI, cybersecurity, data, or engineering concepts.

Example user:

Maya is a 27-year-old customer support specialist trying to move into a cloud engineering role. She searches "What is Kubernetes?" and immediately hits terms like containers, Docker, clusters, nodes, pods, orchestration, networking, and kernels. She is motivated and capable, but the learning path is fragmented.

## Core Workflow

1. User enters a concept or pastes text.
2. App generates a clear explanation at the user's level.
3. App highlights important terms that may block understanding.
4. User clicks a highlighted term.
5. App explains that term in context.
6. App adds the drill-down to a visible concept path or tree.
7. User can keep drilling down, go back up, and mark concepts as understood.

## MVP Promise

In five minutes, a learner should be able to understand a concept that would normally send them into a messy research spiral.

## Why Now

LLMs make it possible to generate contextual explanations on demand, but raw chat is not enough. Learners still have to manage context, remember what they asked, and organize the dependency chain themselves. This app turns the LLM into a structured learning interface.

## Product Differentiation

Concept Ladder is not just another AI chatbot. It is a context-preserving concept graph.

Compared with search:

- Search returns sources; Concept Ladder returns a guided learning path.
- Search pulls users into tabs; Concept Ladder keeps them oriented.

Compared with generic chat:

- Chat is linear; Concept Ladder is explorable.
- Chat requires the user to manage context; Concept Ladder carries the original concept, selected term, parent explanation, and drill path into every response.

Compared with static courses:

- Courses are prebuilt; Concept Ladder adapts to the learner's exact question.
- Courses move at one pace; Concept Ladder lets the learner go deeper only where needed.

