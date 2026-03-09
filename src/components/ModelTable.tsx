"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TranslationKey } from "@/lib/i18n/en";
import { t, type Locale } from "@/lib/translations";
import type { ModelData } from "@/lib/types";
import {
  formatContextLength,
  formatModalities,
  formatPrice,
  type SortColumn,
  type SortDirection,
} from "@/lib/utils";
import { SortableTableHeader } from "./SortableTableHeader";

interface RowActionComponentProps {
  model: ModelData;
  showId: boolean;
  locale: Locale;
}

type RowActionComponent = React.ComponentType<RowActionComponentProps>;

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

interface ModelTableProps {
  locale: Locale;
  models: ModelData[];
  showId: boolean;
  isLoaded: boolean;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  rowActions: RowActionComponent;
  isEmptyMessage?: TranslationKey;
  headerTitle?: TranslationKey | null;
  extraHeaderContent?: React.ReactNode;
  getRowClassName?: (model: ModelData) => string;
  renderNameExtra?: (model: ModelData, showId: boolean) => React.ReactNode;
  dataTestId?: string;
  buildDate?: string;
}

export function ModelTable({
  locale,
  models,
  showId,
  isLoaded,
  sortColumn,
  sortDirection,
  onSort,
  rowActions: RowActionComponent,
  isEmptyMessage = "noModelsFound",
  headerTitle = "comparisonTitle",
  extraHeaderContent,
  getRowClassName,
  renderNameExtra,
  dataTestId = "model-table",
  buildDate,
}: ModelTableProps) {
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

  if (models.length === 0) {
    return (
      <div className="bg-card w-full rounded-lg border">
        {headerTitle && (
          <div className="bg-card flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">{t(locale, headerTitle)}</h3>
            {extraHeaderContent && <div>{extraHeaderContent}</div>}
          </div>
        )}
        <Table data-testid={dataTestId}>
          <TableHeader>
            <TableRow>
              <SortableTableHeader
                column="name"
                label={t(locale, "tableHeaders.modelName")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="contextLength"
                label={t(locale, "tableHeaders.contextLength")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="createdAt"
                label={t(locale, "tableHeaders.createdAt")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="inputPrice"
                label={t(locale, "tableHeaders.input")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="outputPrice"
                label={t(locale, "tableHeaders.output")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="inputCacheReadPrice"
                label={t(locale, "tableHeaders.inputCacheRead")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="inputCacheWritePrice"
                label={t(locale, "tableHeaders.inputCacheWrite")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="inputModalities"
                label={t(locale, "tableHeaders.inputModalities")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableTableHeader
                column="outputModalities"
                label={t(locale, "tableHeaders.outputModalities")}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <TableHead className="w-1/12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-muted-foreground h-24 text-center"
              >
                {t(locale, isEmptyMessage)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-card w-full rounded-lg border">
      {headerTitle && (
        <div className="bg-card flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{t(locale, headerTitle)}</h3>
          {extraHeaderContent && <div>{extraHeaderContent}</div>}
        </div>
      )}
      <Table data-testid={dataTestId}>
        <TableHeader>
          <TableRow>
            <SortableTableHeader
              column="name"
              label={t(locale, "tableHeaders.modelName")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="contextLength"
              label={t(locale, "tableHeaders.contextLength")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="createdAt"
              label={t(locale, "tableHeaders.createdAt")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="inputPrice"
              label={t(locale, "tableHeaders.input")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="outputPrice"
              label={t(locale, "tableHeaders.output")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="inputCacheReadPrice"
              label={t(locale, "tableHeaders.inputCacheRead")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="inputCacheWritePrice"
              label={t(locale, "tableHeaders.inputCacheWrite")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="inputModalities"
              label={t(locale, "tableHeaders.inputModalities")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableTableHeader
              column="outputModalities"
              label={t(locale, "tableHeaders.outputModalities")}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <TableHead className="w-1/12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id} className={getRowClassName?.(model) || ""}>
              <TableCell className="font-medium">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{showId ? model.id : model.name}</span>
                    {renderNameExtra?.(model, showId)}
                  </div>
                  <RowActionComponent
                    model={model}
                    showId={showId}
                    locale={locale}
                  />
                </div>
              </TableCell>
              <TableCell>{formatContextLength(model.contextLength)}</TableCell>
              <TableCell
                className={
                  buildDate && isNew(model.createdAt, buildDate)
                    ? "text-primary underline decoration-2"
                    : ""
                }
              >
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
