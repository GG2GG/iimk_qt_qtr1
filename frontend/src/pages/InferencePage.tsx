import { useState } from 'react';
import { apiClient } from '../api/client';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { Card, Button } from '../components/ui';

export default function InferencePage() {
    const [groupCol, setGroupCol] = useState('Gender');
    const [valueCol, setValueCol] = useState('Addicted_Score');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const runTest = async () => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const { data } = await apiClient.post('/inference/ttest', {
                group_col: groupCol,
                value_col: valueCol
            });
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Test failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hypothesis Testing</h2>
                    <p className="text-slate-500 mt-1">Statistical inference using T-Tests.</p>
                </div>
            </div>

            <Card className="p-8">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Grouping Variable (Categorical)</label>
                        <select
                            value={groupCol} onChange={(e) => setGroupCol(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="Gender">Gender</option>
                            <option value="Affects_Academic_Performance">Academics Affected?</option>
                            <option value="Relationship_Status">Relationship Status</option>
                        </select>
                    </div>

                    <div className="hidden md:flex pb-3 text-slate-300">
                        <ArrowRight />
                    </div>

                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Metric Variable (Numeric)</label>
                        <select
                            value={valueCol} onChange={(e) => setValueCol(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="Addicted_Score">Addicted Score</option>
                            <option value="Avg_Daily_Usage_Hours">Daily Usage</option>
                            <option value="Age">Age</option>
                        </select>
                    </div>

                    <Button
                        onClick={runTest}
                        disabled={loading}
                        className="w-full md:w-auto h-[50px]"
                    >
                        {loading ? 'Calculating...' : 'Run T-Test'}
                    </Button>
                </div>
                {error && <p className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</p>}
            </Card>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6" delay={0.1}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <FlaskConical size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Test Statistics</h3>
                        </div>

                        <div className="space-y-4">
                            <ResultRow label="T-Statistic" value={result.t_statistic.toFixed(4)} />
                            <ResultRow label="P-Value" value={result.p_value.toExponential(4)} />

                            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${result.p_value < 0.05 ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
                                <div className={`w-3 h-3 rounded-full ${result.p_value < 0.05 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                <span className="font-medium">
                                    {result.p_value < 0.05 ? "Significant Difference Found (p < 0.05)" : "No Significant Difference"}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6" delay={0.2}>
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Group Means Comparison</h3>
                        </div>
                        <div className="space-y-6 pt-4">
                            {result.groups.map((grp: string, i: number) => (
                                <div key={grp}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-600">{grp}</span>
                                        <span className="font-mono font-bold text-slate-900">{result.means[i].toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div
                                            className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min((result.means[i] / Math.max(...result.means)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

function ResultRow({ label, value }: any) {
    return (
        <div className="flex justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <span className="text-slate-500 font-medium">{label}</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded">{value}</span>
        </div>
    );
}
