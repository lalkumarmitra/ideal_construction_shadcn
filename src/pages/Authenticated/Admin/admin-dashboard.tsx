import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Users, Package, Tags, TrendingUp, Truck, Users2, Handshake, ArrowLeftRight, Filter, Calendar, RefreshCw, ChevronRight, ArrowUpRight, ArrowDownRight, Activity, Navigation } from "lucide-react";
import CreateProductModal from "./product/create-product-modal";
import CreateVehicleDialog from "./Vehicle/create-vehicle-modal";
import CreateUserDialog from "./User/create-user-dialog";
import CreateNewClient from "./Client/create-client-dialog";
import CreateTransactionDialog from "./Transaction/create-transaction-dialog";

// Types
type IntervalTypes = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year';

// Generate dummy data for charts
const generateDummyTransactionData = (days = 7) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      purchases: Math.floor(Math.random() * 50) + 20,
      sales: Math.floor(Math.random() * 40) + 10,
    };
  });
};

const generateDummyProductData = () => {
  const products = ['Cement', 'Steel', 'Bricks', 'Sand', 'Gravel'];
  return products.map(product => ({
    name: product,
    value: Math.floor(Math.random() * 500) + 100,
  }));
};

const generateDummyClientData = () => {
  return [
    { name: 'Enterprise', value: 35 },
    { name: 'Small Business', value: 45 },
    { name: 'Individual', value: 20 },
  ];
};

const generateRecentTransactions = () => {
  const transactions = [];
  const types = ['Purchase', 'Sale'];
  const products = ['Cement', 'Steel', 'Bricks', 'Sand', 'Gravel'];
  const clients = ['ABC Construction', 'XYZ Builders', 'MegaCorp', 'SmallBiz Ltd', 'Individual Client'];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    transactions.push({
      id: `TXN-${1000 + i}`,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: types[Math.floor(Math.random() * types.length)],
      product: products[Math.floor(Math.random() * products.length)],
      client: clients[Math.floor(Math.random() * clients.length)],
      amount: `$${(Math.floor(Math.random() * 10000) / 100).toFixed(2)}`,
      status: Math.random() > 0.3 ? 'Completed' : 'Pending'
    });
  }
  
  return transactions;
};

