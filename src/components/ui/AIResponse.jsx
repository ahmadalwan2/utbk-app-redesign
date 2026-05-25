import React from 'react';

export function AIResponse({ text, loading }) {
  const lines = text.split("\n").filter(Boolean);
  
  return (
    <div className="bg-[#0D1B2A] border border-primary/20 rounded-xl p-5 min-h-[80px] relative">
      {loading ? (
        <div className="flex items-center gap-2.5 text-muted">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" 
                style={{ animationDelay: `${i * 0.2}s` }} 
              />
            ))}
          </div>
          <span className="text-[13px]">AI sedang menganalisis...</span>
        </div>
      ) : (
        <div className="text-text text-sm leading-relaxed">
          {lines.map((line, i) => {
            const isBold = line.startsWith("**") && line.endsWith("**");
            const isHeader = line.startsWith("##") || line.startsWith("#");
            const isBullet = line.startsWith("- ") || line.startsWith("• ");
            const cleanLine = line.replace(/\*\*/g, "").replace(/^#+\s/, "").replace(/^[-•]\s/, "");
            
            if (isHeader) return <div key={i} className={`font-extrabold text-[15px] text-primary ${i > 0 ? 'mt-4' : ''} mb-1.5`}>{cleanLine}</div>;
            if (isBullet) return <div key={i} className="pl-4 relative mb-1">
              <span className="absolute left-1 text-primary">›</span>{cleanLine}
            </div>;
            if (isBold) return <div key={i} className="font-bold text-blue-50 mb-1">{cleanLine}</div>;
            return <div key={i} className="mb-1">{line}</div>;
          })}
        </div>
      )}
    </div>
  );
}
