import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../../utils/ai';
import { Bot, User, Send, Sparkles } from 'lucide-react';

export function Konsultasi() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! Saya AI tutor SNBT kamu.\n\nSaya bisa membantu:\n- Penjelasan materi & soal\n- Strategi belajar\n- Info seputar PTN\n\nApa yang ingin kamu diskusikan hari ini?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setMessages(prev => [...prev, { role: "assistant", content: "..." }]);

    await askAI(
      "Kamu adalah tutor UTBK yang ramah, profesional, dan to-the-point. Gunakan format markdown yang rapi. Jawaban maksimal 300 kata.",
      userMsg,
      (text) => {
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: text }]);
        setLoading(false);
      }
    );
  };

  const quickQuestions = ["Strategi belajar TPS", "Skor minimal ITB", "Tips manajemen waktu"];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-full max-w-4xl mx-auto border-2 border-border rounded-xl bg-surface overflow-hidden">
      <div className="p-3 md:p-4 border-b-2 border-border bg-surface flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary">
          <Bot size={16} />
        </div>
        <div>
          <h2 className="text-[13px] font-extrabold m-0 flex items-center gap-1.5">
            AI Assistant
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          </h2>
          <div className="text-[10px] font-bold text-muted mt-0.5">Powered by Gemini / Claude</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-7 h-7 rounded-full border-2 shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-primary text-primary-fg border-primary' : 'bg-surface border-border text-text'}`}>
              {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed border-2 ${
              m.role === 'user' 
                ? 'bg-surface-hover border-border text-text rounded-tr-sm font-medium' 
                : 'bg-surface border-border text-text rounded-tl-sm font-medium'
            }`}>
              {m.content.split('\n').map((line, j) => {
                const isBold = line.startsWith("**") && line.endsWith("**");
                const isBullet = line.startsWith("- ");
                const cleanLine = line.replace(/\*\*/g, "").replace(/^- /, "");
                
                if (isBullet) return <div key={j} className="flex gap-2 my-1"><span className="text-muted font-bold">•</span><span>{cleanLine}</span></div>;
                if (isBold) return <div key={j} className="font-extrabold my-2">{cleanLine}</div>;
                return <React.Fragment key={j}>{line}{j < m.content.split('\n').length - 1 && <br />}</React.Fragment>
              })}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {quickQuestions.map(qq => (
              <button 
                key={qq} 
                onClick={() => setInput(qq)} 
                className="bg-surface hover:bg-surface-hover border-2 border-border rounded-full px-3 py-1.5 text-[11px] font-bold text-muted hover:text-text cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={10} />
                {qq}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 bg-surface border-t-2 border-border shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type your message..."
            className="flex-1 bg-surface border-2 border-border rounded-xl px-4 py-2 text-[13px] font-medium text-text outline-none focus:border-primary transition-colors h-[40px] box-border"
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()} 
            className="bg-primary text-primary-fg border-2 border-primary rounded-xl w-10 h-[40px] flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
