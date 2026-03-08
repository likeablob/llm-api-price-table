"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { t, type Locale } from "@/lib/translations";
import type { ModelData } from "@/lib/types";
import {
  formatContextLength,
  formatModalities,
  formatPrice,
  sortModels,
  type SortColumn,
  type SortDirection,
} from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

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

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const handleRemove = (id: string) => {
    onRemove?.(id);
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  if (!isLoaded) {
    return (
      <div className="bg-card w-full rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          <Skeleton className="h-6 w-48" />
        </h3>
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (selectedModels.length === 0) {
    return (
      <div className="bg-card w-full rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {t(locale, "comparisonTitle")}
        </h3>
        <p className="text-muted-foreground">{t(locale, "noModelsFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-card w-full rounded-lg border">
      <div className="bg-card flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">
          {t(locale, "comparisonTitle")}
        </h3>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {t(locale, "priceLabel")}
          </p>
          {selectedModels.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2 className="text-destructive mr-2 h-4 w-4" />
              {t(locale, "clearAll")}
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-1/8 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.modelName")} {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("contextLength")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.contextLength")}{" "}
                {getSortIcon("contextLength")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.createdAt")} {getSortIcon("createdAt")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputPrice")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.input")} {getSortIcon("inputPrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("outputPrice")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.output")} {getSortIcon("outputPrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputCacheReadPrice")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.inputCacheRead")}{" "}
                {getSortIcon("inputCacheReadPrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputCacheWritePrice")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.inputCacheWrite")}{" "}
                {getSortIcon("inputCacheWritePrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputModalities")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.inputModalities")}{" "}
                {getSortIcon("inputModalities")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("outputModalities")}
            >
              <div className="flex items-center">
                {t(locale, "tableHeaders.outputModalities")}{" "}
                {getSortIcon("outputModalities")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedModels.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">
                <div className="flex items-center justify-between">
                  <span>{showId ? model.id : model.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(model.id)}
                    className="text-destructive hover:text-destructive ml-auto h-auto p-0"
                    aria-label={`${t(locale, "deleteModel")}: ${showId ? model.id : model.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{formatContextLength(model.contextLength)}</TableCell>
              <TableCell>
                {model.createdAt
                  ? new Date(model.createdAt * 1000).toISOString().split("T")[0]
                  : "-"}
              </TableCell>
              <TableCell>{formatPrice(model.inputPrice)}</TableCell>
              <TableCell>{formatPrice(model.outputPrice)}</TableCell>
              <TableCell>
                {model.inputCacheReadPrice
                  ? formatPrice(model.inputCacheReadPrice)
                  : "-"}
              </TableCell>
              <TableCell>
                {model.inputCacheWritePrice
                  ? formatPrice(model.inputCacheWritePrice)
                  : "-"}
              </TableCell>
              <TableCell>{formatModalities(model.inputModalities)}</TableCell>
              <TableCell>{formatModalities(model.outputModalities)}</TableCell>
            </TableRow>
          ))}
          {selectedModels.length === 0 && isLoaded && (
            <>
              {[...Array(3)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell colSpan={10} className="h-24">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
