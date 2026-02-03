import { useState, useEffect } from 'react';
import { fetchDistData } from '../api/client';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

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
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Univariate Distributions</h2>
                    <p className="text-gray-500">Analyze the probability distribution of single variables.</p>
                </div>

                <button
                    onClick={() => setSelectedVar(selectedVar)} // Trigger refresh
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Controls Panel */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Variable</label>
                        <select
                            value={selectedVar}
                            onChange={(e) => setSelectedVar(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {FEATURE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theoretical Dist.</label>
                        <div className="flex flex-col gap-2">
                            {['norm', 'lognorm', 'gamma'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setDistType(type)}
                                    className={`px-4 py-2 text-sm rounded-lg text-left transition-all flex justify-between items-center ${distType === type
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    {type === 'norm' ? 'Normal (Gaussian)' : type}
                                    {distType === type && <CheckCircle size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Panel */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[450px]">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="x" label={{ value: selectedVar, position: 'insideBottom', offset: -10 }} tick={{ fontSize: 12 }} />
                                    <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" />
                                    <Bar dataKey="frequency" fill="#e0e7ff" name="Observed Data" barSize={20} radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="fitted" stroke="#2563eb" strokeWidth={3} dot={false} name={`Fitted ${distType}`} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Statistics Cards */}
                    {distData && distData.stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Mean" value={distData.stats.mean.toFixed(2)} />
                            <StatCard label="Std Dev" value={distData.stats.std.toFixed(2)} />
                            <StatCard label="Skewness" value={distData.stats.skewness.toFixed(2)} />
                            <StatCard label="Kurtosis" value={distData.stats.kurtosis.toFixed(2)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-800 font-mono">{value}</p>
        </div>
    );
}
