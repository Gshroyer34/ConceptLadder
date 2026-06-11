import type { DrillableTerm } from "@/types/learning";
import { normalizeTerm } from "@/lib/text";

type HighlightedTextProps = {
  text: string;
  terms: DrillableTerm[];
  onTermClick: (term: DrillableTerm, sourceText: string) => void;
};

export function HighlightedText({ text, terms, onTermClick }: HighlightedTextProps) {
  const usableTerms = terms
    .filter((term) => term.term.trim().length > 0)
    .sort((left, right) => right.term.length - left.term.length);

  if (!text || usableTerms.length === 0) {
    return <>{text}</>;
  }

  const matcher = new RegExp(`(${usableTerms.map((term) => escapeRegex(term.term)).join("|")})`, "gi");
  const parts = text.split(matcher).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        const matchingTerm = usableTerms.find((term) => normalizeTerm(term.term) === normalizeTerm(part));

        if (!matchingTerm) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <button
            type="button"
            className="inline-term"
            key={`${part}-${index}`}
            onClick={() => onTermClick(matchingTerm, text)}
            title={matchingTerm.reason}
          >
            {part}
          </button>
        );
      })}
    </>
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
