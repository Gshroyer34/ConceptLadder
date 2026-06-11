import type { DrillableTerm } from "@/types/learning";

type TermButtonProps = {
  term: DrillableTerm;
  onClick: (term: DrillableTerm) => void;
  compact?: boolean;
};

export function TermButton({ term, onClick, compact = false }: TermButtonProps) {
  return (
    <button
      type="button"
      className={compact ? "term-chip term-chip-compact" : "term-chip"}
      onClick={() => onClick(term)}
      title={term.reason}
    >
      <span>{term.term}</span>
      {term.difficulty ? <small>{term.difficulty}</small> : null}
    </button>
  );
}
