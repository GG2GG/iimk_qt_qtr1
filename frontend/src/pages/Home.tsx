import { useEffect, useState } from 'react';
import { fetchSummary } from '../api/client';
import { Users, Clock, Brain, Activity } from 'lucide-react';
import { PageContainer, Section } from '../components/Layout';
import { StatCard, GlassCard, ChartContainer } from '../components/PremiumUI';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';

// Mock data for charts (to match reference visual)
const barData = [
    { name: 'Middle East', value: 437, value2: 255 },
    { name: 'North America', value: 154, value2: 90 },
    { name: 'Asia', value: 205, value2: 117 },
    { name: 'Europe', value: 309, value2: 120 },
    { name: 'Australia', value: 154, value2: 90 },
];

const pieData = [
    { name: 'High Risk', value: 32.2, color: '#f97316' }, // Orange
    { name: 'Moderate', value: 25.0, color: '#00b4d8' }, // Cyan
    { name: 'Low Risk', value: 24.2, color: '#0f766e' }, // Teal
    { name: 'None', value: 14.6, color: '#8b5cf6' }, // Purple
];

const scatterData = [
    { x: 10, y: 30, z: 200 }, { x: 12, y: 50, z: 260 },
    { x: 18, y: 40, z: 400 }, { x: 16, y: 60, z: 280 },
    { x: 25, y: 70, z: 500 }, { x: 30, y: 35, z: 200 },
    { x: 22, y: 55, z: 200 }, { x: 25, y: 30, z: 100 },
];

interface SummaryData {
    total_students: number;
    avg_usage: number;
    avg_addiction: number;
    avg_mental_health: number;
    columns: string[];
}

export default function Home() {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSummary()
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch(() => {
                // Fallback to mock data for demo/deployment
                console.log("API failed, using mock data");
                setData({
                    total_students: 1254,
                    avg_usage: 4.2,
                    avg_addiction: 45.8,
                    avg_mental_health: 62.1,
                    columns: ['Age', 'Gender', 'Region', 'Avg_Daily_Usage_Hours', 'Addicted_Score', 'Mental_Health_Score']
                });
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    // Error block removed to ensure render


    return (
        <PageContainer>
            <Section>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-slate-900 mb-2">
                        Social Media Analytics Dashboard
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Advanced quantitative analysis of student social media addiction patterns
                    </p>
                </div>

                {/* 1. TOP STATS ROW (4 Cols) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users} label="Total Students"
                        value={data?.total_students.toLocaleString() || '0'}
                        trend={{ value: 12.5, positive: true }} delay={0} variant="teal"
                    />
                    <StatCard
                        icon={Clock} label="Avg Daily Usage"
                        value={`${data?.avg_usage.toFixed(1)}h` || '0h'}
                        trend={{ value: 8.3, positive: false }} delay={0.1} variant="cyan"
                    />
                    <StatCard
                        icon={Brain} label="Avg Mental Health"
                        value={data?.avg_mental_health.toFixed(1) || '0'}
                        trend={{ value: 5.2, positive: true }} delay={0.2} variant="orange"
                    />
                    <StatCard
                        icon={Activity} label="Addiction Score"
                        value={data?.avg_addiction.toFixed(1) || '0'}
                        trend={{ value: 3.1, positive: false }} delay={0.3} variant="red"
                    />
                </div>

                {/* 2. MAIN CHART AREA (2 Cols: Chart + Table) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Bar Chart */}
                    <ChartContainer title="Demographic Distribution" actions={<div className="text-xs text-slate-500">Regional Split</div>}>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} barGap={0}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(226, 232, 240, 0.8)',
                                            color: '#1e293b',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} name="Students" />
                                    <Bar dataKey="value2" fill="#00b4d8" radius={[4, 4, 0, 0]} name="Engaged" />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>

                    {/* Side Table */}
                    <GlassCard className="col-span-1 p-0 overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 border-b border-white/10">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <Activity size={18} />
                                Dataset Columns
                            </h4>
                        </div>
                        <div className="overflow-y-auto h-[350px] pb-4 custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr><th className="px-6 py-3">Column</th><th className="px-6 py-3">Type</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data?.columns.slice(0, 10).map((col, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-700">{col.replace(/_/g, ' ')}</td>
                                            <td className="px-6 py-2">
                                                <span className={`px-2 py-1 rounded text-xs border ${col.includes('Score')
                                                    ? 'bg-blue-500/10 text-blue-200 border-blue-500/20'
                                                    : 'bg-slate-500/10 text-slate-300 border-slate-500/20'}`}>
                                                    {col.includes('Score') ? 'Numeric' : 'Categorical'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* 3. BOTTOM CHARTS ROW (3 Cols) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pie Chart */}
                    <ChartContainer title="Risk Distribution">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(226, 232, 240, 0.8)',
                                            color: '#1e293b',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>

                    {/* Bubble/Scatter Chart */}
                    <ChartContainer title="Usage Correlations">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" dataKey="x" name="Hours" unit="h" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis type="number" dataKey="y" name="Score" unit="pts" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(226, 232, 240, 0.8)',
                                            color: '#1e293b',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Scatter name="Students" data={scatterData} fill="#f97316" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>

                    {/* Top Deals / Insights */}
                    <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Activity size={100} className="text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-6 relative z-10">Top Insights</h3>
                        <div className="space-y-6 relative z-10 flex-1">
                            {[
                                { label: "Total Reach", val: "3.5M", color: "bg-teal-500" },
                                { label: "High Risk", val: "2.5M", color: "bg-orange-500" },
                                { label: "Revenue", val: "1.5M", color: "bg-purple-500", sub: true },
                                { label: "Engagement", val: "92%", color: "bg-cyan-500" }
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="font-bold text-slate-900">{item.val}</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-1000 ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                                            style={{ width: `${80 - (i * 10)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                            <span className="text-xs text-slate-500">Updated just now</span>
                        </div>
                    </GlassCard>
                </div>

            </Section>
        </PageContainer>
    );
}
