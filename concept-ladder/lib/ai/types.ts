import type { DrilldownInput, DrilldownOutput, ExplainInput, ExplainOutput } from "@/types/learning";

export type AiProviderName = "fallback" | "oci";

export type AiProvider = {
  name: AiProviderName;
  explain(input: ExplainInput): Promise<ExplainOutput>;
  drilldown(input: DrilldownInput): Promise<DrilldownOutput>;
};
