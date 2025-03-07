import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transaction_apis } from '@/lib/helpers/api_urls';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm from './components/multi-step-form';
import { TransactionFormData } from './components/transaction-form-types';
import { AlertCircle, MoveLeft, RefreshCw } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { setBreadcrumb } from '@/redux/Features/uiSlice';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TransactionFormSkeleton from './components/transaction-form-skeleton-component';

const CreateTransactionPage: React.FC = () => {
    const {transaction_id} = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const {
      data: defaultTransaction, 
      isLoading, 
      isError, 
      error, 
      refetch
    } = useQuery<any, any, TransactionFormData>({
        queryKey: ['select_transaction', transaction_id],
        queryFn: () => transaction_apis.select(Number(transaction_id)),
        enabled: !!transaction_id,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
        select: (res) => res.data.transaction,
        retry: 1, // Only retry once
    });
    
    useEffect(() => {
        dispatch(setBreadcrumb([
          {label: 'Dashboard', link: '/dashboard'},
          {label: 'Transaction List', link: '/transactions/1/12'},
          {label: transaction_id ? 'Edit Transaction' : 'Create Transaction', type: 'page'}
        ]));
    }, [transaction_id]);
    
    // Handle error effects
    useEffect(() => {
        if (isError && error?.response) {
            const status = error.response.status;
            if (status === 404) {
                toast.error("Transaction not found");
            } else {
                toast.error(error?.response?.data?.message || "Error loading transaction");
            }
        }
    }, [isError, error]);

    const createTransactionMutation = useMutation({
        mutationFn: (data: FormData) => 
            defaultTransaction 
                ? transaction_apis.update(data, defaultTransaction.id) 
                : transaction_apis.create(data),
        onSuccess: (response) => {
            toast.success(response.message);
            navigate('/transactions/1/12');
            queryClient.invalidateQueries({queryKey: ['transactions'], exact: false});
            queryClient.invalidateQueries({queryKey: ['select_transaction', transaction_id]});
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ?? 
                (defaultTransaction ? "Failed to update transaction" : "Failed to create transaction")
            );
        }
    });

    const handleSubmit = (data: TransactionFormData) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const typedKey = key as keyof TransactionFormData; 
            const value = data[typedKey];
    
            if (value !== undefined) {
                formData.append(key, String(value));
            }
        });
        createTransactionMutation.mutate(formData);
    };

    // Render error state if there's an error and we're trying to edit a transaction
    const renderErrorState = () => {
        const status = error?.response?.status;
        
        return (
            <Card className="w-full my-4">
                <CardContent className="pt-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                            {status === 404 ? "Transaction Not Found" : "Error Loading Transaction"}
                        </AlertTitle>
                        <AlertDescription>
                            {status === 404 
                                ? "The transaction you're trying to edit could not be found. It may have been deleted."
                                : (error?.response?.data?.message || "There was a problem loading the transaction data.")}
                        </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={() => navigate('/transactions/1/12')}>
                            <MoveLeft className="mr-2 h-4 w-4" /> 
                            Return to Transactions
                        </Button>
                        
                        {status !== 404 && (
                            <Button onClick={() => refetch()}>
                                <RefreshCw className="mr-2 h-4 w-4" />  Try Again
                            </Button>
                        )}
                        
                        {status === 404 && transaction_id && (
                            <Button onClick={() => navigate('/tr-create')}>
                                Create New Transaction
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className='flex items-center gap-4 justify-between'>
                        {defaultTransaction ? "Edit Transaction" : "Create New Transaction"}
                        <Button variant={'outline'} onClick={() => navigate(-1)}>
                            <MoveLeft className='inline size-6 mr-2' /> Cancel
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && <TransactionFormSkeleton />}
                    
                    {isError && transaction_id ? (renderErrorState()) : (!isLoading && (
                        <TransactionForm 
                            defaultTransaction={defaultTransaction} 
                            onSubmit={handleSubmit}
                        />
                    ))}
                    
                    {/* Allow creating a new transaction even if error, if we're not editing */}
                    {isError && !transaction_id && (
                        <TransactionForm 
                            defaultTransaction={undefined} 
                            onSubmit={handleSubmit}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateTransactionPage;