import React, { useState, useEffect, useRef } from 'react';
import { PosterAnalysis, GenerationStatus, GeneratedImage } from '../types';
import {
  Wand2,
  Image as ImageIcon,
  Copy,
  Loader2,
  Download,
  AlertCircle,
  Maximize2,
  Upload,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { generatePosterImage } from '../services/geminiService';

interface GeneratorProps {
  analysis: PosterAnalysis;
}

const Generator: React.FC<GeneratorProps> = ({ analysis }) => {
  const [sheepAction, setSheepAction] = useState('eating dim sum at a round green table');
  const [sheepCount, setSheepCount] = useState('a group of 4');
  const [scene, setScene] = useState('a warm restaurant with lotus decorations');
  const [season, setSeason] = useState('Summer');
  const [holiday, setHoliday] = useState('None');
  const [aspectRatio, setAspectRatio] = useState('3:4');

  const [refImage, setRefImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [finalPrompt, setFinalPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedImg, setGeneratedImg] = useState<GeneratedImage | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

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
        timestamp: Date.now(),
      });
      setStatus(GenerationStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setStatus(GenerationStatus.ERROR);
      let msg = e.message || 'Failed to generate image.';
      if (msg.includes('403') || msg.includes('permission') || msg.includes('Permission')) {
        msg = 'Permission Denied: Ensure a paid API Key is selected.';
      }
      setErrorMsg(msg);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(finalPrompt);
  };

  const cardClass =
    'rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]';
  const formInputClass =
    'w-full px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400 outline-none transition-all text-sm text-slate-100 placeholder-slate-500';
  const labelClass = 'block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide';

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-3 sm:gap-4 pb-24 lg:pb-4">
      <section className={`order-2 lg:order-1 w-full lg:w-[390px] xl:w-[430px] ${cardClass} overflow-hidden`}>
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-violet-300" />
            <h2 className="font-semibold text-sm sm:text-base">配置面板 Configuration</h2>
          </div>
          <button onClick={copyPrompt} className="text-slate-400 hover:text-white transition-colors" title="Copy Prompt" aria-label="Copy Prompt">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[58vh] lg:max-h-[calc(100vh-220px)] overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={labelClass}>参考角色 (Reference)</label>
              {refImage && (
                <button onClick={clearRefImage} className="text-xs text-rose-300 hover:text-rose-200 inline-flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> 清除
                </button>
              )}
            </div>
            <div
              onClick={() => !refImage && fileInputRef.current?.click()}
              className={`w-full rounded-xl border border-dashed transition-all cursor-pointer group overflow-hidden ${
                refImage
                  ? 'border-violet-400/50 h-36 bg-black/70'
                  : 'border-white/20 hover:border-violet-400 hover:bg-slate-800/40 h-28 flex flex-col items-center justify-center'
              }`}
            >
              {refImage ? (
                <img src={refImage} alt="Ref" className="w-full h-full object-contain" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-violet-300 mb-1" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200">点击上传角色参考图</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <label className={labelClass}>羊只数量 (Count)</label>
            <input className={formInputClass} value={sheepCount} onChange={(e) => setSheepCount(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>羊的行为 (Action)</label>
            <input className={formInputClass} value={sheepAction} onChange={(e) => setSheepAction(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>场景环境 (Scene)</label>
            <input className={formInputClass} value={scene} onChange={(e) => setScene(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>季节 (Season)</label>
              <select className={formInputClass} value={season} onChange={(e) => setSeason(e.target.value)}>
                {['Spring', 'Summer', 'Autumn', 'Winter'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>节日 (Holiday)</label>
              <select className={formInputClass} value={holiday} onChange={(e) => setHoliday(e.target.value)}>
                {['None', 'Chinese New Year', 'Mid-Autumn Festival', 'Dragon Boat Festival', 'Christmas'].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>比例 (Ratio)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {['1:1', '3:4', '4:3', '9:16', '16:9'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 border-violet-400 text-white shadow-lg shadow-violet-900/30'
                      : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {status === GenerationStatus.ERROR && (
            <div className="text-sm text-rose-200 bg-rose-500/10 border border-rose-400/30 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </section>

      <section className={`order-1 lg:order-2 flex-1 ${cardClass} overflow-hidden flex flex-col`}>
        <div className="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <h2 className="font-semibold text-sm sm:text-base">生成预览 Preview</h2>
          </div>
          {generatedImg && (
            <div className="flex items-center gap-2">
              <a
                href={generatedImg.url}
                download={`sheep-poster-${generatedImg.timestamp}.png`}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs border border-white/20 bg-black/40 hover:bg-violet-600/70 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> 下载
              </a>
              <button
                onClick={() => window.open(generatedImg.url, '_blank')}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs border border-white/20 bg-black/40 hover:bg-violet-600/70 transition-colors"
                aria-label="Open fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" /> 全屏
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.12),_transparent_60%)]">
          {generatedImg ? (
            <img src={generatedImg.url} alt="Result" className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]" />
          ) : (
            <div className="text-center text-slate-400">
              <div className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 opacity-70" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">等待生成 (Ready to create)</p>
              <p className="text-xs mt-1 text-slate-500">MUDIDI DESIGNER × GEMINI 3 PRO</p>
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/80 to-transparent lg:hidden">
        <button
          onClick={handleGenerate}
          disabled={status === GenerationStatus.LOADING}
          className={`w-full h-12 rounded-xl font-semibold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
            status === GenerationStatus.LOADING
              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-[0.99]'
          }`}
        >
          {status === GenerationStatus.LOADING ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> 生成中...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" /> 立即生成
            </>
          )}
        </button>
      </div>

      <div className="hidden lg:block fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[320px]">
        <button
          onClick={handleGenerate}
          disabled={status === GenerationStatus.LOADING}
          className={`w-full h-12 rounded-xl font-semibold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
            status === GenerationStatus.LOADING
              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-[0.99]'
          }`}
        >
          {status === GenerationStatus.LOADING ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> 生成中 (Thinking)...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" /> 立即生成 (Generate)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Generator;
