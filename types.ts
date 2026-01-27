
export enum MembershipLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

export enum WritingType {
  NOVEL = 'NOVEL',
  RESEARCH = 'RESEARCH',
  SCREENPLAY = 'SCREENPLAY',
  JOURNAL = 'JOURNAL'
}

export enum ModuleType {
  COLLECTION = 'COLLECTION',
  BOARD = 'BOARD',
  TIMELINE = 'TIMELINE',
  MANUSCRIPT = 'MANUSCRIPT'
}

export interface WritingModule {
  id: string;
  type: ModuleType;
  title: string;
  icon: string;
  description: string;
  order: number;
}

/* 視覺化大綱節點介面定義 */
export interface OutlineNode {
  id: string;
  label: string;
  level: number;
}

export interface Project {
  id: string;
  name: string;
  writingType: WritingType;
  metadata: string;
  progress: number;
  color: string;
  icon: string;
  chapters: Chapter[];
  modules: WritingModule[];
  createdAt: number;
  updatedAt: number;
  tags: string[];
  visualOutline?: OutlineNode[];
  isPinned?: boolean;
  isFavorite?: boolean;
  settings: {
    typography: 'serif' | 'sans';
    fontSize: 'normal' | 'large';
  }
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

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  history: VersionSnapshot[];
  publicationStatus?: PublicationStatus;
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
  WRITE = 'WRITE',
  PROFILE = 'PROFILE',
  PROJECT_DETAIL = 'PROJECT_DETAIL'
}

export type SupportedLanguage = 
  | 'en' | 'zh-TW' | 'zh-CN' | 'es' | 'pt-BR' | 'pt-PT' | 'de' | 'fr' 
  | 'it' | 'nl' | 'sv' | 'tr' | 'ru' | 'ja' | 'ko' | 'th' | 'vi' 
  | 'id' | 'ms' | 'ar' | 'hi';

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
