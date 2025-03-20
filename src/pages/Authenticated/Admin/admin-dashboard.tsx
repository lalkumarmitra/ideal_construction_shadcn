import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboard_apis } from "@/lib/helpers/api_urls";
import ProductsAnalysis from "./DashboardComponents/ProductsAnalysis";
import ClientsAnalysis from "./DashboardComponents/ClientsAnalysis";
import InactiveResources from "./DashboardComponents/InactiveResources";
import QuantityDiscrepancies from "./DashboardComponents/QuantityDiscrepancies";
import TransactionTrends from "./DashboardComponents/TransactionTrends";
import TopPerformers from "./DashboardComponents/TopPerformers";
import { DateRange } from "react-day-picker";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from "date-fns";
import DatePickerWithRange from "@/components/Custom/DatePickerWithRange";
import { CustomSelect } from "@/components/Custom/CustomSelect";
import RouteAnalytics from "./DashboardComponents/RouteAnalytics";
import { TransactionRouteType } from "@/types/typedef";
import QuickActionGrid from "./DashboardComponents/QuickActinGrid";
import OverallStats from "./DashboardComponents/OverallStats";

interface Product { id: number; name: string; }
interface Client { id: number; name: string; }
interface Vehicle { id: number; number: string; type: string; }
interface Driver { id: number; name: string;}
interface ProductData { product: Product; transaction_count: number; total_loading_quantity?: number; total_unloading_quantity?: number; total_value?: number; average_expense: number; }
interface ClientData { client: Client; transaction_count: number; total_quantity?: number; total_price?: number;}
interface VehicleData { vehicle: Vehicle; transaction_count: number; average_expense: number; }
interface DriverData { driver: Driver; transaction_count: number; total_expense: number; average_expense: number;}
interface DailyTransaction { date: string; transaction_count: number; total_expense: number; total_loading: number; total_unloading: number; }
interface DiscrepancyItem { id: number; product_id: number; loading_quantity: number; unloading_quantity: number; difference: number; is_sold: boolean; product: Product; }
interface InactiveResources { inactive_drivers: Driver[]; inactive_vehicles: Vehicle[];}

export interface DashboardData {
	status: string;
	message: string;
  	data: {
    	overall_stats: {
			totals: {
				total_users: number;
				total_vehicles: number;
				total_loading_clients: number;
				total_unloading_clients: number;
				total_transactions: number;
			};
			increments: {
				new_users: number;
				new_vehicles: number;
				new_loading_clients: number;
				new_unloading_clients: number;
				new_transactions: number;
			};
			growth_percentages: {
				users_growth: number;
				vehicles_growth: number;
				loading_clients_growth: number;
				unloading_clients_growth: number;
				transactions_growth: number;
			};
    	};
		top_vehicles: VehicleData[];
		top_drivers: DriverData[];
		products_by_value: ProductData[];
		products_by_quantity: ProductData[];
		loading_points_by_quantity: ClientData[];
		loading_points_by_price: ClientData[];
		unloading_points_by_quantity: ClientData[];
		unloading_points_by_price: ClientData[];
		daily_transactions: DailyTransaction[];
		quantity_discrepancies: DiscrepancyItem[];
		inactive_resources: InactiveResources;
		expensive_routes: TransactionRouteType[];
		high_value_routes: TransactionRouteType[];
		high_quantity_routes: TransactionRouteType[];

		summary: {
			total_transactions: number;
			total_transport_expense: number;
			average_transport_expense: number;
			total_loading_quantity: number;
			total_unloading_quantity: number;
			total_loading_value: number;
			total_unloading_value: number;
		};
		transaction_types: Array<{
			type: string;
			count: number;
			total_expense: number;
			avg_expense: number;
		}>;
  	};
}
interface DatePreset { label: string; range: () => DateRange; }

