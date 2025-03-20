// components/TransactionTrends.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CustomSelect } from "@/components/Custom/CustomSelect";
import { formatIndianNumber } from "@/lib/utils";


interface TransactionTrendsProps {
  data: Array<{
    date: string;
    transaction_count: number;
    total_expense: number;
    total_loading: number;
    total_unloading: number;
  }>;
}

const formatYAxisTick = (value: any) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value;
};

// Add this new custom tooltip component
const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const formattedValue = metric === 'transaction_count' 
    ? value
    : formatIndianNumber(value);

  return (
    <div className="rounded-lg border bg-background py-2 px-8 shadow-md">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: payload[0].color }}
        />
        <span className="font-medium">
          {metric === 'total_expense' ? '₹' : ''}{formattedValue}
          {metric === 'total_unloading' ? ' MT' : ''}
        </span>
      </div>
    </div>
  );
};

const TransactionTrends: React.FC<TransactionTrendsProps> = ({ data }) => {
	const [chartType, setChartType] = React.useState<"line" | "bar">("line");
	const [metric, setMetric] = React.useState<"transaction_count" | "total_expense" | "total_unloading">("transaction_count");

	const formattedData = data.map((item) => ({
		date: new Date(item.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
		transactions: item.transaction_count,
		expense: item.total_expense,
		unloading: item.total_unloading,
	}));

	const getChartColor = () => {
		switch (metric) {
			case "transaction_count":
				return "#3b82f6"; // Blue
			case "total_expense":
				return "#f59e0b"; // Amber
			case "total_unloading":
				return "#10b981"; // Green
			default:
				return "#3b82f6";
		}
	};

	const getMetricLabel = () => {
		switch (metric) {
			case "transaction_count":
				return "Transactions";
			case "total_expense":
				return "Expense (₹)";
			case "total_unloading":
				return "Unloading Quantity";
			default:
				return "Transactions";
		}
	};

	const getMetricKey = () => {
		switch (metric) {
			case "transaction_count":
				return "transactions";
			case "total_expense":
				return "expense";
			case "total_unloading":
				return "unloading";
			default:
				return "transactions";
		}
	};

	return (
    	<Card className="col-span-1 lg:col-span-2">
      		<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<CardTitle>Transaction Trends</CardTitle>
					<CardDescription>Daily transaction metrics over time</CardDescription>
				</div>
				<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
					<CustomSelect
						className="flex-1 sm:flex-none sm:w-[170px]"
						dropdownClassName="bg-background/40 backdrop-blur-sm"
						value={metric}
						onValueChange={(value) => setMetric(value as any)}
						options={[
							{ label: "Transaction Count", value: "transaction_count" },
							{ label: "Total Expense", value: "total_expense" },
							{ label: "Unloading Quantity", value: "total_unloading" },
						]}
					/>
					<CustomSelect
						className="flex-1 sm:flex-none sm:w-[120px]"
						dropdownClassName="bg-background/40 backdrop-blur-sm"
						value={chartType}
						onValueChange={(value) => setChartType(value as any)}
						options={[
							{ label: "Line Chart", value: "line" },
							{ label: "Bar Chart", value: "bar" },
						]}
					/>
				</div>
      		</CardHeader>
			<CardContent className="h-[250px] sm:h-[300px] md:h-[400px] pl-0">
				<ResponsiveContainer width="100%" height="100%">
					{chartType === "line" ? (
						<LineChart 
							data={formattedData}
							margin={{ 
								top: 5, 
								right: 5, 
								left: 5,
								bottom: 5 
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis 
								dataKey="date" 
								tick={{ fontSize: 11 }}
								interval={"preserveStartEnd"}
								tickMargin={5}
							/>
							<YAxis 
								tickFormatter={formatYAxisTick}
								tick={{ fontSize: 11 }}
								tickMargin={5}
								width={40}
							/>
							<Tooltip
								content={<CustomTooltip metric={metric} />}
								cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
							/>
							<Legend 
								wrapperStyle={{ fontSize: '12px' }}
								formatter={(value) => (
									<span className="text-foreground">{value}</span>
								)}
							/>
							<Line
								type="monotone"
								dataKey={getMetricKey()}
								stroke={getChartColor()}
								strokeWidth={2}
								dot={false}
								name={getMetricLabel()}
							/>
						</LineChart>
					) : (
						<BarChart 
							data={formattedData}
							margin={{ 
								top: 5, 
								right: 20, 
								left: -20,
								bottom: 5 
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis 
								dataKey="date" 
								tick={{ fontSize: 11 }}
								interval={"preserveStartEnd"}
								tickMargin={5}
							/>
							<YAxis 
								tickFormatter={formatYAxisTick}
								tick={{ fontSize: 11 }}
								tickMargin={5}
								width={40}
							/>
							<Tooltip
								content={<CustomTooltip metric={metric} />}
								cursor={{ fill: 'var(--border)', opacity: 0.2 }}
							/>
							<Legend 
								wrapperStyle={{ fontSize: '12px' }}
								formatter={(value) => (
									<span className="text-foreground">{value}</span>
								)}
							/>
							<Bar
								dataKey={getMetricKey()}
								fill={getChartColor()}
								name={getMetricLabel()}
							/>
						</BarChart>
					)}
				</ResponsiveContainer>
			</CardContent>
    	</Card>
  	);
};

export default TransactionTrends;
