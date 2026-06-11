import type { DrilldownInput, ExplainInput } from "@/types/learning";

export function buildExplainPrompt(input: ExplainInput) {
  return `You are an expert learning designer.

Create a ${input.learner_level}-friendly explanation of the user's concept.

Instructions:
- Explain the concept in plain English.
- Keep the summary between 120 and 180 words.
- Identify 4 to 8 drillable terms.
- Choose useful prerequisite concepts, not every noun.
- Include one analogy and one check-understanding question.
- Return only valid JSON matching the schema.

User concept:
${input.user_goal}

Optional pasted text:
${input.source_text ?? "None"}`;
}

export function buildDrilldownPrompt(input: DrilldownInput) {
  return `You are an expert learning designer.

Explain the selected term in the context of the parent concept.

Instructions:
- Explain only as much as needed to understand the parent concept.
- Keep the contextual explanation between 80 and 140 words.
- Tie the explanation back to the parent concept.
- Include one concrete example.
- Identify 3 to 6 new drillable terms if helpful.
- Return only valid JSON matching the schema.

Root concept:
${input.root_concept}

Parent concept:
${input.parent_concept}

Parent explanation:
${input.parent_explanation}

Selected term:
${input.selected_text}

Source sentence:
${input.source_sentence}

Breadcrumb path:
${input.breadcrumb_path.join(" -> ")}

Learner level:
${input.learner_level}`;
}
