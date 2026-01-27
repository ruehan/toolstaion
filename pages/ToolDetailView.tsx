
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Info, Share2, HelpCircle } from 'lucide-react';
import { TOOLS } from '../constants';
import ImageConverter from '../tools/ImageConverter';
import ImageCompressor from '../tools/ImageCompressor';
import WordCounter from '../tools/WordCounter';
import TextConverter from '../tools/TextConverter';
import JsonFormatter from '../tools/JsonFormatter';
import Base64Tool from '../tools/Base64Tool';
import SqlFormatter from '../tools/SqlFormatter';
import QrGenerator from '../tools/QrGenerator';
import PasswordGenerator from '../tools/PasswordGenerator';
import AIAssistant from '../tools/AIAssistant';
import AIImageGenerator from '../tools/AIImageGenerator';
import { useLanguage } from '../LanguageContext';
import AdSlot from '../components/AdSlot';

const ToolDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find(t => t.id === id);
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('recentTools');
      let recent: string[] = saved ? JSON.parse(saved) : [];
      // Move to front and keep unique
      recent = [id, ...recent.filter(item => item !== id)].slice(0, 8);
      localStorage.setItem('recentTools', JSON.stringify(recent));
    }
  }, [id]);

  if (!tool) {
    return (
      <div className="p-8 text-center h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Tool not found.</h2>
        <Link to="/" className="text-indigo-600 mt-4 inline-block underline">Go Home</Link>
      </div>
    );
  }

  const renderTool = () => {
    switch (tool.id) {
      case 'ai-assistant': return <AIAssistant />;
      case 'ai-image-generator': return <AIImageGenerator />;
      case 'image-converter': return <ImageConverter />;
      case 'image-compressor': return <ImageCompressor />;
      case 'word-counter': return <WordCounter />;
      case 'text-converter': return <TextConverter />;
      case 'json-formatter': return <JsonFormatter />;
      case 'base64-tool': return <Base64Tool />;
      case 'sql-formatter': return <SqlFormatter />;
      case 'qr-generator': return <QrGenerator />;
      case 'password-generator': return <PasswordGenerator />;
      default: return <div className="p-20 text-center text-slate-400">Coming soon...</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950 animate-in fade-in duration-300 overflow-y-auto overflow-x-hidden scroll-smooth">
      {/* Sub-header */}
      <div className="shrink-0 p-4 border-b bg-white dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hidden sm:block">
                {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 20 })}
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{tool.name[lang]}</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {t(`nav.${tool.category}`)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Layout */}
      <div className="flex-1 flex flex-col">
        {/* The Functional Tool Area */}
        <div className="flex-1 min-h-[550px] bg-white dark:bg-slate-950 border-b dark:border-slate-800">
          {renderTool()}
        </div>

        {/* Info & Guide Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 pt-16 pb-24 border-t dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-8 space-y-16">
            
            {/* Guide Card */}
            <div className="p-10 md:p-14 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {lang === 'ko' ? `${tool.name[lang]} 사용 가이드` : `Guide for ${tool.name[lang]}`}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed Instructions & FAQ</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {tool.guide[lang].map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      <span className="w-7 h-7 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">{idx + 1}</span>
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t dark:border-slate-800 flex items-start gap-3 text-slate-500 dark:text-slate-400">
                <Info size={18} className="shrink-0 mt-0.5 text-indigo-500" />
                <p className="text-[13px] font-medium leading-relaxed">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Privacy Notice:</span> {t('app.privacy_note')}
                </p>
              </div>
            </div>

            {/* Bottom Ad Slot */}
            <div className="space-y-4 pt-10">
              <AdSlot className="h-48 md:h-64" type="banner" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailView;
