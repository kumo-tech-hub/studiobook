import { useLocation } from 'react-router-dom'
import '@/styles/admin.css'

export default function AdminNavbar() {
  const location = useLocation()
  
  // Mapping pathname to title
  const getPageTitle = () => {
    if (location.pathname.includes('/admin/dashboard')) return 'Dashboard'
    if (location.pathname.includes('/admin/bookings')) return 'Daftar Booking'
    if (location.pathname.includes('/admin/packages')) return 'Manajemen Paket'
    if (location.pathname.includes('/admin/slots')) return 'Manajemen Slot'
    if (location.pathname.includes('/admin/reports')) return 'Laporan'
    return 'Admin Panel'
  }

  return (
    <header className="admin-navbar">
      <div className="admin-nav-title">
        <h1>{getPageTitle()}</h1>
      </div>
      <div className="admin-nav-profile">
        <div className="admin-info">
          <span className="admin-name">Admin</span>
          <span className="admin-role">hello@studiobook.id</span>
        </div>
        <div className="admin-avatar">A</div>
      </div>
    </header>
  )
}
