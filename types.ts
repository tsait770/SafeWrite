
export enum MembershipLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

// 10 大核心寫作範本 + 自定義
export enum WritingType {
  LONG_FORM = 'LONG_FORM',      // 長篇敘事
  ARCHIVE = 'ARCHIVE',          // 個人資料庫
  ESSAY = 'ESSAY',              // 論說觀點
  CREATOR = 'CREATOR',          // 創作者電子報
  NOVEL = 'NOVEL',              // 專業小說
  NON_FICTION = 'NON_FICTION',  // 非虛構架構
  RESEARCH = 'RESEARCH',        // 研究導向
  ACADEMIC = 'ACADEMIC',        // 學術論文
  SCREENPLAY = 'SCREENPLAY',    // 影視劇本
  SERIES = 'SERIES',            // 系列史詩
  CUSTOM = 'CUSTOM'             // 自定義範本
}

// 20 種核心寫作模組功能
export enum ModuleFunction {
  MAIN_DRAFT = 'MAIN_DRAFT',
  CHAPTERS = 'CHAPTERS',
  NOTES = 'NOTES',
  WORLD_LORE = 'WORLD_LORE',
  SERIES_BUILDER = 'SERIES_BUILDER',
  VOLUMES = 'VOLUMES',
  ARCS = 'ARCS',
  CHARACTERS = 'CHARACTERS',
  OUTLINE = 'OUTLINE',
  SECTIONS = 'SECTIONS',
  REFERENCES = 'REFERENCES',
  SOURCES = 'SOURCES',
  FINDINGS = 'FINDINGS',
  IDEAS = 'IDEAS',
  LOGS = 'LOGS',
  ACTS = 'ACTS',
  SCENES = 'SCENES',
  DIALOGUE = 'DIALOGUE',
  THESIS = 'THESIS',
  ARGUMENTS = 'ARGUMENTS',
  EVIDENCE = 'EVIDENCE',
  ABSTRACT = 'ABSTRACT',
  METHODOLOGY = 'METHODOLOGY',
  CITATIONS = 'CITATIONS',
  ISSUES = 'ISSUES'
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  PUBLISHED = 'PUBLISHED'
}

export enum ModuleType {
  COLLECTION = 'COLLECTION',
  BOARD = 'BOARD',
  TIMELINE = 'TIMELINE',
  MANUSCRIPT = 'MANUSCRIPT',
  WORLD = 'WORLD',
  CHARACTER = 'CHARACTER'
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

export interface WritingModule {
  id: string;
  function: ModuleFunction;
  title: string;
  icon: string;
  description: string;
  order: number;
  isInitial?: boolean;
}

export interface OutlineNode {
  id: string;
  label: string;
  level: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  history: VersionSnapshot[];
  wordCount: number;
  lastEdited: number;
  publicationStatus?: PublicationStatus;
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

export interface Project {
  id: string;
  name: string;
  writingType: WritingType;
  targetWordCount: number;
  metadata: string;
  progress: number;
  color: string;
  icon: string;
  chapters: Chapter[];
  modules: WritingModule[];
  visualOutline?: OutlineNode[];
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isPinned?: boolean;
  settings: {
    typography: 'serif' | 'sans';
    fontSize: 'normal' | 'large';
  }
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
  editorSettings: {
    typewriterMode: boolean;
    previewMode: boolean;
  };
}
