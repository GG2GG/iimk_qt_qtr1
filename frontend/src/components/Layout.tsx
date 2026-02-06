import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Page Container - Sets maximum width and centers content
export function PageContainer({ children }: { children: ReactNode }) {
    return (
        <div className="w-full min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}

// Page Header - Consistent header across all pages
export function PageHeader({
    title,
    subtitle,
    action
}: {
    title: string;
    subtitle?: string;
    action?: ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 bg-clip-text text-transparent drop-shadow-sm">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-slate-600">{subtitle}</p>
                    )}
                </div>
                {action && (
                    <div className="flex-shrink-0">
                        {action}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Grid Layout - Responsive grid system
export function Grid({
    children,
    cols = 1
}: {
    children: ReactNode;
    cols?: 1 | 2 | 3 | 4
}) {
    // Use explicit classes to ensure Tailwind purge doesn't remove them
    const gridClass = cols === 4 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' :
        cols === 3 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
            cols === 2 ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' :
                'grid grid-cols-1 gap-6';

    return (
        <div className={gridClass}>
            {children}
        </div>
    );
}

// Section - Groups related content
export function Section({
    children,
    className = ''
}: {
    children: ReactNode;
    className?: string
}) {
    return (
        <div className={`space-y-6 ${className}`}>
            {children}
        </div>
    );
}

// Stack - Vertical spacing
export function Stack({
    children,
    spacing = 'md'
}: {
    children: ReactNode;
    spacing?: 'sm' | 'md' | 'lg' | 'xl'
}) {
    const spacingClass = {
        sm: 'space-y-2',
        md: 'space-y-4',
        lg: 'space-y-6',
        xl: 'space-y-8'
    };

    return (
        <div className={spacingClass[spacing]}>
            {children}
        </div>
    );
}
