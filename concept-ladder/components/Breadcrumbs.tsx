import type { ConceptNode, LearningSession } from "@/types/learning";
import { getBreadcrumb } from "@/lib/conceptGraph";

type BreadcrumbsProps = {
  session: LearningSession | null;
  onSelect: (nodeId: string) => void;
};

export function Breadcrumbs({ session, onSelect }: BreadcrumbsProps) {
  if (!session) {
    return (
      <nav className="breadcrumbs" aria-label="Concept path">
        <span>New path</span>
      </nav>
    );
  }

  const path = getBreadcrumb(session);

  return (
    <nav className="breadcrumbs" aria-label="Concept path">
      {path.map((node: ConceptNode, index) => (
        <span className="breadcrumb-part" key={node.id}>
          <button type="button" onClick={() => onSelect(node.id)}>
            {node.term}
          </button>
          {index < path.length - 1 ? <span className="breadcrumb-arrow">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
