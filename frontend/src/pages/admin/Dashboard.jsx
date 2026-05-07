import { useState, useEffect, useCallback } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import '@/styles/admin.css'
import api from '@/services/api'
import { Skel } from '@/components/ui/Skeleton'

const formatRp = (num) => 'Rp ' + Number(num).toLocaleString('id-ID')

// ─── Skeleton untuk stats card ────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="dash-stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skel w="60%" h={13} />
      <Skel w="75%" h={30} />
      <Skel w="40%" h={12} />
    </div>
  )
}

// ─── Skeleton untuk jadwal ────────────────────────────────────────
function ScheduleSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--white-06)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skel w={120} h={14} />
            <Skel w={80} h={12} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <Skel w={80} h={13} />
            <Skel w={60} h={11} />
          </div>
        </div>
      ))}
    </>
  )
}

export default function Dashboard() {
  const [revenueFilter, setRevenueFilter] = useState('minggu_ini')
  const [loading, setLoading]             = useState(true)
  const [stats, setStats]                 = useState(null)
  const [chart, setChart]                 = useState({ weekly: [], monthly: [], yearly: [] })
  const [todaySchedule, setTodaySchedule] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/dashboard')
      setStats(res.data.stats)
      setChart(res.data.chart)
      setTodaySchedule(res.data.today_schedule)
      setRecentBookings(res.data.recent_bookings)
    } catch (err) {
      console.error('Gagal memuat dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const currentChartData =
    revenueFilter === 'tahun_ini' ? chart.yearly :
    revenueFilter === 'bulan_ini' ? chart.monthly :
    chart.weekly

  const statCards = stats ? [
    {
      label: 'Pemasukan Hari Ini',
      value: formatRp(stats.today_revenue),
      trend: stats.revenue_trend >= 0 ? `↑ ${stats.revenue_trend}% dari kemarin` : `↓ ${Math.abs(stats.revenue_trend)}% dari kemarin`,
      color: stats.revenue_trend >= 0 ? '#22c55e' : '#ef4444',
    },
    {
      label: 'Total Booking',
      value: stats.total_bookings.toLocaleString('id-ID'),
      trend: stats.booking_trend >= 0 ? `↑ ${stats.booking_trend}% bulan ini` : `↓ ${Math.abs(stats.booking_trend)}% bulan ini`,
    },
    {
      label: 'Pending Hari Ini',
      value: String(stats.pending_today),
      trend: stats.pending_today > 0 ? 'Butuh aksi' : 'Semua beres',
      color: stats.pending_today > 0 ? '#f59e0b' : '#22c55e',
    },
    {
      label: 'Selesai Hari Ini',
      value: String(stats.done_today),
      trend: 'Booking lunas',
      color: '#22c55e',
    },
  ] : []

  const statusStyle = (status) => {
    if (status === 'Lunas')   return { bg: 'rgba(34, 197, 94, 0.15)',  color: '#22c55e' }
    if (status === 'Pending') return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }
    return { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-60)' }
  }

  return (
    <div className="admin-dashboard">
      {/* ─── STATS CARDS ─────────────────────────────────── */}
      <div className="dash-stats-grid">
        {loading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((s, i) => (
            <div key={i} className="dash-stat-card">
              <span className="stat-title">{s.label}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
                <span className="stat-value" style={{ color: s.color || 'var(--text)' }}>{s.value}</span>
              </div>
              <span style={{ fontSize: '12px', color: s.color || 'var(--text-45)', fontWeight: 500, marginTop: '4px', display: 'block' }}>
                {s.trend}
              </span>
            </div>
          ))
        }
      </div>

      <div className="dash-layout">
        {/* ─── GRAFIK PEMASUKAN ────────────────────────────── */}
        <div className="dash-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Grafik Pemasukan</h3>
            <div className="dash-filter-toggle">
              <select
                className="admin-input"
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: 'var(--primary-mid)' }}
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
              >
                <option value="minggu_ini">Minggu Ini</option>
                <option value="bulan_ini">Bulan Ini</option>
                <option value="tahun_ini">Tahun Ini</option>
              </select>
            </div>
          </div>

          <div style={{ flex: 1, height: '260px', paddingTop: '12px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Skel w={80} h={12} /><Skel w={80} h={12} />
                </div>
                <Skel w="100%" h={220} style={{ borderRadius: 8 }} />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-60)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '3px', background: '#22c55e', borderRadius: '2px' }}></div> Pemasukan (Rp ribu)
                  </div>
                </div>
                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--white-06)" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-45)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-45)' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--white-06)', borderRadius: '8px', fontSize: '12px', color: 'var(--text)' }}
                        formatter={(val) => [`Rp ${(val * 1000).toLocaleString('id-ID')}`, 'Pemasukan']}
                      />
                      <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── JADWAL HARI INI ─────────────────────────────── */}
        <div className="dash-panel" style={{ display: 'flex', flexDirection: 'column', maxHeight: '400px' }}>
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Jadwal Pemotretan Hari Ini</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '8px', flex: 1 }}>
            {loading ? (
              <ScheduleSkeleton />
            ) : todaySchedule.length === 0 ? (
              <div style={{ color: 'var(--text-45)', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontStyle: 'italic' }}>
                Tidak ada jadwal hari ini.
              </div>
            ) : todaySchedule.map((b) => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--white-06)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-45)', marginTop: '4px' }}>{b.package}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{b.slot_time}</div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, marginTop: '4px', display: 'inline-block',
                    padding: '2px 8px', borderRadius: '8px',
                    background: statusStyle(b.status).bg,
                    color: statusStyle(b.status).color,
                  }}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BOOKING TERBARU ─────────────────────────────────── */}
      <div className="dash-panel" style={{ marginTop: '24px' }}>
        <div className="dash-panel-header">
          <h3 className="dash-panel-title">Booking Masuk Terbaru</h3>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Pelanggan</th>
              <th>Tanggal</th>
              <th>Paket</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[70, 130, 90, 110, 70].map((w, j) => (
                    <td key={j} style={{ padding: '14px 12px' }}>
                      <Skel w={w} h={14} />
                    </td>
                  ))}
                </tr>
              ))
            ) : recentBookings.map((b) => {
              const s = statusStyle(b.status)
              return (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.date}</td>
                  <td>{b.package}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
