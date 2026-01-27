
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ko: {
    "app.name": "ToolStation",
    "app.tagline": "모든 도구를 한 곳에서",
    "app.hero_title": "모든 도구를 한 곳에서",
    "app.desc": "서버 업로드 없이 브라우저에서 안전하게 처리하는 올인원 유틸리티 스테이션입니다. 개인정보 보호를 최우선으로 합니다.",
    "app.search_placeholder": "어떤 도구를 찾으시나요? (예: JSON, 이미지, QR)",
    "app.popular_tools": "추천 도구",
    "app.privacy_note": "이 도구는 모든 작업을 브라우저 로컬에서 수행합니다. 데이터는 절대 서버로 전송되지 않습니다.",
    "app.tools_available": "{count}개의 도구 사용 가능",
    "app.tools_active": "활성 도구",
    "app.safe_info": "100% 브라우저 기반 보안 처리",
    "nav.home": "홈 대시보드",
    "nav.categories": "카테고리",
    "nav.image": "이미지 도구",
    "nav.text": "텍스트/자소서",
    "nav.dev": "개발자 도구",
    "nav.utility": "생활 편의",
    "nav.resources": "관련 자료",
    "nav.about": "ToolStation 정보",
    "nav.privacy": "개인정보처리방침",
    "nav.terms": "이용약관",
    "common.copy": "복사",
    "common.copied": "복사됨",
    "common.clear": "지우기",
    "common.download": "다운로드",
    "common.error": "오류 발생",
    "common.input_empty": "입력된 텍스트가 없습니다.",
    "common.launch": "도구 실행",
    "common.advertisement": "광고",
    "common.last_updated": "마지막 업데이트",
    "ai.processing": "AI가 분석 중입니다...",
    "footer.rights": "© 2026 ToolStation. All rights reserved.",
    "footer.contact": "문의: support@toolstation.io",
    "legal.about_title": "ToolStation 소개",
    "legal.privacy_title": "개인정보처리방침",
    "legal.terms_title": "서비스 이용약관",
    "img.convert": "변환하기",
    "img.format": "포맷 선택",
    "img.compress": "압축하기",
    "word.analysis": "텍스트 분석",
    "word.with_space": "공백 포함",
    "word.no_space": "공백 제외",
    "word.byte_calc": "용량 (Byte)",
    "word.words": "단어 수",
    "word.editor_placeholder": "텍스트를 입력하거나 붙여넣으세요...",
    "json.beautify_2": "2칸 정렬",
    "json.beautify_4": "4칸 정렬",
    "sql.format": "SQL 정렬"
  },
  en: {
    "app.name": "ToolStation",
    "app.tagline": "All Tools in One Place",
    "app.hero_title": "Station for every utility",
    "app.desc": "Privacy-focused, all-in-one utility station. Every task is processed locally in your browser without server uploads.",
    "app.search_placeholder": "Search tools... (e.g., JSON, Image, QR)",
    "app.popular_tools": "Recommended Tools",
    "app.privacy_note": "Privacy-First: All processing happens locally in your browser. Data is never sent to our servers.",
    "app.tools_available": "{count} Tools Available",
    "app.tools_active": "Tools Active",
    "app.safe_info": "100% Client-Side Encryption",
    "nav.home": "Dashboard",
    "nav.categories": "Categories",
    "nav.image": "Image Tools",
    "nav.text": "Text & Writing",
    "nav.dev": "Developer Tools",
    "nav.utility": "Daily Utilities",
    "nav.resources": "Resources",
    "nav.about": "About ToolStation",
    "nav.privacy": "Privacy Policy",
    "nav.terms": "Terms of Service",
    "common.copy": "Copy",
    "common.copied": "Copied",
    "common.clear": "Clear",
    "common.download": "Download",
    "common.error": "Error Occurred",
    "common.input_empty": "No input provided.",
    "common.launch": "Launch Utility",
    "common.advertisement": "Advertisement",
    "common.last_updated": "Last Updated",
    "ai.processing": "AI is analyzing...",
    "footer.rights": "© 2026 ToolStation. All rights reserved.",
    "footer.contact": "Contact: support@toolstation.io",
    "legal.about_title": "About ToolStation",
    "legal.privacy_title": "Privacy Policy",
    "legal.terms_title": "Terms of Service",
    "img.convert": "Convert Now",
    "img.format": "Select Format",
    "img.compress": "Compress Now",
    "word.analysis": "Text Analysis",
    "word.with_space": "With Spaces",
    "word.no_space": "No Spaces",
    "word.byte_calc": "Byte Size",
    "word.words": "Word Count",
    "word.editor_placeholder": "Type or paste your text here...",
    "json.beautify_2": "Format (2)",
    "json.beautify_4": "Format (4)",
    "sql.format": "Format SQL"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ko');

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = translations[lang][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v.toString());
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
