const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Database, FilePlus, Search, Edit, Trash2, ChevronDown, X, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../utils/apiClient';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
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
          <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-lg border-2 border-border text-text font-bold text-[13px] hover:bg-surface-hover transition-colors cursor-pointer bg-transparent disabled:opacity-50">Batal</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-lg border-2 border-danger bg-danger text-white font-bold text-[13px] hover:bg-danger/90 transition-colors cursor-pointer disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin inline" /> : "Hapus Permanen"}
          </button>
        </div>
      </Card>
    </div>
  );
};

const CustomSelect = ({ value, options, onChange, name, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={\`relative \${className}\`}>
      {name && <input type="hidden" name={name} value={value} />}
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-surface border-2 border-border rounded-lg px-4 py-2.5 text-[13px] font-bold text-text outline-none focus:border-primary cursor-pointer flex justify-between items-center hover:border-primary/50 transition-colors">
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className={\`text-muted transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface border-2 border-border rounded-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={\`px-4 py-3 text-[13px] cursor-pointer hover:bg-surface-hover transition-colors \${value === opt ? 'bg-primary/10 text-primary font-bold' : 'text-text font-medium'}\`}>
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function ManageSoal() {
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMateri, setFilterMateri] = useState("Semua Materi");
  
  const [showModal, setShowModal] = useState(false);
  const [editingSoal, setEditingSoal] = useState(null);
  
  const [form, setForm] = useState({
    pertanyaan: "", opsiA: "", opsiB: "", opsiC: "", opsiD: "", opsiE: "", jawaban: "A", pembahasan: "", mapel: "TPS", tingkat: "mudah"
  });
  
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSoal = async () => {
    setLoading(true);
    try {
      const res = await api.getSoal(filterMateri !== "Semua Materi" ? filterMateri : null);
      setSoalList(res.data || []);
    } catch (err) {
      alert("Gagal mengambil data soal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSoal(); }, [filterMateri]);

  const deleteSoal = (id) => setConfirmDelete(id);

  const executeDelete = async () => {
    setActionLoading(true);
    try {
      await api.deleteSoal(confirmDelete);
      setSoalList(soalList.filter(s => s.id !== confirmDelete));
      setConfirmDelete(null);
    } catch(err) {
      alert("Gagal menghapus soal: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (soal) => {
    setEditingSoal(soal);
    setForm({
      pertanyaan: soal.pertanyaan,
      opsiA: soal.opsi.A, opsiB: soal.opsi.B, opsiC: soal.opsi.C, opsiD: soal.opsi.D, opsiE: soal.opsi.E,
      jawaban: "A", // Jawaban asli tidak dikirim backend, admin harus re-select
      pembahasan: soal.pembahasan,
      mapel: soal.mapel,
      tingkat: soal.tingkat
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSoal(null);
    setForm({ pertanyaan: "", opsiA: "", opsiB: "", opsiC: "", opsiD: "", opsiE: "", jawaban: "A", pembahasan: "", mapel: "TPS", tingkat: "mudah" });
    setShowModal(true);
  };

  const saveSoal = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      pertanyaan: form.pertanyaan,
      opsi: { A: form.opsiA, B: form.opsiB, C: form.opsiC, D: form.opsiD, E: form.opsiE },
      jawaban: form.jawaban,
      pembahasan: form.pembahasan,
      mapel: form.mapel,
      tingkat: form.tingkat
    };
    
    try {
      if (editingSoal) {
        // Remove jawaban if updating, wait backend might need it
        await api.updateSoal(editingSoal.id, payload);
      } else {
        await api.createSoal(payload);
      }
      setShowModal(false);
      fetchSoal();
    } catch(err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSoal = soalList.filter(s => s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Bank Soal</h1>
          <p className="text-muted text-sm mt-1">Kelola master data soal-soal SNBT.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary text-primary-fg font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors border-none cursor-pointer flex items-center gap-2 text-sm">
          <FilePlus size={16} /> Tambah Soal
        </button>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b-2 border-border flex justify-between items-center bg-surface rounded-t-xl z-10 relative">
          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari ID atau pertanyaan..." className="w-full pl-10 pr-4 py-2 bg-surface-hover border-2 border-border rounded-lg text-[13px] outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-2">
            <CustomSelect value={filterMateri} onChange={setFilterMateri} options={["Semua Materi", "TPS", "TKA_SAINTEK", "TKA_SOSHUM"]} className="w-[160px]" />
          </div>
        </div>
        <div className="overflow-x-auto rounded-b-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted font-bold border-b-2 border-border">
                <th className="p-4">Pertanyaan</th>
                <th className="p-4">Mapel</th>
                <th className="p-4">Tingkat</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="4" className="p-8 text-center text-muted"><Loader2 size={24} className="animate-spin mx-auto" /></td></tr> : filteredSoal.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-muted">Tidak ada soal.</td></tr> : filteredSoal.map((soal) => (
                <tr key={soal.id} className="border-b-2 border-border/50 hover:bg-surface-hover/30 transition-colors">
                  <td className="p-4 text-[13px] font-medium max-w-xs truncate">{soal.pertanyaan}</td>
                  <td className="p-4 text-[13px] font-bold">{soal.mapel}</td>
                  <td className="p-4"><span className={\`px-2 py-1 rounded-md text-[10px] font-bold \${soal.tingkat === 'sulit' ? 'bg-danger/10 text-danger' : soal.tingkat === 'sedang' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}\`}>{soal.tingkat}</span></td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleEdit(soal)} className="p-1.5 text-muted hover:text-primary bg-transparent border-none cursor-pointer"><Edit size={16} /></button>
                    <button onClick={() => deleteSoal(soal.id)} className="p-1.5 text-muted hover:text-danger bg-transparent border-none cursor-pointer"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <Card className="w-full max-w-2xl p-6 my-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface z-10 py-2 border-b-2 border-border">
              <h2 className="text-xl font-black">{editingSoal ? 'Edit Soal' : 'Tambah Soal Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-text bg-transparent border-none cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={saveSoal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase mb-2">Mapel</label>
                  <CustomSelect value={form.mapel} onChange={v => setForm({...form, mapel: v})} options={["TPS", "TKA_SAINTEK", "TKA_SOSHUM"]} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase mb-2">Tingkat Kesulitan</label>
                  <CustomSelect value={form.tingkat} onChange={v => setForm({...form, tingkat: v})} options={["mudah", "sedang", "sulit"]} />
                </div>
              </div>
              <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Pertanyaan</label><textarea required value={form.pertanyaan} onChange={e => setForm({...form, pertanyaan: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary min-h-[80px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Opsi A</label><input required value={form.opsiA} onChange={e => setForm({...form, opsiA: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" /></div>
                <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Opsi B</label><input required value={form.opsiB} onChange={e => setForm({...form, opsiB: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" /></div>
                <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Opsi C</label><input required value={form.opsiC} onChange={e => setForm({...form, opsiC: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" /></div>
                <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Opsi D</label><input required value={form.opsiD} onChange={e => setForm({...form, opsiD: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" /></div>
                <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Opsi E</label><input required value={form.opsiE} onChange={e => setForm({...form, opsiE: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary" /></div>
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase mb-2">Jawaban Benar</label>
                  <CustomSelect value={form.jawaban} onChange={v => setForm({...form, jawaban: v})} options={["A", "B", "C", "D", "E"]} />
                  {editingSoal && <p className="text-[10px] text-danger mt-1">Isi ulang (API tidak mengembalikan kunci).</p>}
                </div>
              </div>
              <div><label className="block text-[11px] font-bold text-muted uppercase mb-2">Pembahasan</label><textarea required value={form.pembahasan} onChange={e => setForm({...form, pembahasan: e.target.value})} className="w-full bg-surface border-2 border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary min-h-[80px]" /></div>
              <div className="pt-4 flex gap-3 sticky bottom-0 bg-surface py-4 border-t-2 border-border">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border-2 border-border text-text font-bold text-[13px] hover:bg-surface-hover cursor-pointer bg-transparent">Batal</button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-3 rounded-lg border-2 border-primary bg-primary text-primary-fg font-bold text-[13px] hover:bg-primary/90 cursor-pointer disabled:opacity-50">
                  {actionLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Simpan Soal"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmModal isOpen={!!confirmDelete} title="Hapus Master Soal" message="Yakin hapus soal ini?" onConfirm={executeDelete} onCancel={() => setConfirmDelete(null)} loading={actionLoading} />
    </div>
  );
}
`;

fs.writeFileSync('src/pages/manageSoal/ManageSoal.jsx', code);
