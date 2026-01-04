import React from 'react';
import { BimStats } from '../types';
import { AlertTriangle, Layers, Maximize, FileWarning, Link as LinkIcon, Box } from 'lucide-react';

interface MetricsGridProps {
  stats: BimStats;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats }) => {
  const MetricCard = ({ label, value, icon: Icon, color, alert }: { label: string, value: string | number, icon: any, color: string, alert?: boolean }) => (
    <div className={`p-4 bg-white rounded-xl shadow-sm border ${alert ? 'border-red-300 bg-red-50' : 'border-slate-200'} flex items-start space-x-4 transition-all hover:shadow-md`}>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold ${alert ? 'text-red-700' : 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <MetricCard 
        label="File Size" 
        value={`${stats.fileSizeMb} MB`} 
        icon={Box} 
        color="bg-blue-500" 
        alert={stats.fileSizeMb > 300}
      />
      <MetricCard 
        label="Total Elements" 
        value={stats.elementCount.toLocaleString()} 
        icon={Layers} 
        color="bg-indigo-500" 
      />
      <MetricCard 
        label="Warnings" 
        value={stats.warningCount} 
        icon={AlertTriangle} 
        color={stats.warningCount > 100 ? "bg-amber-500" : "bg-green-500"}
        alert={stats.warningCount > 200}
      />
      <MetricCard 
        label="In-Place Families" 
        value={stats.inPlaceFamilies} 
        icon={Maximize} 
        color="bg-purple-500"
        alert={stats.inPlaceFamilies > 0}
      />
       <MetricCard 
        label="Unused Views" 
        value={stats.unusedViews} 
        icon={FileWarning} 
        color="bg-slate-500"
      />
      <MetricCard 
        label="Missing Links" 
        value={stats.missingLinks} 
        icon={LinkIcon} 
        color="bg-rose-500"
        alert={stats.missingLinks > 0}
      />
    </div>
  );
};
