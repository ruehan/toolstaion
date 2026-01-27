
import React, { useState, useRef } from 'react';
import { Upload, Download, Sliders, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const ImageCompressor: React.FC = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string, size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
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
          const url = URL.createObjectURL(blob);
          setResult({ url, size: blob.size });
          setProcessing(false);
        }
      }, file.type, quality);
    };
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[500px]">
      <div className="w-full md:w-1/2 p-8 md:border-r dark:border-slate-800 flex flex-col gap-8 bg-white dark:bg-slate-900">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative flex-1 min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer bg-slate-50 dark:bg-slate-950 group overflow-hidden"
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
          {preview ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img src={preview} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="preview" />
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs rounded-full font-mono border border-white/10">
                {formatSize(file?.size || 0)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="text-slate-400 group-hover:text-indigo-500" size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">{t('img.upload_orig')}</p>
                <p className="text-sm text-slate-400">{t('img.upload_prompt')}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-[2rem] shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sliders size={16} /> {t('img.quality')}
              </label>
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold text-xs">
                {Math.round(quality * 100)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.0" 
              step="0.05" 
              value={quality} 
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <button 
            disabled={!file || processing}
            onClick={compressImage}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            {processing ? t('ai.processing') : t('img.compress')}
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center relative">
        {result ? (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 w-full max-w-sm">
            <div className="relative inline-block mx-auto group">
              <img src={result.url} className="max-h-64 mx-auto rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-800" alt="result" />
              <div className="absolute -top-3 -right-3 p-2 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-800">
                <CheckCircle2 size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">{t('img.original')}</p>
                <p className="font-bold text-slate-500">{formatSize(file?.size || 0)}</p>
              </div>
              <div className="text-center border-l dark:border-slate-800">
                <p className="text-[10px] text-emerald-500 uppercase font-extrabold tracking-widest mb-1">{t('img.compressed')}</p>
                <p className="font-extrabold text-indigo-600 dark:text-indigo-400">{formatSize(result.size)}</p>
              </div>
            </div>

            <div className="py-3 px-6 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-100 dark:border-emerald-900/30">
              {t('img.reduced', { percent: Math.round((1 - result.size / (file?.size || 1)) * 100) })}
            </div>

            <a 
              href={result.url} 
              download={`compressed-${file?.name}`}
              className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl hover:opacity-90 transition-all font-bold shadow-xl active:scale-95"
            >
              <Download size={20} />
              {t('common.download')}
            </a>
          </div>
        ) : (
          <div className="text-center space-y-4 max-w-xs animate-in fade-in duration-700">
            <div className="p-6 bg-slate-200/50 dark:bg-slate-800 rounded-full mx-auto w-fit mb-4">
              <Upload size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
              {t('img.compress_prompt')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor;
