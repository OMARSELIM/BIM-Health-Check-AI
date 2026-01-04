import { BimStats } from '../types';

export const parseBimFile = async (file: File): Promise<BimStats> => {
  // Simulate heavy processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const sizeMb = file.size / (1024 * 1024);
  
  // Generate pseudo-realistic stats based on file size
  // In a real app, this would use Autodesk Platform Services or web-ifc
  const elementCount = Math.floor(sizeMb * 150 + Math.random() * 500);
  const warningCount = Math.floor(Math.random() * 200 + (sizeMb > 50 ? 100 : 10));
  const inPlaceFamilies = Math.floor(Math.random() * 50);
  const familiesWithoutParams = Math.floor(Math.random() * 120);
  const unusedViews = Math.floor(Math.random() * 40);
  const unusedLevels = Math.floor(Math.random() * 5);
  const missingLinks = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;

  return {
    fileName: file.name,
    fileSizeMb: parseFloat(sizeMb.toFixed(2)),
    elementCount,
    warningCount,
    inPlaceFamilies,
    familiesWithoutParams,
    unusedViews,
    unusedLevels,
    missingLinks,
    modelComplexity: sizeMb > 200 ? 'High' : sizeMb > 50 ? 'Medium' : 'Low'
  };
};
