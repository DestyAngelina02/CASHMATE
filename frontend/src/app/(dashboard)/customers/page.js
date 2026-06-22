'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', membership: 'REGULAR' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/customers`);
      const json = await res.json();
      setCustomers(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `${API_URL}/customers/${editId}` : `${API_URL}/customers`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (cust) => {
    setEditId(cust.id);
    setFormData({ name: cust.name, phone: cust.phone || '', email: cust.email || '', membership: cust.membership });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pelanggan ini?')) return;
    try {
      const res = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Pelanggan</h1>
          <p className="text-neutral-400 mt-1 text-sm">Kelola daftar pelanggan dan status keanggotaan.</p>
        </div>
        <button
          onClick={() => { setEditId(null); setFormData({ name: '', phone: '', email: '', membership: 'REGULAR' }); setShowModal(true); }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded-lg transition-all"
        >
          + Tambah Pelanggan
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-900 bg-neutral-900/50 overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-900/80 text-xs uppercase font-semibold text-neutral-500 border-b border-neutral-900">
            <tr>
              <th className="px-6 py-4">Nama Pelanggan</th>
              <th className="px-6 py-4">Kontak</th>
              <th className="px-6 py-4">Keanggotaan</th>
              <th className="px-6 py-4">Bergabung</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/50">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center">Memuat...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-neutral-500">Belum ada pelanggan.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-300">{c.phone || '-'}</div>
                    <div className="text-xs text-neutral-500">{c.email || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      c.membership === 'VIP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      c.membership === 'MEMBER' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {c.membership}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(c)} className="text-teal-500 hover:text-teal-400">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-rose-500 hover:text-rose-400">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">{editId ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Nomor HP</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Tipe Keanggotaan</label>
                <select value={formData.membership} onChange={e => setFormData({...formData, membership: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                  <option value="REGULAR">Regular</option>
                  <option value="MEMBER">Member</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-lg shadow-lg shadow-emerald-500/20">{editId ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
