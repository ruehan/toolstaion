
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Palette, Type, Settings } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const QrGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [text, setText] = useState('https://toolstation.io');
  const [qrUrl, setQrUrl] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 2048,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, color, bgColor]);

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Configuration Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-10 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r dark:border-slate-800 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Type size={14} />
            <span>{t('qr.content')}</span>
          </div>
          <textarea
            className="w-full p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 resize-none h-48 text-lg font-medium dark:text-white shadow-inner transition-all leading-relaxed"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your URL or Text here..."
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Settings size={14} />
            <span>Appearance Options</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Palette size={16} className="text-indigo-500" /> {t('qr.foreground')}
              </label>
              <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                <span className="text-sm font-mono font-black uppercase dark:text-slate-200">{color}</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300 rounded-md" /> {t('qr.background')}
              </label>
              <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                <span className="text-sm font-mono font-black uppercase dark:text-slate-200">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50/30 dark:bg-slate-950 flex flex-col items-center justify-center relative">
        {qrUrl ? (
          <div className="text-center space-y-12 animate-in zoom-in-95 duration-700 w-full max-w-lg">
            <div className="relative inline-block mx-auto group">
               <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative p-10 bg-white dark:bg-white rounded-[3.5rem] shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                <img src={qrUrl} className="w-64 h-64 md:w-80 md:h-80" alt="QR Code" />
              </div>
            </div>
            
            <div className="space-y-4">
              <a 
                href={qrUrl} 
                download="toolstation-qr-code.png"
                className="flex items-center justify-center gap-3 px-12 py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black text-lg rounded-2xl hover:opacity-95 transition-all shadow-2xl active:scale-95"
              >
                <Download size={22} />
                {t('common.download')}
              </a>
              <div className="flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span>2048 x 2048 PX</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Lossless PNG</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 opacity-40">
             <div className="animate-pulse w-48 h-48 bg-slate-200 dark:bg-slate-800 rounded-[3rem]" />
             <p className="text-xs font-black uppercase tracking-widest text-slate-500">Generating Preview...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrGenerator;