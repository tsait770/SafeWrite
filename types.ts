
export enum MembershipLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

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

export enum AppMode {
  REPOSITORY = 'REPOSITORY',
  CAPTURE = 'CAPTURE'
}

export enum AppTab {
  LIBRARY = 'LIBRARY',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  WRITE = 'WRITE',
  PROFILE = 'PROFILE'
}

export enum UIMode {
  MANAGEMENT = 'MANAGEMENT',
  FOCUS = 'FOCUS'
}

export enum ThemeMode {
  LIGHT = 'LIGHT',
  NIGHT = 'NIGHT'
}

export enum PublicationStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  LIVE = 'LIVE',
  REJECTED = 'REJECTED'
}

export interface PublishingPayload {
  title: string;
  subtitle: string;
  author: string;
  language: string;
  description: string;
  categories: string[];
  keywords: string[];
  isbn13?: string;
  coverImage?: string;
  contentFormats: ('epub' | 'pdf' | 'docx')[];
}

export interface OutlineNode {
  id: string;
  label: string;
  level: number;
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
  createdAt: number;
  history?: VersionSnapshot[];
}

export type Chapter = StructureUnit;

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
  selectedModel: string;
  tone: 'CREATIVE' | 'ACADEMIC' | 'PROFESSIONAL' | 'CASUAL';
  enableThinking: boolean;
  thinkingBudget: number;
  customBaseUrl?: string;
  budgetLimit: number;
  currentUsage: number;
  onLimitAction: 'STOP' | 'SWITCH' | 'NOTIFY';
}

export interface SecuritySettings {
  autoSnapshotEnabled: boolean;
  autoSnapshotMode: 'interval' | 'idle';
  autoSnapshotIntervalMinutes: number;
  autoSnapshotIdleSeconds: number;
  autoSnapshotCleanupDays: number | 'NEVER';
}

export interface BackupSettings {
  googleDriveConnected: boolean;
  backupFolder: string;
  isEncrypted: boolean;
  lastBackupTime: number | null;
  status: 'IDLE' | 'SYNCING' | 'ERROR';
}

export interface CreditCard {
  id: string;
  number: string;
  expiry: string;
  name: string;
  type: 'MASTERCARD' | 'VISA';
  cvv: string;
}

export interface Project {
  id: string;
  name: string;
  writingType: WritingType;
  structureType: StructureType;
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
  publishingPayload?: PublishingPayload;
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
  backupSettings: BackupSettings;
  savedCards: CreditCard[];
  editorSettings: {
    typewriterMode: boolean;
    previewMode: boolean;
  };
}

export type ImageSize = '1K' | '2K' | '4K';
export type VideoAspectRatio = '16:9' | '9:16';
