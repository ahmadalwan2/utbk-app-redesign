import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Users, Database, FilePlus, TrendingUp, Search, Edit, Trash2, ShieldBan, MoreVertical, Filter, Download, Activity, CheckCircle2, ChevronDown, X, AlertTriangle, Loader2 } from 'lucide-react';
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

export function ExamReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.getAdminReports();
        setReports(res);
      } catch (err) {
        console.error("Gagal mengambil laporan admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Laporan Ujian</h1>
          <p className="text-muted text-sm mt-1">Pantau hasil Tryout dan nilai semua siswa.</p>
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted font-bold border-b-2 border-border">
                <th className="p-4">Sesi Tryout</th>
                <th className="p-4">Nama Siswa</th>
                <th className="p-4">Tanggal Pelaksanaan</th>
                <th className="p-4">Skor Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted"><Loader2 size={24} className="animate-spin mx-auto" /></td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted">Belum ada laporan ujian.</td></tr>
              ) : reports.map((report) => (
                <tr key={report.id} className="border-b-2 border-border/50 hover:bg-surface-hover/30 transition-colors">
                  <td className="p-4 text-[13px] font-mono text-muted">{report.id}</td>
                  <td className="p-4 text-[13px] font-bold">{report.user}</td>
                  <td className="p-4 text-[13px] text-muted">{new Date(report.tanggal || report.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                  <td className="p-4 text-[15px] font-black text-primary">{report.skor || report.score || '-'}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${(report.status || 'Selesai') === 'Selesai' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                      {report.status || 'Selesai'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedReport(report)} className="p-1.5 text-muted hover:text-primary bg-transparent border-none cursor-pointer"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Detail Laporan */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 border-2 border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Detail Laporan</h2>
              <button onClick={() => setSelectedReport(null)} className="text-muted hover:text-text bg-transparent border-none cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b-2 border-border/50 pb-3">
                <span className="text-muted text-[13px] font-bold uppercase">Sesi Tryout</span>
                <span className="text-text font-mono text-[13px]">{selectedReport.id}</span>
              </div>
              <div className="flex justify-between border-b-2 border-border/50 pb-3">
                <span className="text-muted text-[13px] font-bold uppercase">Nama Siswa</span>
                <span className="text-text font-bold text-[13px]">{selectedReport.user}</span>
              </div>
              <div className="flex justify-between border-b-2 border-border/50 pb-3">
                <span className="text-muted text-[13px] font-bold uppercase">Tanggal</span>
                <span className="text-text text-[13px]">{selectedReport.date}</span>
              </div>
              <div className="flex justify-between border-b-2 border-border/50 pb-3">
                <span className="text-muted text-[13px] font-bold uppercase">Status</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${selectedReport.status === 'Selesai' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                  {selectedReport.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted text-[13px] font-bold uppercase">Skor Total</span>
                <span className="text-primary font-black text-2xl">{selectedReport.score}</span>
              </div>
            </div>

            <button onClick={() => setSelectedReport(null)} className="w-full py-2.5 rounded-lg border-2 border-primary bg-primary text-primary-fg font-bold text-[13px] hover:bg-primary/90 transition-colors cursor-pointer">
              Tutup
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
