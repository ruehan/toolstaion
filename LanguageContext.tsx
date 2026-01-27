
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
    "app.recent_tools": "최근 사용한 도구",
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
    "common.close": "닫기",
    "common.beta": "베타",
    "common.beta_notice": "현재 무료 API 기반의 베타 서비스입니다. 동시 접속자가 많을 경우 일시적인 응답 지연이나 사용량 제한이 발생할 수 있습니다.",
    "ai.processing": "AI가 분석 중입니다...",
    "ai.generating": "이미지를 생성 중입니다. 잠시만 기다려 주세요...",
    "ai.grammar": "문법/오타 교정",
    "ai.summarize": "텍스트 요약",
    "ai.professional": "비즈니스 말투",
    "ai.translate": "영문 번역",
    "footer.rights": "© 2026 ToolStation. All rights reserved.",
    "footer.contact": "문의: support@toolstation.io",
    "stats.title": "나의 활동 대시보드",
    "stats.desc": "브라우저에 기록된 나의 생산성 통계 (개인정보 보호됨)",
    "stats.tools_used": "도구 사용",
    "stats.chars_processed": "처리된 글자",
    "stats.storage_saved": "절약된 용량",
    "workflow.next_step": "다음 작업 추천",
    "workflow.try_this": "이 도구는 어떠세요?",
    "error.quota_title": "AI 사용량 한도 초과",
    "error.quota_desc": "현재 무료 버전 API를 사용 중으로 일일 허용된 AI 분석량을 모두 소진했습니다.",
    "img.convert": "변환하기",
    "img.format": "포맷 선택",
    "img.compress": "압축하기",
    "img.generate": "이미지 생성",
    "img.prompt_placeholder": "이미지 설명을 입력하세요...",
    "word.analysis": "텍스트 분석",
    "word.with_space": "공백 포함",
    "word.no_space": "공백 제외",
    "word.byte_calc": "용량 (Byte)",
    "word.words": "단어 수",
    "word.editor_placeholder": "텍스트를 입력하거나 붙여넣으세요...",
    "json.beautify_2": "2칸 정렬",
    "json.beautify_4": "4칸 정렬",
    "sql.format": "SQL 정렬",
    "legal.about_title": "ToolStation 정보",
    "legal.privacy_title": "개인정보처리방침",
    "legal.terms_title": "이용약관",
    "legal.beta_title": "공식 베타 서비스 안내",
    "legal.beta_desc": "ToolStation은 현재 활발한 개발 및 안정화 단계에 있습니다. 사용자분들께 고성능 유틸리티를 무료로 제공하기 위해 최신 AI 기술과 브라우저 내 로컬 처리 기술을 결합하고 있습니다. 서비스 사용 중 발생하는 피드백은 우리 팀에게 큰 힘이 됩니다.",
    "legal.privacy_badge": "개인정보 우선 아키텍처",
    "legal.scale_badge": "유료 플랜 준비 중",
    "legal.mission_h": "우리의 미션",
    "legal.mission_p": "ToolStation은 복잡한 설치 없이 브라우저에서 즉시 실행되는 고성능 유틸리티를 제공합니다. 사용자의 생산성을 높이는 동시에 개인정보 보호를 최우선 가치로 둡니다.",
    "legal.security_h": "데이터 보안",
    "legal.security_p": "모든 작업은 사용자의 기기(Client-side) 내에서만 처리됩니다. 어떠한 이미지나 텍스트도 우리의 서버에 기록되거나 전송되지 않습니다."
  },
  en: {
    "app.name": "ToolStation",
    "app.tagline": "All Tools in One Place",
    "app.hero_title": "Station for every utility",
    "app.desc": "Privacy-focused, all-in-one utility station. Every task is processed locally in your browser without server uploads.",
    "app.search_placeholder": "Search tools... (e.g., JSON, Image, QR)",
    "app.popular_tools": "Recommended Tools",
    "app.recent_tools": "Recently Used",
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
    "common.close": "Close",
    "common.beta": "BETA",
    "common.beta_notice": "This is a Beta service powered by a free API tier. Usage limits apply.",
    "ai.processing": "AI is analyzing...",
    "ai.generating": "Generating image. Please wait...",
    "ai.grammar": "Grammar Check",
    "ai.summarize": "Summarize",
    "ai.professional": "Business Tone",
    "ai.translate": "Translate to English",
    "footer.rights": "© 2026 ToolStation. All rights reserved.",
    "footer.contact": "Contact: support@toolstation.io",
    "stats.title": "Activity Dashboard",
    "stats.desc": "Local productivity stats (Privacy secured)",
    "stats.tools_used": "Tools Used",
    "stats.chars_processed": "Chars Processed",
    "stats.storage_saved": "Storage Saved",
    "workflow.next_step": "Next Step",
    "workflow.try_this": "Why not try this?",
    "error.quota_title": "AI Quota Exceeded",
    "error.quota_desc": "The daily free quota for AI analysis has been exhausted.",
    "img.convert": "Convert Now",
    "img.format": "Select Format",
    "img.compress": "Compress Now",
    "img.generate": "Generate Image",
    "img.prompt_placeholder": "Describe your vision...",
    "word.analysis": "Text Analysis",
    "word.with_space": "With Spaces",
    "word.no_space": "No Spaces",
    "word.byte_calc": "Byte Size",
    "word.words": "Word Count",
    "word.editor_placeholder": "Type or paste your text here...",
    "json.beautify_2": "Format (2)",
    "json.beautify_4": "Format (4)",
    "sql.format": "Format SQL",
    "legal.about_title": "About ToolStation",
    "legal.privacy_title": "Privacy Policy",
    "legal.terms_title": "Terms of Service",
    "legal.beta_title": "Official Beta Information",
    "legal.beta_desc": "ToolStation is currently in an active development and stabilization phase. We combine cutting-edge AI with local browser processing to provide high-performance utilities for free. Your feedback is crucial to our growth.",
    "legal.privacy_badge": "Privacy First Architecture",
    "legal.scale_badge": "Preparing Paid Scale-up",
    "legal.mission_h": "Our Mission",
    "legal.mission_p": "ToolStation provides high-performance utilities that run instantly in your browser without complex installation. We aim to enhance productivity while prioritizing user privacy above all else.",
    "legal.security_h": "Data Security",
    "legal.security_p": "All processing happens exclusively on your device (client-side). No images or text are ever logged or transmitted to our servers."
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
