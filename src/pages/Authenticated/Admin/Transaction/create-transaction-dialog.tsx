import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/typedef";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface CreateTransactionModalProps {
	defaultTransaction?: TransactionType;
	children?: React.ReactNode;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ defaultTransaction, children }) => {
	const navigate = useNavigate();
	const handleClick = () => {	
		if(defaultTransaction) navigate('/tr-create/'+ defaultTransaction.id)
		else navigate('/tr-create')
	}
	return (
		<div onClick={handleClick}>
			{children ? children : (
				<Button className="flex gap-2" >
					<PlusCircle className="size-4 inline" /> <span className="hidden md:inline">New Transaction</span>
				</Button>
			)}
		</div>
	);
};

export default CreateTransactionModal;