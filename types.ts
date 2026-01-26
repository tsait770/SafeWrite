
export enum MembershipLevel { FREE = 'FREE', PRO = 'PRO', PREMIUM = 'PREMIUM' }

export enum ProjectTemplate {
  LONG_FORM = 'Long-form Narrative',
  RESEARCH = 'Research-driven Writing',
  NOVEL = 'Novel Writing',
  SCREENPLAY = 'Screenplay/TV Pilot'
}

export type ModuleType = 'CHAPTER' | 'NOTE' | 'LORE' | 'CHARACTER' | 'SOURCE' | 'FINDING' | 'SCENE' | 'DIALOGUE';

export interface ModuleItem {
  id: string;
  title: string;
  type: ModuleType;
  content: string;
  order: number;
}

// Added OutlineNode for AIPanel.tsx and Sidebar.tsx
export interface OutlineNode {
  id: string;
  label: string;
  level: number;
}

export interface Project {
  id: string;
  name: string;
  template: ProjectTemplate;
  color: string;
  icon: string;
  textColor: string;
  modules: ModuleItem[];
  // Added for Sidebar.tsx compatibility as it expects these properties
  chapters: ModuleItem[];
  visualOutline?: OutlineNode[];
  stats: { wordCount: number; updatedAt: number };
}

export enum UIMode { FOCUS = 'FOCUS', MANAGEMENT = 'MANAGEMENT' }
export enum AppTab { LIBRARY = 'LIBRARY', WRITE = 'WRITE', PROFILE = 'PROFILE' }

// Added Snapshot types for Timeline.tsx and dbService.ts
export enum SnapshotType { AUTO = 'AUTO', MILESTONE = 'MILESTONE' }

export interface VersionSnapshot {
  id: string;
  timestamp: number;
  title?: string;
  content: string;
  type: SnapshotType;
}

// Added UserStats for StatusBar.tsx
export interface UserStats {
  wordCount: number;
}

// Added PublicationStatus for PublicationTracker.tsx
export enum PublicationStatus {
  SUBMITTED = 'Submitted',
  REVIEWING = 'Reviewing',
  ACCEPTED = 'Accepted'
}

// Added SupportedLanguage for Profile.tsx and LanguageSelector.tsx
export type SupportedLanguage = 'en' | 'zh-TW' | 'zh-CN' | 'es' | 'pt-BR' | 'pt-PT' | 'de' | 'fr' | 'it' | 'nl' | 'sv' | 'tr' | 'ru' | 'ja' | 'ko' | 'th' | 'vi' | 'id' | 'ms' | 'ar' | 'hi';

export interface AppState {
  currentProject: Project | null;
  activeModuleId: string | null;
  activeTab: AppTab;
  uiMode: UIMode;
  // Added missing fields used in Profile.tsx
  language: SupportedLanguage;
  membership: MembershipLevel;
}
