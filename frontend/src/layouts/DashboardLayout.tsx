import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BarChart2, GitMerge, Network,
    Calculator, FileText, FlaskConical, PieChart, Menu
} from 'lucide-react';
import { cn } from '../components/ui';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Variables', path: '/variables', icon: FileText },
    { name: 'Univariate', path: '/univariate', icon: BarChart2 },
    { name: 'Bivariate', path: '/bivariate', icon: GitMerge },
    { name: 'Multivariate', path: '/multivariate', icon: Network },
    { name: 'Modeling', path: '/modeling', icon: Calculator },
    { name: 'Inference', path: '/inference', icon: FlaskConical },
    { name: 'Metrics', path: '/metrics', icon: PieChart },
];

export default function DashboardLayout() {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar (Desktop) */}
            <aside className="w-72 bg-slate-900 text-slate-300 hidden md:flex flex-col shadow-2xl relative z-10">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                            QT
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">SocialAnalytics</h1>
                    </div>
                    <div className="h-px bg-slate-800 w-full mb-4"></div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2 pl-2">Analytics Modules</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1"
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive ? "text-blue-200" : "text-slate-500 group-hover:text-blue-400"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
                        <div>
                            <p className="text-sm font-medium text-white">Guest User</p>
                            <p className="text-xs text-slate-500">Data Analyst</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header (Mobile Only mostly, but keeps layout structure) */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/60 px-8 py-4 flex justify-between items-center md:hidden">
                    <span className="font-bold text-slate-800">SocialAnalytics</span>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                        <Menu className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
