import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { MetricsGrid } from './components/MetricsGrid';
import { ScoreGauge } from './components/ScoreGauge';
import { AIRecommendations } from './components/AIRecommendations';
import { parseBimFile } from './services/mockBimParser';
import { analyzeBimHealth } from './services/geminiService';
import { BimStats, AiAnalysisResult, AppState } from './types';
import { Activity, ArrowLeft, Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [stats, setStats] = useState<BimStats | null>(null);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setAppState(AppState.ANALYZING_GEOMETRY);
      
      // Step 1: Parse (Simulated)
      const extractedStats = await parseBimFile(file);
      setStats(extractedStats);
      
      // Step 2: AI Analysis
      setAppState(AppState.GENERATING_REPORT);
      const aiResult = await analyzeBimHealth(extractedStats);
      setAnalysis(aiResult);
      
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  }, []);

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setStats(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl tracking-tight">BIM<span className="text-indigo-600">Health</span>Check</span>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">BETA</span>
              Powered by Gemini 2.0
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* State: IDLE (Upload) */}
        {appState === AppState.IDLE && (
          <FileUpload onFileSelect={handleFileSelect} isProcessing={false} />
        )}

        {/* State: LOADING */}
        {(appState === AppState.ANALYZING_GEOMETRY || appState === AppState.GENERATING_REPORT) && (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
             </div>
             <h2 className="text-xl font-semibold text-slate-700">
               {appState === AppState.ANALYZING_GEOMETRY ? 'Parsing Model Geometry...' : 'Consulting AI Specialist...'}
             </h2>
             <p className="text-slate-500 text-sm max-w-md text-center">
               Extracting metadata, checking families, and validating against ISO 19650 standards.
             </p>
          </div>
        )}

        {/* State: RESULTS */}
        {appState === AppState.RESULTS && stats && analysis && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{stats.fileName}</h1>
                <p className="text-slate-500">Analyzed on {new Date().toLocaleDateString()}</p>
              </div>
              <button 
                onClick={resetApp}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Audit Another File
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Stats */}
              <div className="lg:col-span-2 space-y-8">
                <MetricsGrid stats={stats} />
                <AIRecommendations analysis={analysis} />
              </div>

              {/* Right Column: Score & Details */}
              <div className="space-y-6">
                <ScoreGauge score={analysis.score} />
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                     <Info size={16} className="text-indigo-500"/>
                     Model Details
                   </h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Complexity</span>
                        <span className="font-medium">{stats.modelComplexity}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Families w/o Params</span>
                        <span className="font-medium text-amber-600">{stats.familiesWithoutParams}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Unused Levels</span>
                        <span className="font-medium">{stats.unusedLevels}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Format</span>
                        <span className="font-medium">
                          {stats.fileName.endsWith('.rvt') ? 'Revit (RVT)' : 'IFC'}
                        </span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {appState === AppState.ERROR && (
           <div className="text-center mt-20">
             <div className="text-red-500 text-5xl mb-4 font-bold">!</div>
             <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
             <p className="text-slate-500 mb-8">Could not process the file. Please try again.</p>
             <button 
                onClick={resetApp}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
