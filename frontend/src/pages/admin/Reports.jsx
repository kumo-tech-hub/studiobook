import { useState } from 'react'
import '@/styles/reports.css'

const MOCK_FINANCIALS = [
  { id: 1, date: '02 Mei 2026', customer: 'Andi Pratama', type: 'Solo Session', amount: '+Rp 125.000' },
  { id: 2, date: '02 Mei 2026', customer: 'Budi Santoso', type: 'Duo Frame', amount: '+Rp 185.000' },
  { id: 3, date: '01 Mei 2026', customer: 'Citra Dewi', type: 'Squad Session', amount: '+Rp 265.000' },
  { id: 4, date: '01 Mei 2026', customer: 'Dina Maria', type: 'Family Edition', amount: '+Rp 425.000' },
  { id: 5, date: '30 April 2026', customer: 'Eko Putra', type: 'Solo Session', amount: '+Rp 125.000' },
]

const POPULAR_PACKAGES = [
  { name: 'Duo Frame', count: 42, revenue: 'Rp 7.770.000' },
  { name: 'Solo Session', count: 38, revenue: 'Rp 4.750.000' },
  { name: 'Squad Session', count: 15, revenue: 'Rp 3.975.000' },
  { name: 'Family Edition', count: 8, revenue: 'Rp 3.400.000' },
]

export default function Reports() {
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2026-05-02')

  return (
    <div className="reports-page">
      {/* Global Filter Bar */}
      <div className="reports-filter-bar">
        <div className="filter-controls">
          <span className="stat-label">Periode Laporan</span>
          <input 
            type="date" 
            className="report-date-input" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span style={{ opacity: 0.3 }}>→</span>
          <input 
            type="date" 
            className="report-date-input" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        <button className="export-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="reports-stats-grid">
        <div className="report-stat-card">
          <span className="stat-label">Total Pemasukan</span>
          <div className="stat-main">
            <span className="stat-number">Rp 19.9M</span>
            <span className="stat-trend trend-up">↑ 12%</span>
          </div>
        </div>
        <div className="report-stat-card">
          <span className="stat-label">Total Booking</span>
          <div className="stat-main">
            <span className="stat-number">103</span>
            <span className="stat-trend trend-up">↑ 8%</span>
          </div>
        </div>
        <div className="report-stat-card">
          <span className="stat-label">Avg. Booking Value</span>
          <div className="stat-main">
            <span className="stat-number">Rp 193rb</span>
            <span className="stat-trend trend-down">↓ 2%</span>
          </div>
        </div>
        <div className="report-stat-card">
          <span className="stat-label">Studio Utilization</span>
          <div className="stat-main">
            <span className="stat-number">74%</span>
            <span className="stat-trend trend-up">↑ 5%</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="reports-main-layout">
        {/* Income Details */}
        <div className="report-panel">
          <div className="panel-header">
            <h2 className="panel-title">Rincian Pemasukan</h2>
          </div>
          
          <table className="report-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Paket</th>
                <th style={{ textAlign: 'right' }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FINANCIALS.map((row) => (
                <tr key={row.id}>
                  <td style={{ color: 'var(--text-45)' }}>{row.date}</td>
                  <td style={{ fontWeight: 600 }}>{row.customer}</td>
                  <td>{row.type}</td>
                  <td style={{ textAlign: 'right' }} className="amt-plus">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar Reports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Popular Packages */}
          <div className="report-panel">
            <div className="panel-header">
              <h2 className="panel-title" style={{ fontSize: '18px' }}>Paket Terpopuler</h2>
            </div>
            <div className="top-list">
              {POPULAR_PACKAGES.map((pkg) => (
                <div key={pkg.name} className="top-item">
                  <div className="item-info">
                    <span className="item-name">{pkg.name}</span>
                    <span className="item-meta">{pkg.count} kali dipesan</span>
                  </div>
                  <span className="item-value">{pkg.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours (Insight) */}
          <div className="report-panel" style={{ background: 'var(--text)', color: 'var(--primary)' }}>
            <div className="panel-header">
              <h2 className="panel-title" style={{ fontSize: '18px', color: 'var(--primary)' }}>Jam Teramai</h2>
            </div>
            <div className="peak-hours">
              <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '16px' }}>
                Berdasarkan data 30 hari terakhir, studio paling ramai pada:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', flex: 1 }}>
                  <span style={{ fontSize: '11px', display: 'block', opacity: 0.6 }}>WEEKEND</span>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>14:00 - 17:00</span>
                </div>
                <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', flex: 1 }}>
                  <span style={{ fontSize: '11px', display: 'block', opacity: 0.6 }}>WEEKDAY</span>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>19:00 - 21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
