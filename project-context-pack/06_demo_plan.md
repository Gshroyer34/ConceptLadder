# Demo Plan

## Demo Goal

Prove that the app helps a learner understand a complex concept without opening tabs, losing context, or manually managing follow-up questions.

## Demo Setup

Prepare three paths:

1. Real AI path: audience or judge suggests a concept.
2. Cached path: pre-generated concept such as Kubernetes, neural networks, or OAuth.
3. Hardcoded fallback path: polished demo data that works without network or API access.

The app should make it easy to switch modes without drawing attention to implementation details.

## Recommended Seed Concepts

Use 3 to 5 seeded concepts:

- Kubernetes
- Neural networks
- OAuth
- CRISPR
- Mortgage-backed securities

Kubernetes is the best primary demo because it naturally contains many drillable concepts:

- containers
- cluster
- pod
- node
- deployment
- scaling
- Docker
- kernel

## Live Demo Script

### Opening

"Most learning tools assume the next explanation is enough. But with complex topics, every explanation introduces more terms you do not understand. We built Concept Ladder to keep the learner oriented while they drill into those terms."

### Step 1: Ask For A Concept

"Give us a concept that is hard to explain in one paragraph."

Enter the concept into the app.

If the concept is too broad, use it anyway and let the app produce a beginner explanation. If the API stalls, switch to a seeded example.

### Step 2: Show Initial Explanation

Point out:

- Plain-English summary
- Highlighted drillable terms
- Learner level
- Concept tree root

Say:

"The app is not just generating text. It is identifying the terms most likely to block understanding."

### Step 3: Drill Into A Term

Click a highlighted term.

Point out:

- The explanation is contextual
- It ties back to the parent concept
- It introduces a small set of new drillable terms

Say:

"If we search this term on the web, we get a generic answer. Here, the app explains it only as much as needed to understand the original concept."

### Step 4: Drill Down Again

Click a new term inside the drill-down.

Point out:

- Breadcrumb updates
- Concept tree updates
- Learner did not lose the original topic

Say:

"This is the part that normal chat does not give you: a map of how your understanding is unfolding."

### Step 5: Mark As Understood

Mark the current node as understood.

Point out:

- Progress state changes
- The concept tree becomes a learning artifact

Say:

"Now the learner can see what they have unpacked, what they understand, and where they can return next."

## Demo Proof Points

Judges should see:

- Real input becomes an explanation
- Terms are clickable
- Clicking a term produces contextual explanation
- Breadcrumb and tree preserve orientation
- Mark-understood state proves learning progress
- Fallback mode exists for reliability

## What Not To Demo

Do not spend demo time on:

- Sign up
- Settings
- Full database design
- Prompt engineering details
- Admin workflows
- Export features
- Roadmap features

The demo should stay on the core learning loop.

## Backup Script

If the live AI call fails:

"For reliability during a live demo, we also prepared a cached version of the same workflow. The product behavior is identical: explanation, drill-down, concept path, and progress tracking."

Then run the seeded Kubernetes path.

## Timing

For a 3-minute demo:

- 0:00-0:25 Problem
- 0:25-0:50 Enter concept and generate explanation
- 0:50-1:40 First drill-down
- 1:40-2:20 Second drill-down and tree update
- 2:20-2:45 Mark understood and show progress
- 2:45-3:00 Close with target user and market

