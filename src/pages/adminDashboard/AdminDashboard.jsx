import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Users, Database, FilePlus, TrendingUp, Search, Edit, Trash2, ShieldBan, MoreVertical, Filter, Download, Activity, CheckCircle2, ChevronDown, X, AlertTriangle } from 'lucide-react';
import { api } from '../../utils/apiClient';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm p-6 border-2 border-danger/50">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-full bg-danger/20 text-danger shrink-0 mt-1">
             <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black mb-1">{title}</h3>
            <p className="text-[13px] text-muted leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border-2 border-border text-text font-bold text-[13px] hover:bg-surface-hover transition-colors cursor-pointer bg-transparent">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg border-2 border-danger bg-danger text-white font-bold text-[13px] hover:bg-danger/90 transition-colors cursor-pointer">Hapus Permanen</button>
        </div>
      </Card>
    </div>
  );
};

const CustomSelect = ({ value, options, onChange, name, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface border-2 border-border rounded-lg px-4 py-2.5 text-[13px] font-bold text-text outline-none focus:border-primary cursor-pointer flex justify-between items-center hover:border-primary/50 transition-colors"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface border-2 border-border rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {options.map((opt) => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-3 text-[13px] cursor-pointer hover:bg-surface-hover transition-colors ${value === opt ? 'bg-primary/10 text-primary font-bold' : 'text-text font-medium'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSoal: 0,
    totalSessions: 0,
    materiBaru: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        setStats(res);
      } catch (err) {
        console.error("Gagal mengambil statistik admin:", err);
      }
    };
    fetchStats();
  }, []);

  const recentActivities = [
    { id: 1, user: "Budi Santoso", action: "Menyelesaikan Tryout PU", time: "10 menit yang lalu", status: "success" },
    { id: 2, user: "Siti Aminah", action: "Mendaftar akun baru", time: "32 menit yang lalu", status: "info" },
    { id: 3, user: "Andi Saputra", action: "Menyelesaikan Tryout PBM", time: "1 jam yang lalu", status: "success" },
    { id: 4, user: "Sistem", action: "Backup database harian", time: "2 jam yang lalu", status: "warning" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Beranda Admin</h1>
          <p className="text-muted text-sm mt-1">Ringkasan aktivitas dan metrik platform UTBK Pro.</p>
        </div>
        <button className="flex items-center gap-2 bg-surface text-text border-2 border-border font-bold px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer text-sm">
          <Download size={16} /> Unduh Laporan
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Pengguna", value: stats.totalUsers, icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
          { title: "Soal Tersedia", value: stats.totalSoal, icon: Database, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
          { title: "Sesi Tryout", value: stats.totalSessions, icon: TrendingUp, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
          { title: "Materi Baru", value: stats.materiBaru, icon: FilePlus, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" }
        ].map((stat, i) => (
          <Card key={i} className={`p-4 flex items-center gap-4 border-2 ${stat.border}`}>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{stat.title}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aktivitas Terkini */}
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Activity size={20} className="text-primary"/> Aktivitas Terkini</h3>
            <button className="text-primary text-xs font-bold hover:underline cursor-pointer bg-transparent border-none">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors border-l-4 border-transparent hover:border-primary">
                <div className={`mt-1 p-1.5 rounded-full ${act.status === 'success' ? 'bg-success/20 text-success' : act.status === 'warning' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                  {act.status === 'success' ? <CheckCircle2 size={14} /> : <Activity size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold">{act.user} <span className="font-normal text-muted">— {act.action}</span></p>
                  <p className="text-[11px] text-muted mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Aksi Cepat</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-hover border-2 border-border hover:border-primary transition-colors cursor-pointer text-left">
              <div className="flex items-center gap-3">
                <FilePlus size={18} className="text-primary" />
                <span className="text-sm font-bold">Buat Soal Baru</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-hover border-2 border-border hover:border-primary transition-colors cursor-pointer text-left">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-success" />
                <span className="text-sm font-bold">Undang Admin</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-hover border-2 border-border hover:border-primary transition-colors cursor-pointer text-left">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-warning" />
                <span className="text-sm font-bold">Backup Data</span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
