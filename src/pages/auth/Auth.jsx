import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { api } from '../../utils/apiClient';
import { twMerge } from 'tailwind-merge';
import { GraduationCap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getFriendlyErrorMessage = (rawMessage) => {
    const msg = rawMessage?.toLowerCase() || '';
    if (msg.includes('invalid login credentials')) {
      return 'Email belum terdaftar atau password salah.';
    }
    if (msg.includes('user already registered')) {
      return 'Email ini sudah terdaftar. Kamu bisa langsung masuk menggunakan email tersebut.';
    }
    if (msg.includes('network') || msg.includes('failed to fetch')) {
      return 'Ups! Gagal terhubung ke server. Pastikan koneksi internetmu stabil, ya.';
    }
    return rawMessage; // Fallback ke pesan asli
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validasi Manual
    if (!isLogin && !formData.name.trim()) {
      setError("Nama lengkap tidak boleh kosong.");
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError("Email tidak boleh kosong.");
      setLoading(false);
      return;
    }
    if (!formData.email.includes('@')) {
      setError(`Mohon sertakan '@' pada alamat email. '${formData.email}' tidak memiliki '@'.`);
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid. Pastikan penulisan email sudah benar.");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError("Password tidak boleh kosong.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await api.login(formData.email, formData.password);
        onLoginSuccess();
      } else {
        const res = await api.register(formData.name, formData.email, formData.password);
        setSuccess("Pendaftaran berhasil! Silakan cek kotak masuk emailmu untuk verifikasi.");
        setTimeout(() => setIsLogin(true), 3000);
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl border-2 border-border bg-surface flex items-center justify-center mb-4 overflow-hidden relative">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.style.display='none'; }} />
            {!document.querySelector('img[src="/logo.png"]')?.complete && (
               <GraduationCap size={32} className="text-primary absolute" />
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight">UTBK Pro</h1>
          <p className="text-muted text-[13px] font-bold mt-1 tracking-widest uppercase">
            Platform Latihan SNBT
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-black mb-6 text-center">
            {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h2>

          {error && (
            <div className="mb-6 p-3 rounded-lg border-2 border-danger/50 bg-danger/10 flex gap-3 text-danger text-[13px] items-start">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-lg border-2 border-success/50 bg-success/10 flex gap-3 text-success text-[13px] items-start">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-extrabold text-muted uppercase tracking-widest mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface border-2 border-border rounded-lg px-4 py-3 text-[14px] font-medium text-text placeholder:text-muted/30 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ahmad Fauzi"
                />
              </div>
            )}
            
            <div>
              <label className="block text-[11px] font-extrabold text-muted uppercase tracking-widest mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface border-2 border-border rounded-lg px-4 py-3 text-[14px] font-medium text-text placeholder:text-muted/30 focus:outline-none focus:border-primary transition-colors"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-muted uppercase tracking-widest mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-surface border-2 border-border rounded-lg px-4 py-3 text-[14px] font-medium text-text placeholder:text-muted/30 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-primary text-primary-fg border-2 border-primary rounded-lg px-4 py-3 text-[14px] font-bold cursor-pointer hover:bg-primary/90 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Memproses...</>
              ) : (
                isLogin ? "Masuk ke Beranda" : "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] font-medium text-muted border-t-2 border-border pt-6">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-primary font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              {isLogin ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
