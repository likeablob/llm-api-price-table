import type { ModelData } from "@/lib/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
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
    inputPrice: 2.5,
    outputPrice: 15,
    inputCacheReadPrice: 1.25,
    inputCacheWritePrice: 0.625,
    inputModalities: ["text"],
    outputModalities: ["text"],
    provider: "OpenAI",
    createdAt: 1700000000,
  },
  {
    id: "anthropic/claude-3-5-sonnet",
    name: "Anthropic: Claude 3.5 Sonnet",
    contextLength: 200000,
    inputPrice: 3,
    outputPrice: 15,
    inputCacheReadPrice: 1.5,
    inputCacheWritePrice: 0.75,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    provider: "Anthropic",
    createdAt: 1690000000,
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Google: Gemini 2.0 Flash",
    contextLength: 1000000,
    inputPrice: 0.15,
    outputPrice: 0.6,
    inputCacheReadPrice: 0.075,
    inputCacheWritePrice: 0.0375,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    provider: "Google",
    createdAt: 1680000000,
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyMessage = canvas.getByText("モデルが見つかりません");
    expect(emptyMessage).toBeInTheDocument();
  },
};

export const WithSearch: Story = {
  args: {
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText("モデル名で検索");
    await userEvent.type(searchInput, "Claude");
    const modelCells = canvas.getAllByRole("cell", {
      name: "Anthropic: Claude 3.5 Sonnet",
    });
    expect(modelCells).toHaveLength(1);
  },
};

export const WithSearchById: Story = {
  args: {
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: /ID 表示/ });
    await userEvent.click(checkbox);
    const searchInput = canvas.getByPlaceholderText("モデル名で検索");
    await userEvent.type(searchInput, "google/gemini");
    const modelCells = canvas.getAllByRole("cell", {
      name: "google/gemini-2.0-flash",
    });
    expect(modelCells).toHaveLength(1);
  },
};

export const WithIdCheckbox: Story = {
  args: {
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: /ID 表示/ });
    await userEvent.click(checkbox);
    const idCells = canvas.getAllByRole("cell", {
      name: /openai\/gpt-5.4-pro|anthropic\/claude-3-5-sonnet|google\/gemini-2.0-flash/,
    });
    expect(idCells).toHaveLength(3);
  },
};

export const ToggleAddRemove: Story = {
  args: {
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const plusButtons = canvas.getAllByRole("button", { name: /比較に追加/ });
    await userEvent.click(plusButtons[0]);
    const comparisonSection = canvas.getByText(/モデル比較/);
    expect(comparisonSection).toBeInTheDocument();
    await userEvent.click(plusButtons[0]);
    const emptyMessage = canvas.getByText(/選択されたモデルはありません/i);
    expect(emptyMessage).toBeInTheDocument();
  },
};
