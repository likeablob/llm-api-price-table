import { describe, expect, it, vi } from "vitest";
import { fetchLLMModels } from "../llm-model-service";

describe("fetchLLMModels", () => {
  it("should fetch models successfully from OpenRouter API", async () => {
    const mockModels = [
      {
        id: "openai/gpt-5.4-pro",
        name: "OpenAI: GPT-5.4 Pro",
        context_length: 200000,
        pricing: {
          prompt: "0.0000025",
          completion: "0.000015",
        },
        architecture: {
          modality: "text->text",
          input_modalities: ["text"],
          output_modalities: ["text"],
        },
        top_provider: {
          name: "OpenAI",
        },
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockModels }),
      }),
    );

    const result = await fetchLLMModels();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("openai/gpt-5.4-pro");
    expect(result[0].name).toBe("OpenAI: GPT-5.4 Pro");
    expect(result[0].contextLength).toBe(200000);
    expect(result[0].inputPrice).toBe(2.5);
    expect(result[0].outputPrice).toBe(15);
    expect(result[0].inputModalities).toEqual(["text"]);
    expect(result[0].outputModalities).toEqual(["text"]);
    expect(result[0].provider).toBe("OpenAI");
  });

  it("should return empty array when API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const result = await fetchLLMModels();

    expect(result).toEqual([]);
  });

  it("should return empty array when API returns non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    const result = await fetchLLMModels();

    expect(result).toEqual([]);
  });

  it("should handle missing top_provider name by extracting from id", async () => {
    const mockModels = [
      {
        id: "anthropic/claude-3-5-sonnet",
        name: "Anthropic: Claude 3.5 Sonnet",
        context_length: 200000,
        pricing: {
          prompt: "0.000003",
          completion: "0.000015",
        },
        architecture: {
          modality: "text->text",
          input_modalities: ["text"],
          output_modalities: ["text"],
        },
        top_provider: {},
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockModels }),
      }),
    );

    const result = await fetchLLMModels();

    expect(result).toHaveLength(1);
    expect(result[0].provider).toBe("Anthropic");
  });
});
