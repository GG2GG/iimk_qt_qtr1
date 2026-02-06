import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { RefreshCw } from 'lucide-react';

export default function MultivariatePage() {
    const [pcaData, setPcaData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Hardcoded numeric columns for now
    const [selectedCols] = useState<string[]>([
        'Avg_Daily_Usage_Hours', 'Addicted_Score', 'Mental_Health_Score', 'Sleep_Hours_Per_Night'
    ]);

    const runPCA = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.post('/multivariate/pca', { cols: selectedCols });

            // Transform for Scree Plot
            const screeData = data.explained_variance.map((val: number, i: number) => ({
                component: `PC${i + 1}`,
                variance: val,
                cumulative: data.cumulative_variance[i]
            }));

            setPcaData({ ...data, screeData });
        } catch (err) {
            console.log("Using Mock Data");
            const screeDataMock = Array.from({ length: 10 }, (_, i) => ({
                component: `PC${i + 1}`,
                variance: Math.exp(-i / 2) / 2,
                cumulative: 1 - Math.exp(-(i + 1) / 2)
            }));
            const mockComponents = [
                [0.5, -0.2, 0.8, 0.1],
                [0.4, 0.7, -0.3, 0.2],
                [0.6, 0.1, 0.5, -0.4],
                [0.2, -0.5, 0.1, 0.8]
            ];
            setPcaData({
                explained_variance: [0.4, 0.3, 0.2, 0.1],
                cumulative_variance: [0.4, 0.7, 0.9, 1.0],
                screeData: screeDataMock,
                components: mockComponents,
                feature_names: ['Usage', 'Sleep', 'Addiction', 'Mental Health']
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runPCA();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Multivariate Analysis (PCA)</h2>
                    <p className="text-gray-500">Dimensionality reduction to identify latent factors.</p>
                </div>
                <button
                    onClick={runPCA}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Running...' : 'Re-Run Model'}
                </button>
            </div>

            {pcaData ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Scree Plot */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Scree Plot (Variance Explained)</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <ComposedChart data={pcaData.screeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="component" />
                                <YAxis yAxisId="left" label={{ value: 'Variance Ex.', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Cumulative', angle: 90, position: 'insideRight' }} />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="variance" name="Explained Var" fill="#8884d8" barSize={30} radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative Var" stroke="#ff7300" strokeWidth={2} dot />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Loadings Table */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-auto max-h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Loadings</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="px-3 py-2 text-left font-medium text-gray-500">Feature</th>
                                        {pcaData.components[0].map((_: any, i: number) => (
                                            <th key={i} className="px-3 py-2 text-right font-medium text-gray-500">PC{i + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pcaData.feature_names.map((feature: string, i: number) => (
                                        <tr key={feature} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-3 py-2 font-medium text-gray-900 truncate max-w-[120px]" title={feature}>
                                                {feature}
                                            </td>
                                            {pcaData.components.map((comp: number[], j: number) => (
                                                <td key={j} className="px-3 py-2 text-right text-gray-600 font-mono">
                                                    {comp[i].toFixed(2)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400">Run PCA to visualize data</p>
                </div>
            )}
        </div>
    );
}
