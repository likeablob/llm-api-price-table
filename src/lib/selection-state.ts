import { z } from "zod";

export const SELECTION_STORAGE_KEY = "llm-price-table:selected-models";

export const SelectionStateSchema = z.object({
  selectedModelIds: z.array(z.string()),
  lastUpdated: z.number(),
});

export type SelectionState = z.infer<typeof SelectionStateSchema>;

export const SelectedModelsSchema = z.array(z.string());

export type SelectedModels = z.infer<typeof SelectedModelsSchema>;
