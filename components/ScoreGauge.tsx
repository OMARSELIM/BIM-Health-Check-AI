import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remainder', value: 100 - score },
  ];

  let color = '#22c55e'; // Green
  if (score < 50) color = '#ef4444'; // Red
  else if (score < 80) color = '#f59e0b'; // Orange

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Model Health Score</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#f1f5f9" />
              <Label
                value={`${score}`}
                position="center"
                className="text-4xl font-bold fill-slate-800"
                dy={-10}
              />
              <Label
                value="/ 100"
                position="center"
                className="text-sm fill-slate-400"
                dy={15}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-slate-500 -mt-8">
        Based on ISO 19650 standards
      </p>
    </div>
  );
};
