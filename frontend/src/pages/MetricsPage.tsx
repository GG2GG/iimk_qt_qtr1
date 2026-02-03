import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function MetricsPage() {
    const [gini, setGini] = useState<any>(null);
    const [monteCarlo, setMonteCarlo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [giniRes, mcRes] = await Promise.all([
                    apiClient.get('/metrics/inequality'),
                    apiClient.get('/metrics/monte_carlo')
                ]);
                setGini(giniRes.data);

                // Transform MC histogram for chart
                const mcData = mcRes.data.dist.x.map((x: number, i: number) => ({
                    val: x.toFixed(2),
                    freq: mcRes.data.dist.y[i]
                }));
                setMonteCarlo({ ...mcRes.data, chartData: mcData });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">🧮 Experimental Research Metrics</h2>
                <p className="text-gray-500">Advanced quantitative metrics for rigorous analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gini Coefficients */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Gini Coefficients (Inequality)</h3>
                    {gini ? (
                        <div className="space-y-4">
                            {Object.entries(gini).map(([key, val]: [string, any]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-600">{key.replace(/_/g, ' ')}</span>
                                        <span className="font-mono font-bold text-blue-600">{val.toFixed(3)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${val * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-gray-400 mt-2">0 = Perfect Equality, 1 = Perfect Inequality</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* Monte Carlo */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Monte Carlo Simulation</h3>
                    <p className="text-xs text-gray-500 mb-4">Bootstrapping Mean Addiction Score (1000 iter)</p>

                    {monteCarlo && (
                        <>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monteCarlo.chartData}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis dataKey="val" hide />
                                        <Tooltip />
                                        <Bar dataKey="freq" fill="#8b5cf6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-gray-500">95% CI:</span>
                                <span className="font-mono font-medium">
                                    [{monteCarlo.ci_95[0].toFixed(2)}, {monteCarlo.ci_95[1].toFixed(2)}]
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
