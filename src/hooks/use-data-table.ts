import * as React from "react"
import type { DataTableFilterField } from "@/types/datatable"
import {
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type TableOptions,
	type TableState,
	type VisibilityState,
} from "@tanstack/react-table"
import { useDebounce } from "./use-debounce"


interface UseDataTableProps<TData>
	extends Omit<
		TableOptions<TData>,
		| "pageCount"
		| "getCoreRowModel"
		| "manualFiltering"
		| "manualPagination"
		| "manualSorting"
	>,
	Required<Pick<TableOptions<TData>, "pageCount">> {
	/**
	 * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
	 * - Faceted filters are rendered when `options` are provided for a filter field.
	 * - Otherwise, search filters are rendered.
	 *
	 * The indie filter field `value` represents the corresponding column name in the database table.
	 * @default []
	 * @type { label: string, value: keyof TData, placeholder?: string, options?: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[] }[]
	 * @example
	 * ```ts
	 * // Render a search filter
	 * const filterFields = [
	 *   { label: "Title", value: "title", placeholder: "Search titles" }
	 * ];
	 * // Render a faceted filter
	 * const filterFields = [
	 *   {
	 *     label: "Status",
	 *     value: "status",
	 *     options: [
	 *       { label: "Todo", value: "todo" },
	 *       { label: "In Progress", value: "in-progress" },
	 *     ]
	 *   }
	 * ];
	 * ```
	 */
	filterFields?: DataTableFilterField<TData>[]

	/**
	 * Enable notion like column filters.
	 * Advanced filters and column filters cannot be used at the same time.
	 * @default false
	 * @type boolean
	 */
	enableAdvancedFilter?: boolean

	/**
	 * The method to use when updating the URL.
	 * - "push" - Pushes a new entry onto the history stack.
	 * - "replace" - Replaces the current entry on the history stack.
	 * @default "replace"
	 */
	method?: "push" | "replace"

	/**
	 * Indicates whether the page should scroll to the top when the URL changes.
	 * @default false
	 */
	scroll?: boolean

	/**
	 * A callback function that is called before updating the URL.
	 * Can be use to retrieve the loading state of the route transition.
	 * @see https://react.dev/reference/react/useTransition
	 *
	 */
	startTransition?: React.TransitionStartFunction

	// Extend to make the sorting id typesafe
	initialState?: Omit<Partial<TableState>, "sorting"> & {
		sorting?: {
			id: Extract<keyof TData, string>
			desc: boolean
		}[]
	}
}


export function useDataTable<TData>({
	pageCount = -1,
	filterFields = [],
	enableAdvancedFilter = false,
	method = "replace",
	scroll = false,
	startTransition,
	...props
}: UseDataTableProps<TData>) {
	

	// Search params
	const page = 1
	const perPage = 10
	const sort =`${props.initialState?.sorting?.[0]?.id}.${props.initialState?.sorting?.[0]?.desc ? "desc" : "asc"}`
	const [column, order] = sort?.split(".") ?? []

	const { searchableColumns, filterableColumns } = React.useMemo(() => {
		return {
			searchableColumns: filterFields.filter((field) => !field.options),
			filterableColumns: filterFields.filter((field) => field.options),
		}
	}, [filterFields])
	
	const [rowSelection, setRowSelection] = React.useState({})
	const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] =React.useState<ColumnFiltersState>([{
		id: 'key',
		value: [1],
	}])

	// Handle server-side pagination
	const [{ pageIndex, pageSize }, setPagination] =
		React.useState<PaginationState>({
			pageIndex: page - 1,
			pageSize: perPage,
		})

	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	)

	// Handle server-side sorting
	const [sorting, setSorting] = React.useState<SortingState>([
		{
			id: column ?? "",
			desc: order === "desc",
		},
	])
	const debouncedSearchableColumnFilters = JSON.parse(
		useDebounce(
			JSON.stringify(
				columnFilters.filter((filter) => {
					return searchableColumns.find((column) => column.value === filter.id)
				})
			),
			500
		)
	) as ColumnFiltersState
	const filterableColumnFilters = columnFilters.filter((filter) => {
		return filterableColumns.find((column) => column.value === filter.id)
	})

	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		// Opt out when advanced filter is enabled, because it contains additional params
		if (enableAdvancedFilter) return

		// Prevent resetting the page on initial render
		if (!mounted) {
			setMounted(true)
			return
		}

		// Initialize new params
		const newParamsObject = {
			page: 1,
		}

		// Handle debounced searchable column filters
		for (const column of debouncedSearchableColumnFilters) {
			if (typeof column.value === "string") {
				Object.assign(newParamsObject, {
					[column.id]: typeof column.value === "string" ? column.value : null,
				})
			}
		}

		// Handle filterable column filters
		for (const column of filterableColumnFilters) {
			if (typeof column.value === "object" && Array.isArray(column.value)) {
				Object.assign(newParamsObject, { [column.id]: column.value.join(".") })
			}
		}

		table.setPageIndex(0)
	}, [
		JSON.stringify(debouncedSearchableColumnFilters),
		JSON.stringify(filterableColumnFilters),
		method,
		scroll,
	])

	const table = useReactTable({
		...props,
		pageCount,
		state: {
			pagination,
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
		manualSorting: false,
		manualFiltering: false,
	})

	return { table }
}
