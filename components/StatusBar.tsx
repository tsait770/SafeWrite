
import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';

interface StatusBarProps {
  stats: UserStats;
  isSyncing: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ stats, isSyncing }) => {
  const [syncPhase, setSyncPhase] = useState<'IDLE' | 'CHECKING' | 'SYNCING'>('IDLE');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    
    if (isSyncing) {
      setSyncPhase('CHECKING');
      const timer = setTimeout(() => setSyncPhase('SYNCING'), 400);
      return () => clearTimeout(timer);
    } else {
      setSyncPhase('IDLE');
    }
  }, [isSyncing]);

  return (
    <footer className="h-8 bg-white border-t border-gray-100 flex items-center justify-between px-6 z-50">
      <div className="flex items-center space-x-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span>{stats.wordCount.toLocaleString()} WORDS</span>
        </div>
        {!isOnline && (
          <div className="flex items-center space-x-2 text-orange-500">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM231 167l0 139c0 9.4 7.6 17 17 17s17-7.6 17-17l0-139c0-9.4-7.6-17-17-17s-17 7.6-17 17zm33 217a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"/></svg>
            <span>離線保護模式啟動</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-[9px] font-bold">
           {syncPhase === 'CHECKING' && (
             <span className="text-orange-500 animate-pulse">正在進行增量同步校驗...</span>
           )}
           {syncPhase === 'SYNCING' && (
             <div className="flex items-center space-x-2 text-blue-500">
               <div className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               <span>雲端雙重備份中</span>
             </div>
           )}
           {syncPhase === 'IDLE' && isOnline && (
             <div className="flex items-center space-x-2 text-green-600">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               <span className="opacity-60 text-[8px]">數據庫與雲端同步完成</span>
             </div>
           )}
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
