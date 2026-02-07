import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { GlassCard } from '../components/PremiumUI';
import BoxPlotChart from '../components/BoxPlotChart';
import { GitMerge, FileText, Info, BarChart2 } from 'lucide-react';
import { PageContainer } from '../components/Layout';

export default function BivariatePage() {
    const [activeTab, setActiveTab] = useState<'correlation' | 'cramers' | 'boxplot'>('correlation');
    const [matrixData, setMatrixData] = useState<any>(null);
    const [boxData, setBoxData] = useState<any[]>([]);

    // Box Plot Selections
    const [xVar, setXVar] = useState('Gender');
    const [yVar, setYVar] = useState('Addicted_Score');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            try {
                if (activeTab === 'boxplot') {
                    const { data } = await apiClient.post('/bivariate/boxplot', { x_col: xVar, y_col: yVar });
                    setBoxData(data);
                } else {
                    const endpoint = activeTab === 'correlation' ? 'correlation' : 'cramers';
                    const { data } = await apiClient.post(`/bivariate/${endpoint}`);
                    setMatrixData(data);
                }
            } catch (err) {
                console.log("Using Mock Data / API Error");
                if (activeTab === 'boxplot') {
                    // Mock Box Data
                    setBoxData([
                        { category: 'Male', min: 20, q1: 35, median: 45, q3: 55, max: 70, outliers: [15, 75, 80], count: 120 },
                        { category: 'Female', min: 22, q1: 38, median: 48, q3: 60, max: 75, outliers: [18], count: 140 },
                    ]);
                } else {
                    const cols = ['Age', 'Usage_Hrs', 'Addiction', 'Sleep', 'Mental_Health'];
                    const matrix = [
                        [1.0, 0.3, 0.1, -0.2, 0.05],
                        [0.3, 1.0, 0.85, -0.5, 0.4],
                        [0.1, 0.85, 1.0, -0.6, 0.7],
                        [-0.2, -0.5, -0.6, 1.0, -0.3],
                        [0.05, 0.4, 0.7, -0.3, 1.0]
                    ];
                    setMatrixData({ x: cols, y: cols, z: matrix });
                }
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [activeTab, xVar, yVar]);

    // Helper to colorize correlation cells
    const getCellColor = (val: number) => {
        // Determine color intensity based on absolute correlation
        const intensity = Math.abs(val);
        // Using blue for positive, red for negative
        const color = val > 0 ? 'rgba(59, 130, 246, ' : 'rgba(239, 68, 68, '; // blue-500 vs red-500

        return {
            backgroundColor: `${color}${intensity * 0.2})`, // lighter background
            color: intensity > 0.4 ? '#0f172a' : '#334155', // dark text
            borderColor: `${color}0.3)`
        };
    };

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-slate-900">Advanced Bivariate Analysis</h2>
                        <p className="text-slate-600 mt-1">Explore relationships between variables using statistical tests.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTab('correlation')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'correlation' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <FileText size={16} />
                            Numeric Correlation
                        </button>
                        <button
                            onClick={() => setActiveTab('cramers')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'cramers' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <GitMerge size={16} />
                            Categorical (Cramér's V)
                        </button>
                        <button
                            onClick={() => setActiveTab('boxplot')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'boxplot' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <BarChart2 size={16} />
                            Box Plots
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <GlassCard className="p-1 overflow-visible">
                    {loading ? (
                        <div className="flex justify-center py-20 flex-col items-center gap-4 text-slate-400">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
                            <p>Computing Matrix...</p>
                        </div>
                    ) : matrixData ? (
                        <div className="p-4 overflow-auto rounded-2xl">
                            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-sm"></span>
                                {activeTab === 'correlation' ? 'Pearson Correlation Matrix' : activeTab === 'cramers' ? 'Cramér\'s V Association Matrix' : 'Distribution Comparison (Box Plot)'}
                            </h3>

                            <div className="overflow-x-auto pb-4 custom-scrollbar">
                                <table className="w-full text-xs box-content border-separate border-spacing-1">
                                    <thead>
                                        <tr>
                                            <th className="p-2"></th>
                                            {matrixData.x.map((col: string) => (
                                                <th key={col} className="p-2 text-slate-600 rotate-45 h-32 whitespace-nowrap text-left origin-bottom-left translate-x-4 font-normal">
                                                    {col.replace(/_/g, ' ')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matrixData.y.map((rowLabel: string, i: number) => (
                                            <tr key={rowLabel}>
                                                <td className="p-2 font-medium text-slate-600 text-right whitespace-nowrap">
                                                    {rowLabel.replace(/_/g, ' ')}
                                                </td>
                                                {matrixData.z[i].map((val: number, j: number) => (
                                                    <td
                                                        key={j}
                                                        title={`${rowLabel} vs ${matrixData.x[j]}: ${val.toFixed(3)}`}
                                                        className="p-4 text-center rounded-lg transition-transform hover:scale-105 cursor-help border relative group"
                                                        style={getCellColor(val)}
                                                    >
                                                        <span className="relative z-10 drop-shadow-md font-semibold">{val.toFixed(2)}</span>
                                                        {/* Glow effect on hover */}
                                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'boxplot' && boxData ? (
                        <div className="p-4 rounded-2xl h-[500px] flex flex-col">
                            <div className="flex flex-wrap gap-4 mb-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    Group By (X):
                                    <select
                                        value={xVar}
                                        onChange={(e) => setXVar(e.target.value)}
                                        className="bg-white border border-slate-300 text-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Gender">Gender</option>
                                        <option value="Region">Region</option>
                                        <option value="Influence_Level">Influence Level</option>
                                    </select>
                                </label>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    Metric (Y):
                                    <select
                                        value={yVar}
                                        onChange={(e) => setYVar(e.target.value)}
                                        className="bg-white border border-slate-300 text-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Addicted_Score">Addiction Score</option>
                                        <option value="Mental_Health_Score">Mental Health Score</option>
                                        <option value="Avg_Daily_Usage_Hours">Daily Usage (Hours)</option>
                                        <option value="Age">Age</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex-1 w-full min-h-0">
                                <BoxPlotChart data={boxData} />
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-slate-400 py-10">No data available.</p>
                    )}
                </GlassCard>

                {/* Theory Note */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
                            <Info size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Statistical Significance Node</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Correlation does not imply causation. High correlation between <strong className="text-slate-900">Mental Health Score</strong> and <strong className="text-slate-900">Addiction Score</strong> suggests a strong relationship, but directionality requires experimental design or causal inference methods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
