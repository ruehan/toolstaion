
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg rotate-12 opacity-20 animate-pulse" />
        <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center overflow-hidden">
          {/* Abstract T & S Symbol */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-3/5 h-3/5 text-white"
          >
            <path 
              d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V8C20 8.55228 19.5523 9 19 9H5C4.44772 9 4 8.55228 4 8V6Z" 
              fill="currentColor" 
            />
            <path 
              d="M10 10H14V18C14 18.5523 13.5523 19 13 19H11C10.4477 19 10 18.5523 10 18V10Z" 
              fill="currentColor"
              fillOpacity="0.7"
            />
            <path 
              d="M6 14H8V16H6V14Z" 
              fill="currentColor"
              fillOpacity="0.4"
            />
            <path 
              d="M16 14H18V16H16V14Z" 
              fill="currentColor"
              fillOpacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name */}
      {showText && (
        <div className={`${currentSize.text} tracking-tighter flex items-center`}>
          <span className="font-black text-slate-900 dark:text-white uppercase">Tool</span>
          <span className="font-light text-indigo-500 dark:text-indigo-400 uppercase">Station</span>
        </div>
      )}
    </div>
  );
};

export default Logo;