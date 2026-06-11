export type LearnerLevel = "beginner" | "intermediate" | "expert";

export type TermDifficulty = "easy" | "medium" | "hard";

export type ConceptStatus = "new" | "learning" | "understood";

export type DrillableTerm = {
  term: string;
  reason?: string;
  difficulty?: TermDifficulty;
};

export type UnderstandingCheck = {
  question: string;
  expected_answer: string;
};

export type ExplainInput = {
  user_goal: string;
  source_text?: string | null;
  learner_level: LearnerLevel;
};

export type ExplainOutput = {
  concept: string;
  level: LearnerLevel;
  summary: string;
  key_terms: DrillableTerm[];
  prerequisites: string[];
  analogy: string;
  check_understanding: UnderstandingCheck[];
  safety_note: string | null;
};

export type DrilldownInput = {
  root_concept: string;
  parent_concept: string;
  parent_explanation: string;
  selected_text: string;
  source_sentence: string;
  breadcrumb_path: string[];
  learner_level: LearnerLevel;
};

export type DrilldownOutput = {
  term: string;
  parent_concept: string;
  contextual_explanation: string;
  why_it_matters_here: string;
  new_terms: string[];
  depth_warning: boolean;
  simple_example: string;
  safety_note: string | null;
};

export type ConceptNode = {
  id: string;
  term: string;
  parentId: string | null;
  rootConcept: string;
  summary?: string;
  contextualExplanation?: string;
  whyItMattersHere?: string;
  simpleExample?: string;
  terms: DrillableTerm[];
  sourceSentence?: string;
  analogy?: string;
  prerequisites?: string[];
  checkUnderstanding?: UnderstandingCheck[];
  safetyNote?: string | null;
  depthWarning?: boolean;
  status: ConceptStatus;
  depth: number;
  children: string[];
};

export type LearningSession = {
  id: string;
  rootConcept: string;
  learnerLevel: LearnerLevel;
  activeNodeId: string;
  rootNodeId: string;
  nodes: Record<string, ConceptNode>;
  createdAt: string;
};

export type ProviderMeta = {
  requestedProvider: string;
  provider: string;
  fallbackUsed: boolean;
  notice?: string;
};

export type ExplainApiResponse = ExplainOutput & {
  meta: ProviderMeta;
};

export type DrilldownApiResponse = DrilldownOutput & {
  meta: ProviderMeta;
};
