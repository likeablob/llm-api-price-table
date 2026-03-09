"use client";

import { TableHead } from "@/components/ui/table";
import { type SortColumn, type SortDirection } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface SortableTableHeaderProps {
  column: SortColumn;
  label: React.ReactNode;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

export function SortableTableHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
}: SortableTableHeaderProps) {
  const handleSort = () => {
    onSort(column);
  };

  const getSortIcon = () => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <TableHead className="cursor-pointer" onClick={handleSort}>
      <div className="flex items-center">
        {label} {getSortIcon()}
      </div>
    </TableHead>
  );
}
