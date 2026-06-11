import type { DrilldownInput, ExplainInput } from "@/types/learning";
import { getSeededDrilldown, getSeededExplanation } from "@/lib/demoData";
import type { AiProvider } from "@/lib/ai/types";

export const fallbackProvider: AiProvider = {
  name: "fallback",
  async explain(input: ExplainInput) {
    return getSeededExplanation(input);
  },
  async drilldown(input: DrilldownInput) {
    return getSeededDrilldown(input);
  }
};
