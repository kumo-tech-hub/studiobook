import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/styles/admin.css'
import api from '@/services/api'
import { SkeletonTableRow } from '@/components/ui/Skeleton'

const ITEMS_PER_PAGE = 12

const ViewIcon  = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
const EditIcon  = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>

export default function BookingList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate]     = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [total, setTotal]             = useState(0)

  const fetchBookings = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get('/admin/bookings', {
        params: {
          page,
          per_page: ITEMS_PER_PAGE,
          ...(statusFilter !== 'Semua' && { status: statusFilter }),
          ...(startDate && { start_date: startDate }),
          ...(endDate   && { end_date: endDate }),
        }
      })
      setData(res.data.data)
      setCurrentPage(res.data.current_page)
      setTotalPages(res.data.last_page)
      setTotal(res.data.total)
    } catch (err) {
      console.error('Gagal mengambil data booking:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, startDate, endDate])

  // Fetch ulang saat filter berubah (reset ke page 1)
  useEffect(() => {
    fetchBookings(1)
  }, [fetchBookings])

  const handlePageChange = (page) => {
    fetchBookings(page)
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/admin/bookings/${id}`, { status: newStatus })
      setData(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (err) {
      alert('Gagal mengubah status.')
    }
  }

  const displayStart = total > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const displayEnd   = Math.min(currentPage * ITEMS_PER_PAGE, total)

  return (
    <>
      {/* Shimmer keyframe injected once */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="booking-list-page">
        <div className="booking-list-container">

          {/* FILTER BAR */}
          <div className="booking-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span className="filter-label">Filter</span>

              <div className="filter-group" style={{ marginRight: '8px' }}>
                <div className="custom-select-wrapper">
                  <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="Semua">Status: Semua</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Pending">Pending</option>
                    <option value="Batal">Batal</option>
                  </select>
                </div>
              </div>

              <div className="filter-group">
                <input type="date" className="admin-date-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span style={{ color: 'var(--text-45)', fontSize: '13px' }}>-</span>
                <input type="date" className="admin-date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <button
              className="admin-btn"
              style={{ margin: 0, width: 'auto', padding: '10px 20px', background: 'var(--text)', color: 'var(--primary)' }}
              onClick={() => navigate('/admin/bookings/new')}
            >
              + Tambah Booking
            </button>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: 'auto', borderBottom: '1px solid var(--white-06)' }}>
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
                {loading
                  ? [...Array(8)].map((_, i) => <SkeletonTableRow key={i} />)
                  : data.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-45)' }}>
                          Tidak ada booking ditemukan.
                        </td>
                      </tr>
                    )
                    : data.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">{row.customer_name?.[0]?.toUpperCase()}</div>
                            <div className="customer-info">
                              <span className="customer-name">{row.customer_name}</span>
                              <span className="customer-phone">{row.customer_phone}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-60)', fontWeight: 500 }}>{row.booking_code}</td>
                        <td>{row.package_name}</td>
                        <td style={{ fontWeight: 500 }}>
                          {new Date(row.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ color: 'var(--text-60)' }}>{row.slot_time}</td>
                        <td>{'Rp ' + Number(row.total_price).toLocaleString('id-ID')}</td>
                        <td>
                          <select
                            value={row.status}
                            onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                            className={`status-badge ${row.status.toLowerCase()}`}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px', padding: '4px 8px', borderRadius: '12px' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Lunas">Lunas</option>
                            <option value="Batal">Batal</option>
                          </select>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button title="View Detail" onClick={() => navigate(`/admin/bookings/${row.id}`)}>{ViewIcon}</button>
                            <button title="Edit" onClick={() => navigate(`/admin/bookings/${row.id}`)}>{EditIcon}</button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* PAGINATION & INFO */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', fontSize: '13px', color: 'var(--text-60)' }}>
            <div>
              {loading ? 'Memuat...' : `Menampilkan ${displayStart} - ${displayEnd} dari total `}
              {!loading && <b>{total}</b>}
              {!loading && ' booking'}
            </div>

            {totalPages > 1 && !loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--primary-mid)', border: '1px solid var(--white-08)', color: currentPage === 1 ? 'var(--text-45)' : 'var(--text)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Prev
                </button>

                <div style={{ padding: '0 8px', fontWeight: 500, color: 'var(--text)' }}>
                  Halaman {currentPage} dari {totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--primary-mid)', border: '1px solid var(--white-08)', color: currentPage === totalPages ? 'var(--text-45)' : 'var(--text)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
