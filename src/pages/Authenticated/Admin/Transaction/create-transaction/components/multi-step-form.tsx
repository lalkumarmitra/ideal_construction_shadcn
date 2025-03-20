// src/components/transaction/TransactionForm.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { TransactionFormData, TransactionFormProps } from './transaction-form-types';
import TransactionFormStep1 from './form-1';
import TransactionFormStep2 from './form-2';

const TransactionForm: React.FC<TransactionFormProps> = ({  defaultTransaction,  onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<TransactionFormData>>( defaultTransaction || {});
    const updateFormData = (data: Partial<TransactionFormData>) => { setFormData(prev => ({ ...prev, ...data })) };
    useEffect(()=> {
        if(defaultTransaction){
            const transactionData:any = {};
            Object.keys(defaultTransaction).forEach((key) => {
                const typedKey = key as keyof TransactionFormData; 
                const value = defaultTransaction[typedKey];
                if(value) transactionData[typedKey] = String(value);
            });
            updateFormData({...transactionData})
        }
    },[defaultTransaction])
    const validateStep1 = () => {
        const requiredFields = [ 'product_id',  'loading_date',  'loading_vehicle_id',  'loading_point_id'] as const;
        const missingFields = requiredFields.filter(field => formData[field] === undefined || formData[field] === '');
        if (missingFields.length > 0) {
            toast.error(`Please fill in the following required fields: ${missingFields.map(m=>m.replace(/_/g, ' ').toUpperCase()).join(', ')}`);
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const requiredFields = [ 'unloading_date',  'unloading_vehicle_id',  'unloading_point_id', 'unit' ] as const;
        const missingFields = requiredFields.filter(field => formData[field] === undefined || formData[field] === '');
        if (missingFields.length > 0) {
            toast.error(`Please fill in the following required fields: ${missingFields.map(m=>m.replace(/_/g, ' ').toUpperCase()).join(', ')}`);
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateStep1()) setCurrentStep(2);
        else if (currentStep === 2 && validateStep2()) handleSubmit();
    };

    const handleSubmit = () => {
        if (Object.keys(formData).length === 0) {
            toast.error("No transaction data provided");
            return;
        }
        onSubmit(formData as TransactionFormData);
    };

    return (
        <div className="space-y-3">
            <Progress value={currentStep === 1 ? 50 : 100} className="w-full" />
            {currentStep === 1 && ( <TransactionFormStep1  formData={formData} updateFormData={updateFormData} defaultTransaction={defaultTransaction}/>)}
            {currentStep === 2 && ( <TransactionFormStep2  formData={formData} updateFormData={updateFormData} defaultTransaction={defaultTransaction} />)}
            <div className="flex flex-col gap-2 md:flex-row justify-between p-2">
                {currentStep > 1 && (
                    <Button  variant="outline"  onClick={() => setCurrentStep(prev => prev - 1)} >
                        <ArrowLeft className="mr-2 size-4" /> Previous
                    </Button>
                )}
                <Button  onClick={handleNextStep} className={`ml-auto w-full md:w-auto ${currentStep === 1 ? '' : 'gap-2'}`}>
                    {currentStep === 1 ? 'Next' : 'Save Transaction'}
                    {currentStep === 1  ? <ArrowRight className="size-4" />  : <Save className="size-4" />}
                </Button>
            </div>
        </div>
    );
};

export default TransactionForm;