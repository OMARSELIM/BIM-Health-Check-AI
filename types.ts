export interface BimStats {
  fileName: string;
  fileSizeMb: number;
  elementCount: number;
  warningCount: number;
  inPlaceFamilies: number;
  familiesWithoutParams: number;
  unusedViews: number;
  unusedLevels: number;
  missingLinks: number;
  modelComplexity: 'Low' | 'Medium' | 'High';
}

export interface AiAnalysisResult {
  score: number;
  summary: string;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    category: 'ISO 19650' | 'Performance' | 'Standardization';
  }>;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING_GEOMETRY = 'ANALYZING_GEOMETRY',
  GENERATING_REPORT = 'GENERATING_REPORT',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
