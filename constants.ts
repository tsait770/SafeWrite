
import { WritingType } from './types';

export const COLORS = {
  PRIMARY: '#1E293B',
  SECONDARY: '#FDFBF7',
  ACCENT: '#7b61ff',
  TEXT: '#111827',
  BG_NIGHT: '#0F172A',
};

export const PROJECT_COLORS = [
  '#FADE4B', '#FF6B2C', '#D4FF5F', '#B2A4FF', 
  '#7b61ff', '#FF8A5B', '#4CAF50', '#2196F3', 
  '#F44336', '#E91E63', '#9C27B0', '#00897B',
];

export const PROJECT_ICONS = [
  'fa-feather-pointed', 'fa-pen-nib', 'fa-book-open', 'fa-note-sticky',
  'fa-paper-plane', 'fa-diagram-project', 'fa-flask', 'fa-graduation-cap',
  'fa-clapperboard', 'fa-layer-group'
];

export interface TemplateConfig {
  label: string;
  enLabel: string;
  icon: string;
  description: string;
  skeleton: string[]; // 範本主結構清單
}

export const TEMPLATES: Record<WritingType, TemplateConfig> = {
  [WritingType.NOVEL]: {
    label: '長篇敘事',
    enLabel: 'Novel / Fiction',
    icon: 'fa-feather-pointed',
    description: '市場最受歡迎架構，整合章節、世界觀與深度筆記。',
    skeleton: ['Chapter 1', '世界觀設定', '人物誌', '大綱']
  },
  [WritingType.LONG_FORM]: {
    label: '長篇創作',
    enLabel: 'Long-form Writing',
    icon: 'fa-book-open',
    description: '適合進行大篇幅、多章節的專業創作。',
    skeleton: ['Chapter 1', '前言', '背景研究']
  },
  [WritingType.BLOG]: {
    label: '部落格創作',
    enLabel: 'Blog / Medium',
    icon: 'fa-pen-nib',
    description: '專為虛構寫作環境，支援三幕結構與角色弧線。',
    skeleton: ['主要內容', 'SEO 關鍵字', '發佈說明']
  },
  [WritingType.DIARY]: {
    label: '隨手筆記',
    enLabel: 'Diary / Notes',
    icon: 'fa-note-sticky',
    description: '部落格與專欄創作者首選，強調論證邏輯與證據鏈。',
    skeleton: ['今日紀事']
  },
  [WritingType.CUSTOM]: {
    label: '自定義範本',
    enLabel: 'Custom Template',
    icon: 'fa-plus',
    description: '由您定義結構，靈活適配任何創作場景。',
    skeleton: ['主草稿']
  },
  // 卷軸範本庫
  [WritingType.BUSINESS_PLAN]: {
    label: '商業計畫書',
    enLabel: 'Business Plan',
    icon: 'fa-briefcase',
    description: '創業首選：市場分析、產品定義與財務預測。',
    skeleton: ['摘要', '市場分析', '產品 / 服務', '商業模式', '財務預測']
  },
  [WritingType.SCREENPLAY]: {
    label: '影視腳本',
    enLabel: 'Screenplay',
    icon: 'fa-clapperboard',
    description: '符合工業標準的場景、對白與行動描述管理。',
    skeleton: ['標題頁', '分場', '對白', '行動描述']
  },
  [WritingType.ACADEMIC]: {
    label: '學術論文',
    enLabel: 'Academic Paper',
    icon: 'fa-graduation-cap',
    description: '嚴謹的論文結構模板，鎖定必要學術區塊。',
    skeleton: ['Abstract', 'Introduction', 'Literature Review', 'Methodology', 'Results', 'Discussion', 'Conclusion']
  },
  [WritingType.PRD]: {
    label: '產品需求文件',
    enLabel: 'PRD / Spec',
    icon: 'fa-gears',
    description: '定義問題與需求列表，追蹤產品成功指標。',
    skeleton: ['背景', '問題定義', '需求列表', '使用流程', '成功指標']
  },
  [WritingType.COPYWRITING]: {
    label: '行銷文案',
    enLabel: 'Copywriting',
    icon: 'fa-bullhorn',
    description: '針對定時發佈內容優化，Hook 到 CTA 一氣呵成。',
    skeleton: ['Hook', 'Pain', 'Solution', 'Proof', 'CTA']
  },
  [WritingType.COURSE]: {
    label: '教學課程',
    enLabel: 'Course / Tutorial',
    icon: 'fa-chalkboard-user',
    description: '管理課程目標與單元教學內容。',
    skeleton: ['課程目標', '單元列表', '教學內容', '練習 / 作業']
  },
  [WritingType.BOOK_OUTLINE]: {
    label: '書籍大綱',
    enLabel: 'Book Outline',
    icon: 'fa-sitemap',
    description: '書籍定位、目標讀者與跨章節出版規劃。',
    skeleton: ['書籍定位', '目標讀者', '章節規劃', '出版目標']
  }
};

export const PLACEHOLDER_TEXT = "寫作即是思考的延伸，請在此開始記錄...";
