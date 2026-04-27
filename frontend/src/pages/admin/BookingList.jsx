import { useState } from 'react'
import '@/styles/admin.css'

export default function BookingList() {
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const dummyData = [
    {
      id: 'BK-2041',
      customer: { name: 'Anindya Paramita', phone: '+62 812-3344-1290', avatar: 'A' },
      paket: 'Couple',
      tanggal: '24 Apr 2026',
      slot: '14:00 - 14:45',
      total: 'Rp 225.000',
      status: 'Lunas'
    },
    {
      id: 'BK-2040',
      customer: { name: 'Reza Darmawan', phone: '+62 813-9900-4422', avatar: 'R' },
      paket: 'Solo',
      tanggal: '24 Apr 2026',
      slot: '11:30 - 12:00',
      total: 'Rp 125.000',
      status: 'Lunas'
    },
    {
      id: 'BK-2039',
      customer: { name: 'Maria & Kevin', phone: '+62 877-1122-3344', avatar: 'M' },
      paket: 'Couple',
      tanggal: '24 Apr 2026',
      slot: '16:30 - 17:15',
      total: 'Rp 220.000',
      status: 'Pending'
    },
    {
      id: 'BK-2038',
      customer: { name: 'Dimas Prasetyo', phone: '+62 811-5566-7788', avatar: 'D' },
      paket: 'Family',
      tanggal: '24 Apr 2026',
      slot: '19:00 - 20:00',
      total: 'Rp 340.000',
      status: 'Pending'
    },
    {
      id: 'BK-2037',
      customer: { name: 'Gisel Natasha', phone: '+62 878-3344-1100', avatar: 'G' },
      paket: 'Solo',
      tanggal: '25 Apr 2026',
      slot: '10:00 - 10:30',
      total: 'Rp 125.000',
      status: 'Lunas'
    },
    {
      id: 'BK-2036',
      customer: { name: 'Family Santoso', phone: '+62 812-7788-2211', avatar: 'F' },
      paket: 'Family Edition',
      tanggal: '25 Apr 2026',
      slot: '15:00 - 16:30',
      total: 'Rp 465.000',
      status: 'Pending'
    },
    {
      id: 'BK-2035',
      customer: { name: 'Putri Handayani', phone: '+62 821-9988-7766', avatar: 'P' },
      paket: 'Couple',
      tanggal: '25 Apr 2026',
      slot: '18:00 - 18:45',
      total: 'Rp 185.000',
      status: 'Lunas'
    },
    {
      id: 'BK-2034',
      customer: { name: 'Bagas & Team', phone: '+62 819-2233-4455', avatar: 'B' },
      paket: 'Family',
      tanggal: '26 Apr 2026',
      slot: '13:00 - 14:00',
      total: 'Rp 265.000',
      status: 'Lunas'
    }
  ]

  // Action icons SVG paths
  const ViewIcon = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  const ChatIcon = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
  const EditIcon = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>

  return (
    <div className="booking-list-page">
      <div className="booking-list-container">
        
        {/* FILTER BAR */}
        <div className="booking-filter-bar">
          <span className="filter-label">Filter</span>
          
          <div className="filter-group" style={{ marginRight: '16px' }}>
            <div className="custom-select-wrapper">
              <select 
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Semua">Status: Semua</option>
                <option value="Lunas">Lunas</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <input 
              type="date" 
              className="admin-date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span style={{ color: 'var(--text-45)', fontSize: '13px' }}>-</span>
            <input 
              type="date" 
              className="admin-date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Kode</th>
                <th>Paket</th>
                <th>Tanggal</th>
                <th>Slot</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{row.customer.avatar}</div>
                      <div className="customer-info">
                        <span className="customer-name">{row.customer.name}</span>
                        <span className="customer-phone">{row.customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-60)', fontWeight: 500 }}>{row.id}</td>
                  <td>{row.paket}</td>
                  <td style={{ fontWeight: 500 }}>{row.tanggal}</td>
                  <td style={{ color: 'var(--text-60)' }}>{row.slot}</td>
                  <td>{row.total}</td>
                  <td>
                    <span className={`status-badge ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button title="View Detail">{ViewIcon}</button>
                      <button title="Chat">{ChatIcon}</button>
                      <button title="Edit">{EditIcon}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
