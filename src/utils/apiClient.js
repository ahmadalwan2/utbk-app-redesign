const BASE_URL = "https://utbk-backend-production.up.railway.app/api/v1";

// Helper untuk mengambil token dari localStorage
const getToken = () => localStorage.getItem("access_token");

// Helper untuk membuat headers secara dinamis
const getHeaders = (requireAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Error handler yang melempar error agar bisa ditangkap oleh komponen UI
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || data.error_description || data.error || "Terjadi kesalahan pada server";
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }
  return data;
};

export const api = {
  // === AUTH ===
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    
    // MOCK ROLE: Jadikan abu@gmail.com sebagai admin sementara
    if (data.user) {
      data.user.role = email === 'abu@gmail.com' ? 'admin' : 'user';
    }

    // Simpan token otomatis saat login sukses
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
    }
    return data;
  },

  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  logout: async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getHeaders(true),
      });
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      // Selalu hapus token dari lokal meskipun server error
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
    }
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  // === SOAL ===
  getSoal: async (mapel, tingkat) => {
    let url = `${BASE_URL}/soal`;
    const params = new URLSearchParams();
    if (mapel) params.append("mapel", mapel);
    if (tingkat) params.append("tingkat", tingkat);
    
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  
  createSoal: async (data) => {
    const res = await fetch(`${BASE_URL}/soal`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateSoal: async (id, data) => {
    const res = await fetch(`${BASE_URL}/soal/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteSoal: async (id) => {
    const res = await fetch(`${BASE_URL}/soal/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  // === LATIHAN (TRYOUT) ===
  mulaiLatihan: async (mapel, jumlah) => {
    const res = await fetch(`${BASE_URL}/latihan/mulai`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ mapel, jumlah }),
    });
    return handleResponse(res);
  },

  submitLatihan: async (sessionId, jawabans) => {
    // jawabans format: [{ soalId: "uuid", jawaban: "A" }, ...]
    const res = await fetch(`${BASE_URL}/latihan/${sessionId}/submit`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ jawabans }),
    });
    return handleResponse(res);
  },

  getRiwayatLatihan: async () => {
    const res = await fetch(`${BASE_URL}/latihan/riwayat`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  getDetailLatihan: async (sessionId) => {
    const res = await fetch(`${BASE_URL}/latihan/${sessionId}`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  // === ADMIN ===
  getAdminUsers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        method: "GET",
        headers: getHeaders(true),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn("API Admin belum tersedia di backend, menggunakan data fallback.");
      return [
        { id: "U-001", name: "Siti Aminah (Fallback)", email: "siti@gmail.com", status: "Aktif", joined: "12 Mei 2026" },
        { id: "U-002", name: "Budi Santoso (Fallback)", email: "budi@yahoo.com", status: "Aktif", joined: "14 Mei 2026" },
      ];
    }
  },

  getAdminStats: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        method: "GET",
        headers: getHeaders(true),
      });
      return await handleResponse(res);
    } catch (err) {
      return { totalUsers: 1204, totalSoal: 840, totalSessions: 3120, materiBaru: 12 };
    }
  },

  getAdminReports: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/reports`, {
        method: "GET",
        headers: getHeaders(true),
      });
      return await handleResponse(res);
    } catch (err) {
      return [
        { id: "TR-092", user: "Budi Santoso", date: "25 Mei 2026", score: 850, status: "Selesai" },
        { id: "TR-091", user: "Andi Saputra", date: "24 Mei 2026", score: 720, status: "Selesai" }
      ];
    }
  }
};
