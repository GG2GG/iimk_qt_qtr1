import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 1. Card Component
export function Card({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className={cn(
                "bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

// 2. Button Component
export function Button({
    children, onClick, variant = 'primary', className, disabled
}: {
    children: React.ReactNode,
    onClick?: () => void,
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
    className?: string,
    disabled?: boolean
}) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900",
        ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(baseStyles, variants[variant], className)}
        >
            {children}
        </button>
    );
}
