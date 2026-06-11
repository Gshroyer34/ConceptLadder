"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConceptTree } from "@/components/ConceptTree";
import { DrilldownPanel } from "@/components/DrilldownPanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { TopicInput } from "@/components/TopicInput";
import {
  addDrilldownNode,
  createSessionFromExplanation,
  findExistingChild,
  getBreadcrumb,
  getNodeExplanation,
  markNodeUnderstood
} from "@/lib/conceptGraph";
import { getSeededDrilldown, getSeededExplanation } from "@/lib/demoData";
import { loadSession, saveSession } from "@/lib/storage";
import { extractSourceSentence } from "@/lib/text";
import type {
  DrillableTerm,
  DrilldownInput,
  DrilldownApiResponse,
  ExplainInput,
  ExplainApiResponse,
  LearnerLevel,
  LearningSession,
  ProviderMeta
} from "@/types/learning";

const usesStaticFallback = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function AppShell() {
  const [topic, setTopic] = useState("Kubernetes");
  const [level, setLevel] = useState<LearnerLevel>("beginner");
  const [session, setSession] = useState<LearningSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<ProviderMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSession(saved);
      setTopic(saved.rootConcept);
      setLevel(saved.learnerLevel);
      setMeta({
        requestedProvider: "fallback",
        provider: "fallback",
        fallbackUsed: false
      });
      return;
    }

    const input = {
      user_goal: "Kubernetes",
      source_text: null,
      learner_level: "beginner" as const
    };
    const output = getSeededExplanation(input);
    setSession(createSessionFromExplanation(input, output));
    setMeta({
      requestedProvider: "fallback",
      provider: "fallback",
      fallbackUsed: false
    });
  }, []);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const activeNode = session ? session.nodes[session.activeNodeId] : null;
  const rootNode = session ? session.nodes[session.rootNodeId] : null;
  const providerLabel = useMemo(() => {
    if (!meta) {
      return "Fallback ready";
    }

    return meta.fallbackUsed ? "Fallback active" : `${capitalize(meta.provider)} active`;
  }, [meta]);

  async function handleGenerate(nextTopic = topic, nextLevel = level) {
    const userGoal = nextTopic.trim() || "Kubernetes";

    setLoading(true);
    setError(null);

    try {
      const explainInput = {
        user_goal: userGoal,
        source_text: null,
        learner_level: nextLevel
      };
      const output = await requestExplanation(explainInput);
      setMeta(output.meta);
      setSession(createSessionFromExplanation(explainInput, output));
      setTopic(output.concept);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate an explanation.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTermClick(term: DrillableTerm, sourceText: string) {
    if (!session) {
      return;
    }

    const parent = session.nodes[session.activeNodeId];
    const existingChild = findExistingChild(session, parent.id, term.term);

    if (existingChild) {
      setSession({ ...session, activeNodeId: existingChild.id });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const breadcrumbPath = [...getBreadcrumb(session).map((node) => node.term), term.term];
      const parentExplanation = getNodeExplanation(parent);
      const drilldownInput = {
        root_concept: session.rootConcept,
        parent_concept: parent.term,
        parent_explanation: parentExplanation,
        selected_text: term.term,
        source_sentence: extractSourceSentence(sourceText || parentExplanation, term.term),
        breadcrumb_path: breadcrumbPath,
        learner_level: session.learnerLevel
      };

      const output = await requestDrilldown(drilldownInput);
      setMeta(output.meta);
      setSession(addDrilldownNode(session, parent.id, drilldownInput, output));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not create that drill-down.");
    } finally {
      setLoading(false);
    }
  }

  function handleExample(example: string) {
    setTopic(example);
    void handleGenerate(example);
  }

  function handleLevelChange(nextLevel: LearnerLevel) {
    setLevel(nextLevel);

    if (session) {
      void handleGenerate(topic, nextLevel);
    }
  }

  function handleSelectNode(nodeId: string) {
    if (!session) {
      return;
    }

    setSession({
      ...session,
      activeNodeId: nodeId
    });
  }

  function handleMarkUnderstood() {
    if (!session) {
      return;
    }

    setSession(markNodeUnderstood(session, session.activeNodeId));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="product-kicker">Concept Ladder</p>
          <h1>Interactive concept map</h1>
        </div>
        <div className="status-pill" title={meta?.notice}>
          <span className={meta?.fallbackUsed ? "status-light fallback" : "status-light"} />
          {providerLabel}
        </div>
      </header>

      <TopicInput
        topic={topic}
        level={level}
        loading={loading}
        onTopicChange={setTopic}
        onLevelChange={handleLevelChange}
        onGenerate={() => void handleGenerate()}
        onExample={handleExample}
      />

      <Breadcrumbs session={session} onSelect={handleSelectNode} />

      {error ? <p className="error-banner">{error}</p> : null}
      {meta?.notice && meta.fallbackUsed ? <p className="notice-banner">{meta.notice}</p> : null}

      <div className="workspace-grid">
        <ConceptTree session={session} onSelect={handleSelectNode} />
        <ExplanationPanel
          node={activeNode}
          loading={loading}
          onTermClick={handleTermClick}
          onMarkUnderstood={handleMarkUnderstood}
        />
        <DrilldownPanel rootNode={rootNode} activeNode={activeNode} onTermClick={handleTermClick} />
      </div>
    </main>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function requestExplanation(input: ExplainInput): Promise<ExplainApiResponse> {
  if (usesStaticFallback) {
    return {
      ...getSeededExplanation(input),
      meta: staticFallbackMeta()
    };
  }

  const response = await fetch("/api/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("The explanation route did not respond successfully.");
  }

  return (await response.json()) as ExplainApiResponse;
}

async function requestDrilldown(input: DrilldownInput): Promise<DrilldownApiResponse> {
  if (usesStaticFallback) {
    return {
      ...getSeededDrilldown(input),
      meta: staticFallbackMeta()
    };
  }

  const response = await fetch("/api/drilldown", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("The drill-down route did not respond successfully.");
  }

  return (await response.json()) as DrilldownApiResponse;
}

function staticFallbackMeta(): ProviderMeta {
  return {
    requestedProvider: "static-fallback",
    provider: "fallback",
    fallbackUsed: false
  };
}
