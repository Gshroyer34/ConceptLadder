import type { LearningSession } from "@/types/learning";

const STORAGE_KEY = "concept-ladder-session";

export function loadSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LearningSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: LearningSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
