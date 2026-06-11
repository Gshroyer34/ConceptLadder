import type {
  DrillableTerm,
  DrilldownInput,
  DrilldownOutput,
  ExplainInput,
  ExplainOutput,
  LearnerLevel
} from "@/types/learning";
import { compactTerms } from "@/lib/text";

const learnerLevels: LearnerLevel[] = ["beginner", "intermediate", "expert"];

export function parseLearnerLevel(value: unknown): LearnerLevel {
  return typeof value === "string" && learnerLevels.includes(value as LearnerLevel)
    ? (value as LearnerLevel)
    : "beginner";
}

export function parseExplainInput(value: unknown): ExplainInput {
  const record = isRecord(value) ? value : {};
  const userGoal = stringValue(record.user_goal).trim();

  return {
    user_goal: userGoal || "Kubernetes",
    source_text: nullableString(record.source_text),
    learner_level: parseLearnerLevel(record.learner_level)
  };
}

export function parseDrilldownInput(value: unknown): DrilldownInput {
  const record = isRecord(value) ? value : {};

  return {
    root_concept: stringValue(record.root_concept).trim() || "Kubernetes",
    parent_concept: stringValue(record.parent_concept).trim() || "Kubernetes",
    parent_explanation: stringValue(record.parent_explanation).trim(),
    selected_text: stringValue(record.selected_text).trim() || "core idea",
    source_sentence: stringValue(record.source_sentence).trim(),
    breadcrumb_path: stringArray(record.breadcrumb_path),
    learner_level: parseLearnerLevel(record.learner_level)
  };
}

export function assertValidExplanation(output: ExplainOutput) {
  if (!output.concept || !output.summary) {
    throw new Error("Explanation is missing a concept or summary.");
  }

  if (!Array.isArray(output.key_terms) || output.key_terms.length < 4 || output.key_terms.length > 8) {
    throw new Error("Explanation must include 4 to 8 key terms.");
  }

  return {
    ...output,
    key_terms: compactTerms(output.key_terms, 8),
    prerequisites: Array.isArray(output.prerequisites) ? output.prerequisites.slice(0, 6) : [],
    check_understanding: Array.isArray(output.check_understanding)
      ? output.check_understanding.slice(0, 2)
      : []
  };
}

export function assertValidDrilldown(output: DrilldownOutput) {
  if (!output.term || !output.contextual_explanation || !output.why_it_matters_here) {
    throw new Error("Drilldown is missing required explanation fields.");
  }

  return {
    ...output,
    new_terms: Array.isArray(output.new_terms)
      ? output.new_terms.filter((term) => typeof term === "string" && term.trim()).slice(0, 6)
      : [],
    depth_warning: Boolean(output.depth_warning)
  };
}

export function termsFromStrings(terms: string[]): DrillableTerm[] {
  return compactTerms(terms.map((term) => ({ term })), 6);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function nullableString(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "string" ? value : String(value);
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
