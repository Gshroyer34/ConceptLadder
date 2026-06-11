import type {
  ConceptNode,
  ConceptStatus,
  DrillableTerm,
  DrilldownInput,
  DrilldownOutput,
  ExplainInput,
  ExplainOutput,
  LearningSession
} from "@/types/learning";
import { sameTerm, slugify } from "@/lib/text";

export function createSessionFromExplanation(input: ExplainInput, output: ExplainOutput): LearningSession {
  const rootNodeId = createNodeId("root", output.concept);
  const rootNode: ConceptNode = {
    id: rootNodeId,
    term: output.concept,
    parentId: null,
    rootConcept: output.concept,
    summary: output.summary,
    terms: output.key_terms,
    analogy: output.analogy,
    prerequisites: output.prerequisites,
    checkUnderstanding: output.check_understanding,
    safetyNote: output.safety_note,
    status: "learning",
    depth: 0,
    children: []
  };

  return {
    id: createNodeId("session", output.concept),
    rootConcept: output.concept,
    learnerLevel: input.learner_level,
    activeNodeId: rootNodeId,
    rootNodeId,
    nodes: {
      [rootNodeId]: rootNode
    },
    createdAt: new Date().toISOString()
  };
}

export function addDrilldownNode(
  session: LearningSession,
  parentId: string,
  input: DrilldownInput,
  output: DrilldownOutput
): LearningSession {
  const parent = session.nodes[parentId];
  const existingChild = findExistingChild(session, parentId, output.term);

  if (existingChild) {
    return {
      ...session,
      activeNodeId: existingChild.id
    };
  }

  const childNode: ConceptNode = {
    id: createNodeId("node", output.term),
    term: output.term,
    parentId,
    rootConcept: session.rootConcept,
    contextualExplanation: output.contextual_explanation,
    whyItMattersHere: output.why_it_matters_here,
    simpleExample: output.simple_example,
    terms: output.new_terms.map((newTerm) => ({ term: newTerm })),
    sourceSentence: input.source_sentence,
    safetyNote: output.safety_note,
    depthWarning: output.depth_warning,
    status: "learning",
    depth: parent.depth + 1,
    children: []
  };

  return {
    ...session,
    activeNodeId: childNode.id,
    nodes: {
      ...session.nodes,
      [parentId]: {
        ...parent,
        children: [...parent.children, childNode.id]
      },
      [childNode.id]: childNode
    }
  };
}

export function findExistingChild(session: LearningSession, parentId: string, term: string) {
  const parent = session.nodes[parentId];
  return parent.children.map((childId) => session.nodes[childId]).find((child) => sameTerm(child.term, term));
}

export function getBreadcrumb(session: LearningSession, nodeId = session.activeNodeId) {
  const path: ConceptNode[] = [];
  let current: ConceptNode | undefined = session.nodes[nodeId];

  while (current) {
    path.unshift(current);
    current = current.parentId ? session.nodes[current.parentId] : undefined;
  }

  return path;
}

export function markNodeUnderstood(session: LearningSession, nodeId: string): LearningSession {
  const node = session.nodes[nodeId];
  const nextStatus: ConceptStatus = node.status === "understood" ? "learning" : "understood";

  return {
    ...session,
    nodes: {
      ...session.nodes,
      [nodeId]: {
        ...node,
        status: nextStatus
      }
    }
  };
}

export function getNodeExplanation(node: ConceptNode) {
  return node.summary ?? node.contextualExplanation ?? "";
}

export function createSyntheticTerms(terms: string[]): DrillableTerm[] {
  return terms.map((term) => ({ term }));
}

function createNodeId(prefix: string, label: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}_${slugify(label)}_${random}`;
}
