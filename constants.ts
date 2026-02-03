
import { WritingType, ModuleFunction } from './types';

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
  'fa-feather-pointed', 'fa-box-archive', 'fa-pen-clip', 'fa-paper-plane',
  'fa-book-open', 'fa-diagram-project', 'fa-flask', 'fa-graduation-cap',
  'fa-clapperboard', 'fa-layer-group'
];

export interface TemplateConfig {
  label: string;
  enLabel: string;
  icon: string;
  description: string;
  skeleton: { function: ModuleFunction; title: string; icon: string }[];
}

export const TEMPLATES: Record<WritingType, TemplateConfig> = {
  [WritingType.LONG_FORM]: {
    label: '長篇敘事', enLabel: 'LONG-FORM NARRATIVE', icon: 'fa-feather-pointed',
    description: '市場最受歡迎架構，整合章節、世界觀與深度筆記。',
    skeleton: [
      { function: ModuleFunction.MAIN_DRAFT, title: '主草稿', icon: 'fa-file-lines' },
      { function: ModuleFunction.CHAPTERS, title: '章節結構', icon: 'fa-list-ol' },
      { function: ModuleFunction.NOTES, title: '備註筆記', icon: 'fa-sticky-note' },
      { function: ModuleFunction.WORLD_LORE, title: '世界觀設定', icon: 'fa-globe' }
    ]
  },
  [WritingType.ARCHIVE]: {
    label: '個人資料庫', enLabel: 'PERSONAL ARCHIVE', icon: 'fa-box-archive',
    description: '寫作者的第二大腦，收納靈感、紀錄與日常日誌。',
    skeleton: [
      { function: ModuleFunction.NOTES, title: '個人筆記', icon: 'fa-note-sticky' },
      { function: ModuleFunction.IDEAS, title: '靈感捕捉', icon: 'fa-lightbulb' },
      { function: ModuleFunction.LOGS, title: '創作日誌', icon: 'fa-calendar-day' }
    ]
  },
  [WritingType.ESSAY]: {
    label: '論說 / 觀點', enLabel: 'ESSAY & OPINION', icon: 'fa-pen-clip',
    description: '部落格與專欄創作者首選，強調論證邏輯與證據鏈。',
    skeleton: [
      { function: ModuleFunction.THESIS, title: '核心論點', icon: 'fa-bullseye' },
      { function: ModuleFunction.ARGUMENTS, title: '邏輯論證', icon: 'fa-scale-balanced' },
      { function: ModuleFunction.EVIDENCE, title: '支持證據', icon: 'fa-link' }
    ]
  },
  [WritingType.CREATOR]: {
    label: '創作者電子報', enLabel: 'CREATOR / NEWSLETTER', icon: 'fa-paper-plane',
    description: '針對定時發佈內容優化，管理期數與發佈備註。',
    skeleton: [
      { function: ModuleFunction.ISSUES, title: '單元期數', icon: 'fa-list-ol' },
      { function: ModuleFunction.MAIN_DRAFT, title: '本期草稿', icon: 'fa-pen-nib' },
      { function: ModuleFunction.NOTES, title: '發佈說明', icon: 'fa-clipboard-check' }
    ]
  },
  [WritingType.NOVEL]: {
    label: '小說創作', enLabel: 'NOVEL WRITING', icon: 'fa-book-open',
    description: '專業虛構寫作環境，支援三幕結構與角色弧線。',
    skeleton: [
      { function: ModuleFunction.ACTS, title: '幕結構', icon: 'fa-map' },
      { function: ModuleFunction.CHAPTERS, title: '章節內容', icon: 'fa-book-bookmark' },
      { function: ModuleFunction.CHARACTERS, title: '角色弧線', icon: 'fa-person-running' }
    ]
  },
  [WritingType.NON_FICTION]: {
    label: '非虛構架構', enLabel: 'NON-FICTION FRAMEWORK', icon: 'fa-diagram-project',
    description: '商業、教學或專業書籍，強調大綱引導。',
    skeleton: [
      { function: ModuleFunction.OUTLINE, title: '層級大綱', icon: 'fa-sitemap' },
      { function: ModuleFunction.SECTIONS, title: '段落結構', icon: 'fa-align-left' },
      { function: ModuleFunction.REFERENCES, title: '參考資料', icon: 'fa-book-atlas' }
    ]
  },
  [WritingType.RESEARCH]: {
    label: '研究導向寫作', enLabel: 'RESEARCH-DRIVEN', icon: 'fa-flask',
    description: '深度調查與學術預研，管理資料來源與核心發現。',
    skeleton: [
      { function: ModuleFunction.SOURCES, title: '資料來源庫', icon: 'fa-database' },
      { function: ModuleFunction.FINDINGS, title: '研究關鍵發現', icon: 'fa-magnifying-glass-chart' },
      { function: ModuleFunction.MAIN_DRAFT, title: '報告草稿', icon: 'fa-file-export' }
    ]
  },
  [WritingType.ACADEMIC]: {
    label: '學術論文', enLabel: 'ACADEMIC PAPER', icon: 'fa-graduation-cap',
    description: '嚴謹的論文結構模板，鎖定必要學術區塊。',
    skeleton: [
      { function: ModuleFunction.ABSTRACT, title: '摘要', icon: 'fa-star' },
      { function: ModuleFunction.METHODOLOGY, title: '研究方法', icon: 'fa-flask-vial' },
      { function: ModuleFunction.CITATIONS, title: '引用與參考', icon: 'fa-quote-left' }
    ]
  },
  [WritingType.SCREENPLAY]: {
    label: '影視劇本', enLabel: 'SCREENPLAY / TV PILOT', icon: 'fa-clapperboard',
    description: '符合工業標準的場景對白管理。',
    skeleton: [
      { function: ModuleFunction.ACTS, title: '三幕劇幕次', icon: 'fa-clapperboard' },
      { function: ModuleFunction.SCENES, title: '場景列表', icon: 'fa-location-dot' },
      { function: ModuleFunction.DIALOGUE, title: '對白區塊', icon: 'fa-comment-dots' }
    ]
  },
  [WritingType.SERIES]: {
    label: '系列建構者', enLabel: 'SERIES / SAGA BUILDER', icon: 'fa-layer-group',
    description: '跨作品宏觀管理，控制卷集與史詩弧線。',
    skeleton: [
      { function: ModuleFunction.VOLUMES, title: '卷集清單', icon: 'fa-books' },
      { function: ModuleFunction.ARCS, title: '故事弧線', icon: 'fa-waveform' },
      { function: ModuleFunction.CHARACTERS, title: '跨作品角色', icon: 'fa-users-gear' }
    ]
  }
};

export const PLACEHOLDER_TEXT = "寫作即是思考的延伸，請在此開始記錄...";
