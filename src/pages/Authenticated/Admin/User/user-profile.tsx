import { user_apis } from "@/lib/helpers/api_urls";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { UserType } from "@/types/user";
import { TransactionType } from "@/types/typedef";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Phone, Mail, Package, Calendar, MapPin, MailPlus, PhoneIncoming } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import DatePickerWithRange from "@/components/Custom/DatePickerWithRange";
import ChangeEmailPhoneDialog from "./change-email-phone";
import { AssetUrl } from "@/lib/helpers/api_helper";

interface UserProfileResponse {
	user: UserType;
	transactions: {
		data: TransactionType[];
		current_page: number;
		total: number;
		per_page: number;
		last_page: number;
	};
	total_transactions: number;
	total_expense: number;
	total_unloaded_quantity: number;
	total_price: number;
	pagination: {
		current_page: number;
		per_page: number;
		total: number;
		last_page: number;
	};
}

const UserProfile = () => {
	const { user_id } = useParams();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
  
	// Get query params with defaults
	const currentPage = parseInt(searchParams.get("page") || "1");
	const perPage = parseInt(searchParams.get("per_page") || "10");
  
  // State for date range
	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		if (from && to) {
			return {
				from: new Date(from),
				to: new Date(to),
			};
		}
		return undefined;
	});

	// Update URL when filters change
	const updateFilters = ( page?: number, newPerPage?: number, newDateRange?: DateRange | undefined) => {
    	const params = new URLSearchParams(searchParams);
		if (page) params.set("page", page.toString());
		if (newPerPage) params.set("per_page", newPerPage.toString());
		if (newDateRange?.from) params.set("from", format(newDateRange.from, "yyyy-MM-dd"));
		else params.delete("from");
    	if (newDateRange?.to) params.set("to", format(newDateRange.to, "yyyy-MM-dd"));
    	else params.delete("to");
    	setSearchParams(params);
  	};

	// Prepare form data for API request
	const prepareFormData = () => {
		const formData = new FormData();
		formData.append("page", currentPage.toString());
		formData.append("per_page", perPage.toString());
		if (dateRange?.from) formData.append("from_date", format(dateRange.from, "yyyy-MM-dd"));
		if (dateRange?.to) formData.append("to_date", format(dateRange.to, "yyyy-MM-dd"));
		return formData;
	};

	// Query for user profile data
	const userProfileQuery = useQuery<any, any, UserProfileResponse>({
		queryKey: ["user", user_id, currentPage, perPage, dateRange?.from, dateRange?.to],
		queryFn: () => user_apis.select(prepareFormData(), user_id || ""),
		select: (res) => res.data,
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!user_id,
	});

	// Set breadcrumb on component mount
	useEffect(() => {
		dispatch(
			setBreadcrumb([
				{ label: "Dashboard", link: "/dashboard" },
				{ label: "User List", link: "/users" },
				{ label: "User Profile", type: "page" },
			])
		);
	}, []);

	// Show error toast if query fails
	useEffect(() => {
		if (userProfileQuery.isError)
			toast.error(
				userProfileQuery.error?.response?.data?.message ||
				userProfileQuery.error.message
			);
	}, [userProfileQuery.error]);

	// Handle date range change
	const handleDateRangeChange = (range: DateRange | undefined) => {
		setDateRange(range);
		updateFilters(1, perPage, range); // Reset to page 1 when date range changes
	};

  	// Handle page change
	const handlePageChange = (page: number) => {
		updateFilters(page, perPage, dateRange);
	};

	// Handle per page change
	const handlePerPageChange = (value: string) => {
		const newPerPage = parseInt(value);
		updateFilters(1, newPerPage, dateRange); // Reset to page 1 when per page changes
	};
  	// Get initials for avatar fallback
  	const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

	// Render role badge based on role type
	const getRoleBadge = (role: string) => {
		switch (role) {
			case "driver":
				return <Badge variant="secondary">Driver</Badge>;
			case "admin":
				return <Badge variant="destructive">Admin</Badge>;
			default:
				return <Badge>{role}</Badge>;
		}
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6">
			{userProfileQuery.isLoading ? (<UserProfileSkeleton />) : userProfileQuery.data ? (
				<>
					{/* User Info Card */}
					<Card>
						<CardHeader className="pb-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div className="flex items-center gap-4">
									<Avatar className="h-20 w-20">
										<AvatarImage src={AssetUrl + userProfileQuery.data.user.avatar || ""} alt={userProfileQuery.data.user.name}/>
										<AvatarFallback className="text-xl">{getInitials(userProfileQuery.data.user.name)}</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className="text-2xl md:text-3xl">{userProfileQuery.data.user.name}</CardTitle>
										<div className="flex items-center gap-2 mt-1">
											{getRoleBadge(userProfileQuery.data.user.role.type)}
												<Badge variant={userProfileQuery.data.user.is_active? "outline": "secondary"}>
													{userProfileQuery.data.user.is_active? "Active": "Inactive"}
												</Badge>
										</div>
									</div>
								</div>
							<div className="flex flex-wrap gap-3">
								<ChangeEmailPhoneDialog user={userProfileQuery.data.user} type="phone">
									<Button variant="outline" size="sm">
										{userProfileQuery.data.user.phone ? (
											<><Phone className="h-4 w-4 mr-2" />{userProfileQuery.data.user.phone}</>
										):(<span className="text-muted-foreground flex gap-2 items-center"><PhoneIncoming  className="h-4 w-4" />Add Phone</span>)}
									</Button>
								</ChangeEmailPhoneDialog>
								
								<ChangeEmailPhoneDialog user={userProfileQuery.data.user} type="email">
									<Button variant="outline" size="sm">
										{userProfileQuery.data.user.email ? (
											<><Mail className="h-4 w-4 mr-2" />{userProfileQuery.data.user.email}</>
										):(<span className="text-muted-foreground flex gap-2 items-center"><MailPlus  className="h-4 w-4" />Add Email</span>)}
									</Button>
								</ChangeEmailPhoneDialog>
							
							</div>
							</div>
						</CardHeader>
						{userProfileQuery.data.user.role.type === 'driver' &&(
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{userProfileQuery.data.total_transactions}</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{userProfileQuery.data.total_unloaded_quantity.toFixed(2)}{" "}
												<span className="text-sm font-normal">MT</span>
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium text-muted-foreground">Total Expense</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												₹{userProfileQuery.data.total_expense.toLocaleString()}
											</div>
										</CardContent>
									</Card>
								</div>
							</CardContent>
						)}
					</Card>

					{userProfileQuery.data.user.role.type === 'driver' && (
						<Card>
						<CardHeader>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<CardTitle>Transaction History</CardTitle>
							<div className="flex flex-col sm:flex-row gap-3">
								<DatePickerWithRange
								defaultDate={dateRange}
								onDateChange={handleDateRangeChange}
								placeholder="Filter by date range"
								className="w-full sm:w-auto"
								/>
								<Select
								value={perPage.toString()}
								onValueChange={handlePerPageChange}
								>
								<SelectTrigger className="w-full sm:w-[150px]">
									<SelectValue placeholder="Rows per page" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">10 per page</SelectItem>
									<SelectItem value="25">25 per page</SelectItem>
									<SelectItem value="50">50 per page</SelectItem>
									<SelectItem value="100">100 per page</SelectItem>
								</SelectContent>
								</Select>
							</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
							<Table>
								<TableHeader>
								<TableRow>
									<TableHead className="w-16">ID</TableHead>
									<TableHead>
									<div className="flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										Date
									</div>
									</TableHead>
									<TableHead>
									<div className="flex items-center gap-1">
										<Package className="h-4 w-4" />
										Product
									</div>
									</TableHead>
									<TableHead>
									<div className="flex items-center gap-1">
										<MapPin className="h-4 w-4" />
										Route
									</div>
									</TableHead>
									<TableHead className="text-right">Quantity</TableHead>
									<TableHead className="text-right">Expense</TableHead>
								</TableRow>
								</TableHeader>
								<TableBody>
								{userProfileQuery.data.transactions.data.length === 0 ? (
									<TableRow>
									<TableCell
										colSpan={6}
										className="h-24 text-center text-muted-foreground"
									>
										No transactions found.
									</TableCell>
									</TableRow>
								) : (
									userProfileQuery.data.transactions.data.map(
									(transaction) => (
										<TableRow key={transaction.id}>
										<TableCell className="font-medium">
											{transaction.id}
											<div className="text-xs text-muted-foreground">
											#{transaction.challan_number}
											</div>
										</TableCell>
										<TableCell>
											{new Date(
											transaction.unloading_date || 
											transaction.loading_date
											).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<HoverCard>
											<HoverCardTrigger asChild>
												<Button
												variant="link"
												className="p-0 h-auto text-left font-normal"
												>
												{transaction.product?.name}
												</Button>
											</HoverCardTrigger>
											<HoverCardContent className="w-80">
												<div className="space-y-2">
												<h4 className="text-sm font-semibold">
													{transaction.product?.name}
												</h4>
												<div className="text-xs">
													<p>
													<span className="font-medium">Unit:</span>{" "}
													{transaction.product?.unit}
													</p>
													<p>
													<span className="font-medium">
														Description:
													</span>{" "}
													{transaction.product?.description || "N/A"}
													</p>
													{(transaction?.product?.rate || 0) > 0 && (
													<p>
														<span className="font-medium">
														Rate:
														</span>{" "}
														₹{transaction.product?.rate}
													</p>
													)}
												</div>
												</div>
											</HoverCardContent>
											</HoverCard>
										</TableCell>
										<TableCell>
											<HoverCard>
											<HoverCardTrigger asChild>
												<Button
												variant="link"
												className="p-0 h-auto text-left font-normal"
												>
												{transaction.loading_point?.name} →{" "}
												{transaction.unloading_point?.name}
												</Button>
											</HoverCardTrigger>
											<HoverCardContent className="w-80">
												<div className="space-y-3">
												<div>
													<h4 className="text-sm font-semibold">
													Loading Point
													</h4>
													<p className="text-xs">
													{transaction.loading_point?.name}
													</p>
													{transaction.loading_point?.address && (
													<p className="text-xs text-muted-foreground">
														{transaction.loading_point?.address}
													</p>
													)}
												</div>
												<div>
													<h4 className="text-sm font-semibold">
													Unloading Point
													</h4>
													<p className="text-xs">
													{transaction.unloading_point?.name}
													</p>
													{transaction.unloading_point?.address && (
													<p className="text-xs text-muted-foreground">
														{transaction.unloading_point?.address}
													</p>
													)}
												</div>
												</div>
											</HoverCardContent>
											</HoverCard>
										</TableCell>
										<TableCell className="text-right">
											{parseFloat(
											transaction.unloading_quantity || "0"
											).toFixed(2)}{" "}
											<span className="text-xs text-muted-foreground">
											MT
											</span>
										</TableCell>
										<TableCell className="text-right">
											{transaction.transport_expense
											? `₹${Number(
												transaction.transport_expense
												).toLocaleString()}`
											: "–"}
										</TableCell>
										</TableRow>
									)
									)
								)}
								</TableBody>
							</Table>
							</div>
						</CardContent>
						<CardFooter>
							<div className="w-full flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								Showing{" "}
								<strong>
								{userProfileQuery.data.transactions.data.length}
								</strong>{" "}
								of{" "}
								<strong>{userProfileQuery.data.transactions.total}</strong>{" "}
								transactions
							</div>
							{userProfileQuery.data.transactions.last_page > 1 && (
								<Pagination>
								<PaginationContent>
									<PaginationItem>
									<PaginationPrevious
										onClick={() => {
										if (currentPage > 1) {
											handlePageChange(currentPage - 1);
										}
										}}
										className={
										currentPage === 1
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
										}
									/>
									</PaginationItem>
									
									{Array.from(
									{ length: userProfileQuery.data.transactions.last_page },
									(_, i) => i + 1
									).map((page) => {
									// Show first page, last page, and pages around current page
									if (
										page === 1 ||
										page === userProfileQuery.data.transactions.last_page ||
										(page >= currentPage - 2 && page <= currentPage + 2)
									) {
										return (
										<PaginationItem key={page}>
											<PaginationLink
											onClick={() => handlePageChange(page)}
											isActive={page === currentPage}
											>
											{page}
											</PaginationLink>
										</PaginationItem>
										);
									}
									
									// Add ellipsis where needed
									if (
										(page === 2 && currentPage > 4) ||
										(page === userProfileQuery.data.transactions.last_page - 1 &&
										currentPage < userProfileQuery.data.transactions.last_page - 3)
									) {
										return (
										<PaginationItem key={page}>
											<span className="flex h-9 w-9 items-center justify-center">
											...
											</span>
										</PaginationItem>
										);
									}
									
									return null;
									})}
									
									<PaginationItem>
									<PaginationNext
										onClick={() => {
										if (
											currentPage <
											userProfileQuery.data.transactions.last_page
										) {
											handlePageChange(currentPage + 1);
										}
										}}
										className={
										currentPage ===
										userProfileQuery.data.transactions.last_page
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
										}
									/>
									</PaginationItem>
								</PaginationContent>
								</Pagination>
							)}
							</div>
						</CardFooter>
						</Card>
					)}
				</>
			) : (<div className="text-center p-8"><p>No user data found.</p></div>)}
		</div>
	);
};

// Skeleton loading state component
const UserProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48" />
                <div className="flex items-center gap-2 mt-1">
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex py-4 gap-4">
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-48" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;