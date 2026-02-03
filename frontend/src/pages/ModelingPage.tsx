import { useState } from 'react';
import { apiClient } from '../api/client';

export default function ModelingPage() {
    const [target, setTarget] = useState('Addicted_Score');
    const [predictors, setPredictors] = useState<string[]>(['Avg_Daily_Usage_Hours']);
    const [modelData, setModelData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const availableFeatures = ['Avg_Daily_Usage_Hours', 'Age', 'Sleep_Hours_Per_Night', 'Mental_Health_Score'];

    const togglePredictor = (feat: string) => {
        setPredictors(prev =>
            prev.includes(feat) ? prev.filter(p => p !== feat) : [...prev, feat]
        );
    };

    const runModel = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await apiClient.post('/models/regression', {
                target,
                predictors,
                model_type: 'OLS'
            });
            setModelData(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Model failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔮 Statistical Modeling</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Variable (Y)</label>
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="Addicted_Score">Addicted_Score</option>
                            <option value="Mental_Health_Score">Mental_Health_Score</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Predictors (X)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableFeatures.map(feat => (
                                <button
                                    key={feat}
                                    onClick={() => togglePredictor(feat)}
                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${predictors.includes(feat)
                                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {feat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={runModel}
                    disabled={loading || predictors.length === 0}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Fitting Model...' : 'Run OLS Regression'}
                </button>
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </div>

            {modelData && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Summary</h3>
                    {/* Render raw HTML from statsmodels safely-ish */}
                    <div
                        className="prose max-w-none text-xs"
                        dangerouslySetInnerHTML={{ __html: modelData.summary_html }}
                    />
                </div>
            )}
        </div>
    );
}
