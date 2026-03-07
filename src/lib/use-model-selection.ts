import { useCallback, useEffect, useState } from "react";
import {
  SelectedModelsSchema,
  SELECTION_STORAGE_KEY,
  SelectionStateSchema,
  type SelectedModels,
  type SelectionState,
} from "./selection-state";

export function saveSelectionToStorage(ids: SelectedModels): void {
  try {
    const state: SelectionState = {
      selectedModelIds: ids,
      lastUpdated: Date.now(),
    };
    const validated = SelectionStateSchema.safeParse(state);
    if (validated.success) {
      localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    console.error("Failed to save selection state to localStorage:", error);
  }
}

export function loadSelectionFromStorage(): SelectedModels {
  try {
    const stored = localStorage.getItem(SELECTION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const result = SelectedModelsSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to load selection state from localStorage:", error);
    return [];
  }
}

export function addModelToSelection(
  current: SelectedModels,
  id: string,
): SelectedModels {
  if (current.includes(id)) {
    return current;
  }
  return [...current, id];
}

export function removeModelFromSelection(
  current: SelectedModels,
  id: string,
): SelectedModels {
  return current.filter((modelId) => modelId !== id);
}

export function clearSelection(): SelectedModels {
  return [];
}

export function useModelSelection(initialIds: SelectedModels = []): {
  selectedModelIds: SelectedModels;
  addModel: (id: string) => void;
  removeModel: (id: string) => void;
  clearAll: () => void;
} {
  const [selectedModelIds, setSelectedModelIds] =
    useState<SelectedModels>(initialIds);

  useEffect(() => {
    const loaded = loadSelectionFromStorage();
    if (loaded.length > 0) {
      setSelectedModelIds(loaded);
    }
  }, []);

  const addModel = useCallback((id: string) => {
    setSelectedModelIds((prev) => {
      const updated = addModelToSelection(prev, id);
      saveSelectionToStorage(updated);
      return updated;
    });
  }, []);

  const removeModel = useCallback((id: string) => {
    setSelectedModelIds((prev) => {
      const updated = removeModelFromSelection(prev, id);
      saveSelectionToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    const cleared = clearSelection();
    setSelectedModelIds(cleared);
    saveSelectionToStorage(cleared);
  }, []);

  return {
    selectedModelIds,
    addModel,
    removeModel,
    clearAll,
  };
}
