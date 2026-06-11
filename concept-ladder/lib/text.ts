import type { DrillableTerm } from "@/types/learning";

export function normalizeTerm(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugify(value: string) {
  return normalizeTerm(value).replace(/\s+/g, "-") || "concept";
}

export function sameTerm(left: string, right: string) {
  return normalizeTerm(left) === normalizeTerm(right);
}

export function compactTerms(terms: DrillableTerm[], limit = 8) {
  const seen = new Set<string>();
  const compacted: DrillableTerm[] = [];

  for (const term of terms) {
    const normalized = normalizeTerm(term.term);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    compacted.push({
      ...term,
      term: term.term.trim()
    });

    if (compacted.length >= limit) {
      break;
    }
  }

  return compacted;
}

export function extractSourceSentence(text: string, term: string) {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const normalizedTerm = normalizeTerm(term);

  return (
    sentences.find((sentence) => normalizeTerm(sentence).includes(normalizedTerm)) ??
    sentences[0] ??
    text
  );
}