const AdminDashboard = () => {
  const [interval, setInterval] = useState<IntervalTypes>('this_week');
  const [transactionData, setTransactionData] = useState(generateDummyTransactionData());
  const [productData, setProductData] = useState(generateDummyProductData());
  const [clientData, setClientData] = useState(generateDummyClientData());
  const [recentTransactions, setRecentTransactions] = useState(generateRecentTransactions());
  const [isLoading, setIsLoading] = useState(false);

  // Summary metrics
  const metrics = [
    { title: "Total Users", value: "128", trend: +12, icon: <Users size={24} className="text-purple-500" /> },
    { title: "Total Products", value: "64", trend: +8, icon: <Package size={24} className="text-blue-500" /> },
    { title: "Total Vehicles", value: "42", trend: +4, icon: <Truck size={24} className="text-green-500" /> },
    { title: "Transactions", value: "867", trend: +18, icon: <Tags size={24} className="text-yellow-500" /> },
    { title: "Purchased", value: "532", trend: +22, icon: <ShoppingCart size={24} className="text-orange-500" /> },
    { title: "Sold", value: "335", trend: -5, icon: <ArrowLeftRight size={24} className="text-red-500" /> },
  ];

  // Function to refresh data based on interval
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let days = 7;
      switch (interval) {
        case 'today': days = 1; break;
        case 'yesterday': days = 1; break;
        case 'this_week': days = 7; break;
        case 'this_month': days = 30; break;
        case 'this_year': days = 12; break;
      }
      
      setTransactionData(generateDummyTransactionData(days));
      setProductData(generateDummyProductData());
      setClientData(generateDummyClientData());
      setRecentTransactions(generateRecentTransactions());
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    refreshData();
  }, [interval]);

  // Colors for pie charts
  const PRODUCT_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
  const CLIENT_COLORS = ['#f59e0b', '#fbbf24', '#fcd34d'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header with title and interval selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor your business performance at a glance.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={interval} onValueChange={(value) => setInterval(value as IntervalTypes)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <button 
            onClick={refreshData}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          <CreateNewClient>
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                <Handshake className="size-8 text-blue-500 mb-2 mt-3" />
                <p className="text-xs sm:text-sm font-medium">Add Client</p>
              </CardContent>
            </Card>
          </CreateNewClient>
          <CreateTransactionDialog>
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                <ArrowLeftRight className="size-8 text-purple-500 mb-2 mt-3" />
                <p className="text-xs sm:text-sm font-medium">New Transaction</p>
              </CardContent>
            </Card>
          </CreateTransactionDialog>
          <CreateProductModal>
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                <Package className="size-8 text-green-500 mb-2 mt-3" />
                <p className="text-xs sm:text-sm font-medium">Add Product</p>
              </CardContent>
            </Card>
          </CreateProductModal>
          <CreateVehicleDialog>
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                <Truck className="size-8 text-amber-500 mb-2 mt-3" />
                <p className="text-xs sm:text-sm font-medium">Add Vehicle</p>
              </CardContent>
            </Card>
          </CreateVehicleDialog>
          <CreateUserDialog>
            <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                <Users2 className="size-8 text-cyan-500 mb-2 mt-3" />
                <p className="text-xs sm:text-sm font-medium">Add User/Staff</p>
              </CardContent>
            </Card>
          </CreateUserDialog>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="rounded-full bg-muted p-2">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`text-sm mt-1 flex items-center ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend > 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {Math.abs(metric.trend)}% {metric.trend > 0 ? 'increase' : 'decrease'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Transaction Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
              <CardDescription>Purchases vs Sales over {interval.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent className="pl-1">
              {isLoading ? (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={transactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="purchases" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Distribution Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Product Distribution</CardTitle>
                <CardDescription>Breakdown by product type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {productData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Client Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Client Distribution</CardTitle>
                <CardDescription>Breakdown by client type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={clientData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {clientData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={CLIENT_COLORS[index % CLIENT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                View all <ChevronRight className="h-4 w-4" />
              </a>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'Purchase' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {transaction.type === 'Purchase' ? <ShoppingCart className="h-5 w-5" /> : <ArrowLeftRight className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.type}: {transaction.product}</div>
                          <div className="text-sm text-muted-foreground">{transaction.client} • {transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{transaction.amount}</div>
                        <div className={`text-sm ${transaction.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t py-3 bg-muted/50">
              <a href="#" className="text-sm text-center w-full text-blue-600 hover:underline flex items-center justify-center">
                View All Transactions <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transaction Analysis</CardTitle>
                <button className="text-sm text-muted-foreground flex items-center">
                  <Filter className="h-4 w-4 mr-1" /> Filter
                </button>
              </div>
              <CardDescription>Volume and trends over {interval.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent className="pl-1">
              {isLoading ? (
                <Skeleton className="h-[300px] w-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={transactionData} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="purchases" fill="#3b82f6" barSize={20} />
                    <Bar dataKey="sales" fill="#ef4444" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Transaction Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" /> Average Transaction Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,258.33</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  7.2% from last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Navigation className="h-4 w-4 mr-2 text-purple-500" /> Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.7%</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  3.1% from last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" /> Revenue Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.8%</div>
                <div className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  2.3% from last period
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* More detailed transaction table would go here */}
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Performance Analytics</CardTitle>
              <CardDescription>Key metrics across all business areas</CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would contain more detailed analytics components */}
              <p className="text-center text-muted-foreground py-12">More detailed analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const AdminDashboardSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
      <Skeleton className="h-9 w-[250px] rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="space-y-3">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
};

export default AdminDashboard;