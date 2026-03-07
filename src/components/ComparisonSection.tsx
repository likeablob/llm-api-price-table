"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  models: ModelData[];
  selectedModelIds: string[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
}

export function ComparisonSection({
  models,
  selectedModelIds,
  onRemove,
  onClearAll,
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

  if (selectedModels.length === 0) {
    return (
      <div className="bg-card w-full rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">モデル比較</h3>
        <p className="text-muted-foreground">選択されたモデルはありません</p>
        <p className="text-muted-foreground text-sm">
          モデル一覧からモデルを選択して比較してください
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card w-full rounded-lg border">
      <div className="bg-card flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">モデル比較</h3>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">価格：$/1M Token</p>
          {selectedModels.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2 className="text-destructive mr-2 h-4 w-4" />
              すべてクリア
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
                モデル名 {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("contextLength")}
            >
              <div className="flex items-center">
                コンテキスト長 {getSortIcon("contextLength")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center">
                作成日 {getSortIcon("createdAt")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputPrice")}
            >
              <div className="flex items-center">
                Input {getSortIcon("inputPrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("outputPrice")}
            >
              <div className="flex items-center">
                Output {getSortIcon("outputPrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputCacheReadPrice")}
            >
              <div className="flex items-center">
                Input Cache Read {getSortIcon("inputCacheReadPrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputCacheWritePrice")}
            >
              <div className="flex items-center">
                Input Cache Write {getSortIcon("inputCacheWritePrice")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("inputModalities")}
            >
              <div className="flex items-center">
                入力モダリティ {getSortIcon("inputModalities")}
              </div>
            </TableHead>
            <TableHead
              className="w-1/12 cursor-pointer"
              onClick={() => handleSort("outputModalities")}
            >
              <div className="flex items-center">
                出力モダリティ {getSortIcon("outputModalities")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedModels.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">
                <div className="flex items-center justify-between">
                  <span>{model.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(model.id)}
                    className="text-destructive hover:text-destructive"
                    aria-label={`${model.name} を削除`}
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
        </TableBody>
      </Table>
    </div>
  );
}
