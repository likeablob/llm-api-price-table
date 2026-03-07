import { expect, test } from "vitest";
import {
  addModelToSelection,
  clearSelection,
  loadSelectionFromStorage,
  removeModelFromSelection,
} from "../use-model-selection";

test("addModelToSelection should add a model ID", () => {
  const current: string[] = ["model-1"];
  const result = addModelToSelection(current, "model-2");

  expect(result).toContain("model-2");
  expect(result).toHaveLength(2);
});

test("addModelToSelection should not add duplicate model IDs", () => {
  const current: string[] = ["model-1"];
  const result = addModelToSelection(current, "model-1");

  expect(result).toHaveLength(1);
  expect(result).toContain("model-1");
});

test("removeModelFromSelection should remove a model ID", () => {
  const current: string[] = ["model-1", "model-2", "model-3"];
  const result = removeModelFromSelection(current, "model-2");

  expect(result).toHaveLength(2);
  expect(result).not.toContain("model-2");
  expect(result).toContain("model-1");
});

test("removeModelFromSelection should handle non-existent model", () => {
  const current: string[] = ["model-1", "model-2"];
  const result = removeModelFromSelection(current, "non-existent");

  expect(result).toEqual(current);
  expect(result).toHaveLength(2);
});

test("clearSelection should return empty array", () => {
  const result = clearSelection();

  expect(result).toHaveLength(0);
});

test("loadSelectionFromStorage should return empty array when not set", () => {
  const result = loadSelectionFromStorage();

  expect(result).toEqual([]);
});
