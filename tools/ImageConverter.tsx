
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Download, FileType, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const ImageConverter: React.FC = () => {
  const { lang, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateStats = () => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

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
      updateStats();
    };
  };

  const nextTools = TOOLS.find(t => t.id === 'image-converter')?.nextTools || [];

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Upload/Setting Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r dark:border-slate-800 flex flex-col gap-10 bg-white dark:bg-slate-900 overflow-y-auto">
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
              <option value="image/png">PNG (.png)</option>
              <option value="image/jpeg">JPEG (.jpg)</option>
              <option value="image/webp">WebP (.webp)</option>
            </select>
          </div>
          <button 
            disabled={!file || converting}
            onClick={convertImage}
            className="w-full h-[66px] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl transition-all disabled:opacity-50 shadow-xl active:scale-95"
          >
            {converting ? t('ai.processing') : t('img.convert')}
          </button>
        </div>
      </div>

      {/* Result Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50/30 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[400px] relative overflow-y-auto">
        {result ? (
          <div className="text-center space-y-12 animate-in zoom-in-95 duration-500 w-full max-w-lg py-10">
            <div className="relative inline-block mx-auto group">
              <img src={result} className="relative max-h-[450px] mx-auto rounded-[2.5rem] shadow-2xl border-8 border-white dark:border-slate-900" alt="result" />
              <div className="absolute -top-4 -right-4 p-3 bg-emerald-500 text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900">
                <CheckCircle2 size={32} />
              </div>
            </div>
            
            <div className="space-y-6">
              <a 
                href={result} 
                download={`converted.${targetFormat.split('/')[1]}`}
                className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl hover:opacity-95 transition-all font-black text-lg shadow-2xl active:scale-95"
              >
                <Download size={22} />
                {t('common.download')}
              </a>

              {/* Smart Workflow */}
              <div className="pt-8 border-t dark:border-slate-800 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={12} className="text-indigo-500" />
                  {t('workflow.next_step')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {nextTools.map(toolId => {
                    const tool = TOOLS.find(t => t.id === toolId);
                    if (!tool) return null;
                    return (
                      <Link 
                        key={tool.id} 
                        to={`/tool/${tool.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 transition-all shadow-sm group"
                      >
                        {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 14 })}
                        <span className="text-slate-700 dark:text-slate-300">{tool.name[lang]}</span>
                        <ArrowRight size={12} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-sm">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-full mx-auto w-fit shadow-sm border dark:border-slate-800">
              <FileType size={64} className="text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-slate-300 dark:text-slate-700 font-medium">{t('img.convert_prompt')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;
