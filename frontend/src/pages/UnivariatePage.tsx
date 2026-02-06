import { useState, useEffect } from 'react';
import { fetchDistData } from '../api/client';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { RefreshCw, CheckCircle, Activity } from 'lucide-react';
import { GlassCard, StatCard, PremiumButton, Select, ChartContainer } from '../components/PremiumUI';
import { PageContainer } from '../components/Layout';

const FEATURE_OPTIONS = [
    'Age', 'Avg_Daily_Usage_Hours', 'Sleep_Hours_Per_Night',
    'Mental_Health_Score', 'Addicted_Score'
];

export default function UnivariatePage() {
    const [selectedVar, setSelectedVar] = useState('Avg_Daily_Usage_Hours');
    const [distType, setDistType] = useState('norm');
    const [distData, setDistData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchDistData(selectedVar, distType)
            .then(data => setDistData(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedVar, distType]);

    // Combine histograms and fitted curve for Recharts
    const chartData = distData ? distData.histogram.x.map((x: number, i: number) => ({
        x: x.toFixed(2),
        frequency: distData.histogram.y[i],
        fitted: distData.fitted.y[i] || 0
    })) : [];

    return (
        <PageContainer>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-slate-900">Univariate Distributions</h2>
                        <p className="text-slate-600 mt-1">Analyze the probability distribution of single variables.</p>
                    </div>

                    <PremiumButton
                        onClick={() => setSelectedVar(selectedVar)} // Trigger refresh
                        variant="neon"
                        icon={RefreshCw}
                    >
                        Refresh
                    </PremiumButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Controls Panel */}
                    <div className="lg:col-span-3 space-y-6">
                        <GlassCard className="p-6 space-y-6">
                            <Select
                                label="Target Variable"
                                value={selectedVar}
                                onChange={setSelectedVar}
                                options={FEATURE_OPTIONS.map(opt => ({ value: opt, label: opt.replace(/_/g, ' ') }))}
                            />

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 ml-1">Distribution Type</label>
                                <div className="space-y-2">
                                    {['norm', 'lognorm', 'gamma'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setDistType(type)}
                                            className={`w-full px-4 py-3 text-sm rounded-xl text-left transition-all flex justify-between items-center border ${distType === type
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            {type === 'norm' ? 'Normal (Gaussian)' : type}
                                            {distType === type && <CheckCircle size={16} className="text-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Chart Panel */}
                    <div className="lg:col-span-9 space-y-6">
                        <ChartContainer title={`Distribution Analysis: ${selectedVar.replace(/_/g, ' ')}`}>
                            <div className="h-[400px] w-full">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center text-slate-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue mr-3"></div>
                                        Loading distribution data...
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                                            <XAxis
                                                dataKey="x"
                                                label={{ value: selectedVar, position: 'insideBottom', offset: -10, fill: '#64748b' }}
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                stroke="rgba(0,0,0,0.1)"
                                            />
                                            <YAxis
                                                label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                stroke="rgba(0,0,0,0.1)"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(8px)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(226, 232, 240, 0.8)',
                                                    color: '#1e293b',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}
                                                itemStyle={{ color: '#1e293b' }}
                                            />
                                            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                                            <Bar dataKey="frequency" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" name="Observed Data" barSize={20} radius={[4, 4, 0, 0]} />
                                            <Line type="monotone" dataKey="fitted" stroke="#00f2fe" strokeWidth={3} dot={false} name={`Fitted ${distType}`} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </ChartContainer>

                        {/* Statistics Cards */}
                        {distData && distData.stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard
                                    icon={Activity}
                                    label="Mean"
                                    value={distData.stats.mean.toFixed(2)}
                                    variant="neon"
                                />
                                <StatCard
                                    icon={Activity}
                                    label="Std Dev"
                                    value={distData.stats.std.toFixed(2)}
                                    variant="cyan"
                                />
                                <StatCard
                                    icon={Activity}
                                    label="Skewness"
                                    value={distData.stats.skewness.toFixed(2)}
                                    variant="teal"
                                />
                                <StatCard
                                    icon={Activity}
                                    label="Kurtosis"
                                    value={distData.stats.kurtosis.toFixed(2)}
                                    variant="orange"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