const AdminDashboard = () => {
	const datePresets: DatePreset[] = [
		{
			label: "Today",
			range: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()),}),
		},
		{
			label: "Yesterday",
			range: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)),}),
		},
		{
			label: "This Month",
			range: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()),}),
		},
		{
			label: "This Year",
			range: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()),}),
		},
		{
			label: "Last 7 Days",
			range: () => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()),}),
		},
		{
			label: "Last 30 Days",
			range: () => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()),}),
		},
		{
			label: "Custom Date",
			range: () => ({ from: undefined, to: undefined }),
		},
	];

	const initialDateRange = datePresets[2].range();
	const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
	const fromDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
	const toDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

	// Prepare form data for the API call
	const getFormData = () => {
		const formData = new FormData();
		formData.append("from_date", fromDate);
		formData.append("to_date", toDate);
		return formData;
	};

	// Handle date range change
	const handleDateRangeChange = (range: DateRange | undefined) => {
		if (range?.from && range?.to) {
		setDateRange(range);
		}
	};

	// Handle preset selection
	const handlePresetSelect = (preset: DatePreset) => {
		if (preset.label === "Custom Date") {
			setDateRange(undefined);
			return;
		}
    	const newRange = preset.range();
    	setDateRange(newRange);
  	};

	// Use react-query to fetch dashboard data
	const { data: dashboardData, isLoading, error, refetch, isRefetching } = useQuery<DashboardData>({
		queryKey: ["dashboard", fromDate, toDate],
		queryFn: () => dashboard_apis.getData(getFormData()),
		enabled: !!fromDate && !!toDate, // Only run query when dates are available
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	// Handle refresh
	const handleRefresh = () => refetch();
  	return (
    	<div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      		{/* Header with Date Range Picker */}
      		<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
					<p className="text-muted-foreground">
						Real-time business insights and analytics Showing from{" "}
						{format(dateRange?.from || new Date(), "dd MMM, yyyy")} to{" "}
						{format(dateRange?.to || new Date(), "dd MMM, yyyy")}
					</p>
        		</div>
				<div className="flex flex-col sm:flex-row items-center gap-4">
					<div className="flex gap-2 flex-wrap">
						<CustomSelect
							className="w-44"
							dropdownClassName="bg-background/40 backdrop-blur-sm"
							options={datePresets.map((d) => ({
								label: d.label,
								value: d.label,
							}))}
							onValueChange={(v) =>
								handlePresetSelect(
								datePresets.find((d) => d.label === v) || datePresets[0]
								)
							}
							defaultValue="This Month"
						/>

						{dateRange === undefined && (
							<div className="w-64">
								<DatePickerWithRange
									isModal={false}
									onDateChange={handleDateRangeChange}
									defaultDate={dateRange}
									placeholder="Select date range"
								/>
							</div>
						)}
						<button onClick={handleRefresh} className="p-2 rounded-full hover:bg-muted transition-colors" disabled={isLoading || isRefetching}>
							<RefreshCw className={`h-5 w-5 ${isLoading || isRefetching ? "animate-spin" : ""}`} />
						</button>
					</div>
				</div>
    		</div>


			{/* Loading state */}
			{isLoading && (
				<div className="space-y-4">
					<Skeleton className="h-[120px] w-full" />
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
						{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-[100px] w-full" />))}
					</div>
				</div>
			)}

			{/* Error state */}
			{error && (
				<Card className="bg-red-50 border-red-200">
					<CardContent className="pt-6">
						<p className="text-red-600">Error loading dashboard data. Please try again.</p>
					</CardContent>
				</Card>
			)}
			<QuickActionGrid />
      		{/* Dashboard content */}
      		{dashboardData && (
        		<>
         			{/* Metric Cards */}
					<OverallStats dashboardData={dashboardData} />

					{/* Main Content */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Top Performers */}
						<TopPerformers
							vehicles={dashboardData.data.top_vehicles}
							drivers={dashboardData.data.top_drivers}
							transactionRoute={dashboardData.data.expensive_routes}
						/>
						{/* Inactive Resources */}
						<RouteAnalytics 
							highExpenseRoute={dashboardData.data.expensive_routes}
							highQuantityRoute={dashboardData.data.high_quantity_routes}
							highValueRoute={dashboardData.data.high_value_routes}
						/>
						{/* Transaction Trends */}
						<TransactionTrends data={dashboardData.data.daily_transactions} />

						{/* Products Analysis Component */}
						<ProductsAnalysis
						productsByValue={dashboardData.data.products_by_value}
						productsByQuantity={dashboardData.data.products_by_quantity}
						/>
						{/* Clients Analysis Component */}
						<ClientsAnalysis
						unloadingClients={dashboardData.data.unloading_points_by_quantity}
						unloadingClientsByPrice={
							dashboardData.data.unloading_points_by_price
						}
						/>
						{/* Quantity Discrepancies */}
						<QuantityDiscrepancies discrepancies={dashboardData.data.quantity_discrepancies} />
						<InactiveResources inactiveDrivers={dashboardData.data.inactive_resources.inactive_drivers} inactiveVehicles={dashboardData.data.inactive_resources.inactive_vehicles} />
					</div>
        		</>
      		)}
    	</div>
  	);
};

export default AdminDashboard;
