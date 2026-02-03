import { useEffect, useState } from 'react';
import { fetchSummary } from '../api/client';
import { Users, Clock, Brain, Activity } from 'lucide-react';

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
            .then(setData)
            .catch((err) => setError('Failed to load summary data: ' + err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading summary...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Dashboard</h2>
                <p className="text-gray-600">
                    Quantitative Theory Analysis of Student Social Media Addiction.
                    Explore the menu to see detailed statistical breakdowns.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="Total Students" value={data?.total_students} icon={Users} color="blue" />
                <MetricCard label="Avg Daily Usage" value={data?.avg_usage.toFixed(2) + ' h'} icon={Clock} color="indigo" />
                <MetricCard label="Avg Addiction Score" value={data?.avg_addiction.toFixed(2)} icon={Activity} color="rose" />
                <MetricCard label="Avg Mental Health" value={data?.avg_mental_health.toFixed(2)} icon={Brain} color="teal" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Dataset Columns</h3>
                <div className="flex flex-wrap gap-2">
                    {data?.columns.map(col => (
                        <span key={col} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {col}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color }: any) {
    const colorClasses: any = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        rose: "bg-rose-50 text-rose-600",
        teal: "bg-teal-50 text-teal-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-lg mr-4 ${colorClasses[color] || "bg-gray-100"}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
