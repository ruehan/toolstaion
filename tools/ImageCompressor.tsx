
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Download, Sliders, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const ImageCompressor: React.FC = () => {
  const { lang, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string, size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateStats = (savedBytes: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.storageSaved += savedBytes;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const compressImage = async () => {
    if (!file) return;
    setProcessing(true);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResult({ url: URL.createObjectURL(blob), size: blob.size });
          updateStats(file.size - blob.size);
          setProcessing(false);
        }
      }, file.type, quality);
    };
  };

  const formatSize = (bytes: number) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB'][i];
  };

  const nextTools = TOOLS.find(t => t.id === 'image-compressor')?.nextTools || [];

  return (
    <div className="flex flex-col md:flex-row min-h-[500px]">
      <div className="w-full md:w-1/2 p-8 border-r dark:border-slate-800 flex flex-col gap-8 bg-white dark:bg-slate-900">
        <div onClick={() => fileInputRef.current?.click()} className="relative flex-1 min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); }
          }} />
          {preview ? <img src={preview} className="max-w-full max-h-full object-contain p-4" /> : <div className="text-center p-6"><Upload className="mx-auto mb-4 text-slate-300" size={40} /><p className="font-bold">{t('img.upload_orig')}</p></div>}
        </div>
        <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-[2rem]">
          <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-500"><span>{t('img.quality')}</span><span>{Math.round(quality*100)}%</span></div>
          <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          <button disabled={!file || processing} onClick={compressImage} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg active:scale-95">{processing ? t('ai.processing') : t('img.compress')}</button>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center">
        {result ? (
          <div className="text-center space-y-8 w-full max-w-sm">
            <div className="relative group mx-auto">
              <img src={result.url} className="max-h-64 rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800" />
              <div className="absolute -top-3 -right-3 p-2 bg-emerald-500 text-white rounded-full"><CheckCircle2 size={24} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800">
              <div><p className="text-[10px] uppercase font-black text-slate-400">{t('img.original')}</p><p className="font-bold">{formatSize(file?.size || 0)}</p></div>
              <div className="border-l dark:border-slate-800"><p className="text-[10px] uppercase font-black text-emerald-500">{t('img.compressed')}</p><p className="font-black text-indigo-600">{formatSize(result.size)}</p></div>
            </div>
            <a href={result.url} download="compressed.png" className="flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black shadow-xl active:scale-95"><Download size={20} />{t('common.download')}</a>
            
            <div className="pt-8 border-t dark:border-slate-800 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={12} className="text-indigo-500" />{t('workflow.next_step')}</p>
              <div className="flex flex-wrap gap-2">
                {nextTools.map(id => {
                  const tool = TOOLS.find(t => t.id === id);
                  return tool ? <Link key={id} to={`/tool/${id}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 shadow-sm group">{React.cloneElement(tool.icon as any, {size: 14})} {tool.name[lang]} <ArrowRight size={12} className="group-hover:translate-x-1" /></Link> : null;
                })}
              </div>
            </div>
          </div>
        ) : <p className="text-slate-400 font-bold">{t('img.compress_prompt')}</p>}
      </div>
    </div>
  );
};

export default ImageCompressor;
