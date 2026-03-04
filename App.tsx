import React, { useState, useEffect } from 'react';
import { INITIAL_ANALYSIS } from './constants';
import Generator from './components/Generator';
import { Palette, Key, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [analysis] = useState(INITIAL_ANALYSIS);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
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

  if (!hasApiKey && window.aistudio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_top,_#24183D,_#09090f_45%)] text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Palette className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold mb-2 tracking-tight">Welcome to MUDIDI</h1>
          <p className="text-sm text-slate-300/90 leading-relaxed">
            To generate high-quality images with <strong>Gemini 3 Pro Image</strong>, please select a paid API key from your Google Cloud project.
          </p>

          <button
            onClick={handleSelectKey}
            className="mt-6 w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-[0.99] transition-all shadow-xl shadow-violet-900/30"
          >
            <Key className="w-5 h-5" />
            Select API Key
          </button>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-violet-300 transition-colors">
              Billing Documentation <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 bg-[#07070c] bg-[radial-gradient(circle_at_15%_10%,_rgba(147,51,234,0.25),_transparent_35%),radial-gradient(circle_at_90%_20%,_rgba(59,130,246,0.2),_transparent_35%),linear-gradient(to_bottom,#09090f,#050509)]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <Palette className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 to-cyan-300">
                MUDIDI POSTER DESIGNER
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI image workflow · Nano Banana Pro</p>
            </div>
          </div>

          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200">
            Gemini 3 Pro
          </span>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto w-full px-0 sm:px-4 py-0 sm:py-4">
        <Generator analysis={analysis} />
      </main>
    </div>
  );
};

export default App;
