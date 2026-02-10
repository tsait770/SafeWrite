
import React from 'react';
import { Project, PublicationStatus } from '../types';

interface PublicationTrackerProps {
  project: Project | null;
  isNight: boolean;
}

const PublicationTracker: React.FC<PublicationTrackerProps> = ({ project, isNight }) => {
  const latestPub = project?.publicationHistory?.[0];
  
  const steps = [
    { status: PublicationStatus.SUBMITTED, label: '已投遞', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z' },
    { status: PublicationStatus.REVIEWING, label: '審核中', icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' },
    { status: PublicationStatus.ACCEPTED, label: '已出版', icon: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' }
  ];

  if (!latestPub) return null;

  const currentIdx = steps.findIndex(s => s.status === latestPub.status);

  return (
    <div className={`w-full max-w-3xl mt-8 px-8 py-8 rounded-[44px] border animate-in slide-in-from-top duration-700 ${isNight ? 'bg-[#1C1C1E] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
             <i className="fa-solid fa-paper-plane text-sm"></i>
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">出版通道：{latestPub.platform}</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1">
              最後更新於 {new Date(latestPub.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-[#D4FF5F] rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-[#D4FF5F] uppercase tracking-widest">處理中</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 relative">
        <div className="absolute left-10 right-10 top-5 h-0.5 bg-white/5 -z-10" />
        {steps.map((step, i) => (
          <div key={step.status} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${i <= currentIdx ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#0F0F10] border-white/10 text-gray-700'}`}>
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={step.icon} /></svg>
            </div>
            <p className={`text-[9px] font-black mt-3 uppercase tracking-widest ${i <= currentIdx ? 'text-blue-500' : 'text-gray-700'}`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationTracker;
