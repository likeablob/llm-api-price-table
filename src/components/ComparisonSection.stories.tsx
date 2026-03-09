import type { ModelData } from "@/lib/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ComparisonSection } from "./ComparisonSection";

const mockModels: ModelData[] = [
  {
    id: "openai/gpt-4",
    name: "GPT-4",
    contextLength: 128000,
    inputPrice: 0.03,
    outputPrice: 0.06,
    inputModalities: ["text"],
    outputModalities: ["text"],
    provider: "OpenAI",
  },
  {
    id: "anthropic/claude-3",
    name: "Claude 3",
    contextLength: 200000,
    inputPrice: 0.008,
    outputPrice: 0.024,
    inputModalities: ["text"],
    outputModalities: ["text"],
    provider: "Anthropic",
  },
  {
    id: "google/gemini-1.5",
    name: "Gemini 1.5",
    contextLength: 1000000,
    inputPrice: 0.0007,
    outputPrice: 0.0015,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    provider: "Google",
  },
];

const meta = {
  title: "Components/ComparisonSection",
  component: ComparisonSection,
  args: {
    locale: "en" as const,
    models: mockModels,
    isLoaded: true,
  },
} satisfies Meta<typeof ComparisonSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
  args: {
    selectedModelIds: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyMessage = canvas.getByText(/No models selected/i);
    expect(emptyMessage).toBeInTheDocument();
    const clearAllButton = canvas.getByRole("button", {
      name: /Clear All/i,
    });
    expect(clearAllButton).toBeDisabled();
  },
};

export const WithOneModel: Story = {
  args: {
    selectedModelIds: ["openai/gpt-4"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GPT-4")).toBeInTheDocument();
    expect(canvas.getByText("128,000")).toBeInTheDocument();
    expect(canvas.getByText("$0.03")).toBeInTheDocument();
    expect(canvas.getByText("$0.06")).toBeInTheDocument();
    const deleteButton = canvas.getByRole("button", { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();
    const clearAllButton = canvas.getByRole("button", {
      name: /Clear All/i,
    });
    expect(clearAllButton).toBeInTheDocument();
  },
};

export const WithMultipleModels: Story = {
  args: {
    selectedModelIds: ["openai/gpt-4", "anthropic/claude-3"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GPT-4")).toBeInTheDocument();
    expect(canvas.getByText("Claude 3")).toBeInTheDocument();
    expect(canvas.queryByText("Gemini 1.5")).not.toBeInTheDocument();
    const deleteButtons = canvas.getAllByRole("button", { name: /Delete/i });
    expect(deleteButtons).toHaveLength(2);
  },
};

export const WithAllModels: Story = {
  args: {
    selectedModelIds: [
      "openai/gpt-4",
      "anthropic/claude-3",
      "google/gemini-1.5",
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GPT-4")).toBeInTheDocument();
    expect(canvas.getByText("Claude 3")).toBeInTheDocument();
    expect(canvas.getByText("Gemini 1.5")).toBeInTheDocument();
    const clearAllButton = canvas.getByRole("button", {
      name: /Clear All/i,
    });
    expect(clearAllButton).toBeInTheDocument();
  },
};

export const DeleteButton: Story = {
  args: {
    selectedModelIds: ["openai/gpt-4"],
    onRemove: fn(),
    onClearAll: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByRole("button", { name: /Delete/i });
    await userEvent.click(deleteButton);
    await waitFor(() => {
      expect(args.onRemove).toHaveBeenCalledWith("openai/gpt-4");
    });
  },
};

export const ClearAllButton: Story = {
  args: {
    selectedModelIds: [
      "openai/gpt-4",
      "anthropic/claude-3",
      "google/gemini-1.5",
    ],
    onRemove: fn(),
    onClearAll: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const clearAllButton = canvas.getByRole("button", {
      name: /Clear All/i,
    });
    await userEvent.click(clearAllButton);
    await waitFor(() => {
      expect(args.onClearAll).toHaveBeenCalled();
    });
  },
};

export const SortFunctionality: Story = {
  args: {
    selectedModelIds: [
      "openai/gpt-4",
      "anthropic/claude-3",
      "google/gemini-1.5",
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByText(/Model Name/);
    await userEvent.click(nameHeader);
    await waitFor(() => {
      const rows = canvas.getAllByRole("row").slice(1);
      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain("Claude");
    });
    const inputHeaders = canvas.getAllByText(
      (content) => content.startsWith("Input") && !content.includes("Cache"),
    );
    await userEvent.click(inputHeaders[0]);
    await waitFor(() => {
      const rows = canvas.getAllByRole("row").slice(1);
      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain("Gemini");
    });
  },
};
