'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ROLE_LABELS = {
  1: { label: 'ADMIN', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  2: { label: 'KASIR', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleId: 2 });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error('Gagal mengambil data pengguna.');
      const json = await res.json();
      setUsers(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus pengguna.');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, roleId: parseInt(formData.roleId, 10) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menambahkan pengguna.');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', roleId: 2 });
      fetchUsers();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Pengguna</h1>
          <p className="text-neutral-400 mt-1 text-sm">Kelola akun kasir dan administrator sistem.</p>
        </div>
        <button
          id="btn-add-user"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>+</span> Tambah Pengguna
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          id="input-search-user"
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-neutral-900 bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-900">
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nama</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Bergabung</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-900/50">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 text-sm">
                    {search ? 'Tidak ada pengguna yang cocok.' : 'Belum ada pengguna.'}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const roleInfo = ROLE_LABELS[user.roleId] || { label: 'UNKNOWN', color: 'bg-neutral-700 text-neutral-300' };
                  return (
                    <tr key={user.id} className="border-b border-neutral-900/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Tambah Pengguna Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Contoh: Budi Santoso' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'budi@cashmate.com' },
                { id: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 karakter' },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={`modal-${field.id}`} className="block text-xs font-medium text-neutral-400 mb-1.5">{field.label}</label>
                  <input
                    id={`modal-${field.id}`}
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    value={formData[field.id]}
                    onChange={e => setFormData(f => ({ ...f, [field.id]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="modal-role" className="block text-xs font-medium text-neutral-400 mb-1.5">Role</label>
                <select
                  id="modal-role"
                  value={formData.roleId}
                  onChange={e => setFormData(f => ({ ...f, roleId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value={1}>ADMIN</option>
                  <option value={2}>KASIR</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-400 hover:text-white transition-all">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-neutral-950 font-semibold text-sm transition-all">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
