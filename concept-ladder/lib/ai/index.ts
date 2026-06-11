import type { DrilldownInput, ExplainInput, ProviderMeta } from "@/types/learning";
import { assertValidDrilldown, assertValidExplanation } from "@/lib/ai/schemas";
import { fallbackProvider } from "@/lib/ai/providers/fallback";
import { ociProvider } from "@/lib/ai/providers/oci";
import type { AiProvider } from "@/lib/ai/types";

export function getConfiguredProvider(): AiProvider {
  const requestedProvider = process.env.AI_PROVIDER?.toLowerCase();

  if (requestedProvider === "oci") {
    return ociProvider;
  }

  return fallbackProvider;
}

export async function generateExplanation(input: ExplainInput) {
  const provider = getConfiguredProvider();
  const requestedProvider = provider.name;

  try {
    const output = assertValidExplanation(await provider.explain(input));
    return {
      ...output,
      meta: providerMeta(requestedProvider, provider.name, false)
    };
  } catch (error) {
    const fallbackOutput = assertValidExplanation(await fallbackProvider.explain(input));

    return {
      ...fallbackOutput,
      meta: providerMeta(
        requestedProvider,
        fallbackProvider.name,
        true,
        error instanceof Error ? error.message : "Provider failed; fallback content was used."
      )
    };
  }
}

export async function generateDrilldown(input: DrilldownInput) {
  const provider = getConfiguredProvider();
  const requestedProvider = provider.name;

  try {
    const output = assertValidDrilldown(await provider.drilldown(input));
    return {
      ...output,
      meta: providerMeta(requestedProvider, provider.name, false)
    };
  } catch (error) {
    const fallbackOutput = assertValidDrilldown(await fallbackProvider.drilldown(input));

    return {
      ...fallbackOutput,
      meta: providerMeta(
        requestedProvider,
        fallbackProvider.name,
        true,
        error instanceof Error ? error.message : "Provider failed; fallback content was used."
      )
    };
  }
}

function providerMeta(
  requestedProvider: string,
  provider: string,
  fallbackUsed: boolean,
  notice?: string
): ProviderMeta {
  return {
    requestedProvider,
    provider,
    fallbackUsed,
    notice
  };
}
