
export enum MembershipLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

// 核心寫作範本類型
export enum WritingType {
  NOVEL = 'NOVEL',              // 長篇小說 / 故事
  BLOG = 'BLOG',               // 部落格 / Medium
  DIARY = 'DIARY',              // 日記 / 隨手筆記
  CUSTOM = 'CUSTOM',            // 自定義範本
  LONG_FORM = 'LONG_FORM',      // 長篇作品
  
  // 卷軸範本庫內容
  BUSINESS_PLAN = 'BUSINESS_PLAN', // 商業計畫書
  SCREENPLAY = 'SCREENPLAY',       // 劇本 / 影視腳本
  ACADEMIC = 'ACADEMIC',           // 學術論文
  PRD = 'PRD',                     // 產品需求文件
  COPYWRITING = 'COPYWRITING',     // 行銷文案
  COURSE = 'COURSE',               // 教學課程
  BOOK_OUTLINE = 'BOOK_OUTLINE'    // 書籍大綱
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  PUBLISHED = 'PUBLISHED'
}

export enum UIMode {
  FOCUS = 'FOCUS',
  MANAGEMENT = 'MANAGEMENT'
}

export enum AppMode {
  REPOSITORY = 'REPOSITORY',
  CAPTURE = 'CAPTURE'
}

export enum ThemeMode {
  DAY = 'DAY',
  NIGHT = 'NIGHT'
}

export enum AppTab {
  LIBRARY = 'LIBRARY',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  WRITE = 'WRITE',
  PROFILE = 'PROFILE'
}

export enum SnapshotType {
  AUTO = 'auto',
  MANUAL = 'manual',
  MILESTONE = 'milestone',
}

export interface VersionSnapshot {
  id: string;
  timestamp: number;
  content: string;
  title: string;
  type: SnapshotType;
  milestoneName?: string;
}

export interface StructureUnit {
  id: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  lastEdited: number;
  history?: VersionSnapshot[];
}

// Alias StructureUnit as Chapter for consistent usage across components
export type Chapter = StructureUnit;

export interface OutlineNode {
  id: string;
  label: string;
  level: number;
}

export enum ModuleType {
  NARRATIVE = 'NARRATIVE',
  CHARACTER = 'CHARACTER',
  RESEARCH = 'RESEARCH'
}

export interface WritingModule {
  id: string;
  title: string;
  icon: string;
  order: number;
}

export interface UserStats {
  wordCount: number;
  projectCount: number;
  exportCount: number;
  lastActive: number;
  hasTrialed: boolean;
  dailyGoal: number;
  writingStreak: number;
  todayWords: number;
}

export type SupportedLanguage = 
  | 'en' | 'zh-TW' | 'zh-CN' | 'es' | 'pt-BR' | 'pt-PT' | 'de' | 'fr' 
  | 'it' | 'nl' | 'sv' | 'tr' | 'ru' | 'ja' | 'ko' | 'th' | 'vi' 
  | 'id' | 'ms' | 'ar' | 'hi';

export interface AIPreferences {
  provider: 'DEFAULT' | 'CUSTOM';
  customModel: string;
  tone: 'CREATIVE' | 'ACADEMIC' | 'PROFESSIONAL' | 'CASUAL';
  enableThinking: boolean;
  thinkingBudget: number;
}

export interface Project {
  id: string;
  name: string;
  writingType: WritingType;
  targetWordCount: number;
  metadata: string;
  progress: number;
  color: string;
  icon: string;
  chapters: Chapter[]; // 使用 Chapter alias
  modules: WritingModule[];
  createdAt: number;
  updatedAt: number;
  tags: string[];
  settings: {
    typography: 'serif' | 'sans';
    fontSize: 'normal' | 'large';
  };
  isPinned?: boolean;
  visualOutline?: OutlineNode[];
}

export interface AppState {
  projects: Project[];
  currentProject: Project | null;
  currentChapterId: string | null;
  uiMode: UIMode;
  appMode: AppMode;
  activeTab: AppTab;
  theme: ThemeMode;
  membership: MembershipLevel;
  stats: UserStats;
  language: SupportedLanguage;
  aiPreferences: AIPreferences;
  editorSettings: {
    typewriterMode: boolean;
    previewMode: boolean;
  };
}
