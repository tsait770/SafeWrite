
import React from 'react';
import { Project, PublicationStatus } from '../types';

interface PublicationTrackerProps {
  project: Project | null;
  isNight: boolean;
}

const PublicationTracker: React.FC<PublicationTrackerProps> = ({ project, isNight }) => {
  const steps = [
    { status: PublicationStatus.SUBMITTED, icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z' },
    { status: PublicationStatus.REVIEWING, icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' },
    { status: PublicationStatus.ACCEPTED, icon: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' }
  ];

  return (
    <div className={`w-full max-w-3xl mt-8 px-8 py-6 rounded-3xl border animate-in slide-in-from-top duration-500 ${isNight ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32z"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold">出版直通車：投遞狀態</h3>
            <p className="text-[10px] text-gray-400">當前專案：{project?.name}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-green-500/10 text-green-600 px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">實時審核中</span>
      </div>

      <div className="flex items-center justify-between px-10">
        {steps.map((step, i) => (
          <div key={step.status} className="flex flex-col items-center relative group">
            {i < steps.length - 1 && (
              <div className={`absolute left-full top-5 w-32 h-0.5 ${i === 0 ? 'bg-blue-500' : (isNight ? 'bg-slate-800' : 'bg-gray-100')}`} />
            )}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${i === 0 ? 'bg-blue-500 border-blue-500 text-white' : (isNight ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white border-gray-100 text-gray-300')}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={step.icon} /></svg>
            </div>
            <p className={`text-[9px] font-bold mt-3 uppercase tracking-widest ${i === 0 ? 'text-blue-500' : 'text-gray-400'}`}>{step.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationTracker;
