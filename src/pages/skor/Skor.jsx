import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { AIResponse } from '../../components/ui/AIResponse';
import { askAI } from '../../utils/ai';
import { Crown, Zap, Crosshair, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';

export function Skor() {
  const [riwayat, setRiwayat] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getRiwayatLatihan();
        // filter out null scores (if not finished)
        setRiwayat((res.data || []).filter(r => r.skor !== null));
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const scores = riwayat.map(r => r.skor).reverse(); // Reverse so oldest is first, or keep newest first depending on preference. Let's keep chronological for trend.
  
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const best = scores.length ? Math.max(...scores) : 0;
  const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : 0;

  const getAnalysis = async () => {
    setLoading(true); setAiAnalysis("");
    await askAI(
      "Kamu adalah konsultan akademik UTBK. Analisis performa pelajar dan berikan saran yang actionable, motivatif, dan spesifik. Gunakan Bahasa Indonesia. Format dengan ## header dan - poin.",
      `Data tryout pelajar: ${scores.join(", ")}. Rata-rata: ${avg}. Terbaik: ${best}. Berikan analisis performa dan rekomendasi belajar spesifik untuk meningkatkan skor UTBK.`,
      (text) => { setAiAnalysis(text); setLoading(false); }
    );
  };

  if (loadingHistory) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-5">
        <div className="w-16 h-16 bg-surface border-2 border-border rounded-2xl flex items-center justify-center text-muted">
          <Crosshair size={28} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold mb-1.5">Belum Ada Analitik</h2>
          <p className="text-muted text-[13px] font-medium leading-relaxed">Selesaikan setidaknya satu simulasi tryout untuk melihat laporan performa dan metrik berbasis AI.</p>
        </div>
        <button 
          onClick={() => navigate('/tryout')} 
          className="bg-primary border-2 border-primary rounded-lg px-5 py-2.5 text-primary-fg cursor-pointer font-bold text-[13px] hover:bg-primary/90 transition-colors"
        >
          Mulai Tryout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1.5">Statistik & Performa</h1>
        <p className="text-muted text-[13px] font-medium">Lihat sejauh mana kemampuanmu berkembang dengan rekomendasi AI.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Skor Rata-rata", val: avg, icon: Crosshair, color: "text-text" },
          { label: "Skor Terbaik", val: best, icon: Crown, color: "text-success" },
          { label: "Tren Terakhir", val: (trend >= 0 ? "+" : "") + trend, icon: Zap, color: trend >= 0 ? "text-success" : "text-danger" }
        ].map((item, i) => (
          <Card key={i} className="flex flex-col p-5">
            <div className="flex items-center gap-2 mb-3 text-muted">
              <item.icon size={14} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{item.label}</span>
            </div>
            <div className={`text-3xl font-black tracking-tighter ${item.color}`}>{item.val}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="text-[11px] text-muted font-extrabold mb-5 tracking-widest uppercase flex items-center gap-2">
            <Zap size={12} /> Riwayat Skor Tryout
          </div>
          <div className="space-y-4">
            {riwayat.slice().reverse().map((r, i) => (
              <div key={r.id || i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] font-bold">Latihan {r.mapel}</span>
                  <span className="text-[13px] font-mono font-bold">{r.skor}</span>
                </div>
                <ProgressBar value={r.skor} max={1000} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] text-muted font-extrabold mb-5 tracking-widest uppercase flex items-center gap-2">
            <Crown size={12} /> Target Benchmarks PTN
          </div>
          <div className="space-y-4">
            {[
              { label: "Top PTN (UI/ITB/UGM)", target: 750 }, 
              { label: "PTN Menengah", target: 600 }, 
              { label: "PTN Daerah", target: 450 }
            ].map(({ label, target }, i) => {
              const isReached = avg >= target;
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-text">{label}</span>
                    <span className={`text-[11px] font-extrabold ${isReached ? 'text-success' : 'text-muted'}`}>
                      {isReached ? "Tercapai!" : `Jarak: ${target - avg}`}
                    </span>
                  </div>
                  <ProgressBar 
                    value={Math.min(avg, target)} 
                    max={target} 
                    indicatorClassName={isReached ? 'bg-success' : 'bg-primary'} 
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="pt-2">
        {!aiAnalysis && !loading ? (
          <button 
            onClick={getAnalysis} 
            className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-surface-hover border-2 border-border rounded-xl px-5 py-4 text-text cursor-pointer transition-colors group"
          >
            <Sparkles size={18} className="text-muted group-hover:text-text transition-colors" />
            <span className="font-extrabold text-[13px]">Analisis Performa dengan AI</span>
          </button>
        ) : (
          <Card className="border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-text mb-4 pb-4 border-b-2 border-border">
              <Sparkles size={14} /> AI Performance Review
            </div>
            <AIResponse text={aiAnalysis} loading={loading} />
          </Card>
        )}
      </div>
    </div>
  );
}
