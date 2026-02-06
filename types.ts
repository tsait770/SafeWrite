
export enum MembershipLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

// 核心寫作範本類型
export enum WritingType {
  NOVEL = 'NOVEL',
  BLOG = 'BLOG',
  DIARY = 'DIARY',
  CUSTOM = 'CUSTOM',
  LONG_FORM = 'LONG_FORM',
  BUSINESS_PLAN = 'BUSINESS_PLAN',
  SCREENPLAY = 'SCREENPLAY',
  ACADEMIC = 'ACADEMIC',
  PRD = 'PRD',
  COPYWRITING = 'COPYWRITING',
  COURSE = 'COURSE',
  BOOK_OUTLINE = 'BOOK_OUTLINE'
}

export enum StructureType {
  CHAPTER = 'CHAPTER',
  SECTION = 'SECTION',
  BLOCK = 'BLOCK',
  FREE = 'FREE'
}

export interface StructureDefinition {
  type: StructureType;
  autoNumbering: boolean;
  defaultNamingRule: (index: number) => string;
  allowManualOrder: boolean;
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
  order: number; // Used as position
  wordCount: number;
  lastEdited: number;
  createdAt: number;
  history?: VersionSnapshot[];
}

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

export interface SecuritySettings {
  autoSnapshotEnabled: boolean;
  autoSnapshotMode: 'interval' | 'idle';
  autoSnapshotIntervalMinutes: number;
  autoSnapshotIdleSeconds: number;
  autoSnapshotCleanupDays: number | 'NEVER';
}

export interface Project {
  id: string;
  name: string;
  writingType: WritingType;
  structureType: StructureType; // New: linking template to structure
  targetWordCount: number;
  metadata: string;
  progress: number;
  color: string;
  icon: string;
  chapters: StructureUnit[];
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
  securitySettings: SecuritySettings;
  editorSettings: {
    typewriterMode: boolean;
    previewMode: boolean;
  };
}
