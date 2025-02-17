import { cn } from '@/lib/utils';
import React, { ButtonHTMLAttributes, ReactNode } from 'react'

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    classNames?:string;
}
const ShimmerButton: React.FC<ShimmerButtonProps> = ({children,classNames,...props}) => {
    return (
        <button 
            className={cn(
                "inline-flex h-12 animate-shimmer items-center justify-center rounded-md border bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-primary-foreground dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 border-slate-800 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
                classNames
            )}
            {...props}
        >
          {children}
        </button>
    )
}

export default ShimmerButton