import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

interface TrendDataPoint {
  date: string;
  distressScore: number;
  riskLevel: string;
  moodScore?: number | null;
  anxietyScore?: number | null;
  sleepQuality?: number | null;
  summary?: string;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel p-3.5 rounded-xl border border-gray-700/80 shadow-2xl text-xs space-y-1.5 max-w-xs">
        <p className="font-bold text-gray-200 border-b border-gray-800 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-teal-400 font-mono">
            {data.riskLevel}
          </span>
        </p>
        <div className="space-y-1 pt-1 font-mono">
          <p className="text-teal-300 flex justify-between">
            <span>Distress Index:</span>
            <span className="font-bold">{data.distressScore?.toFixed(1)} / 100</span>
          </p>
          {data.moodScore !== null && (
            <p className="text-emerald-400 flex justify-between">
              <span>Mood (1-5):</span>
              <span>{data.moodScore}</span>
            </p>
          )}
          {data.anxietyScore !== null && (
            <p className="text-amber-400 flex justify-between">
              <span>Anxiety (1-5):</span>
              <span>{data.anxietyScore}</span>
            </p>
          )}
        </div>
        {data.summary && (
          <p className="text-gray-400 text-[11px] pt-1.5 border-t border-gray-800/80 italic line-clamp-2">
            "{data.summary}"
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center rounded-xl bg-gray-900/40 border border-dashed border-gray-800 text-gray-500 text-sm">
        No assessment logs recorded yet. Complete check-ins to generate dynamic trend analytics.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-500/80 inline-block"></span>
            Distress Index (0-100)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-400 inline-block"></span>
            Anxiety (x20 scale)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
            Mood (x20 scale)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-emerald-400">Green &lt; 31</span>
          <span className="text-amber-400">Yellow 31-55</span>
          <span className="text-orange-400">Orange 56-80</span>
          <span className="text-red-400">Red &gt; 80</span>
        </div>
      </div>

      <div className="w-full" style={{ minHeight: height, height }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={height}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="distressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Indicators */}
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'Critical', fill: '#ef4444', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={56} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'High Risk', fill: '#f97316', fontSize: 10, position: 'right' }} />

            {/* Primary Distress Area */}
            <Area
              type="monotone"
              dataKey="distressScore"
              name="Distress Index"
              stroke="#14b8a6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#distressGradient)"
            />

            {/* Scaled Anxiety Line for overlay correlation (anxiety * 20) */}
            <Line
              type="monotone"
              dataKey={(d) => (d.anxietyScore ? d.anxietyScore * 20 : null)}
              name="Anxiety (Scaled)"
              stroke="#f43f5e"
              strokeWidth={1.5}
              dot={{ r: 3, fill: '#f43f5e' }}
              connectNulls
            />

            {/* Scaled Mood Line (mood * 20) */}
            <Line
              type="monotone"
              dataKey={(d) => (d.moodScore ? d.moodScore * 20 : null)}
              name="Mood (Scaled)"
              stroke="#10b981"
              strokeWidth={1.5}
              dot={{ r: 3, fill: '#10b981' }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
