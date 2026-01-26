
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface EditorContextType {
  content: string;
  setContent: (val: string) => void;
  saveStatus: 'SAVED' | 'SAVING' | 'IDLE';
  currentModuleId: string | null;
  setModule: (id: string | null, initialContent?: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING' | 'IDLE'>('IDLE');
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  const setModule = useCallback((id: string | null, initialContent: string = '') => {
    setCurrentModuleId(id);
    if (id) {
      const cached = localStorage.getItem(`sw_cache_${id}`);
      setContent(cached || initialContent);
    } else {
      setContent('');
    }
  }, []);

  useEffect(() => {
    if (!currentModuleId) return;
    setSaveStatus('SAVING');
    const timer = setTimeout(() => {
      localStorage.setItem(`sw_cache_${currentModuleId}`, content);
      setSaveStatus('SAVED');
    }, 800);
    return () => clearTimeout(timer);
  }, [content, currentModuleId]);

  return (
    <EditorContext.Provider value={{ content, setContent, saveStatus, currentModuleId, setModule }}>
      {children}
    </EditorContext.Provider>
  );
};
