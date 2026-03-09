"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { t, type Locale } from "@/lib/translations";
import type { ModelData } from "@/lib/types";
import { useModelSelection } from "@/lib/use-model-selection";
import { sortModels, type SortColumn, type SortDirection } from "@/lib/utils";
import { Check, Copy, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ComparisonSection } from "./ComparisonSection";
import { ModelTable } from "./ModelTable";

interface ModelBrowserProps {
  locale: Locale;
  models: ModelData[];
  buildDate: string;
}

export function ModelBrowser({ locale, models, buildDate }: ModelBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showId, setShowId] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { selectedModelIds, isLoaded, addModel, removeModel, clearAll } =
    useModelSelection();

  const filteredAndSortedModels = useMemo(() => {
    const modelList = models ?? [];
    let result = [...modelList];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((model) =>
        showId
          ? model.id.toLowerCase().includes(query)
          : model.name.toLowerCase().includes(query),
      );
    }

    if (sortColumn) {
      result = sortModels(result, sortColumn, sortDirection);
    }

    return result;
  }, [models, searchQuery, sortColumn, sortDirection, showId]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleAddModel = (id: string) => {
    if (selectedModelIds.includes(id)) {
      removeModel(id);
    } else {
      addModel(id);
    }
  };

  const RowActionComponent = ({ model }: any) => {
    const isAdded = selectedModelIds.includes(model.id);

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAddModel(model.id)}
        className={`h-auto p-0 ${
          isAdded
            ? "text-green-600 hover:text-green-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title={isAdded ? t(locale, "selected") : t(locale, "addToComparison")}
        aria-label={t(locale, "addToComparison")}
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  };

  const renderNameExtra = (model: ModelData, showId: boolean) => {
    const index = filteredAndSortedModels.indexOf(model);
    return (
      <button
        onClick={() => handleCopy(showId ? model.id : model.name, index)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title={showId ? t(locale, "copyId") : t(locale, "copyName")}
      >
        {copiedIndex === index ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    );
  };

  return (
    <div className="w-full space-y-6">
      <ComparisonSection
        locale={locale}
        models={models}
        selectedModelIds={selectedModelIds}
        isLoaded={isLoaded}
        onRemove={removeModel}
        onClearAll={clearAll}
        showId={showId}
      />

      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{t(locale, "modelList")}</h2>
            <Badge variant="secondary">
              {filteredAndSortedModels.length} {t(locale, "modelsCount")}
            </Badge>
            <Badge variant="outline">
              {t(locale, "lastUpdated")}: {buildDate}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {t(locale, "priceLabel")}
          </p>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t(locale, "searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border py-2 pr-3 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {t(locale, "showId")}
              </span>
              <Checkbox
                id="showId"
                checked={showId as boolean}
                onCheckedChange={(checked: unknown) =>
                  setShowId(checked as boolean)
                }
                aria-label={t(locale, "showId")}
              />
            </div>
          </div>
        </div>

        <ModelTable
          locale={locale}
          models={filteredAndSortedModels}
          showId={showId}
          isLoaded={isLoaded}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          rowActions={RowActionComponent}
          headerTitle={null}
          isEmptyMessage="noModelsFound"
          renderNameExtra={renderNameExtra}
          buildDate={buildDate}
          dataTestId="model-browser-table"
        />
      </div>
    </div>
  );
}
