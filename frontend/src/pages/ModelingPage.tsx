import { useState } from 'react';
import { apiClient } from '../api/client';
import { Card, Button } from '../components/ui';
import { Calculator } from 'lucide-react';

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
            console.log("Using Mock Data");
            setModelData({
                summary_html: '<table class="simpletable"><tr><td><strong>Dep. Variable:</strong></td><td>Addicted_Score</td><td><strong>  R-squared:         </strong></td><td>   0.724</td></tr><tr><td><strong>Model:</strong></td><td>OLS</td><td><strong>  Adj. R-squared:    </strong></td><td>   0.723</td></tr></table><p>Mock Model Summary provided for demo purposes.</p>'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Statistical Modeling</h2>
                <p className="text-slate-500 mt-1">Ordinary Least Squares (OLS) Regression Analysis.</p>
            </div>

            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Target Variable (Dependent)</label>
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Addicted_Score">Addicted_Score</option>
                            <option value="Mental_Health_Score">Mental_Health_Score</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Predictors (Independent)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableFeatures.map(feat => (
                                <button
                                    key={feat}
                                    onClick={() => togglePredictor(feat)}
                                    className={`px-4 py-2 text-sm rounded-full font-medium transition-all border ${predictors.includes(feat)
                                        ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {feat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={runModel}
                        disabled={loading || predictors.length === 0}
                        className="w-full md:w-auto"
                    >
                        {loading ? 'Fitting Model...' : 'Run OLS Regression'}
                    </Button>
                    {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
                </div>
            </Card>

            {modelData && (
                <Card className="p-0 overflow-hidden" delay={0.2}>
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                        <Calculator size={18} className="text-slate-500" />
                        <h3 className="font-semibold text-slate-700">Model Summary</h3>
                    </div>
                    <div className="p-6 overflow-x-auto bg-white">
                        {/* 
                           We apply prose-sm but also some custom CSS override for the statsmodels HTML table 
                           because standard tables are ugly.
                        */}
                        <div
                            className="prose prose-sm max-w-none prose-table:border prose-table:border-slate-200 prose-td:p-2 prose-th:p-2 prose-th:bg-slate-50"
                            dangerouslySetInnerHTML={{ __html: modelData.summary_html }}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
}
