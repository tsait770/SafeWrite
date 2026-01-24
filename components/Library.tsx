import React, { useState } from 'react';

interface LibraryProps {
  onSelectProject: (p: any) => void;
}

const Library: React.FC<LibraryProps> = ({ onSelectProject }) => {
  const [weather] = useState({ temp: '15', city: '新北市', date: 'January 20' });

  const projects = [
    {
      id: 'p1',
      name: 'The Solar Paradox',
      category: 'SCI-FI • NOVEL',
      metadata: 'EDITED 10M AGO',
      progress: 82,
      color: 'bg-[#F5E050]',
      textColor: 'text-[#121212]',
      progressColor: 'bg-[#121212]/30'
    },
    {
      id: 'p2',
      name: 'Urban Solitude',
      category: 'PHOTOGRAPHY • ESSAY',
      metadata: 'DRAFTING • CHAPTER 3',
      progress: 35,
      color: 'bg-[#FF6B2C]',
      textColor: 'text-white',
      progressColor: 'bg-white/20'
    },
    {
      id: 'p3',
      name: 'Cognitive Bias Research',
      category: 'ACADEMIC • THESIS',
      metadata: 'REVIEW PENDING',
      progress: 95,
      color: 'bg-[#D4FF5F]',
      textColor: 'text-[#121212]',
      progressColor: 'bg-[#121212]/20'
    },
    {
      id: 'p4',
      name: 'Midnight Podcast S2',
      category: 'AUDIO • SCRIPT',
      metadata: 'CREATED YESTERDAY',
      progress: 10,
      color: 'bg-[#B2A4FF]',
      textColor: 'text-white',
      progressColor: 'bg-white/30'
    }
  ];

  return (
    <div className="px-8 space-y-12">
      {/* Weather Widget */}
      <section>
        <div className="weather-card">
          <div className="weather-container">
            <div className="cloud front">
              <span className="left-front"></span>
              <span className="right-front"></span>
            </div>
            <span className="sun sunshine"></span>
            <span className="sun"></span>
            <div className="cloud back">
              <span className="left-back"></span>
              <span className="right-back"></span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-base text-[rgba(87,77,51,0.6)] uppercase tracking-tight">{weather.city}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-sm text-[rgba(87,77,51,0.4)]">{weather.date}</span>
              <span className="bg-black/5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-[rgba(87,77,51,0.5)]">MACOS</span>
            </div>
          </div>
          <span className="temp">{weather.temp}°</span>
          <div className="temp-scale">
            <span>Celsius</span>
          </div>
        </div>
      </section>

      {/* Core Repositories Stacking */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <h2 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">CORE REPOSITORIES</h2>
          </div>
          <div className="flex-1 h-px bg-white/10 ml-6" />
        </div>
        
        <div className="stack-container">
          {projects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className={`stack-card ${proj.color} ${proj.textColor}`}
              style={{ 
                zIndex: projects.length - idx,
              }}
              onClick={() => onSelectProject(proj)}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h3 className="text-3xl font-black tracking-tighter leading-[0.9]">{proj.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-50 mt-3">{proj.category}</p>
                  </div>
                  <button className="card-action-btn">
                     <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  </button>
                </div>
                
                <div className="mt-12">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span>{proj.metadata}</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className={`progress-fill ${proj.progressColor}`} style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center pt-10 pb-24">
        <button className="text-[10px] font-black text-[#8e8e93] uppercase tracking-[0.2em] hover:text-white transition-colors py-4 px-8 border border-white/5 rounded-full">
          Manage all repositories
        </button>
      </div>
    </div>
  );
};

export default Library;