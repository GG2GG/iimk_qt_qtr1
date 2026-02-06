import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// Glassmorphic Card
export function GlassCard({
    children,
    className = '',
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`
        glass-panel rounded-3xl
        relative overflow-hidden
        transition-all duration-300
        hover:shadow-neon/20 hover:border-white/20
        ${className}
      `}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

// Stat Card
interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: { value: number; positive: boolean };
    delay?: number;
    variant?: 'white' | 'teal' | 'cyan' | 'orange' | 'red' | 'neon';
}

export function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    delay = 0,
    variant = 'neon'
}: StatCardProps) {
    const variants = {
        white: "bg-white border-slate-200 text-slate-900 shadow-sm",
        teal: "bg-teal-50 border-teal-100 text-teal-900",
        cyan: "bg-cyan-50 border-cyan-100 text-cyan-900",
        orange: "bg-orange-50 border-orange-100 text-orange-900",
        red: "bg-red-50 border-red-100 text-red-900",
        neon: "glass-panel bg-gradient-to-br from-white/80 to-white/40 border-white/60 text-slate-900 hover:shadow-lg"
    };

    const textColors = {
        white: { label: "text-slate-500", value: "text-slate-900", icon: "bg-slate-100", iconColor: "text-slate-600" },
        teal: { label: "text-teal-600", value: "text-teal-900", icon: "bg-teal-100", iconColor: "text-teal-600" },
        cyan: { label: "text-cyan-600", value: "text-cyan-900", icon: "bg-cyan-100", iconColor: "text-cyan-600" },
        orange: { label: "text-orange-600", value: "text-orange-900", icon: "bg-orange-100", iconColor: "text-orange-600" },
        red: { label: "text-red-600", value: "text-red-900", icon: "bg-red-100", iconColor: "text-red-600" },
        neon: { label: "text-slate-500", value: "text-slate-900", icon: "bg-gradient-to-br from-blue-500 to-purple-600", iconColor: "text-white" }
    };

    const currentText = textColors[variant] || textColors.neon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative h-full"
        >
            <div className={`
        relative overflow-hidden
        rounded-2xl p-6
        transition-all duration-300
        hover:shadow-xl relative z-10
        border backdrop-blur-md
        ${variants[variant]}
      `}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`p-3 rounded-xl shadow-lg transition-all ${currentText.icon}`}>
                        <Icon className={`w-6 h-6 ${currentText.iconColor}`} />
                    </div>
                    {trend && (
                        <div className={`
              text-sm font-bold px-2 py-1 rounded-full backdrop-blur-sm
              ${trend.positive ? 'text-green-400 bg-green-900/30 border border-green-500/30' : 'text-red-400 bg-red-900/30 border border-red-500/30'}
            `}>
                            {trend.positive ? '+' : ''}{trend.value}%
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-1 relative z-10">
                    <p className={`text-sm font-medium uppercase tracking-wider ${currentText.label}`}>
                        {label}
                    </p>
                    <p className={`text-3xl font-bold ${currentText.value}`}>
                        {value}
                    </p>
                </div>

                {/* Sparkline Decoration */}
                <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M0 50 Q 25 20 50 35 T 100 10 V 50 H 0" fill="url(#sparkline-gradient)" />
                    <defs>
                        <linearGradient id="sparkline-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </motion.div>
    );
}

// Chart Container
export function ChartContainer({
    title,
    children,
    actions
}: {
    title: string;
    children: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full block"></span>
                    {title}
                </h3>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            <div className="w-full relative z-10">
                {children}
            </div>
        </GlassCard>
    );
}

// Premium Button
export function PremiumButton({
    children,
    onClick,
    variant = 'primary',
    icon: Icon,
    loading = false,
    disabled = false
}: {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'neon';
    icon?: LucideIcon;
    loading?: boolean;
    disabled?: boolean;
}) {
    const variants = {
        primary: `
      bg-gradient-to-r from-blue-600 to-blue-700
      hover:from-blue-500 hover:to-blue-600
      text-white shadow-lg shadow-blue-500/30
      hover:shadow-blue-500/50
      border border-transparent
    `,
        secondary: `
      glass-panel
      bg-white/5 hover:bg-white/10
      border-white/10 hover:border-white/30
      text-white shadow-sm
    `,
        ghost: `
      bg-transparent hover:bg-white/10
      text-slate-300 hover:text-white
    `,
        neon: `
      bg-gradient-to-r from-neon-blue to-neon-purple
      text-white shadow-neon
      hover:shadow-neon/50
      border border-transparent
        `
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        px-6 py-3 rounded-xl
        font-semibold text-sm
        flex items-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {Icon && !loading && <Icon className="w-4 h-4" />}
            {children}
        </motion.button>
    );
}

// Input Field
export function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder
}: {
    label?: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-slate-300 ml-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
          w-full px-4 py-3
          bg-white/50 border border-slate-200
          rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
          transition-all duration-200
          text-slate-900 placeholder-slate-400
          backdrop-blur-sm
        "
            />
        </div>
    );
}

// Select Field
export function Select({
    label,
    value,
    onChange,
    options
}: {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-slate-300 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="
            w-full px-4 py-3
            bg-white/50 border border-slate-200
            rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
            transition-all duration-200
            text-slate-900
            cursor-pointer
            appearance-none
            backdrop-blur-sm
          "
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
