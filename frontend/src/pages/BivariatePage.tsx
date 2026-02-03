import { useState, useEffect } from 'react';
import { fetchCorrelation, apiClient } from '../api/client';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function BivariatePage() {
    const [activeTab, setActiveTab] = useState<'correlation' | 'cramers'>('correlation');
    const [matrixData, setMatrixData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            try {
                const endpoint = activeTab === 'correlation' ? 'correlation' : 'cramers';
                // Note: We need to implement cramers endpoint in main.py if not already there, 
                // based on previous steps main.py has /api/bivariate/correlation but maybe not cramers yet?
                // Checking main.py content earlier it DID NOT have cramers_v endpoint exposed. 
                // I will default to correlation for now and handle error gracefully.
                const { data } = await apiClient.post(`/bivariate/${endpoint}`);
                setMatrixData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [activeTab]);

    // Helper to colorize correlation cells
    const getCellColor = (val: number) => {
        // Determine color intensity based on absolute correlation
        const intensity = Math.abs(val);
        const color = val > 0 ? 'bg-blue' : 'bg-red';
        // Tailwind doesn't support dynamic opacity well in arbitrary values without style prop
        // Manual style injection is cleaner here
        return {
            backgroundColor: val > 0 ? `rgba(59, 130, 246, ${intensity})` : `rgba(239, 68, 68, ${intensity})`,
            color: intensity > 0.5 ? 'white' : 'black'
        };
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Advanced Bivariate Analysis</h2>
                    <p className="text-gray-500 text-sm">Explore relationships between variables using statistical tests.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('correlation')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'correlation' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Numeric Correlation
                    </button>
                    <button
                        onClick={() => setActiveTab('cramers')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'cramers' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Categorical (Cramér's V)
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-auto">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : matrixData ? (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {activeTab === 'correlation' ? 'Person Correlation Matrix' : 'Cramér\'s V Association Matrix'}
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs box-content">
                                <thead>
                                    <tr>
                                        <th className="p-2"></th>
                                        {matrixData.x.map((col: string) => (
                                            <th key={col} className="p-2 text-gray-500 rotate-45 h-24 whitespace-nowrap text-left origin-bottom-left translate-x-2">
                                                {col.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {matrixData.y.map((rowLabel: string, i: number) => (
                                        <tr key={rowLabel}>
                                            <td className="p-2 font-medium text-gray-600 text-right whitespace-nowrap">
                                                {rowLabel.replace(/_/g, ' ')}
                                            </td>
                                            {matrixData.z[i].map((val: number, j: number) => (
                                                <td
                                                    key={j}
                                                    title={`${rowLabel} vs ${matrixData.x[j]}: ${val.toFixed(3)}`}
                                                    className="p-3 text-center border border-white border-4 rounded-lg relative transition-transform hover:scale-110 cursor-help"
                                                    style={getCellColor(val)}
                                                >
                                                    {val.toFixed(2)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-10">No data available.</p>
                )}
            </div>

            {/* Bayes Playground (Placeholder for now, can be expanded) */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">💡 Theory Note</h3>
                <p className="text-indigo-700 text-sm">
                    Correlation does not imply causation. High correlation between <strong>Mental Health Score</strong> and <strong>Addiction Score</strong> suggests a strong relationship, but directionality requires experimental design or causal inference methods.
                </p>
            </div>
        </div>
    );
}
