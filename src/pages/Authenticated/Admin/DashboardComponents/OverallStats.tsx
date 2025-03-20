
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {  Users, Truck, ArrowLeftRight, Package, TrendingUp } from 'lucide-react';
import { DashboardData } from '../admin-dashboard';

interface StatsProps {
	dashboardData: DashboardData
}

const OverallStats: React.FC<StatsProps> = ({ dashboardData }) => {
	// Define metrics based on the dashboard data
	const metrics = dashboardData ? [
        {
			title: "Total Users",
			value: dashboardData.data.overall_stats.totals.total_users,
			trend: dashboardData.data.overall_stats.growth_percentages.users_growth,
			increment: dashboardData.data.overall_stats.increments.new_users,
			icon: <Users size={24} className="text-blue-500" />,
        },
        {
			title: "Total Vehicles",
			value: dashboardData.data.overall_stats.totals.total_vehicles,
			trend: dashboardData.data.overall_stats.growth_percentages.vehicles_growth,
			increment: dashboardData.data.overall_stats.increments.new_vehicles,
			icon: <Truck size={24} className="text-green-500" />,
        },
        {
			title: "Loading Clients",
			value: dashboardData.data.overall_stats.totals.total_loading_clients,
			trend: dashboardData.data.overall_stats.growth_percentages.loading_clients_growth,
			increment: dashboardData.data.overall_stats.increments.new_loading_clients,
			icon: <ArrowLeftRight size={24} className="text-amber-500" />,
        },
        {
          	title: "Unloading Clients",
			value: dashboardData.data.overall_stats.totals.total_unloading_clients,
			trend: dashboardData.data.overall_stats.growth_percentages.unloading_clients_growth,
			increment: dashboardData.data.overall_stats.increments.new_unloading_clients,
			icon: <Package size={24} className="text-purple-500" />,
        },
        {
			title: "Total Transactions",
			value: dashboardData.data.overall_stats.totals.total_transactions,
			trend: dashboardData.data.overall_stats.growth_percentages.transactions_growth,
			increment: dashboardData.data.overall_stats.increments.new_transactions,
			icon: <TrendingUp size={24} className="text-red-500" />,
        },
    ] : [];
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
			{metrics.map((metric, index) => (
				<Card key={index} className="overflow-hidden">
					<CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
						{metric.icon}
						<span className={`text-xs font-medium ${ metric.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
							{metric.trend >= 0 ? "+" : ""}
							{metric.trend}%
						</span>
					</CardHeader>
					<CardContent className="p-4">
						<div className="text-2xl font-bold">
							{metric.value.toLocaleString()}
							<span className='text-xs text-muted-foreground ms-1'>({metric.increment > 0 ? '+' : ''}{metric.increment})</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default OverallStats;