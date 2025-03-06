import { ArrowLeftRight, BookCopy, Building2, BusFront, Cog, FolderClock, HandHelping, Handshake, Home, LogInIcon, Package2, Users2 } from 'lucide-react';
import _404 from '@/pages/Error/404';
import SettingsPage from '@/pages/Authenticated/Settings/Settings';
import { RouteType } from '@/types/route';
import LandingPage from '@/pages/Public/LandingPage/Index';
import { Dashboard } from '@/pages/Authenticated/DashboardPage';
import LoginPage from '@/pages/login-page';
import ProductPage from '@/pages/Authenticated/Admin/product/productPage';
import VehiclePage from '@/pages/Authenticated/Admin/Vehicle/vehicle-page';
import UserPage from '@/pages/Authenticated/Admin/User/user-page';
import TransactionPage from '@/pages/Authenticated/Admin/Transaction/transaction-page';
import TransactionHistoryPage from '@/pages/Authenticated/Admin/Transaction/transaction-history-page';
import ClientPage from '@/pages/Authenticated/Admin/Client/client-page';
import UserProfile from '@/pages/Authenticated/Admin/User/user-profile';
import CreateTransactionPage from '@/pages/Authenticated/Admin/Transaction/create-transaction/create-transaction-page';






export const routes: RouteType[] = [
	{
		isMenu: false,
		icon: Home,
		label: 'Transaction',
		path: "/tr-create/:transaction_id?",
		component: <CreateTransactionPage />,
		layout: 'main',
		middlewares: ['auth'],
	},
	{
		isMenu: true,
		icon: Home,
		label: 'Dashboard',
		path: "/dashboard",
		component: <Dashboard />,
		layout: 'main',
		middlewares: ['auth'],
	},
	{
		isMenu: true,
		icon: ArrowLeftRight,
		label: 'Transaction',
		path: "/transactions/:page/:offset",
		defaultParameters: ['1','12'],
		component: <TransactionPage />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','staff','manager']
	},
	{
		isMenu: true,
		icon: Handshake,
		label: 'Clients',
		path: "/clients/:page/:offset",
		defaultParameters: ['1','12'],
		component: <ClientPage />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','staff','manager']
	},
	{
		isMenu: true,
		icon: Users2,
		label: 'Users/Staffs',
		path: "/users/:page/:offset",
		defaultParameters: ['1','12'],
		component: <UserPage />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','manager']
	},
	{
		isMenu: true,
		icon: Package2,
		label: 'Products',
		path: "/products/:page/:offset",
		defaultParameters: ['1','12'],
		component: <ProductPage />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','manager']
	},
	{
		isMenu: true,
		icon: BusFront,
		label: 'Vehicles',
		path: "/vehicles/:page/:offset",
		defaultParameters:['1','12'],
		component: <VehiclePage />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','manager']
	},
	{
		isMenu: true,
		icon: FolderClock,
		label: 'History',
		path: "/transaciton-history",
		component: <TransactionHistoryPage />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','manager']
	},
	{
		isMenu: false,
		label: 'User Profile',
		path: "/users/profile/:user_id",
		component: <UserProfile />,
		layout: 'main',
		middlewares: ['auth'],
		users:['admin','manager']
	},

	// Public Routes
	{
		isMenu: true,
		label: 'Home',
		icon: BookCopy,
		path: "/",
		component: <LandingPage />,
		layout: 'public',
		middlewares: ['guest'],
	},
	{
		isMenu: false,
		label: 'settings',
		icon: Cog,
		path: "/settings",
		component: <SettingsPage />,
		layout: 'public',
		middlewares: ['auth'],
	},
	{
		isMenu: true,
		label: 'Privacy Policy',
		icon: Building2,
		path: "/privacy-policy",
		component: <LandingPage />,
		layout: 'public',
		middlewares: ['guest'],
	},
	{
		isMenu: true,
		label: 'Services',
		icon: HandHelping,
		path: "/services",
		component: <LandingPage />,
		layout: 'public',
		middlewares: ['guest'],
	},
	{
		isMenu: true,
		label: 'Login',
		icon: LogInIcon,
		path: "/login",
		component: <LoginPage />,
		layout: 'public',
		middlewares: ['guest'],
	},


	{
		path: "*",
		isMenu: false,
		component: <_404 />,
		layout: 'error',
	}
];



