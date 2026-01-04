import React from 'react';
import { AiAnalysisResult } from '../types';
import { Sparkles, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

interface AIRecommendationsProps {
  analysis: AiAnalysisResult;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex items-center gap-3">
        <Sparkles className="w-6 h-6 animate-pulse" />
        <div>
          <h2 className="text-xl font-bold">AI Manager Analysis</h2>
          <p className="text-indigo-100 text-sm opacity-90">{analysis.summary}</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Recommended Actions
        </h3>
        
        <div className="space-y-4">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
              <div className="mt-1">
                {rec.priority === 'High' ? (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                ) : rec.priority === 'Medium' ? (
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${rec.priority === 'High' ? 'bg-red-100 text-red-700' : 
                        rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-600 font-medium">
                      {rec.category}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
