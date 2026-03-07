import { describe, expect, it } from "vitest";
import {
  extractProviderFromId,
  parseModalityString,
  parsePriceFromString,
  transformOpenRouterModel,
} from "../llm-model-service";

describe("parsePriceFromString", () => {
  it("should convert string price to number", () => {
    expect(parsePriceFromString("0.0000025")).toBe(0.0000025);
    expect(parsePriceFromString("0.000015")).toBe(0.000015);
    expect(parsePriceFromString("0")).toBe(0);
    expect(parsePriceFromString("1.5")).toBe(1.5);
  });

  it("should handle empty string", () => {
    expect(parsePriceFromString("")).toBe(0);
  });

  it("should handle invalid strings", () => {
    expect(parsePriceFromString("invalid")).toBe(0);
    expect(parsePriceFromString("")).toBe(0);
  });
});

describe("parseModalityString", () => {
  it("should parse modality string into input and output arrays", () => {
    const result = parseModalityString("text->text");
    expect(result.input).toEqual(["text"]);
    expect(result.output).toEqual(["text"]);
  });

  it("should handle multiple modalities", () => {
    const result = parseModalityString("text,image->text");
    expect(result.input).toEqual(["text", "image"]);
    expect(result.output).toEqual(["text"]);
  });

  it("should handle empty strings", () => {
    const result = parseModalityString("");
    expect(result.input).toEqual([]);
    expect(result.output).toEqual([]);
  });
});

describe("extractProviderFromId", () => {
  it("should extract provider name from model ID", () => {
    expect(extractProviderFromId("openai/gpt-5.4-pro")).toBe("OpenAI");
    expect(extractProviderFromId("anthropic/claude-3-5-sonnet")).toBe(
      "Anthropic",
    );
    expect(extractProviderFromId("google/gemini-pro")).toBe("Google");
  });

  it("should handle single part ID", () => {
    expect(extractProviderFromId("mymodel")).toBe("Mymodel");
  });
});

describe("transformOpenRouterModel", () => {
  it("should transform OpenRouter model to ModelData", () => {
    const openRouterModel = {
      id: "openai/gpt-5.4-pro",
      name: "OpenAI: GPT-5.4 Pro",
      created: 1234567890,
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
    };

    const result = transformOpenRouterModel(openRouterModel);

    expect(result.id).toBe("openai/gpt-5.4-pro");
    expect(result.name).toBe("OpenAI: GPT-5.4 Pro");
    expect(result.contextLength).toBe(200000);
    expect(result.inputPrice).toBe(2.5);
    expect(result.outputPrice).toBe(15);
    expect(result.inputModalities).toEqual(["text"]);
    expect(result.outputModalities).toEqual(["text"]);
    expect(result.provider).toBe("OpenAI");
  });

  it("should use extractProviderFromId when top_provider name is missing", () => {
    const openRouterModel = {
      id: "anthropic/claude-3-5-sonnet",
      name: "Anthropic: Claude 3.5 Sonnet",
      created: 1234567890,
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
    };

    const result = transformOpenRouterModel(openRouterModel);

    expect(result.provider).toBe("Anthropic");
  });

  it("should handle null context_length", () => {
    const openRouterModel = {
      id: "test/model",
      name: "Test Model",
      created: 1234567890,
      context_length: null,
      pricing: {
        prompt: "0.000001",
        completion: "0.000002",
      },
      architecture: {
        modality: "text->text",
        input_modalities: ["text"],
        output_modalities: ["text"],
      },
      top_provider: {},
    };

    const result = transformOpenRouterModel(openRouterModel);

    expect(result.contextLength).toBe(0);
  });
});
