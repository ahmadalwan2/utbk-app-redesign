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

export function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getAdminUsers();
        setUsers(res);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Aktif' ? 'Suspend' : 'Aktif' } : u));
  };

  const deleteUser = (id) => {
    setConfirmDelete(id);
  };

  const executeDelete = () => {
    setUsers(users.filter(u => u.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "Semua Status" || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted text-sm mt-1">Kelola data siswa dan status akun mereka.</p>
        </div>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b-2 border-border flex justify-between items-center bg-surface rounded-t-xl z-10 relative">
          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari email atau nama..." 
              className="w-full pl-10 pr-4 py-2 bg-surface-hover border-2 border-border rounded-lg text-[13px] outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <CustomSelect 
              value={filterStatus}
              onChange={setFilterStatus}
              options={["Semua Status", "Aktif", "Suspend"]}
              className="w-[160px]"
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-b-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted font-bold border-b-2 border-border">
                <th className="p-4">ID</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted"><Loader2 size={24} className="animate-spin mx-auto" /></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted">Tidak ada pengguna yang cocok dengan pencarian.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="border-b-2 border-border/50 hover:bg-surface-hover/30 transition-colors">
                  <td className="p-4 text-[13px] font-mono text-muted">{user.id}</td>
                  <td className="p-4 text-[13px] font-bold">{user.name}</td>
                  <td className="p-4 text-[13px]">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${user.status === 'Aktif' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-[13px] text-muted">{user.joined}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button className="p-1.5 text-muted hover:text-primary bg-transparent border-none cursor-pointer" title="Edit Data"><Edit size={16} /></button>
                    {user.status === 'Aktif' ? (
                       <button onClick={() => toggleStatus(user.id)} className="p-1.5 text-muted hover:text-warning bg-transparent border-none cursor-pointer" title="Suspend"><ShieldBan size={16} /></button>
                    ) : (
                       <button onClick={() => toggleStatus(user.id)} className="p-1.5 text-muted hover:text-success bg-transparent border-none cursor-pointer" title="Aktifkan"><CheckCircle2 size={16} /></button>
                    )}
                    <button onClick={() => deleteUser(user.id)} className="p-1.5 text-muted hover:text-danger bg-transparent border-none cursor-pointer" title="Hapus"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal 
        isOpen={!!confirmDelete} 
        title="Hapus Pengguna"
        message="Apakah kamu yakin ingin menghapus akun siswa ini secara permanen? Data tryout dan statistik mereka juga akan hilang dan tidak dapat dikembalikan."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
