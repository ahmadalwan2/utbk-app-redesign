import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getApiKey, getProvider, setApiKeyStorage, setProviderStorage, PROVIDERS } from '../../utils/storage';
import { Card } from '../../components/ui/Card';

export function Pengaturan() {
  const [key, setKey] = useState(getApiKey());
  const [provider, setProvider] = useState(getProvider());
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const info = PROVIDERS[provider];

  const handleSave = () => {
    setApiKeyStorage(key.trim());
    setProviderStorage(provider);
    setSaved(true);
    setTimeout(() => { setSaved(false); }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Pengaturan Sistem</h1>
        <p className="text-muted text-sm mt-1">Konfigurasi preferensi AI dan akun pengguna.</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="m-0 text-text text-lg font-extrabold mb-1">🤖 Konfigurasi AI</h3>
            <p className="text-muted text-[13px]">Atur kunci API agar fitur Tanya AI (Konsultasi) dapat berfungsi penuh.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[11px] text-muted font-bold block mb-2 uppercase">Pilih Provider AI</label>
              <div className="flex gap-3">
                {Object.entries(PROVIDERS).map(([id, p]) => (
                  <button 
                    key={id} 
                    onClick={() => { setProvider(id); setKey(""); }} 
                    className={`flex-1 rounded-lg px-4 py-3 cursor-pointer text-center transition-all border-2 ${provider === id ? 'bg-primary/5 border-primary' : 'bg-surface border-border hover:border-primary/50'}`}
                  >
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className={`text-[12px] font-bold ${provider === id ? 'text-primary' : 'text-muted'}`}>
                      {id === "anthropic" ? "Claude (Disarankan)" : "Gemini"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted font-bold block mb-2 uppercase">{info.name} API Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder={info.placeholder}
                  className="w-full bg-surface border-2 border-border rounded-lg pl-4 pr-10 py-3 text-text text-[13px] outline-none focus:border-primary transition-colors box-border"
                />
                <button 
                  onClick={() => setShowKey(!showKey)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-1"
                  title={showKey ? "Sembunyikan" : "Tampilkan"}
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="bg-surface border-2 border-border rounded-lg p-4">
              <div className="text-[12px] text-muted leading-relaxed">
                💡 <strong>Aman & Terjaga:</strong> API key disimpan langsung di penyimpanan lokal (localStorage) browsermu dan tidak pernah dikirim ke server *backend* aplikasi ini. <br/>Kunci ini hanya digunakan untuk menghubungi server {info.name} secara langsung saat menggunakan fitur AI.
                <br /><br />
                Belum punya API key? Dapatkan secara gratis di <a href={`https://${info.url}`} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">{info.url}</a>
              </div>
            </div>

            <button 
              onClick={handleSave} 
              className={`w-full border-2 rounded-lg px-4 py-3 font-bold text-[13px] cursor-pointer transition-all ${saved ? 'bg-success text-white border-success' : 'bg-primary border-primary text-primary-fg hover:bg-primary/90'}`}
            >
              {saved ? "✅ Pengaturan Berhasil Disimpan!" : `💾 Simpan Pengaturan API Key`}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
