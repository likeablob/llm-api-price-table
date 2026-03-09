"use client";

import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/translations";
import type { ModelData } from "@/lib/types";
import { sortModels, type SortColumn, type SortDirection } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ModelTable } from "./ModelTable";

interface ComparisonSectionProps {
  locale: Locale;
  models: ModelData[];
  selectedModelIds: string[];
  isLoaded: boolean;
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  showId?: boolean;
}

export function ComparisonSection({
  locale,
  models,
  selectedModelIds,
  isLoaded,
  onRemove,
  onClearAll,
  showId = false,
}: ComparisonSectionProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const selectedModels = useMemo(() => {
    const result = models.filter((model) =>
      selectedModelIds.includes(model.id),
    );

    if (sortColumn) {
      return sortModels(result, sortColumn, sortDirection);
    }

    return result;
  }, [models, selectedModelIds, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleRemove = (id: string) => {
    onRemove?.(id);
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const RowActionComponent = ({ model, showId }: any) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleRemove(model.id)}
      className="text-destructive hover:text-destructive ml-auto h-auto p-0"
      aria-label={`${t(locale, "deleteModel")}: ${showId ? model.id : model.name}`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  const extraHeaderContent = (
    <div className="flex items-center gap-2">
      <p className="text-muted-foreground text-sm">{t(locale, "priceLabel")}</p>
      {selectedModels.length > 0 ? (
        <Button variant="outline" size="sm" onClick={handleClearAll}>
          <Trash2 className="text-destructive mr-2 h-4 w-4" />
          {t(locale, "clearAll")}
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <Trash2 className="text-destructive mr-2 h-4 w-4" />
          {t(locale, "clearAll")}
        </Button>
      )}
    </div>
  );

  return (
    <ModelTable
      locale={locale}
      models={selectedModels}
      showId={showId}
      isLoaded={isLoaded}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
      rowActions={RowActionComponent}
      extraHeaderContent={extraHeaderContent}
      dataTestId="comparison-table"
    />
  );
}
