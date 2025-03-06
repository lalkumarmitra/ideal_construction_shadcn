import { createContext, PropsWithChildren, useContext, useState } from "react";
import { ClientType, ProductType, VehicleType } from "@/types/typedef";
import { UserType } from "@/types/user";

type CreateTransactionContextType = {
  // Tab state
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Form submission state
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;

  // Transaction Details tab
  transactionDate: Date | null;
  setTransactionDate: (date: Date | null) => void;

  selectedProduct: ProductType | undefined;
  setSelectedProduct: (product: ProductType | undefined) => void;

  transportExpense: number;
  setTransportExpense: (expense: number) => void;

  // Loading section
  loadingClient: ClientType | undefined;
  setLoadingClient: (client: ClientType | undefined) => void;

  loadingVehicle: VehicleType | undefined;
  setLoadingVehicle: (vehicle: VehicleType | undefined) => void;

  loadingDriver: UserType | undefined;
  setLoadingDriver: (driver: UserType | undefined) => void;

  loadingDate: Date | null;
  setLoadingDate: (date: Date | null) => void;

  loadingQuantity: number;
  setLoadingQuantity: (quantity: number) => void;

  loadingRate: number;
  setLoadingRate: (rate: number) => void;

  // Unloading section
  unloadingClient: ClientType | undefined;
  setUnloadingClient: (client: ClientType | undefined) => void;

  unloadingVehicle: VehicleType | undefined;
  setUnloadingVehicle: (vehicle: VehicleType | undefined) => void;

  unloadingDriver: UserType | undefined;
  setUnloadingDriver: (driver: UserType | undefined) => void;

  unloadingDate: Date | null;
  setUnloadingDate: (date: Date | null) => void;

  unloadingQuantity: number;
  setUnloadingQuantity: (quantity: number) => void;

  unloadingRate: number;
  setUnloadingRate: (rate: number) => void;

  // Calculated fields
  loadingCost: number;
  unloadingRevenue: number;
  estimatedProfit: number;
  profitMargin: number;

  // Form actions
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  validateForm: () => boolean;
};

