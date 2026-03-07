import type { ModelData } from "@/lib/types";

interface OpenRouterAPIResponse {
  data: OpenRouterModel[];
}

interface OpenRouterModel {
  id: string;
  name: string;
  created: number;
  context_length: number | null;
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
    input_cache_write?: string;
  };
  architecture: {
    modality: string;
    input_modalities: string[];
    output_modalities: string[];
  };
  top_provider: {
    name?: string;
  };
}

export function parsePriceFromString(priceString: string): number {
  const parsed = parseFloat(priceString);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseModalityString(modality: string): {
  input: string[];
  output: string[];
} {
  if (!modality || !modality.includes("->")) {
    return { input: [], output: [] };
  }

  const [inputPart, outputPart] = modality.split("->");
  return {
    input: inputPart.split(",").filter(Boolean),
    output: outputPart.split(",").filter(Boolean),
  };
}

export function extractProviderFromId(modelId: string): string {
  const parts = modelId.split("/");
  if (parts.length >= 1) {
    const provider = parts[0];
    const providerMap: Record<string, string> = {
      openai: "OpenAI",
      anthropic: "Anthropic",
      google: "Google",
      meta: "Meta",
      mistral: "Mistral",
      deepseek: "DeepSeek",
    };
    return (
      providerMap[provider] ??
      provider.charAt(0).toUpperCase() + provider.slice(1)
    );
  }
  return "Unknown";
}

export function transformOpenRouterModel(model: OpenRouterModel): ModelData {
  const tokensPerMillion = 1_000_000;
  return {
    id: model.id,
    name: model.name,
    contextLength: model.context_length ?? 0,
    inputPrice: parsePriceFromString(model.pricing.prompt) * tokensPerMillion,
    outputPrice:
      parsePriceFromString(model.pricing.completion) * tokensPerMillion,
    inputCacheReadPrice: model.pricing.input_cache_read
      ? parsePriceFromString(model.pricing.input_cache_read) * tokensPerMillion
      : undefined,
    inputCacheWritePrice: model.pricing.input_cache_write
      ? parsePriceFromString(model.pricing.input_cache_write) * tokensPerMillion
      : undefined,
    inputModalities: model.architecture.input_modalities ?? [],
    outputModalities: model.architecture.output_modalities ?? [],
    provider: model.top_provider?.name ?? extractProviderFromId(model.id),
    createdAt: model.created,
  };
}

export async function fetchLLMModels(): Promise<ModelData[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models");

    if (!response.ok) {
      console.warn("OpenRouter API failed to fetch:", response.status);
      return [];
    }

    const apiResponse: OpenRouterAPIResponse = await response.json();

    return apiResponse.data
      .map((model) => transformOpenRouterModel(model))
      .filter((model) => model.inputPrice >= 0 && model.outputPrice >= 0);
  } catch (error) {
    console.warn("Failed to fetch LLM models:", error);
    return [];
  }
}
