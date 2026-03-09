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
  {
    id: "meta/llama-3.1",
    name: "Meta: Llama 3.1",
    contextLength: 128000,
    inputPrice: 0.1,
    outputPrice: 0.4,
    inputModalities: ["text"],
    outputModalities: ["text"],
    provider: "Meta",
    createdAt: 1695000000,
  },
];

export const Default: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: "2024-03-08T00:00:00Z",
  },
};

export const EmptyState: Story = {
  args: {
    locale: "en",
    models: [],
    buildDate: "2024-03-08T00:00:00Z",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyMessages = canvas.getAllByText(/No models selected/i);
    await expect(emptyMessages[0]).toBeInTheDocument();
  },
};

export const WithSearch: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText("Search by model name");
    await userEvent.type(searchInput, "Claude");
    const modelCells = canvas.getAllByRole("cell", {
      name: "Anthropic: Claude 3.5 Sonnet",
    });
    expect(modelCells).toHaveLength(1);
  },
};

export const WithSearchById: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: /Show ID/ });
    await userEvent.click(checkbox);
    const searchInput = canvas.getByPlaceholderText("Search by model name");
    await userEvent.type(searchInput, "google/gemini");
    const modelCells = canvas.getAllByRole("cell", {
      name: "google/gemini-2.0-flash",
    });
    expect(modelCells).toHaveLength(1);
  },
};

export const WithIdCheckbox: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: /Show ID/ });
    await userEvent.click(checkbox);
    const idCells = canvas.getAllByRole("cell", {
      name: /openai\/gpt-5.4-pro|anthropic\/claude-3-5-sonnet|google\/gemini-2.0-flash/,
    });
    expect(idCells).toHaveLength(3);
  },
};

export const ToggleAddRemove: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const modelTable = canvas.getByTestId("model-browser-table");
    const modelWithin = within(modelTable);
    const plusButtons = modelWithin.getAllByRole("button", {
      name: /Add to comparison/,
    });
    await userEvent.click(plusButtons[0]);
    const comparisonSection = canvas.getByText(/Comparison/);
    expect(comparisonSection).toBeInTheDocument();
    const comparisonTable = canvas.getByTestId("comparison-table");
    const comparisonWithin = within(comparisonTable);
    const firstModel = comparisonWithin.getByText(/OpenAI: GPT-5\.4 Pro/i);
    expect(firstModel).toBeInTheDocument();
  },
};

export const SortInputCacheReadPrice: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const modelTable = canvas.getByTestId("model-browser-table");
    const modelWithin = within(modelTable);
    const sortHeader = modelWithin.getByRole("columnheader", {
      name: /Input Cache Read/,
    });
    await userEvent.click(sortHeader);
    const firstRow = modelWithin.getAllByRole("row")[1];
    const cells = within(firstRow).getAllByRole("cell");
    expect(cells[0].textContent).toContain("Google: Gemini 2.0 Flash");
    const lastRow = modelWithin.getAllByRole("row")[4];
    const lastCells = within(lastRow).getAllByRole("cell");
    expect(lastCells[0].textContent).toContain("Meta: Llama 3.1");
  },
};

export const SortInputCacheWritePrice: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const modelTable = canvas.getByTestId("model-browser-table");
    const modelWithin = within(modelTable);
    const sortHeader = modelWithin.getByRole("columnheader", {
      name: /Input Cache Write/,
    });
    await userEvent.click(sortHeader);
    const firstRow = modelWithin.getAllByRole("row")[1];
    const cells = within(firstRow).getAllByRole("cell");
    expect(cells[0].textContent).toContain("Google: Gemini 2.0 Flash");
    const lastRow = modelWithin.getAllByRole("row")[4];
    const lastCells = within(lastRow).getAllByRole("cell");
    expect(lastCells[0].textContent).toContain("Meta: Llama 3.1");
  },
};

export const SortInputModalities: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const modelTable = canvas.getByTestId("model-browser-table");
    const modelWithin = within(modelTable);
    const sortHeader = modelWithin.getByRole("columnheader", {
      name: /Input Modalities/,
    });
    await userEvent.click(sortHeader);
    const firstRow = modelWithin.getAllByRole("row")[1];
    const cells = within(firstRow).getAllByRole("cell");
    expect(cells[0].textContent).toContain("OpenAI: GPT-5.4 Pro");
  },
};

export const SortOutputModalities: Story = {
  args: {
    locale: "en",
    models: mockModels,
    buildDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const modelTable = canvas.getByTestId("model-browser-table");
    const modelWithin = within(modelTable);
    const sortHeader = modelWithin.getByRole("columnheader", {
      name: /Output Modalities/,
    });
    await userEvent.click(sortHeader);
    const firstRow = modelWithin.getAllByRole("row")[1];
    const cells = within(firstRow).getAllByRole("cell");
    expect(cells[0].textContent).toContain("OpenAI: GPT-5.4 Pro");
  },
};
