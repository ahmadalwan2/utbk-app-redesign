import React, { useState, useEffect } from "react";
import { LayoutGrid, BookText, ClipboardEdit, LineChart, BotMessageSquare, Settings, LogOut, Database, Users, FileBarChart } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Materi } from "./pages/materi/Materi";
import { Tryout } from "./pages/tryout/Tryout";
import { Skor } from "./pages/skor/Skor";
import { Konsultasi } from "./pages/konsultasi/Konsultasi";
import { Pengaturan } from "./pages/pengaturan/Pengaturan";
import { Auth } from "./pages/auth/Auth";
import { api } from "./utils/apiClient";
import { AdminDashboard } from "./pages/adminDashboard/AdminDashboard";
import { ManageUsers } from "./pages/manageUsers/ManageUsers";
import { ManageSoal } from "./pages/manageSoal/ManageSoal";
import { ExamReports } from "./pages/examReports/ExamReports";

function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const [userRole, setUserRole] = useState(() => {
    const data = localStorage.getItem("user_data");
    return data ? JSON.parse(data).role || 'user' : 'user';
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.logout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={() => {
      setIsLoggedIn(true);
      const data = localStorage.getItem("user_data");
      const role = data ? JSON.parse(data).role || 'user' : 'user';
      setUserRole(role);
      navigate(role === 'admin' ? '/admin-home' : '/home');
    }} />;
  }

  const navItems = userRole === 'admin' 
    ? [
        { path: "/admin-home", label: "Beranda Admin", icon: LayoutGrid },
        { path: "/admin-users", label: "Pengguna", icon: Users },
        { path: "/admin-soal", label: "Bank Soal", icon: Database },
        { path: "/admin-reports", label: "Laporan", icon: FileBarChart },
      ]
    : [
        { path: "/home", label: "Beranda", icon: LayoutGrid },
        { path: "/materi", label: "Materi", icon: BookText },
        { path: "/tryout", label: "Tryout", icon: ClipboardEdit },
        { path: "/skor", label: "Statistik", icon: LineChart },
        { path: "/konsultasi", label: "Tanya AI", icon: BotMessageSquare },
      ];

  return (
    <div className="flex h-screen bg-bg text-text font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r-2 border-border bg-surface hidden md:flex flex-col">
        <div className="p-6 pb-8">
          <Link 
            to={userRole === 'admin' ? '/admin-home' : '/home'}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none text-text text-left no-underline"
          >
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg border-2 border-border object-cover" />
            <span className="font-bold text-[15px] tracking-tight">SNBT Tracker</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-2 cursor-pointer no-underline ${
                  isActive ? 'bg-surface-hover text-text border-border' : 'border-transparent text-muted hover:bg-surface-hover/50 hover:text-text'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-text' : 'text-muted'} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t-2 border-border space-y-2">
          <Link 
            to="/pengaturan"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-2 cursor-pointer no-underline ${
              location.pathname.startsWith('/pengaturan') ? 'bg-surface-hover text-text border-border' : 'border-transparent text-muted hover:bg-surface-hover/50 hover:text-text'
            }`}
          >
            <Settings size={16} className={location.pathname.startsWith('/pengaturan') ? 'text-text' : 'text-muted'} />
            <span className="text-[13px] font-medium">Pengaturan</span>
          </Link>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-danger border-2 border-transparent hover:border-danger/30 hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span className="text-[13px] font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-16 md:pb-0">
        <div className="md:hidden p-4 border-b-2 border-border flex justify-between items-center bg-surface sticky top-0 z-40">
          <Link 
            to={userRole === 'admin' ? '/admin-home' : '/home'}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none text-text text-left no-underline"
          >
            <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded border-2 border-border object-cover" />
            <span className="font-bold text-sm">SNBT Tracker</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pengaturan" className="text-muted hover:text-text cursor-pointer no-underline">
              <Settings size={18} />
            </Link>
            <button onClick={() => setShowLogoutConfirm(true)} className="text-danger hover:text-danger/80 cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <Routes>
            {userRole === 'admin' ? (
              <>
                <Route path="/admin-home" element={<AdminDashboard />} />
                <Route path="/admin-users" element={<ManageUsers />} />
                <Route path="/admin-soal" element={<ManageSoal />} />
                <Route path="/admin-reports" element={<ExamReports />} />
                <Route path="/pengaturan" element={<Pengaturan />} />
                <Route path="*" element={<Navigate to="/admin-home" replace />} />
              </>
            ) : (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/materi" element={<Materi />} />
                <Route path="/tryout" element={<Tryout />} />
                <Route path="/skor" element={<Skor />} />
                <Route path="/konsultasi" element={<Konsultasi />} />
                <Route path="/pengaturan" element={<Pengaturan />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            )}
          </Routes>
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t-2 border-border flex justify-around p-2 z-50">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors border-2 cursor-pointer no-underline ${
                isActive ? 'text-text border-border bg-surface-hover' : 'text-muted border-transparent'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
          <div 
            className="bg-surface border-2 border-border rounded-xl p-6 w-full max-w-[320px] flex flex-col items-center text-center animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <LogOut size={24} />
            </div>
            <h3 className="m-0 text-text text-lg font-black mb-2">Konfirmasi Keluar</h3>
            <p className="text-muted text-[13px] mb-6 font-medium">Apakah kamu yakin ingin keluar dari aplikasi?</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-transparent border-2 border-border text-text font-bold text-[13px] hover:bg-surface-hover transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="flex-1 py-2.5 rounded-lg border-2 border-danger bg-danger text-white font-bold text-[13px] hover:bg-danger/90 transition-colors cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
