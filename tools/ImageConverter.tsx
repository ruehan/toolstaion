
import React, { useState, useRef } from 'react';
import { Upload, Download, FileType, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const ImageConverter: React.FC = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const convertImage = async () => {
    if (!file) return;
    setConverting(true);
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL(targetFormat);
      setResult(dataUrl);
      setConverting(false);
    };
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Upload/Setting Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r dark:border-slate-800 flex flex-col gap-10 bg-white dark:bg-slate-900">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Asset</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer bg-slate-50 dark:bg-slate-950 group overflow-hidden"
          >
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
            {preview ? (
              <img src={preview} className="max-w-full max-h-[400px] object-contain p-6" alt="preview" />
            ) : (
              <div className="flex flex-col items-center gap-5 text-center px-10">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm group-hover:scale-110 transition-transform border dark:border-slate-800">
                  <Upload className="text-slate-300 group-hover:text-indigo-500" size={40} />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-lg text-slate-900 dark:text-slate-200">{t('img.upload_prompt')}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-black">{t('img.formats_supported')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('img.format')}</label>
            <select 
              value={targetFormat} 
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold text-base dark:text-white"
            >
              <option value="image/png">PNG Asset (.png)</option>
              <option value="image/jpeg">JPEG Photo (.jpg)</option>
              <option value="image/webp">WebP Format (.webp)</option>
            </select>
          </div>
          <button 
            disabled={!file || converting}
            onClick={convertImage}
            className="w-full h-[66px] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/10 active:scale-95"
          >
            {converting ? t('ai.processing') : t('img.convert')}
          </button>
        </div>
      </div>

      {/* Result Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50/30 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[400px] relative overflow-y-auto">
        {result ? (
          <div className="text-center space-y-12 animate-in zoom-in-95 duration-500 w-full max-w-lg">
            <div className="relative inline-block mx-auto group">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-2xl group-hover:bg-indigo-500/20 transition-all" />
              <img src={result} className="relative max-h-[450px] mx-auto rounded-[2.5rem] shadow-2xl border-8 border-white dark:border-slate-900" alt="result" />
              <div className="absolute -top-4 -right-4 p-3 bg-emerald-500 text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900">
                <CheckCircle2 size={32} />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-500/20">
                Conversion Successful
              </div>
              <a 
                href={result} 
                download={`toolstation-converted.${targetFormat.split('/')[1]}`}
                className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl hover:opacity-95 transition-all font-black text-lg shadow-2xl active:scale-95"
              >
                <Download size={22} />
                {t('common.download')}
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-sm animate-in fade-in duration-1000">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-full mx-auto w-fit shadow-sm border dark:border-slate-800">
              <FileType size={64} className="text-slate-200 dark:text-slate-700" />
            </div>
            <div className="space-y-2">
               <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">
                Awaiting Input
              </p>
              <p className="text-slate-300 dark:text-slate-700 font-medium">
                {t('img.convert_prompt')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;