'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TIERS = [
  { value: 'REGULAR', label: 'Regular', color: 'bg-neutral-800 text-neutral-400', icon: '👤', desc: 'Pelanggan umum tanpa benefit khusus.' },
  { value: 'MEMBER', label: 'Member', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: '⭐', desc: 'Pelanggan terdaftar dengan diskon khusus.' },
  { value: 'VIP', label: 'VIP', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: '👑', desc: 'Pelanggan prioritas dengan benefit eksklusif.' },
];

export default function MembershipPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/customers`)
      .then(r => r.json())
      .then(j => setCustomers(j.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (id, membership) => {
    setUpdating(id);
    try {
      const cust = customers.find(c => c.id === id);
      await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cust, membership })
      });
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, membership } : c));
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  const grouped = TIERS.map(tier => ({
    ...tier,
    members: customers.filter(c => c.membership === tier.value)
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Manajemen Membership</h1>
        <p className="text-neutral-500 text-sm mt-1">Kelola tingkat keanggotaan dan upgrade status pelanggan.</p>
      </div>

      {/* Tier Summary */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {grouped.map(tier => (
          <div key={tier.value} className="p-5 rounded-2xl border border-white/5 bg-neutral-900/40">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{tier.icon}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tier.color}`}>{tier.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{tier.members.length}</p>
            <p className="text-xs text-neutral-600 mt-1">{tier.desc}</p>
          </div>
        ))}
      </div>

      {/* Customer Table with Membership Control */}
      <div className="rounded-2xl border border-white/5 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5 text-xs uppercase font-semibold text-neutral-600">
            <tr>
              <th className="px-5 py-3.5 text-left">Pelanggan</th>
              <th className="px-5 py-3.5 text-left">Kontak</th>
              <th className="px-5 py-3.5 text-left">Bergabung</th>
              <th className="px-5 py-3.5 text-left">Status Saat Ini</th>
              <th className="px-5 py-3.5 text-right">Ubah Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-600">Belum ada pelanggan.</td></tr>
            ) : customers.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3.5 font-medium text-white">{c.name}</td>
                <td className="px-5 py-3.5 text-neutral-500">
                  <div>{c.phone || '-'}</div>
                  <div className="text-xs">{c.email || ''}</div>
                </td>
                <td className="px-5 py-3.5 text-neutral-600 text-xs">{new Date(c.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    c.membership === 'VIP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    c.membership === 'MEMBER' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-neutral-800 text-neutral-500'
                  }`}>{c.membership}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {TIERS.filter(t => t.value !== c.membership).map(t => (
                      <button key={t.value} onClick={() => handleUpgrade(c.id, t.value)}
                        disabled={updating === c.id}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 text-neutral-500 hover:text-white hover:border-white/30 transition-all disabled:opacity-50">
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
