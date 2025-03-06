
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transaction_apis } from '@/lib/helpers/api_urls';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm from './components/multi-step-form';
import { TransactionFormData } from './components/transaction-form-types';
import { Loader } from 'lucide-react';




const CreateTransactionPage: React.FC = () => {
    const {transaction_id} = useParams();
    const queryClient = useQueryClient();
    const {data:defaultTransaction, isLoading } = useQuery<any, any, TransactionFormData>({
        queryKey: ['select_transaction',transaction_id],
        queryFn: ()=> transaction_apis.select(Number(transaction_id)),
        enabled: !!transaction_id,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
        select: (res) => res.data.transaction
    });
    const navigate = useNavigate();
    const createTransactionMutation = useMutation({
        mutationFn: (data: FormData) => 
            defaultTransaction 
                ? transaction_apis.update(data,defaultTransaction.id) 
                : transaction_apis.create(data),
        onSuccess: (response) => {
            toast.success(response.message);
            navigate('/transactions/1/12');
            queryClient.invalidateQueries({queryKey:['transactions'],exact:false});
            queryClient.invalidateQueries({queryKey:['select_transaction',transaction_id]});
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>
                        {defaultTransaction ? "Edit Transaction" : "Create New Transaction"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && <Loader className='animate-spin inline' />}
                    <TransactionForm 
                        defaultTransaction={defaultTransaction} 
                        onSubmit={handleSubmit}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateTransactionPage;