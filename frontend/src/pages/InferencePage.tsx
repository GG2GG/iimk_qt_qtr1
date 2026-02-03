import { useState } from 'react';
import { apiClient } from '../api/client';
import { ArrowRight } from 'lucide-react';

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
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🧪 Hypothesis Testing (T-Test)</h2>

                <div className="flex items-center gap-4 flex-wrap">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Grouping Variable</label>
                        <select
                            value={groupCol} onChange={(e) => setGroupCol(e.target.value)}
                            className="p-2 border rounded-lg bg-gray-50"
                        >
                            <option value="Gender">Gender</option>
                            <option value="Affects_Academic_Performance">Academics Affected?</option>
                            <option value="Relationship_Status">Relationship Status</option>
                        </select>
                    </div>
                    <ArrowRight className="text-gray-400 mt-5" />
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Metric Variable</label>
                        <select
                            value={valueCol} onChange={(e) => setValueCol(e.target.value)}
                            className="p-2 border rounded-lg bg-gray-50"
                        >
                            <option value="Addicted_Score">Addicted Score</option>
                            <option value="Avg_Daily_Usage_Hours">Daily Usage</option>
                            <option value="Age">Age</option>
                        </select>
                    </div>
                    <button
                        onClick={runTest}
                        className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        {loading ? 'Calculating...' : 'Run T-Test'}
                    </button>
                </div>
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
                        <div className="space-y-3">
                            <ResultRow label="T-Statistic" value={result.t_statistic.toFixed(4)} />
                            <ResultRow label="P-Value" value={result.p_value.toExponential(4)} />
                            <div className={`p-3 rounded-lg text-center font-medium ${result.p_value < 0.05 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {result.p_value < 0.05 ? "Significant Difference Found" : "No Significant Difference"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Means</h3>
                        <div className="space-y-4">
                            {result.groups.map((grp: string, i: number) => (
                                <div key={grp} className="flex justify-between items-center">
                                    <span className="text-gray-600">{grp}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: Math.min(result.means[i] * 50, 100) + 'px' }}></div>
                                        <span className="font-mono">{result.means[i].toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ResultRow({ label, value }: any) {
    return (
        <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">{label}</span>
            <span className="font-mono font-bold text-gray-900">{value}</span>
        </div>
    );
}
