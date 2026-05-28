'use client';

import { SkeletonTable } from '@/components/ui/skeleton-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useReducer, useRef } from 'react';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';

/**
 * Server-side pagination info (Django Ninja format)
 */
interface ServerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Server-side pagination (for Django integration) */
  serverPagination?: ServerPagination;
  /** Callback for server-side pagination */
  onPaginationChange?: (page: number, pageSize: number) => void;
  /** Callback for server-side search */
  onSearchChange?: (search: string) => void;
  /** Debounce delay for search (ms) */
  searchDebounce?: number;
}

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: Record<string, boolean>;
  searchValue: string;
}

type TableAction =
  | { type: 'SET_SORTING'; payload: SortingState }
  | { type: 'SET_COLUMN_FILTERS'; payload: ColumnFiltersState }
  | { type: 'SET_COLUMN_VISIBILITY'; payload: VisibilityState }
  | { type: 'SET_ROW_SELECTION'; payload: Record<string, boolean> }
  | { type: 'SET_SEARCH_VALUE'; payload: string };

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'SET_SORTING':
      return { ...state, sorting: action.payload };
    case 'SET_COLUMN_FILTERS':
      return { ...state, columnFilters: action.payload };
    case 'SET_COLUMN_VISIBILITY':
      return { ...state, columnVisibility: action.payload };
    case 'SET_ROW_SELECTION':
      return { ...state, rowSelection: action.payload };
    case 'SET_SEARCH_VALUE':
      return { ...state, searchValue: action.payload };
    default:
      return state;
  }
}

const initialTableState: TableState = {
  sorting: [],
  columnFilters: [],
  columnVisibility: {},
  rowSelection: {},
  searchValue: '',
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  showColumnToggle = true,
  showPagination = true,
  pageSize = 10,
  isLoading = false,
  serverPagination,
  onPaginationChange,
  onSearchChange,
  searchDebounce = 300,
}: DataTableProps<TData, TValue>) {
  const [state, dispatch] = useReducer(tableReducer, initialTableState);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    dispatch({ type: 'SET_SEARCH_VALUE', payload: value });

    if (onSearchChange) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(value);
      }, searchDebounce);
    }
  };

  const isServerSide = !!serverPagination;
  const pagination: PaginationState = isServerSide
    ? {
        pageIndex: serverPagination.page - 1,
        pageSize: serverPagination.pageSize,
      }
    : { pageIndex: 0, pageSize };

  const handlePaginationChange: OnChangeFn<PaginationState> = updater => {
    if (!onPaginationChange) return;
    const newState =
      typeof updater === 'function' ? updater(pagination) : updater;
    onPaginationChange(newState.pageIndex + 1, newState.pageSize);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(state.sorting) : updater;
      dispatch({ type: 'SET_SORTING', payload: next });
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(state.columnFilters) : updater;
      dispatch({ type: 'SET_COLUMN_FILTERS', payload: next });
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(state.columnVisibility) : updater;
      dispatch({ type: 'SET_COLUMN_VISIBILITY', payload: next });
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(state.rowSelection) : updater;
      dispatch({ type: 'SET_ROW_SELECTION', payload: next });
    },
    ...(isServerSide
      ? {
          manualPagination: true,
          manualFiltering: true,
          pageCount: serverPagination.totalPages,
          onPaginationChange: handlePaginationChange,
        }
      : {
          initialState: { pagination: { pageSize } },
        }),
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      ...(isServerSide && { pagination }),
    },
  });

  if (isLoading && data.length === 0) {
    return <SkeletonTable rows={pageSize} columns={columns.length} />;
  }

  const currentPage = isServerSide
    ? serverPagination.page
    : table.getState().pagination.pageIndex + 1;
  const totalPages = isServerSide
    ? serverPagination.totalPages
    : table.getPageCount();
  const totalRows = isServerSide
    ? serverPagination.total
    : table.getFilteredRowModel().rows.length;

  return (
    <div className="gap-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        showColumnToggle={showColumnToggle}
        isLoading={isLoading}
        onSearchChange={onSearchChange}
        searchValue={state.searchValue}
        onSearchValueChange={handleSearchChange}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <DataTablePagination
          table={table}
          data={data}
          isLoading={isLoading}
          serverPagination={serverPagination}
          onPaginationChange={onPaginationChange}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          isServerSide={isServerSide}
        />
      )}
    </div>
  );
}
