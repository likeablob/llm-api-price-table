"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ModelData } from "@/lib/types";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

type SortColumn = keyof ModelData | null;

interface ModelBrowserProps {
  models: ModelData[];
  buildDate: string;
}

type SortDirection = "asc" | "desc";

export function ModelBrowser({ models, buildDate }: ModelBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showId, setShowId] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (
          sortColumn === "inputPrice" ||
          sortColumn === "outputPrice" ||
          sortColumn === "inputCacheReadPrice" ||
          sortColumn === "inputCacheWritePrice"
        ) {
          const aNum = (aValue ?? 0) as number;
          const bNum = (bValue ?? 0) as number;
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
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

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold">モデル一覧</h2>
        <Badge variant="secondary">
          {filteredAndSortedModels.length} 個のモデル
        </Badge>
        <Badge variant="outline">最終更新：{buildDate}</Badge>
      </div>
      <div className="mb-4">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>モデル名</span>
                  {getSortIcon("name")}
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-muted-foreground text-xs">ID 表示</span>
                  <Checkbox
                    id="showId"
                    checked={showId as boolean}
                    onCheckedChange={(checked: unknown) =>
                      setShowId(checked as boolean)
                    }
                    aria-label="ID 表示"
                  />
                </div>
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
                colSpan={10}
                className="text-muted-foreground h-24 text-center"
              >
                モデルが見つかりません
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedModels.map((model, index) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{showId ? model.id : model.name}</span>
                    <button
                      onClick={() =>
                        handleCopy(showId ? model.id : model.name, index)
                      }
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={showId ? "ID をコピー" : "モデル名をコピー"}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </TableCell>
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
