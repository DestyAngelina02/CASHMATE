const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Ambil token dari localStorage
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper fetch dengan autentikasi otomatis
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    // Token expired — redirect ke login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request gagal: ${res.status}`);
  }

  return res.json();
}

// Alias untuk backward compatibility
export const fetcher = apiFetch;
export { API_URL };
