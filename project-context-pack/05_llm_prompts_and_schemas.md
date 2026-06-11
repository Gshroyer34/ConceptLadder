# LLM Prompts and Schemas

## Prompting Principle

The model should not produce a generic article. It should produce a small, structured learning object that the UI can render.

Every response should:

- Match the learner level
- Stay concise
- Explain in context
- Return drillable terms
- Avoid overwhelming the learner
- Use valid JSON

## Initial Explanation Prompt

```text
You are an expert learning designer.

Create a beginner-friendly explanation of the user's concept.

Goal:
Help the learner understand the concept without getting lost in jargon.

Instructions:
- Explain the concept in plain English.
- Keep the summary between 120 and 180 words.
- Identify 4 to 8 terms that are important to understanding the concept and may be unfamiliar.
- Choose terms that are useful drill-down points, not every noun.
- Include one simple analogy if helpful.
- Include one check-understanding question.
- Do not invent citations.
- If the topic is medical, legal, financial, or safety-critical, include appropriate uncertainty and avoid direct advice.
- Return only valid JSON matching the schema.

User concept:
{{user_goal}}

Learner level:
{{learner_level}}

Optional pasted text:
{{source_text}}
```

## Initial Explanation JSON Schema

```json
{
  "concept": "string",
  "level": "beginner | intermediate | expert",
  "summary": "string",
  "key_terms": [
    {
      "term": "string",
      "reason": "string",
      "difficulty": "easy | medium | hard"
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
  "safety_note": "string | null"
}
```

## Drill-Down Prompt

```text
You are an expert learning designer.

Explain the selected term in the context of the parent concept.

Goal:
Help the learner understand the parent concept better. Do not turn this into a general encyclopedia article.

Instructions:
- Explain only as much as needed to understand the parent concept.
- Keep the contextual explanation between 80 and 140 words.
- Tie the explanation back to the parent concept.
- Include one concrete example.
- Identify 3 to 6 new drillable terms if helpful.
- Avoid repeating terms already in the breadcrumb unless necessary.
- If the learner is already at a foundational concept, set depth_warning to true.
- Return only valid JSON matching the schema.

Root concept:
{{root_concept}}

Parent concept:
{{parent_concept}}

Parent explanation:
{{parent_explanation}}

Selected term:
{{selected_text}}

Source sentence:
{{source_sentence}}

Breadcrumb path:
{{breadcrumb_path}}

Learner level:
{{learner_level}}
```

## Drill-Down JSON Schema

```json
{
  "term": "string",
  "parent_concept": "string",
  "contextual_explanation": "string",
  "why_it_matters_here": "string",
  "new_terms": ["string"],
  "depth_warning": "boolean",
  "simple_example": "string",
  "safety_note": "string | null"
}
```

## Example Initial Response

```json
{
  "concept": "Kubernetes",
  "level": "beginner",
  "summary": "Kubernetes is a system for running and managing applications across many computers. Instead of manually starting, stopping, and fixing each copy of an app, teams tell Kubernetes what they want running, and Kubernetes works to keep that desired state true. It is especially useful for apps packaged in containers, because containers can be moved and restarted more consistently than traditional software installs. Kubernetes groups machines into a cluster, schedules work onto those machines, restarts failed parts, and can scale applications up or down when demand changes.",
  "key_terms": [
    {
      "term": "containers",
      "reason": "Kubernetes is built around running and managing containers.",
      "difficulty": "medium"
    },
    {
      "term": "cluster",
      "reason": "A cluster is the group of machines Kubernetes manages.",
      "difficulty": "easy"
    },
    {
      "term": "desired state",
      "reason": "This is how Kubernetes decides what to keep running.",
      "difficulty": "medium"
    },
    {
      "term": "scale",
      "reason": "Scaling is one of the main reasons teams use Kubernetes.",
      "difficulty": "easy"
    }
  ],
  "prerequisites": ["application", "server", "container"],
  "analogy": "Think of Kubernetes like a building manager for apps: you describe what should be running, and it keeps checking that everything is in place.",
  "check_understanding": [
    {
      "question": "What problem does Kubernetes help solve?",
      "expected_answer": "It helps run, manage, restart, and scale applications across multiple machines."
    }
  ],
  "safety_note": null
}
```

## Example Drill-Down Response

```json
{
  "term": "containers",
  "parent_concept": "Kubernetes",
  "contextual_explanation": "In Kubernetes, a container is a packaged way to run one part of an application with the files and settings it needs. Containers make it easier for Kubernetes to start the same app consistently on different machines. Kubernetes does not usually manage raw code directly; it manages containers created from container images. That is why containers are a core building block for understanding Kubernetes.",
  "why_it_matters_here": "Kubernetes is mainly valuable because it can run, restart, move, and scale containers across a cluster.",
  "new_terms": ["container image", "process isolation", "Docker", "runtime"],
  "depth_warning": false,
  "simple_example": "A checkout service for an online store can be packaged as a container, then Kubernetes can run several copies of it when traffic increases.",
  "safety_note": null
}
```

## Output Validation Rules

The app should validate:

- JSON parses successfully
- Required fields exist
- `key_terms` length is between 4 and 8 for root explanations
- `new_terms` length is between 0 and 6 for drill-downs
- Explanation strings are not empty
- Term text appears reasonable and is not too long

If validation fails:

- Retry once with a stricter repair prompt
- If still failing, use fallback content

