"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { t, tTableHeader, type Locale } from "@/lib/translations";
import type { ModelData } from "@/lib/types";
import { useModelSelection } from "@/lib/use-model-selection";
import { sortModels, type SortColumn, type SortDirection } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Copy,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ComparisonSection } from "./ComparisonSection";

const isNew = (
  createdAt: number | null | undefined,
  buildDate: string,
): boolean => {
  if (!createdAt) return false;
  const created = new Date(createdAt * 1000);
  const build = new Date(buildDate);
  const diffInDays = Math.floor(
    (build.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffInDays <= 30;
};

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

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toPrecision(3)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatContextLength = (length: number) => {
    return length.toLocaleString();
  };

  const formatModalities = (modalities: string[]) => {
    return modalities.join(", ");
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
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t(locale, "searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border py-2 pr-3 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <Table data-testid="model-table">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{tTableHeader(locale, "modelName")}</span>
                    {getSortIcon("name")}
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-muted-foreground text-xs">
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
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("contextLength")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "contextLength")}{" "}
                  {getSortIcon("contextLength")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "createdAt")} {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("inputPrice")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "input")} {getSortIcon("inputPrice")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("outputPrice")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "output")} {getSortIcon("outputPrice")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("inputCacheReadPrice")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "inputCacheRead")}{" "}
                  {getSortIcon("inputCacheReadPrice")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("inputCacheWritePrice")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "inputCacheWrite")}{" "}
                  {getSortIcon("inputCacheWritePrice")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("inputModalities")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "inputModalities")}{" "}
                  {getSortIcon("inputModalities")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("outputModalities")}
              >
                <div className="flex items-center">
                  {tTableHeader(locale, "outputModalities")}{" "}
                  {getSortIcon("outputModalities")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedModels.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-muted-foreground h-24 text-center"
                >
                  {t(locale, "noModelsFound")}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedModels.map((model, index) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span>{showId ? model.id : model.name}</span>
                        <button
                          onClick={() =>
                            handleCopy(showId ? model.id : model.name, index)
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title={
                            showId ? t(locale, "copyId") : t(locale, "copyName")
                          }
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddModel(model.id)}
                        className={`ml-auto h-auto p-0 ${
                          selectedModelIds.includes(model.id)
                            ? "text-green-600 hover:text-green-600"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title={
                          selectedModelIds.includes(model.id)
                            ? t(locale, "selected")
                            : t(locale, "addToComparison")
                        }
                        aria-label={t(locale, "addToComparison")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatContextLength(model.contextLength)}
                  </TableCell>
                  <TableCell
                    className={
                      isNew(model.createdAt, buildDate)
                        ? "text-primary underline decoration-2"
                        : ""
                    }
                  >
                    {model.createdAt
                      ? new Date(model.createdAt * 1000)
                          .toISOString()
                          .split("T")[0]
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
                  <TableCell>
                    {formatModalities(model.inputModalities)}
                  </TableCell>
                  <TableCell>
                    {formatModalities(model.outputModalities)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
