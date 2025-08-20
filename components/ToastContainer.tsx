import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const Toast: React.FC<{ message: string, type: string, onDismiss: () => void }> = ({ message, type, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onDismiss, 300); // Wait for animation to finish
        }, 3000); // 3 seconds visible

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(onDismiss, 300);
    };

    const typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const icon = {
        success: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
        error: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    }

    return (
        <div className={`w-full max-w-sm rounded-lg shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden transition-transform ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
            <div className={`w-0 flex-1 p-4 ${typeClasses[type as keyof typeof typeClasses]}`}>
                 <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5 text-white">
                        {icon[type as keyof typeof icon]}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-white">{message}</p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-200">
                <button onClick={handleDismiss} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary bg-white hover:bg-slate-50">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};


const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-end z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onDismiss={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;