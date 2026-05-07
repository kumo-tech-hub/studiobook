import { useState, useEffect, useCallback } from 'react'
import '@/styles/reports.css'
import api from '@/services/api'
import { Skel } from '@/components/ui/Skeleton'

const formatRp = (num) => 'Rp ' + Number(num).toLocaleString('id-ID')

// Skeleton untuk stats card laporan
function ReportStatSkeleton({ cols = 4 }) {
  return (
    <div className="reports-stats-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {[...Array(cols)].map((_, i) => (
        <div key={i} className="report-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skel w="55%" h={12} />
          <Skel w="70%" h={28} />
          <Skel w="40%" h={11} />
        </div>
      ))}
    </div>
  )
}

// Skeleton untuk tabel laporan
function TableSkeleton({ rows = 6, cols = 4 }) {
  return (
    <tbody>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          {[...Array(cols)].map((_, j) => (
            <td key={j} style={{ padding: '14px 12px' }}>
              <Skel w={j === cols - 1 ? 70 : j === 1 ? 130 : 90} h={14} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

const statusStyle = (status) => {
  if (status === 'Lunas') return { bg: 'rgba(34,197,94,0.15)', color: '#15803d' }
  if (status === 'Pending') return { bg: 'rgba(245,158,11,0.15)', color: '#b45309' }
  return { bg: 'rgba(239,68,68,0.15)', color: '#b91c1c' }
}

const EXPENSE_CATEGORIES = ['Sewa', 'Listrik', 'Bahan', 'Peralatan', 'Pemasaran', 'Lainnya']

export default function Reports() {
  const [activeTab, setActiveTab] = useState('pemasukan')
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  // ─── Expense state ──────────────────────────────────────
  const [expenses, setExpenses] = useState([])
  const [expLoading, setExpLoading] = useState(false)
  const [totalExpense, setTotalExpense] = useState(0)
  const [byCategory, setByCategory] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [expForm, setExpForm] = useState({ expense_date: '', category: 'Sewa', description: '', amount: '' })
  const [expSaving, setExpSaving] = useState(false)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/reports', {
        params: { start_date: startDate, end_date: endDate }
      })
      setData(res.data)
    } catch (err) {
      console.error('Gagal memuat laporan:', err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  const fetchExpenses = useCallback(async () => {
    setExpLoading(true)
    try {
      const res = await api.get('/admin/expenses', {
        params: { start_date: startDate, end_date: endDate }
      })
      setExpenses(res.data.expenses)
      setTotalExpense(res.data.total_expense)
      setByCategory(res.data.by_category)
    } catch (err) {
      console.error('Gagal memuat pengeluaran:', err)
    } finally {
      setExpLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => { fetchReport() }, [fetchReport])
  useEffect(() => { if (activeTab === 'pengeluaran') fetchExpenses() }, [activeTab, fetchExpenses])

  const handleSaveExpense = async () => {
    if (!expForm.expense_date || !expForm.description || !expForm.amount) {
      alert('Semua field wajib diisi.')
      return
    }
    setExpSaving(true)
    try {
      const res = await api.post('/admin/expenses', { ...expForm, amount: Number(expForm.amount) })
      setExpenses(prev => [res.data, ...prev])
      setTotalExpense(prev => prev + res.data.amount)
      setShowModal(false)
      setExpForm({ expense_date: '', category: 'Sewa', description: '', amount: '' })
      fetchExpenses() // refresh by_category juga
    } catch (err) {
      alert('Gagal menyimpan pengeluaran.')
    } finally {
      setExpSaving(false)
    }
  }

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Hapus pengeluaran ini?')) return
    try {
      await api.delete(`/admin/expenses/${id}`)
      setExpenses(prev => prev.filter(e => e.id !== id))
      fetchExpenses()
    } catch { alert('Gagal menghapus.') }
  }

  const trend = (val) => {
    if (val === 0) return null
    return (
      <span className={`stat-trend ${val >= 0 ? 'trend-up' : 'trend-down'}`}>
        {val >= 0 ? '↑' : '↓'} {Math.abs(val)}%
      </span>
    )
  }

  const handleExport = async () => {
    try {
      // Gunakan api.get agar token auth ikut terkirim
      const res = await api.get('/admin/reports/export', {
        params: { start_date: startDate, end_date: endDate },
        responseType: 'blob' // Penting: beri tahu axios kita mengharapkan file binary
      });

      // Buat URL sementara dari blob data
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;

      // Beri nama file
      const filename = `Laporan_${startDate}_to_${endDate}.xlsx`;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();

      // Bersihkan memory
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export gagal:', err);
      alert('Gagal mengekspor laporan. Silakan coba lagi.');
    }
  };

  return (
    <div className="reports-page">
      {/* ─── TAB NAVIGATION ─────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, borderBottom: '1px solid var(--white-06)', paddingBottom: 16 }}>
        {['pemasukan', 'booking', 'pengeluaran'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-pill)',
              background: activeTab === tab ? 'var(--text)' : 'transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-60)',
              border: 'none', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {tab === 'pemasukan' ? 'Pemasukan' : tab === 'booking' ? 'Pemesanan / Booking' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      {/* ─── FILTER BAR ──────────────────────────────────────── */}
      <div className="reports-filter-bar">
        <div className="filter-controls">
          <span className="stat-label">Periode Laporan</span>
          <input type="date" className="report-date-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span style={{ opacity: 0.3 }}>→</span>
          <input type="date" className="report-date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button className="export-btn" onClick={handleExport}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Excel
        </button>
      </div>

      {/* ─── TAB: PEMASUKAN ──────────────────────────────────── */}
      {activeTab === 'pemasukan' && (
        <>
          {loading ? <ReportStatSkeleton /> : (
            <div className="reports-stats-grid">
              <div className="report-stat-card">
                <span className="stat-label">Total Pemasukan</span>
                <div className="stat-main">
                  <span className="stat-number">{formatRp(data?.pemasukan?.stats?.total_revenue ?? 0)}</span>
                  {trend(data?.pemasukan?.stats?.revenue_trend)}
                </div>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Total Booking Lunas</span>
                <div className="stat-main">
                  <span className="stat-number">{data?.pemasukan?.stats?.total_count ?? 0}</span>
                  {trend(data?.pemasukan?.stats?.count_trend)}
                </div>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Avg. Nilai Booking</span>
                <div className="stat-main">
                  <span className="stat-number">{formatRp(data?.pemasukan?.stats?.avg_value ?? 0)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="reports-main-layout">
            <div className="report-panel">
              <div className="panel-header"><h2 className="panel-title">Rincian Pemasukan</h2></div>
              <table className="report-table">
                <thead>
                  <tr><th>Tanggal</th><th>Pelanggan</th><th>Paket</th><th style={{ textAlign: 'right' }}>Jumlah</th></tr>
                </thead>
                {loading ? <TableSkeleton rows={6} cols={4} /> : (
                  <tbody>
                    {data?.pemasukan?.financials?.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-45)' }}>Tidak ada data pada periode ini.</td></tr>
                    ) : data?.pemasukan?.financials?.map((row) => (
                      <tr key={row.id}>
                        <td style={{ color: 'var(--text-45)' }}>{row.date}</td>
                        <td style={{ fontWeight: 600 }}>{row.customer}</td>
                        <td>{row.type}</td>
                        <td style={{ textAlign: 'right' }} className="amt-plus">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            <div className="report-panel">
              <div className="panel-header"><h2 className="panel-title" style={{ fontSize: '18px' }}>Paket Terpopuler</h2></div>
              <div className="top-list">
                {loading
                  ? [...Array(4)].map((_, i) => (
                    <div key={i} className="top-item">
                      <Skel w={120} h={14} />
                      <Skel w={80} h={14} />
                    </div>
                  ))
                  : data?.pemasukan?.popular_packages?.map((pkg) => (
                    <div key={pkg.name} className="top-item">
                      <div className="item-info">
                        <span className="item-name">{pkg.name}</span>
                        <span className="item-meta">{pkg.count} kali dipesan</span>
                      </div>
                      <span className="item-value">{pkg.revenue}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── TAB: BOOKING ────────────────────────────────────── */}
      {activeTab === 'booking' && (
        <>
          {loading ? <ReportStatSkeleton /> : (
            <div className="reports-stats-grid">
              <div className="report-stat-card">
                <span className="stat-label">Total Booking</span>
                <div className="stat-main"><span className="stat-number">{data?.booking?.stats?.total ?? 0}</span></div>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Selesai</span>
                <div className="stat-main"><span className="stat-number" style={{ color: '#22c55e' }}>{data?.booking?.stats?.done ?? 0}</span></div>
                <span style={{ fontSize: '11px', color: 'var(--text-45)' }}>{data?.booking?.stats?.done_pct ?? 0}% dari total</span>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Pending</span>
                <div className="stat-main"><span className="stat-number" style={{ color: '#f59e0b' }}>{data?.booking?.stats?.pending ?? 0}</span></div>
                <span style={{ fontSize: '11px', color: 'var(--text-45)' }}>{data?.booking?.stats?.pending_pct ?? 0}% dari total</span>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Dibatalkan</span>
                <div className="stat-main"><span className="stat-number" style={{ color: '#ef4444' }}>{data?.booking?.stats?.cancelled ?? 0}</span></div>
                <span style={{ fontSize: '11px', color: 'var(--text-45)' }}>{data?.booking?.stats?.cancel_pct ?? 0}% dari total</span>
              </div>
            </div>
          )}

          <div className="reports-main-layout">
            <div className="report-panel">
              <div className="panel-header"><h2 className="panel-title">Daftar Pemesanan</h2></div>
              <table className="report-table">
                <thead>
                  <tr><th>Tanggal</th><th>Pelanggan</th><th>Paket</th><th>Status</th><th style={{ textAlign: 'right' }}>Jumlah</th></tr>
                </thead>
                {loading ? <TableSkeleton rows={6} cols={5} /> : (
                  <tbody>
                    {data?.booking?.list?.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-45)' }}>Tidak ada data pada periode ini.</td></tr>
                    ) : data?.booking?.list?.map((row) => {
                      const s = statusStyle(row.status)
                      return (
                        <tr key={row.id}>
                          <td style={{ color: 'var(--text-45)' }}>{row.date}</td>
                          <td style={{ fontWeight: 600 }}>{row.customer}</td>
                          <td>{row.type}</td>
                          <td>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
                              {row.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', color: row.status === 'Batal' ? 'var(--text-45)' : '#22c55e', fontWeight: row.status === 'Batal' ? 400 : 600 }}>
                            {row.amount}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                )}
              </table>
            </div>

            <div className="report-panel">
              <div className="panel-header"><h2 className="panel-title" style={{ fontSize: '18px' }}>Booking per Paket</h2></div>
              <div className="top-list">
                {loading
                  ? [...Array(4)].map((_, i) => <div key={i} className="top-item"><Skel w={120} h={14} /><Skel w={50} h={14} /></div>)
                  : data?.booking?.by_package?.map((pkg) => (
                    <div key={pkg.name} className="top-item">
                      <div className="item-info"><span className="item-name">{pkg.name}</span></div>
                      <span className="item-value">{pkg.count} <span style={{ fontSize: 11, color: 'var(--text-45)', fontWeight: 400 }}>booking</span></span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── TAB: PENGELUARAN (dinamis) ──────────────────── */}
      {activeTab === 'pengeluaran' && (
        <>
          {/* Stats */}
          {expLoading ? <ReportStatSkeleton cols={3} /> : (
            <div className="reports-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="report-stat-card">
                <span className="stat-label">Total Pengeluaran</span>
                <div className="stat-main">
                  <span className="stat-number" style={{ color: '#ef4444' }}>{formatRp(totalExpense)}</span>
                </div>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Total Pemasukan</span>
                <div className="stat-main">
                  <span className="stat-number" style={{ color: '#22c55e' }}>
                    {loading ? '...' : formatRp(data?.pemasukan?.stats?.total_revenue ?? 0)}
                  </span>
                </div>
              </div>
              <div className="report-stat-card">
                <span className="stat-label">Laba Bersih</span>
                <div className="stat-main">
                  <span className="stat-number">
                    {loading || expLoading ? '...' : formatRp(Math.max(0, (data?.pemasukan?.stats?.total_revenue ?? 0) - totalExpense))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="reports-main-layout">
            {/* Tabel pengeluaran */}
            <div className="report-panel">
              <div className="panel-header">
                <h2 className="panel-title">Rincian Pengeluaran</h2>
                <button
                  onClick={() => setShowModal(true)}
                  style={{ padding: '8px 16px', background: 'var(--text)', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  + Catat Pengeluaran
                </button>
              </div>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Tanggal</th><th>Kategori</th><th>Keterangan</th>
                    <th style={{ textAlign: 'right' }}>Jumlah</th>
                    <th></th>
                  </tr>
                </thead>
                {expLoading ? <TableSkeleton rows={5} cols={5} /> : (
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-45)', fontStyle: 'italic' }}>
                        Belum ada pengeluaran dicatat pada periode ini.
                      </td></tr>
                    ) : expenses.map((row) => (
                      <tr key={row.id}>
                        <td style={{ color: 'var(--text-45)' }}>{row.date}</td>
                        <td>
                          <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', border: '1px solid var(--white-08)', background: 'var(--primary-mid)' }}>
                            {row.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{row.description}</td>
                        <td style={{ textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>{row.amount_fmt}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteExpense(row.id)}
                            title="Hapus"
                            style={{ background: 'none', border: 'none', color: 'var(--text-45)', cursor: 'pointer', padding: '4px' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            {/* Ringkasan laba rugi */}
            <div className="report-panel" style={{ background: 'var(--text)', color: 'var(--primary)' }}>
              <div className="panel-header">
                <h2 className="panel-title" style={{ fontSize: '18px', color: 'var(--primary)' }}>Ringkasan Laba Rugi</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total Pemasukan</span>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>
                    {loading ? '...' : formatRp(data?.pemasukan?.stats?.total_revenue ?? 0)}
                  </span>
                </div>
                {expLoading ? (
                  <Skel w="100%" h={14} />
                ) : byCategory.map((cat, i, arr) => (
                  <div key={cat.category} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{cat.category}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>-{cat.total_fmt}</span>
                  </div>
                ))}
                {byCategory.length === 0 && !expLoading && (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontStyle: 'italic' }}>Belum ada data pengeluaran.</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Laba Bersih</span>
                  <span style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                    {loading || expLoading ? '...' : formatRp(Math.max(0, (data?.pemasukan?.stats?.total_revenue ?? 0) - totalExpense))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── MODAL TAMBAH PENGELUARAN ─────────────────── */}
          {showModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Catat Pengeluaran</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-60)', display: 'block', marginBottom: '6px' }}>Tanggal *</label>
                    <input type="date" value={expForm.expense_date} onChange={e => setExpForm(f => ({ ...f, expense_date: e.target.value }))} style={{ width: '100%', padding: '10px 12px', background: 'var(--primary-mid)', border: '1px solid var(--white-08)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-60)', display: 'block', marginBottom: '6px' }}>Kategori *</label>
                    <select value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 12px', background: 'var(--primary-mid)', border: '1px solid var(--white-08)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}>
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-60)', display: 'block', marginBottom: '6px' }}>Keterangan *</label>
                    <input type="text" value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} placeholder="Contoh: Sewa studio bulan Juni" style={{ width: '100%', padding: '10px 12px', background: 'var(--primary-mid)', border: '1px solid var(--white-08)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-60)', display: 'block', marginBottom: '6px' }}>Jumlah (Rp) *</label>
                    <input type="number" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} placeholder="3500000" min="1" style={{ width: '100%', padding: '10px 12px', background: 'var(--primary-mid)', border: '1px solid var(--white-08)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setShowModal(false); setExpForm({ expense_date: '', category: 'Sewa', description: '', amount: '' }) }} style={{ padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-60)', cursor: 'pointer', fontSize: '14px' }}>Batal</button>
                  <button onClick={handleSaveExpense} disabled={expSaving} style={{ padding: '10px 20px', background: 'var(--text)', color: 'var(--primary)', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                    {expSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
