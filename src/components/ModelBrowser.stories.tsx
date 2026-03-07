import type { ModelData } from "@/lib/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModelBrowser } from "./ModelBrowser";

const meta = {
  title: "Components/ModelBrowser",
  component: ModelBrowser,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ModelBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockModels: ModelData[] = [
  {
    id: "openai/gpt-5.4-pro",
    name: "OpenAI: GPT-5.4 Pro",
    contextLength: 200000,
    inputPrice: 0.0000025,
    outputPrice: 0.000015,
    inputModalities: ["text"],
    outputModalities: ["text"],
    provider: "OpenAI",
  },
  {
    id: "anthropic/claude-3-5-sonnet",
    name: "Anthropic: Claude 3.5 Sonnet",
    contextLength: 200000,
    inputPrice: 0.000003,
    outputPrice: 0.000015,
    inputModalities: ["text"],
    outputModalities: ["text"],
    provider: "Anthropic",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Google: Gemini 2.0 Flash",
    contextLength: 1000000,
    inputPrice: 0.00000015,
    outputPrice: 0.0000006,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    provider: "Google",
  },
];

export const Default: Story = {
  args: {
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
};

export const EmptyState: Story = {
  args: {
    models: [],
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
};

export const WithSearch: Story = {
  args: {
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvas, userEvent }) => {
    const searchInput = canvas.getByPlaceholderText("モデル名で検索");
    await userEvent.type(searchInput, "Claude");
  },
};
