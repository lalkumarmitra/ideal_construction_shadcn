import React from 'react';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src: string;
                trigger?: string;
                delay?: string;
                state?: string;
                colors?:string;
            };
        }
    }
}


interface LoaderProps {
    show: boolean;
    message: string
}
const Loader: React.FC<LoaderProps> = ({ show, message }) => {
    return show ? (
        <div className='fixed  top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm z-50 flex justify-center items-center flex-col'>
            <lord-icon
                src="https://cdn.lordicon.com/rqptwppx.json"
                trigger="loop"
                state="loop-cycle"
                colors="primary:#fafafa,secondary:#171717"
                style={{ width: '250px', height: '250px' }}
            >
            </lord-icon>
            <h3 className='text-xl font-bold dark:text-[#fafafa] mt-4 border-b-4 border-[#171717] dark:border-[#fafafa]'>{message}</h3>
        </div>
    ) : null;
};

export default Loader;