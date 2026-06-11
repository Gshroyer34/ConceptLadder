import type { ConceptNode, DrillableTerm } from "@/types/learning";
import { getNodeExplanation } from "@/lib/conceptGraph";
import { HighlightedText } from "@/components/HighlightedText";
import { TermButton } from "@/components/TermButton";

type ExplanationPanelProps = {
  node: ConceptNode | null;
  loading: boolean;
  onTermClick: (term: DrillableTerm, sourceText: string) => void;
  onMarkUnderstood: () => void;
};

export function ExplanationPanel({ node, loading, onTermClick, onMarkUnderstood }: ExplanationPanelProps) {
  if (!node) {
    return (
      <section className="main-panel empty-panel" aria-label="Explanation">
        <h1>Concept Ladder</h1>
        <p>Enter a topic to build the first rung.</p>
      </section>
    );
  }

  const explanation = getNodeExplanation(node);

  return (
    <section className="main-panel" aria-label="Explanation">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{node.depth === 0 ? "Root concept" : `Depth ${node.depth}`}</span>
          <h1>{node.term}</h1>
        </div>
        <button
          type="button"
          className={node.status === "understood" ? "understood-button active" : "understood-button"}
          onClick={onMarkUnderstood}
        >
          {node.status === "understood" ? "Understood" : "Mark understood"}
        </button>
      </div>

      <p className="explanation-copy">
        <HighlightedText text={explanation} terms={node.terms} onTermClick={onTermClick} />
      </p>

      {node.safetyNote ? <p className="safety-note">{node.safetyNote}</p> : null}
      {node.depthWarning ? <p className="depth-note">This is close to a foundation concept.</p> : null}

      <div className="term-list" aria-label="Drillable terms">
        {node.terms.map((term) => (
          <TermButton
            compact
            term={term}
            key={term.term}
            onClick={(selectedTerm) => onTermClick(selectedTerm, explanation)}
          />
        ))}
      </div>

      {loading ? <div className="loading-bar" aria-label="Loading" /> : null}
    </section>
  );
}
