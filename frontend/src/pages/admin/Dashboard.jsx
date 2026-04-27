import { useState } from 'react'
import '@/styles/admin.css'

export default function Dashboard() {
  const [filter, setFilter] = useState('hari_ini')

  // Dummy data
  const stats = [
    { label: 'Total Booking', value: '1,248' },
    { label: 'Pemasukan (April)', value: 'Rp 8,4jt' },
    { label: 'Occupancy Rate', value: '96%' },
    { label: 'Pelanggan Baru', value: '142' }
  ]

  const recentBookings = [
    { id: '#SB-1001', name: 'Ahmad Fauzi', date: '27 Apr 2026', package: 'Paket Solo', status: 'Selesai' },
    { id: '#SB-1002', name: 'Budi Santoso', date: '27 Apr 2026', package: 'Paket Couple', status: 'Menunggu' },
    { id: '#SB-1003', name: 'Siti Aminah', date: '28 Apr 2026', package: 'Paket Solo', status: 'Dikonfirmasi' },
    { id: '#SB-1004', name: 'Dewi Lestari', date: '29 Apr 2026', package: 'Paket Family', status: 'Dikonfirmasi' },
  ]

  return (
    <div className="admin-dashboard">
      <div className="dash-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card">
            <span className="stat-title">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="dash-layout">
        {/* Left Column - Tampilan Kedua */}
        <div className="dash-panel">
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
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.date}</td>
                  <td>{b.package}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '100px', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      background: b.status === 'Selesai' ? 'var(--primary-accent)' : 
                                  b.status === 'Menunggu' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: b.status === 'Selesai' ? 'var(--text-60)' :
                             b.status === 'Menunggu' ? '#a16207' : '#15803d'
                    }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column - Daftar Jadwal & Filter */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">Jadwal Pemotretan</h3>
            <div className="dash-filter-toggle">
              <button 
                className={`filter-btn ${filter === 'hari_ini' ? 'active' : ''}`}
                onClick={() => setFilter('hari_ini')}
              >
                Hari Ini
              </button>
              <button 
                className={`filter-btn ${filter === 'semua' ? 'active' : ''}`}
                onClick={() => setFilter('semua')}
              >
                Semua
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentBookings
              .filter(b => filter === 'semua' || b.date === '27 Apr 2026')
              .map((b) => (
              <div key={b.id + 'sched'} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--white-06)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-45)', marginTop: '4px' }}>{b.package}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{b.date}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-45)', marginTop: '4px' }}>10:00 - 11:30</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
