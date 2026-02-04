import React from 'react';
import { PosterAnalysis } from '../types';
import { Palette, Layers, Users, Sparkles } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: PosterAnalysis;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  const getIcon = (category: string) => {
    if (category.includes('Visual')) return <Palette className="w-5 h-5" />;
    if (category.includes('Character')) return <Users className="w-5 h-5" />;
    if (category.includes('Composition')) return <Layers className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-full flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="text-purple-600 dark:text-purple-400 w-5 h-5" />
          风格分析报告 (Style Analysis)
        </h2>
      </div>
      
      <div className="p-6 overflow-y-auto space-y-8 flex-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600">
        {/* Colors */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">色彩分析 (Palette)</h3>
          <div className="flex flex-wrap gap-3">
            {analysis.colorPalette.map((color, idx) => (
              <div key={idx} className="group relative">
                <div 
                  className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color }}
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap bg-white dark:bg-slate-800 px-1 rounded shadow">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-1 gap-6">
          {analysis.attributes.map((attr, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-purple-200 dark:border-purple-800">
              <div className="absolute -left-[9px] top-0 bg-white dark:bg-slate-800 p-1 transition-colors">
                <div className="text-purple-600 dark:text-purple-400">
                  {getIcon(attr.category)}
                </div>
              </div>
              <div className="mb-1">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                  {attr.category}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{attr.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {attr.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {attr.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;