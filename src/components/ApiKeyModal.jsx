import React, { useState } from 'react';
import { getApiKey, getProvider, setApiKeyStorage, setProviderStorage, PROVIDERS } from '../utils/storage';

export function ApiKeyModal({ show, onClose }) {
  const [key, setKey] = useState(getApiKey());
  const [provider, setProvider] = useState(getProvider());
  const [saved, setSaved] = useState(false);

  if (!show) return null;

  const info = PROVIDERS[provider];

  const handleSave = () => {
    setApiKeyStorage(key.trim());
    setProviderStorage(provider);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface border-2 border-border rounded-xl p-6 w-full max-w-[400px]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="m-0 text-text text-base font-extrabold">⚙️ Pengaturan AI</h3>
          <button onClick={onClose} className="bg-transparent border-none text-muted text-lg cursor-pointer hover:text-text transition-colors">✕</button>
        </div>

        <div className="mb-4">
          <label className="text-[11px] text-muted font-bold block mb-2 uppercase">PILIH PROVIDER AI</label>
          <div className="flex gap-2">
            {Object.entries(PROVIDERS).map(([id, p]) => (
              <button 
                key={id} 
                onClick={() => { setProvider(id); setKey(""); }} 
                className={`flex-1 rounded-lg px-3 py-2 cursor-pointer text-center transition-all border-2 ${provider === id ? 'bg-primary/5 border-primary' : 'bg-surface border-border hover:border-primary/50'}`}
              >
                <div className="text-lg mb-0.5">{p.icon}</div>
                <div className={`text-[10px] font-bold ${provider === id ? 'text-primary' : 'text-muted'}`}>
                  {id === "anthropic" ? "Claude" : "Gemini"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[11px] text-muted font-bold block mb-2 uppercase">{info.name} API KEY</label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder={info.placeholder}
            className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-text text-[13px] outline-none focus:border-primary transition-colors box-border"
          />
        </div>

        <div className="bg-surface border-2 border-border rounded-lg p-3 mb-5">
          <div className="text-[10px] text-muted leading-relaxed">
            💡 API key disimpan di browser kamu (localStorage) dan <strong className="text-success">tidak dikirim ke server manapun</strong> kecuali langsung ke {info.name}.
            <br /><br />
            Dapatkan API key di <a href={`https://${info.url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{info.url}</a>
          </div>
        </div>

        <button 
          onClick={handleSave} 
          className={`w-full border-none rounded-lg px-4 py-2.5 text-primary-fg font-bold text-[13px] cursor-pointer transition-all ${saved ? 'bg-success' : 'bg-primary hover:bg-primary/90'}`}
        >
          {saved ? "✅ Tersimpan!" : `💾 Simpan API Key`}
        </button>
      </div>
    </div>
  );
}
