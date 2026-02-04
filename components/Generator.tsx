import React, { useState, useEffect, useRef } from 'react';
import { PosterAnalysis, GenerationStatus, GeneratedImage } from '../types';
import { Wand2, Image as ImageIcon, Copy, Loader2, Download, AlertCircle, Maximize2, Ratio, Upload, X, Trash2 } from 'lucide-react';
import { generatePosterImage } from '../services/geminiService';

interface GeneratorProps {
  analysis: PosterAnalysis;
}

const Generator: React.FC<GeneratorProps> = ({ analysis }) => {
  // State variables
  const [sheepAction, setSheepAction] = useState('eating dim sum at a round green table');
  const [sheepCount, setSheepCount] = useState('a group of 4');
  const [scene, setScene] = useState('a warm restaurant with lotus decorations');
  const [season, setSeason] = useState('Summer');
  const [holiday, setHoliday] = useState('None');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  
  // Reference Image State
  const [refImage, setRefImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [finalPrompt, setFinalPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedImg, setGeneratedImg] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Update prompt when inputs change
  useEffect(() => {
    let prompt = analysis.basePrompt;
    prompt = prompt.replace('[COUNT]', sheepCount);
    prompt = prompt.replace('[ACTION]', sheepAction);
    prompt = prompt.replace('[SCENE]', scene);
    prompt = prompt.replace('[SEASON]', season);
    if (holiday && holiday !== 'None') {
        prompt = prompt.replace('[HOLIDAY]', `${holiday} holiday theme, festive decorations, `);
    } else {
        prompt = prompt.replace('[HOLIDAY]', '');
    }
    setFinalPrompt(prompt);
  }, [sheepAction, sheepCount, scene, season, holiday, analysis.basePrompt]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearRefImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    setStatus(GenerationStatus.LOADING);
    setErrorMsg('');
    try {
      const base64Url = await generatePosterImage(finalPrompt, aspectRatio, refImage || undefined);
      setGeneratedImg({
        url: base64Url,
        prompt: finalPrompt,
        timestamp: Date.now()
      });
      setStatus(GenerationStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setStatus(GenerationStatus.ERROR);
      let msg = e.message || "Failed to generate image.";
      if (msg.includes('403') || msg.includes('permission') || msg.includes('Permission')) {
          msg = "Permission Denied: Ensure a paid API Key is selected.";
      }
      setErrorMsg(msg);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(finalPrompt);
  };

  const formInputClass = "w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs sm:text-sm text-slate-200 placeholder-slate-500";
  const labelClass = "block text-[11px] uppercase font-bold text-slate-500 mb-1 tracking-wider";

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-0 md:gap-4 p-0 md:p-4 overflow-hidden bg-slate-950">
        
        {/* LEFT PANEL: Controls (Fixed width on desktop) */}
        <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 flex flex-col h-full bg-slate-900 md:rounded-2xl border-b md:border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
                
                {/* Panel Title */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                    <Wand2 className="text-blue-400 w-4 h-4" />
                    <span className="font-bold text-slate-200 text-sm">配置 (Configuration)</span>
                </div>

                {/* Reference Image - Compact */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className={labelClass}>参考角色 (Reference)</label>
                        {refImage && (
                             <button onClick={clearRefImage} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> 清除
                             </button>
                        )}
                    </div>
                    <div 
                        onClick={() => !refImage && fileInputRef.current?.click()}
                        className={`w-full relative rounded-lg border border-dashed transition-all cursor-pointer group overflow-hidden
                            ${refImage ? 'border-blue-500/50 h-28 bg-black' : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800/50 h-20 flex flex-col items-center justify-center'}`}
                    >
                        {refImage ? (
                            <img src={refImage} alt="Ref" className="w-full h-full object-contain" />
                        ) : (
                            <>
                                <Upload className="w-5 h-5 text-slate-500 group-hover:text-blue-400 mb-1" />
                                <span className="text-[10px] text-slate-500 group-hover:text-blue-400">点击上传参考图 (Click to Upload)</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                </div>

                {/* 3-Column Grid for Selects */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                        <label className={labelClass}>数量 (Cnt)</label>
                        <select value={sheepCount} onChange={(e) => setSheepCount(e.target.value)} className={formInputClass}>
                            <option value="one single">1</option>
                            <option value="two">2</option>
                            <option value="three">3</option>
                            <option value="a group of 4">4</option>
                            <option value="a large crowd of">Many</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className={labelClass}>季节 (Seas)</label>
                        <select value={season} onChange={(e) => setSeason(e.target.value)} className={formInputClass}>
                            <option value="Spring">🌸 春</option>
                            <option value="Summer">☀️ 夏</option>
                            <option value="Autumn">🍂 秋</option>
                            <option value="Winter">❄️ 冬</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className={labelClass}>节日 (Hol)</label>
                        <select value={holiday} onChange={(e) => setHoliday(e.target.value)} className={formInputClass}>
                            <option value="None">无</option>
                            <option value="New Year">🧧 新年</option>
                            <option value="Christmas">🎄 圣诞</option>
                            <option value="Mid-Autumn Festival">🥮 中秋</option>
                            <option value="Valentine's Day">💖 情人</option>
                        </select>
                    </div>
                </div>

                {/* Text Inputs */}
                <div className="space-y-3">
                    <div>
                        <label className={labelClass}>动作 (Action)</label>
                        <input 
                            type="text" 
                            value={sheepAction} 
                            onChange={(e) => setSheepAction(e.target.value)} 
                            className={formInputClass} 
                        />
                    </div>
                    <div>
                        <label className={labelClass}>场景 (Scene)</label>
                        <textarea 
                            rows={2}
                            value={scene} 
                            onChange={(e) => setScene(e.target.value)} 
                            className={`${formInputClass} resize-none`} 
                        />
                    </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                    <label className={labelClass}>比例 (Ratio)</label>
                    <div className="grid grid-cols-5 gap-1">
                        {['1:1', '3:4', '4:3', '9:16', '16:9'].map((ratio) => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`py-1.5 text-[10px] font-medium rounded border transition-colors
                                    ${aspectRatio === ratio 
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'}`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 backdrop-blur z-10">
                <div className="mb-2 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                     <span className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">Prompt Preview</span>
                     <button onClick={copyPrompt} className="text-slate-500 hover:text-white" title="Copy Prompt">
                        <Copy className="w-3 h-3" />
                     </button>
                </div>
                
                <button
                    onClick={handleGenerate}
                    disabled={status === GenerationStatus.LOADING}
                    className={`w-full py-3 rounded-xl font-bold text-white text-sm md:text-base shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2
                        ${status === GenerationStatus.LOADING 
                        ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]'}`}
                >
                    {status === GenerationStatus.LOADING ? (
                        <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        生成中 (Thinking)...
                        </>
                    ) : (
                        <>
                        <ImageIcon className="w-4 h-4" />
                        立即生成 (Generate)
                        </>
                    )}
                </button>
                
                {status === GenerationStatus.ERROR && (
                    <div className="mt-2 text-[10px] text-red-400 flex items-start gap-1 leading-tight">
                        <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT PANEL: Preview Area (Fluid width) */}
        <div className="flex-1 h-full bg-slate-900/50 md:rounded-2xl border-l md:border border-slate-800 relative flex flex-col overflow-hidden">
             
             {/* Main Image Container */}
             <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                {generatedImg ? (
                    <div className="relative max-w-full max-h-full flex items-center justify-center shadow-2xl group">
                         <img 
                            src={generatedImg.url} 
                            alt="Result" 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-black/50"
                        />
                        
                        {/* Hover Overlay Controls */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                             <a 
                                href={generatedImg.url} 
                                download={`sheep-poster-${generatedImg.timestamp}.png`}
                                className="w-10 h-10 bg-black/60 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                                title="Download"
                             >
                                <Download className="w-5 h-5" />
                             </a>
                             <button 
                                onClick={() => window.open(generatedImg.url, '_blank')}
                                className="w-10 h-10 bg-black/60 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                                title="Fullscreen"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-600 select-none">
                        <div className="w-20 h-20 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <ImageIcon className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">等待生成 (Ready to create)</p>
                        <p className="text-xs mt-2 opacity-40">MUDIDI ARCHITECT x GEMINI 3 PRO</p>
                    </div>
                )}
             </div>
        </div>
    </div>
  );
};

export default Generator;