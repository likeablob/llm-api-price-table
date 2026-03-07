"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ModelData } from "@/lib/types";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React, { useMemo, useState } from "react";

type SortColumn = keyof ModelData | null;

interface ModelBrowserProps {
  models: ModelData[];
}

type SortDirection = "asc" | "desc";

export function ModelBrowser({ models }: ModelBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAndSortedModels = useMemo(() => {
    const modelList = models ?? [];
    let result = [...modelList];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((model) =>
        model.name.toLowerCase().includes(query),
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (
          sortColumn === "inputPrice" ||
          sortColumn === "outputPrice" ||
          sortColumn === "inputCacheReadPrice" ||
          sortColumn === "inputCacheWritePrice"
        ) {
          return sortDirection === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }

        if (sortColumn === "contextLength") {
          return sortDirection === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }

        if (
          sortColumn === "inputModalities" ||
          sortColumn === "outputModalities"
        ) {
          const aArr = Array.isArray(aValue) ? aValue : [];
          const bArr = Array.isArray(bValue) ? bValue : [];
          const aLen = aArr.length;
          const bLen = bArr.length;

          if (sortDirection === "asc") {
            return aLen - bLen;
          }
          return bLen - aLen;
        }

        const aStr = String(aValue ?? "").toLowerCase();
        const bStr = String(bValue ?? "").toLowerCase();

        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr);
        }
        return bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [models, searchQuery, sortColumn, sortDirection]);

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

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="モデル名で検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Table data-testid="model-table">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                モデル名 {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("contextLength")}
            >
              <div className="flex items-center">
                コンテキスト長 {getSortIcon("contextLength")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center">
                作成日 {getSortIcon("createdAt")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("inputPrice")}
            >
              <div className="flex items-center">
                Input ($/1M Token) {getSortIcon("inputPrice")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("outputPrice")}
            >
              <div className="flex items-center">
                Output ($/1M Token) {getSortIcon("outputPrice")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("inputCacheReadPrice")}
            >
              <div className="flex items-center">
                キャッシュ読み込み ($/Mtoken){" "}
                {getSortIcon("inputCacheReadPrice")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("inputCacheWritePrice")}
            >
              <div className="flex items-center">
                キャッシュ書き込み ($/Mtoken){" "}
                {getSortIcon("inputCacheWritePrice")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("inputModalities")}
            >
              <div className="flex items-center">
                入力モダリティ {getSortIcon("inputModalities")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("outputModalities")}
            >
              <div className="flex items-center">
                出力モダリティ {getSortIcon("outputModalities")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("provider")}
            >
              <div className="flex items-center">
                プロバイダー {getSortIcon("provider")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedModels.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-muted-foreground h-24 text-center"
              >
                モデルが見つかりません
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>
                  {formatContextLength(model.contextLength)}
                </TableCell>
                <TableCell>
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
                <TableCell>{formatModalities(model.inputModalities)}</TableCell>
                <TableCell>
                  {formatModalities(model.outputModalities)}
                </TableCell>
                <TableCell>{model.provider}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
