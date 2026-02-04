import React, { useState, useEffect } from 'react';
import { INITIAL_ANALYSIS } from './constants';
import Generator from './components/Generator';
import { Palette, Key, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [analysis] = useState(INITIAL_ANALYSIS);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // Fallback for environments where window.aistudio is not available
        setHasApiKey(true); 
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  // Landing Page (No API Key)
  if (!hasApiKey && window.aistudio) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 overflow-hidden">
         <div className="max-w-md w-full p-8 rounded-2xl shadow-xl text-center space-y-6 bg-slate-900 border border-slate-800">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Palette className="text-white w-8 h-8" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome to MUDIDI</h1>
              <p className="text-sm text-slate-400">
                To generate high-quality images with <strong>Gemini 3 Pro Image</strong>, a paid API key from a Google Cloud Project is required.
              </p>
            </div>

            <button 
              onClick={handleSelectKey}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <Key className="w-5 h-5" />
              Select API Key
            </button>

            <div className="text-xs text-slate-500 pt-4 border-t border-slate-800">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 hover:text-blue-500 transition-colors">
                Billing Documentation <ExternalLink className="w-3 h-3" />
              </a>
            </div>
         </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Compact Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 flex-none z-10 shadow-md">
        <div className="w-full h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <Palette className="text-white w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                MUDIDI POSTER ARCHITECT
              </h1>
              <span className="hidden sm:inline-block text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                Nano Banana Pro
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace - Full Height, No Scroll on body */}
      <main className="flex-1 overflow-hidden relative w-full bg-slate-950">
        <Generator analysis={analysis} />
      </main>
    </div>
  );
};

export default App;