
import React, { useEffect } from 'react';

interface AdSlotProps {
  className?: string;
  slotId?: string;
  type?: 'banner' | 'square' | 'vertical';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSlot: React.FC<AdSlotProps> = ({ className = '', slotId, type = 'banner' }) => {
  useEffect(() => {
    try {
      // Ensure the adsbygoogle array is available and push a new ad request
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense initialization error:', e);
    }
  }, [slotId]);

  const getFormat = () => {
    switch (type) {
      case 'square': return 'rectangle';
      case 'vertical': return 'vertical';
      default: return 'horizontal';
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[100px] group transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}>
      {/* Real AdSense Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%', minWidth: '250px' }}
        data-ad-client="ca-pub-5755103615230819"
        data-ad-slot={slotId || ""} 
        data-ad-format={getFormat()}
        data-full-width-responsive="true"
      ></ins>

      {/* Visual Placeholder (shown behind the ad or if the ad fails to load/is blocked) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -z-10">
        <div className="flex flex-col items-center gap-2 opacity-25 group-hover:opacity-40 transition-opacity">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Advertisement</span>
          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSlot;
