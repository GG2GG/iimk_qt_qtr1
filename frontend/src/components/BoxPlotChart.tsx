
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface BoxPlotData {
    category: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers: number[];
    count: number;
}

interface BoxPlotChartProps {
    data: BoxPlotData[];
}

const CustomBoxPlot = (props: any) => {
    const { x, width, height, value } = props;
    const { min, q1, median, q3, max } = value;

    if (!width || !height) return null;

    const yMin = props.yAxis.scale(min);
    const yQ1 = props.yAxis.scale(q1);
    const yMedian = props.yAxis.scale(median);
    const yQ3 = props.yAxis.scale(q3);
    const yMax = props.yAxis.scale(max);

    const boxWidth = width * 0.4;
    const center = x + width / 2;

    return (
        <g>
            {/* Whiskers */}
            <line x1={center} y1={yMin} x2={center} y2={yQ1} stroke="#334155" strokeWidth={2} />
            <line x1={center} y1={yQ3} x2={center} y2={yMax} stroke="#334155" strokeWidth={2} />
            <line x1={center - boxWidth / 2} y1={yMin} x2={center + boxWidth / 2} y2={yMin} stroke="#334155" strokeWidth={2} />
            <line x1={center - boxWidth / 2} y1={yMax} x2={center + boxWidth / 2} y2={yMax} stroke="#334155" strokeWidth={2} />

            {/* Box */}
            <rect
                x={center - boxWidth}
                y={yQ3}
                width={boxWidth * 2}
                height={yQ1 - yQ3}
                fill="#fca5a5"
                stroke="#b91c1c"
                strokeWidth={2}
                opacity={0.8}
                rx={4}
            />

            {/* Median Line */}
            <line x1={center - boxWidth} y1={yMedian} x2={center + boxWidth} y2={yMedian} stroke="#7f1d1d" strokeWidth={3} />
        </g>
    );
};

// Custom tooltip to show stats
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 rounded-xl shadow-xl text-sm z-50">
                <p className="font-bold text-slate-800 mb-2">{data.category}</p>
                <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between gap-4"><span>Max:</span> <span className="font-mono">{data.max.toFixed(2)}</span></div>
                    <div className="flex justify-between gap-4"><span>Q3:</span> <span className="font-mono">{data.q3.toFixed(2)}</span></div>
                    <div className="flex justify-between gap-4 text-rose-600 font-bold"><span>Median:</span> <span className="font-mono">{data.median.toFixed(2)}</span></div>
                    <div className="flex justify-between gap-4"><span>Q1:</span> <span className="font-mono">{data.q1.toFixed(2)}</span></div>
                    <div className="flex justify-between gap-4"><span>Min:</span> <span className="font-mono">{data.min.toFixed(2)}</span></div>
                    <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-400">
                        Samples: {data.count} | Outliers: {data.outliers.length}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function BoxPlotChart({ data }: BoxPlotChartProps) {
    // Flatten outliers for scatter plot if needed, strictly speaking Recharts doesn't easy support 
    // mixing aggregated boxplot + raw outliers easily without custom shape overrides or layered charts.
    // For now we will just show the box plot stats.

    // Transform data for recharts
    // We pass the whole object to the 'value' prop for the CustomBoxPlot to parse
    const chartData = data.map(d => ({
        ...d,
        stats: { min: d.min, q1: d.q1, median: d.median, q3: d.q3, max: d.max }
    }));

    // Find global min/max for Y axis scaling
    const allValues = data.flatMap(d => [d.min, d.max, ...d.outliers]);
    const minDomain = Math.min(...allValues);
    const maxDomain = Math.max(...allValues);
    const domainPadding = (maxDomain - minDomain) * 0.1;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                />
                <YAxis
                    domain={[minDomain - domainPadding, maxDomain + domainPadding]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* The Box Plot implementation using a Custom Bar Shape */}
                <Bar dataKey="stats" shape={<CustomBoxPlot />} />

                {/* 
                   Future improvement: Add Scatter for outliers. 
                   Requires flattening the outliers array into a separate dataset 
                   that aligns with the x-axis categories.
                */}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
