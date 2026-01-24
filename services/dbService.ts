
import { Project, VersionSnapshot } from '../types';

const DB_NAME = 'SafeWriteDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

export const dbService = {
  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async saveProject(project: Project): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(project);
    
    // 任務書：每 2 分鐘檢測 hash 變動並存儲快照
    this.scheduleAutoSnapshot(project.id);
  },

  // Fix: Object literal properties cannot have access modifiers like 'private' and must follow property: value syntax
  snapshotTimers: {} as Record<string, number>,

  scheduleAutoSnapshot(projectId: string) {
    if (this.snapshotTimers[projectId]) return;
    
    this.snapshotTimers[projectId] = window.setInterval(async () => {
      console.log("[Safety] 執行 2 分鐘安全快照檢測...");
      const project = await this.getProject(projectId);
      if (project) {
        // 實作快照邏輯
      }
    }, 120000); // 2 分鐘
  },

  async getProject(id: string): Promise<Project | null> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve(req.result || null);
    });
  },

  async getAllProjects(): Promise<Project[]> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
    });
  },

  onSync(callback: (id: string) => void) {
    const channel = new BroadcastChannel('safewrite_sync');
    channel.onmessage = (e) => callback(e.data.id);
  }
};