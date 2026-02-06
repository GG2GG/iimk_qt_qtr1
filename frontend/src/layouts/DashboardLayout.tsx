import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BarChart2, GitMerge, Network,
    Calculator, FileText, FlaskConical, PieChart,
    Settings, Zap, X, Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlassCard } from '../components/PremiumUI';

const MENU_ITEMS = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Variables', path: '/variables', icon: FileText },
    { label: 'Univariate', path: '/univariate', icon: BarChart2 },
    { label: 'Bivariate', path: '/bivariate', icon: GitMerge },
    { label: 'Multivariate', path: '/multivariate', icon: Network },
    { label: 'Modeling', path: '/modeling', icon: Calculator },
    { label: 'Inference', path: '/inference', icon: FlaskConical },
    { label: 'Metrics', path: '/metrics', icon: PieChart },
];

export default function DashboardLayout() {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const SidebarContent = () => (
        <div className="h-full flex flex-col">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                        AddictCheck
                    </span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className="block relative group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-blue-50 rounded-xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={`
                                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                                ${isActive ? 'text-blue-600 font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                            `}>
                                <item.icon size={20} className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <GlassCard className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 !border-none">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">Pro Plan</p>
                            <p className="text-blue-100 text-xs">Unlock all features</p>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                        Upgrade Now
                    </button>
                </GlassCard>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden text-slate-900 bg-slate-50 selection:bg-blue-200 selection:text-blue-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 m-4 rounded-3xl bg-white border border-slate-200 relative z-20 overflow-hidden transition-all duration-300 shadow-xl shadow-slate-200/50">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl"
                    >
                        <SidebarContent />
                    </motion.aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden m-4 mb-0 rounded-2xl p-4 bg-white shadow-sm border border-slate-200 flex justify-between items-center z-20">
                    <span className="font-bold text-slate-900">AddictCheck</span>
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
