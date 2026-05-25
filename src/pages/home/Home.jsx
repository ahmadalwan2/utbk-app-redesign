import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { getApiKey } from '../../utils/storage';
import { Medal, ListChecks, Zap, AlertCircle, BookText, ClipboardEdit, LineChart, BotMessageSquare, Loader2 } from 'lucide-react';
import { api } from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getRiwayatLatihan();
        setRiwayat((res.data || []).filter(r => r.skor !== null));
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const scores = riwayat.map(r => r.skor);
  const hasScore = scores.length > 0;
  const avgScore = hasScore ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const hasApiKey = !!getApiKey();

  const cards = [
    { id: "materi", title: "Materi Belajar", desc: "Pelajari konsep & teori UTBK", icon: BookText, path: "/materi" },
    { id: "tryout", title: "Simulasi Tryout", desc: "Latihan soal CBT", icon: ClipboardEdit, path: "/tryout" },
    { id: "skor", title: "Skor & Analisis", desc: "Pantau perkembanganmu", icon: LineChart, path: "/skor" },
    { id: "konsultasi", title: "AI Konsultasi", desc: "Tanya AI 24/7", icon: BotMessageSquare, path: "/konsultasi" },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1.5">Welcome back.</h1>
        <p className="text-muted text-[13px]">Track your progress and prepare for SNBT 2025.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-muted">Skor Rata-rata</h3>
            <Medal size={14} className="text-accent" />
          </div>
          <div>
            <div className="text-2xl font-black">{hasScore ? avgScore : '--'}</div>
            <p className="text-[11px] font-medium text-muted mt-1">/ 1000 points</p>
          </div>
        </Card>
        
        <Card className="flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-muted">Tryout Selesai</h3>
            <ListChecks size={14} className="text-success" />
          </div>
          <div>
            <div className="text-2xl font-black">{scores.length}</div>
            <p className="text-[11px] font-medium text-muted mt-1">Sesi Tryout</p>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-muted">Kesiapan PTN</h3>
            <Zap size={14} className="text-warning" />
          </div>
          <div>
            <div className="text-2xl font-black">{hasScore ? Math.min(100, Math.round((avgScore/750)*100)) : 0}%</div>
            <p className="text-[11px] font-medium text-muted mt-1">Target 750</p>
          </div>
        </Card>
      </div>

      <div className="pt-2">
        <h2 className="text-base font-extrabold mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <button 
                key={c.id} 
                onClick={() => navigate(c.path)}
                className="group flex flex-col text-left bg-surface border-2 border-border rounded-xl p-4 hover:border-muted transition-all cursor-pointer"
              >
                <div className="bg-surface-hover w-8 h-8 rounded-lg flex items-center justify-center mb-3 group-hover:-translate-y-0.5 transition-transform border-2 border-border">
                  <Icon size={16} className="text-text" />
                </div>
                <h3 className="text-[13px] font-extrabold mb-1">{c.title}</h3>
                <p className="text-[11px] font-medium text-muted leading-relaxed">{c.desc}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
