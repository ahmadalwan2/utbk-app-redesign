import React, { useState } from 'react';
import { SUBJECTS_INFO } from '../../data/dummyData';
import { AIResponse } from '../../components/ui/AIResponse';
import { Card } from '../../components/ui/Card';
import { askAI } from '../../utils/ai';
import * as Icons from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function Materi() {
  const [selected, setSelected] = useState(null);
  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const loadMateri = async (subject, topic) => {
    setSelectedTopic(`${subject} - ${topic}`);
    setAiContent(""); setLoading(true);
    await askAI(
      "Kamu adalah tutor UTBK ahli. Jelaskan materi dengan ringkas, terstruktur, dan mudah dipahami. Gunakan contoh soal sederhana. Format dengan section ##, poin-poin - , dan **teks penting**. Maksimal 400 kata.",
      `Jelaskan materi UTBK tentang: ${topic} (bagian dari ${subject}). Berikan: penjelasan singkat, rumus/konsep kunci, dan 1 contoh soal dengan pembahasan.`,
      (text) => { setAiContent(text); setLoading(false); }
    );
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1.5">Materi Belajar</h1>
        <p className="text-muted text-[13px]">Pilih topik materi dan AI akan men-generate ringkasan khusus untukmu.</p>
      </header>

      <div className="space-y-3">
        {SUBJECTS_INFO.map(sub => {
          const Icon = Icons[sub.iconName] || Icons.Book;
          const isExpanded = selected === sub.name;
          return (
            <div key={sub.name} className="border-2 border-border rounded-xl bg-surface overflow-hidden transition-all">
              <button 
                onClick={() => setSelected(isExpanded ? null : sub.name)} 
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-hover border-2 border-border flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-text" />
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-[13px]">{sub.name}</div>
                    <div className="text-[11px] font-medium text-muted">{sub.full}</div>
                  </div>
                </div>
                <Icons.ChevronDown size={16} className={`text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="p-4 border-t-2 border-border bg-surface grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sub.topics.map(topic => {
                    const isSelected = selectedTopic === `${sub.name} - ${topic}`;
                    return (
                      <button 
                        key={topic} 
                        onClick={() => loadMateri(sub.name, topic)} 
                        className={twMerge(
                          "px-4 py-2.5 rounded-lg text-[13px] text-left cursor-pointer transition-all border-2",
                          isSelected ? "bg-primary text-primary-fg border-primary font-bold" : "bg-surface-hover border-transparent text-muted hover:text-text hover:border-border font-medium"
                        )}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {(loading || aiContent) && (
        <Card className="mt-6 border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icons.Sparkles size={14} className="text-accent" />
            <h3 className="text-[13px] font-extrabold text-accent">AI Tutor: {selectedTopic}</h3>
          </div>
          <AIResponse text={aiContent} loading={loading} />
        </Card>
      )}
    </div>
  );
}
