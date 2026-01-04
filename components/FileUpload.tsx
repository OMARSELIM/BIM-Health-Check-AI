import React, { useRef, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const validExtensions = ['.rvt', '.ifc'];
    const isRvtOrIfc = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (isRvtOrIfc) {
      onFileSelect(file);
    } else {
      alert("Please upload a valid Revit (.rvt) or IFC (.ifc) file.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">BIM Model Health Checker</h1>
        <p className="text-center text-slate-500 mb-8">Upload your .rvt or .ifc file for an AI-powered ISO 19650 audit.</p>
        
        <form
          className={`relative h-64 w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-slate-400'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".rvt,.ifc"
            onChange={handleChange}
          />
          
          <div className="bg-indigo-100 p-4 rounded-full mb-4">
            <UploadCloud className="w-10 h-10 text-indigo-600" />
          </div>
          
          <p className="text-lg font-medium text-slate-700">
            Drag & Drop your model here
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Supports .rvt and .ifc files
          </p>
          
          <div className="absolute bottom-4 flex gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FileType size={12}/> Revit 2020-2025</span>
            <span className="flex items-center gap-1"><FileType size={12}/> IFC 2x3, IFC4</span>
          </div>
        </form>
    </div>
  );
};
