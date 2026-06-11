import type { ConceptNode, DrillableTerm } from "@/types/learning";
import { TermButton } from "@/components/TermButton";

type DrilldownPanelProps = {
  rootNode: ConceptNode | null;
  activeNode: ConceptNode | null;
  onTermClick: (term: DrillableTerm, sourceText: string) => void;
};

export function DrilldownPanel({ rootNode, activeNode, onTermClick }: DrilldownPanelProps) {
  if (!activeNode) {
    return (
      <aside className="side-panel" aria-label="Context panel">
        <span className="eyebrow">Context</span>
        <h2>No concept selected</h2>
      </aside>
    );
  }

  if (activeNode.parentId === null) {
    return (
      <aside className="side-panel" aria-label="Context panel">
        <span className="eyebrow">Starter frame</span>
        <h2>Why this holds together</h2>
        {activeNode.analogy ? <p>{activeNode.analogy}</p> : null}
        {activeNode.prerequisites?.length ? (
          <div className="context-block">
            <h3>Prerequisites</h3>
            <div className="pill-row">
              {activeNode.prerequisites.map((item) => (
                <span className="plain-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {activeNode.checkUnderstanding?.[0] ? (
          <div className="context-block">
            <h3>Check</h3>
            <p>{activeNode.checkUnderstanding[0].question}</p>
          </div>
        ) : null}
      </aside>
    );
  }

  const contextText = activeNode.contextualExplanation ?? "";

  return (
    <aside className="side-panel" aria-label="Context panel">
      <span className="eyebrow">Contextual drill-down</span>
      <h2>{activeNode.term}</h2>
      {rootNode ? <p className="root-link">Root: {rootNode.term}</p> : null}

      {activeNode.whyItMattersHere ? (
        <div className="context-block">
          <h3>Why it matters here</h3>
          <p>{activeNode.whyItMattersHere}</p>
        </div>
      ) : null}

      {activeNode.simpleExample ? (
        <div className="context-block">
          <h3>Example</h3>
          <p>{activeNode.simpleExample}</p>
        </div>
      ) : null}

      {activeNode.terms.length ? (
        <div className="context-block">
          <h3>Next terms</h3>
          <div className="term-list">
            {activeNode.terms.map((term) => (
              <TermButton
                compact
                term={term}
                key={term.term}
                onClick={(selectedTerm) => onTermClick(selectedTerm, contextText)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
