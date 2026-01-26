
import { WritingType, ModuleType, WritingModule } from './types';

export const COLORS = {
  PRIMARY: '#1E293B',    // Deep Slate
  SECONDARY: '#FDFBF7',  // Soft Paper
  ACCENT: '#7b61ff',     // SafeWrite Purple
  PREMIUM: '#D97706',    // Milestone Gold
  TEXT: '#111827',       // Ink Black
  SUCCESS: '#10B981',    // Safe Green
  BG_NIGHT: '#0F172A',   // Midnight Void
};

export const PROJECT_COLORS = [
  '#7b61ff', '#F5E050', '#FF6B2C', '#D4FF5F', '#B2A4FF', '#FF9F7A',
  '#10B981', '#3B82F6', '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6'
];

export const PROJECT_ICONS = [
  'fa-feather-pointed', 'fa-book', 'fa-scroll', 'fa-flask', 'fa-pen-nib',
  'fa-file-lines', 'fa-brain', 'fa-microphone', 'fa-camera', 'fa-film',
  'fa-star', 'fa-compass', 'fa-anchor', 'fa-shield-halved', 'fa-gem',
  'fa-palette', 'fa-music', 'fa-code', 'fa-quote-left', 'fa-newspaper'
];

export const TEMPLATES: Record<WritingType, { label: string, icon: string, modules: Partial<WritingModule>[] }> = {
  [WritingType.NOVEL]: {
    label: '長篇敘事 Novel',
    icon: 'fa-book-open',
    modules: [
      { type: ModuleType.BOARD, title: '世界觀設定 World', icon: 'fa-globe', description: '地理、歷史與規則' },
      { type: ModuleType.COLLECTION, title: '人物檔案 Characters', icon: 'fa-users', description: '主角與配角設定' },
      { type: ModuleType.TIMELINE, title: '劇情線 Story Arcs', icon: 'fa-timeline', description: '敘事節點與衝突' },
      { type: ModuleType.MANUSCRIPT, title: '主稿 Chapters', icon: 'fa-feather', description: '核心創作區域' }
    ]
  },
  [WritingType.RESEARCH]: {
    label: '研究報告 Research',
    icon: 'fa-microscope',
    modules: [
      { type: ModuleType.COLLECTION, title: '文獻來源 Sources', icon: 'fa-link', description: '參考資料與連結' },
      { type: ModuleType.BOARD, title: '核心發現 Findings', icon: 'fa-lightbulb', description: '關鍵論點與數據' },
      { type: ModuleType.MANUSCRIPT, title: '草稿 Drafts', icon: 'fa-file-signature', description: '正式寫作區域' }
    ]
  },
  [WritingType.SCREENPLAY]: {
    label: '影視劇本 Screenplay',
    icon: 'fa-clapperboard',
    modules: [
      { type: ModuleType.BOARD, title: '幕結構 Acts', icon: 'fa-layer-group', description: '三幕劇結構' },
      { type: ModuleType.COLLECTION, title: '場景 Scenes', icon: 'fa-film', description: '分場大綱' },
      { type: ModuleType.MANUSCRIPT, title: '劇本內容 Script', icon: 'fa-i-cursor', description: '標準劇本格式' }
    ]
  },
  [WritingType.JOURNAL]: {
    label: '私人日誌 Journal',
    icon: 'fa-calendar-day',
    modules: [
      { type: ModuleType.MANUSCRIPT, title: '每日紀錄 Entries', icon: 'fa-book', description: '生活點滴' },
      { type: ModuleType.BOARD, title: '回顧 Reflections', icon: 'fa-seedling', description: '成長與感悟' }
    ]
  }
};

export const THRESHOLDS = {
  PRO_WORD_COUNT: 15000,
  PRO_CHAPTER_COUNT: 5,
  PREMIUM_PROJECT_COUNT: 3
};

export const PLACEHOLDER_TEXT = "寫作即是思考的延伸，請在此開始記錄...";
