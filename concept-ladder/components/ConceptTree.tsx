import type { ConceptNode, LearningSession } from "@/types/learning";

type ConceptTreeProps = {
  session: LearningSession | null;
  onSelect: (nodeId: string) => void;
};

export function ConceptTree({ session, onSelect }: ConceptTreeProps) {
  if (!session) {
    return (
      <aside className="tree-panel" aria-label="Concept tree">
        <span className="eyebrow">Concept tree</span>
        <p className="muted">No nodes yet.</p>
      </aside>
    );
  }

  return (
    <aside className="tree-panel" aria-label="Concept tree">
      <span className="eyebrow">Concept tree</span>
      <TreeNode
        node={session.nodes[session.rootNodeId]}
        session={session}
        activeNodeId={session.activeNodeId}
        onSelect={onSelect}
      />
    </aside>
  );
}

type TreeNodeProps = {
  node: ConceptNode;
  session: LearningSession;
  activeNodeId: string;
  onSelect: (nodeId: string) => void;
};

function TreeNode({ node, session, activeNodeId, onSelect }: TreeNodeProps) {
  return (
    <div className="tree-node">
      <button
        type="button"
        className={node.id === activeNodeId ? "tree-button active" : "tree-button"}
        onClick={() => onSelect(node.id)}
        style={{ paddingLeft: `${Math.min(node.depth * 14 + 10, 52)}px` }}
      >
        <span className={`status-dot ${node.status}`} />
        <span>{node.term}</span>
      </button>
      {node.children.map((childId) => (
        <TreeNode
          key={childId}
          node={session.nodes[childId]}
          session={session}
          activeNodeId={activeNodeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
