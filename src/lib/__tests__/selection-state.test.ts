import { describe, expect, it } from "vitest";
import {
  SelectedModelsSchema,
  SELECTION_STORAGE_KEY,
  SelectionStateSchema,
  type SelectedModels,
  type SelectionState,
} from "../selection-state";

describe("selection-state", () => {
  describe("SELECTION_STORAGE_KEY", () => {
    it("should be defined with correct format", () => {
      expect(SELECTION_STORAGE_KEY).toBe("llm-price-table:selected-models");
    });
  });

  describe("SelectionStateSchema", () => {
    it("should validate valid selection state", () => {
      const validState: SelectionState = {
        selectedModelIds: ["model-1", "model-2"],
        lastUpdated: Date.now(),
      };

      const result = SelectionStateSchema.safeParse(validState);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.selectedModelIds).toHaveLength(2);
        expect(typeof result.data.lastUpdated).toBe("number");
      }
    });

    it("should reject invalid selection state", () => {
      const invalidState = {
        selectedModelIds: "not-an-array",
        lastUpdated: Date.now(),
      };

      const result = SelectionStateSchema.safeParse(invalidState);
      expect(result.success).toBe(false);
    });

    it("should allow empty selectedModelIds array", () => {
      const state: SelectionState = {
        selectedModelIds: [],
        lastUpdated: Date.now(),
      };

      const result = SelectionStateSchema.safeParse(state);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.selectedModelIds).toHaveLength(0);
      }
    });
  });

  describe("SelectedModelsSchema", () => {
    it("should validate valid selected models", () => {
      const selected: SelectedModels = ["model-1", "model-2", "model-3"];

      const result = SelectedModelsSchema.safeParse(selected);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);
        expect(
          result.data.every((id): id is string => typeof id === "string"),
        ).toBe(true);
      }
    });

    it("should allow empty array", () => {
      const selected: SelectedModels = [];

      const result = SelectedModelsSchema.safeParse(selected);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });

    it("should reject non-string elements", () => {
      const invalid: unknown = [1, 2, 3];

      const result = SelectedModelsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