const CreateTransactionContext = createContext<CreateTransactionContextType | undefined>(undefined);
type CreateTransactionContextProps = PropsWithChildren;
const CreateTransactionProvider = ({children}: CreateTransactionContextProps) => {
	// Initialize with current date
	const currentDate = new Date();
	
	// Tab state
	const [activeTab, setActiveTab] = useState<string>("details");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Transaction Details tab
	const [transactionDate, setTransactionDate] = useState<Date | null>(currentDate);
	const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined>();
  	const [transportExpense, setTransportExpense] = useState<number>(0);

	// Loading section
	const [loadingClient, setLoadingClient] = useState<ClientType | undefined>();
	const [loadingVehicle, setLoadingVehicle] = useState<VehicleType | undefined>();
	const [loadingDriver, setLoadingDriver] = useState<UserType | undefined>();
	const [loadingDate, setLoadingDate] = useState<Date | null>(currentDate);
	const [loadingQuantity, setLoadingQuantity] = useState<number>(0);
	const [loadingRate, setLoadingRate] = useState<number>(0);

	// Unloading section
	const [unloadingClient, setUnloadingClient] = useState<ClientType | undefined>();
	const [unloadingVehicle, setUnloadingVehicle] = useState<VehicleType | undefined>();
	const [unloadingDriver, setUnloadingDriver] = useState<UserType | undefined>();
	const [unloadingDate, setUnloadingDate] = useState<Date | null>(currentDate);
	const [unloadingQuantity, setUnloadingQuantity] = useState<number>(0);
	const [unloadingRate, setUnloadingRate] = useState<number>(0);

	// Calculate financial summaries
	const loadingCost = loadingQuantity * loadingRate;
	const unloadingRevenue = unloadingQuantity * unloadingRate;
	const estimatedProfit = unloadingRevenue - loadingCost - transportExpense;
	const profitMargin = unloadingRevenue > 0 ? (estimatedProfit / unloadingRevenue) * 100 : 0;

	// Form actions
  	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		setIsSubmitting(true);

		// Here you would normally submit the data to your API
		// For now, we'll simulate an API call with a timeout
    	setTimeout(() => {
			console.log({
				transactionDate,
				product: selectedProduct,
				transportExpense,
				loading: {
					client: loadingClient,
					vehicle: loadingVehicle,
					driver: loadingDriver,
					date: loadingDate,
					quantity: loadingQuantity,
					rate: loadingRate,
				},
				unloading: {
					client: unloadingClient,
					vehicle: unloadingVehicle,
					driver: unloadingDriver,
					date: unloadingDate,
					quantity: unloadingQuantity,
					rate: unloadingRate,
				},
				financial: {
					loadingCost,
					transportExpense,
					unloadingRevenue,
					estimatedProfit,
					profitMargin,
				},
			});
			setIsSubmitting(false);
			resetForm();
    	}, 1500);
  	};

	const resetForm = () => {
		const resetDate = new Date();
		// Reset all state values to their defaults
		setActiveTab("details");
		setTransactionDate(resetDate);
		setSelectedProduct(undefined);
		setTransportExpense(0);

		setLoadingClient(undefined);
		setLoadingVehicle(undefined);
		setLoadingDriver(undefined);
		setLoadingDate(resetDate);
		setLoadingQuantity(0);
		setLoadingRate(0);

		setUnloadingClient(undefined);
		setUnloadingVehicle(undefined);
		setUnloadingDriver(undefined);
		setUnloadingDate(resetDate);
		setUnloadingQuantity(0);
		setUnloadingRate(0);
	};

	// Validate the form before submission
	const validateForm = () => {
		// Transaction details validation
		if (!transactionDate) {
			alert("Please select a transaction date");
			setActiveTab("details");
			return false;
		}

		if (!selectedProduct) {
			alert("Please select a product");
			setActiveTab("details");
			return false;
		}

		// Loading section validation
		if (!loadingClient) {
			alert("Please select a loading client");
			setActiveTab("loading");
			return false;
		}

		if (!loadingVehicle) {
			alert("Please select a loading vehicle");
			setActiveTab("loading");
			return false;
		}

		if (!loadingDriver) {
			alert("Please select a loading driver");
			setActiveTab("loading");
			return false;
		}

		if (!loadingDate) {
			alert("Please select a loading date");
			setActiveTab("loading");
			return false;
		}

		if (loadingQuantity <= 0) {
			alert("Please enter a valid loading quantity");
			setActiveTab("loading");
			return false;
		}

		if (loadingRate <  0) {
			alert("Please enter a valid loading rate");
			setActiveTab("loading");
			return false;
		}

		// Unloading section validation
		if (!unloadingClient) {
			alert("Please select an unloading client");
			setActiveTab("unloading");
			return false;
		}

		if (!unloadingVehicle) {
			alert("Please select an unloading vehicle");
			setActiveTab("unloading");
			return false;
		}

		if (!unloadingDriver) {
			alert("Please select an unloading driver");
			setActiveTab("unloading");
			return false;
		}

		if (!unloadingDate) {
			alert("Please select an unloading date");
			setActiveTab("unloading");
			return false;
		}

		if (unloadingQuantity <= 0) {
			alert("Please enter a valid unloading quantity");
			setActiveTab("unloading");
			return false;
		}

		if (unloadingRate <= 0) {
			alert("Please enter a valid unloading rate");
			setActiveTab("unloading");
			return false;
		}

		// Additional validation rules
		if (unloadingDate && loadingDate && unloadingDate < loadingDate) {
			alert("Unloading date cannot be before loading date");
			setActiveTab("unloading");
			return false;
		}
		return true;
	};

	const contextValue: CreateTransactionContextType = {
		activeTab,setActiveTab,
		isSubmitting,setIsSubmitting,

		transactionDate,setTransactionDate,
		selectedProduct,setSelectedProduct,
		transportExpense,setTransportExpense,

		loadingClient,setLoadingClient,
		loadingVehicle,setLoadingVehicle,
		loadingDriver,setLoadingDriver,
		loadingDate,setLoadingDate,
		loadingQuantity,setLoadingQuantity,
		loadingRate,setLoadingRate,

		unloadingClient,setUnloadingClient,
		unloadingVehicle,setUnloadingVehicle,
		unloadingDriver,setUnloadingDriver,
		unloadingDate,setUnloadingDate,
		unloadingQuantity,setUnloadingQuantity,
		unloadingRate,setUnloadingRate,

		loadingCost,
		unloadingRevenue,
		estimatedProfit,
		profitMargin,

		handleSubmit,
		resetForm,
		validateForm,
	};

	return (
		<CreateTransactionContext.Provider value={contextValue}>
			{children}
		</CreateTransactionContext.Provider>
	);
};
export default CreateTransactionProvider;
export const useCreateTransaction = () => {
	const context = useContext(CreateTransactionContext);
	if (context === undefined) 
	throw new Error("useCreateTransaction Hook must be used inside CreateTransactionProvider");
  	return context;
};