
import React from 'react';
import { 
  Type, 
  Hash, 
  Braces, 
  Database, 
  QrCode, 
  Lock,
  FileOutput,
  Scale,
  Sparkles,
  ArrowRightLeft,
  ImageIcon,
  Ruler
} from 'lucide-react';

export interface Tool {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  guide: Record<string, { title: string, content: string }[]>;
  category: string;
  icon: React.ReactNode;
  disabled?: boolean;
  nextTools?: string[];
  themeColor?: string; // Add specific color for premium card styling
}

export const TOOLS: Tool[] = [
  {
    id: 'ai-assistant',
    name: { ko: 'AI 텍스트 어시스턴트', en: 'AI Writing Assistant' },
    description: { 
      ko: '구글 제미나이 AI를 활용하여 문장을 정교하게 교정하고 요약합니다.', 
      en: 'Utilize Google Gemini AI to refine and summarize sentences.' 
    },
    guide: {
      ko: [
        { title: "사용 방법", content: "텍스트를 입력하고 분석 버튼을 누르면 AI가 문맥을 파악하여 최적의 결과를 도출합니다." },
        { title: "장점", content: "단순 오타 교정을 넘어 문맥에 맞는 전문적인 비즈니스 말투로 변환이 가능합니다." }
      ],
      en: [
        { title: "How to Use", content: "Input your text and click an analysis button. AI processes context for the best result." },
        { title: "Benefits", content: "Goes beyond simple typo correction to provide context-aware professional rewriting." }
      ]
    },
    category: 'text',
    icon: <Sparkles size={24} />,
    themeColor: 'purple',
    nextTools: ['word-counter', 'qr-generator', 'text-converter']
  },
  {
    id: 'ai-image-generator',
    name: { ko: 'AI 이미지 생성기', en: 'AI Image Generator' },
    description: { 
      ko: '텍스트 설명을 바탕으로 고화질 이미지를 생성합니다. (현재 점검 중)', 
      en: 'Generate high-quality images from text descriptions. (Under Maintenance)' 
    },
    guide: {
      ko: [
        { title: "알림", content: "현재 서비스 안정화를 위해 임시 점검 중입니다. 곧 더 나은 기능으로 찾아뵙겠습니다." }
      ],
      en: [
        { title: "Notice", content: "Currently under maintenance for service stabilization. We will be back soon." }
      ]
    },
    category: 'image',
    icon: <ImageIcon size={24} />,
    themeColor: 'indigo',
    nextTools: ['image-converter', 'image-compressor']
  },
  {
    id: 'image-converter',
    name: { ko: '이미지 포맷 변환', en: 'Image Format Converter' },
    description: { 
      ko: 'JPG, PNG, WebP 등 다양한 이미지 포맷을 브라우저에서 즉시 변환합니다.', 
      en: 'Convert between various image formats like JPG, PNG, and WebP instantly.' 
    },
    guide: {
      ko: [
        { title: "포맷 안내", content: "WebP는 고화질을 유지하며 용량을 줄여주는 최신 웹 표준 포맷입니다." },
        { title: "보안", content: "이미지는 서버로 전송되지 않고 브라우저 내에서 직접 변환되므로 매우 안전합니다." }
      ],
      en: [
        { title: "Format Info", content: "WebP is a modern web standard that keeps high quality while reducing file size." },
        { title: "Privacy", content: "Images are processed directly in your browser, ensuring no server uploads." }
      ]
    },
    category: 'image',
    icon: <FileOutput size={24} />,
    themeColor: 'blue',
    nextTools: ['image-compressor', 'qr-generator']
  },
  {
    id: 'image-compressor',
    name: { ko: '이미지 용량 압축', en: 'Image Compressor' },
    description: { 
      ko: '화질 손실을 최소화하면서 이미지 파일 크기를 획기적으로 줄입니다.', 
      en: 'Significantly reduce image file size with minimal loss in quality.' 
    },
    guide: {
      ko: [
        { title: "압축 원리", content: "불필요한 메타데이터를 제거하고 픽셀 데이터를 효율적으로 재구성하여 용량을 줄입니다." },
        { title: "설정 팁", content: "80% 품질 설정이 용량 대비 화질 가성비가 가장 좋습니다." }
      ],
      en: [
        { title: "How it works", content: "Reduces size by removing meta-data and efficiently re-encoding pixel data." },
        { title: "Quality Tip", content: "80% quality is usually the sweet spot between file size and clarity." }
      ]
    },
    category: 'image',
    icon: <Scale size={24} />,
    themeColor: 'cyan',
    nextTools: ['image-converter', 'qr-generator']
  },
  {
    id: 'word-counter',
    name: { ko: '글자 수 세기', en: 'Character Counter' },
    description: { 
      ko: '공백 포함/제외 글자 수와 바이트(Byte) 단위를 실시간으로 계산합니다.', 
      en: 'Real-time calculation of characters (with/without spaces) and byte sizes.' 
    },
    guide: {
      ko: [
        { title: "바이트 계산", content: "한글은 UTF-8 기준 3Byte, 영문과 공백은 1Byte로 계산됩니다." },
        { title: "자소서 팁", content: "주요 취업 사이트들의 글자 수 기준을 모두 충족하는 정확한 데이터를 제공합니다." }
      ],
      en: [
        { title: "Byte Calculation", content: "Characters take different sizes; standard Latin takes 1 byte, while others vary." },
        { title: "Utility", content: "Essential for meeting character limits for essays or social media posts." }
      ]
    },
    category: 'text',
    icon: <Hash size={24} />,
    themeColor: 'emerald',
    nextTools: ['ai-assistant', 'text-converter', 'qr-generator']
  },
  {
    id: 'text-converter',
    name: { ko: '텍스트 대소문자 변환', en: 'Case Converter' },
    description: { 
      ko: '대문자, 소문자, 카멜 케이스, 스네이크 케이스 등 텍스트 형식을 변환합니다.', 
      en: 'Convert text to UPPERCASE, lowercase, camelCase, snake_case, and more.' 
    },
    guide: {
      ko: [
        { title: "변환 종류", content: "개발자를 위한 카멜 케이스나 스네이크 케이스 변환 기능을 포함합니다." },
        { title: "사용성", content: "수많은 텍스트를 일일이 수정할 필요 없이 한 번의 클릭으로 변환 가능합니다." }
      ],
      en: [
        { title: "Types", content: "Includes standard cases and developer-focused cases like camelCase or snake_case." },
        { title: "Efficiency", content: "Instantly update large blocks of text without manual retyping." }
      ]
    },
    category: 'text',
    icon: <Type size={24} />,
    themeColor: 'pink',
    nextTools: ['ai-assistant', 'word-counter']
  },
  {
    id: 'json-formatter',
    name: { ko: 'JSON 포맷터', en: 'JSON Formatter' },
    description: { 
      ko: '한 줄로 된 JSON 데이터를 보기 좋게 정렬하고 문법 오류를 체크합니다.', 
      en: 'Beautify minified JSON data and validate syntax errors instantly.' 
    },
    guide: {
      ko: [
        { title: "문법 검증", content: "잘못된 콤마나 따옴표 등 JSON 문법에 어긋나는 부분을 실시간으로 표시합니다." },
        { title: "포맷팅", content: "2칸 또는 4칸 들여쓰기를 선택하여 가독성을 높일 수 있습니다." }
      ],
      en: [
        { title: "Validation", content: "Highlights syntax errors like missing commas or quotes in real-time." },
        { title: "Prettify", content: "Improve readability by choosing 2-space or 4-space indentation." }
      ]
    },
    category: 'dev',
    icon: <Braces size={24} />,
    themeColor: 'orange',
    nextTools: ['base64-tool', 'word-counter']
  },
  {
    id: 'sql-formatter',
    name: { ko: 'SQL 포맷터', en: 'SQL Formatter' },
    description: { 
      ko: '복잡한 SQL 쿼리문을 예약어 기준으로 보기 좋게 정렬합니다.', 
      en: 'Format complex SQL queries based on standard keywords for readability.' 
    },
    guide: {
      ko: [
        { title: "가독성", content: "SELECT, FROM, WHERE 등 주요 예약어를 줄바꿈 처리하여 쿼리 구조를 명확히 보여줍니다." },
        { title: "호환성", content: "표준 SQL 및 다양한 DB 벤더의 쿼리 형식을 폭넓게 지원합니다." }
      ],
      en: [
        { title: "Readability", content: "Indent and line-break standard SQL keywords for a clear query structure." },
        { title: "Compatibility", content: "Supports standard SQL and various database vendor dialects." }
      ]
    },
    category: 'dev',
    icon: <Database size={24} />,
    themeColor: 'teal',
    nextTools: ['base64-tool', 'json-formatter']
  },
  {
    id: 'base64-tool',
    name: { ko: 'Base64 인코더/디코더', en: 'Base64 Tool' },
    description: { 
      ko: '텍스트 데이터를 Base64 형식으로 상호 변환합니다.', 
      en: 'Inter-convert text data and Base64 encoded strings.' 
    },
    guide: {
      ko: [
        { title: "인코딩", content: "바이너리 데이터를 텍스트로 안전하게 전송하기 위한 표준 인코딩 방식입니다." },
        { title: "실시간", content: "입력 즉시 인코딩/디코딩 결과가 하단에 출력됩니다." }
      ],
      en: [
        { title: "Encoding", content: "A standard way to safely transmit binary data in a text-based format." },
        { title: "Live Update", content: "Results are displayed instantly as you type in either direction." }
      ]
    },
    category: 'dev',
    icon: <ArrowRightLeft size={24} />,
    themeColor: 'rose',
    nextTools: ['json-formatter', 'sql-formatter']
  },
  {
    id: 'qr-generator',
    name: { ko: 'QR 코드 생성기', en: 'QR Code Generator' },
    description: { 
      ko: 'URL이나 텍스트를 고화질 QR 코드로 만들고 색상을 커스텀합니다.', 
      en: 'Generate high-quality QR codes for URLs and customize their colors.' 
    },
    guide: {
      ko: [
        { title: "커스터마이징", content: "배경색과 전경색을 자유롭게 선택하여 브랜드에 어울리는 QR을 만드세요." },
        { title: "다운로드", content: "인쇄 가능한 고해상도 PNG 파일로 즉시 내려받을 수 있습니다." }
      ],
      en: [
        { title: "Customization", content: "Choose foreground and background colors to match your brand." },
        { title: "High-Res", content: "Download as a professional-grade high-resolution PNG file." }
      ]
    },
    category: 'utility',
    icon: <QrCode size={24} />,
    themeColor: 'violet',
    nextTools: ['password-generator']
  },
  {
    id: 'password-generator',
    name: { ko: '강력한 비밀번호 생성', en: 'Password Generator' },
    description: { 
      ko: '보안 등급이 높은 무작위 비밀번호를 생성하고 강도를 확인합니다.', 
      en: 'Generate secure random passwords and check their strength level.' 
    },
    guide: {
      ko: [
        { title: "보안성", content: "브라우저 내에서 무작위로 생성되므로 서버를 거치는 것보다 훨씬 안전합니다." },
        { title: "설정", content: "길이 조절 및 특수문자, 숫자 포함 여부를 자유롭게 설정할 수 있습니다." }
      ],
      en: [
        { title: "Security", content: "Generated entirely in your browser, making it safer than server-based tools." },
        { title: "Config", content: "Adjust length and toggle symbols or numbers to meet your security needs." }
      ]
    },
    category: 'utility',
    icon: <Lock size={24} />,
    themeColor: 'amber',
    nextTools: ['qr-generator']
  }
];
