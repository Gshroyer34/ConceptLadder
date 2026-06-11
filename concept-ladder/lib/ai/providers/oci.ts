import type { AiProvider } from "@/lib/ai/types";

export const ociProvider: AiProvider = {
  name: "oci",
  async explain() {
    throw new Error("OCI Generative AI provider is not configured in this MVP build.");
  },
  async drilldown() {
    throw new Error("OCI Generative AI provider is not configured in this MVP build.");
  }
};
