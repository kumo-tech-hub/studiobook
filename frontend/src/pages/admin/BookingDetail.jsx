import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '@/styles/admin.css'
import api from '@/services/api'
import { Skel } from '@/components/ui/Skeleton'

const formatRp = (num) => 'Rp ' + Number(num).toLocaleString('id-ID')

// ─── Icons ──────────────────────────────────────────────────
const PhoneIcon = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
const EmailIcon = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
const CheckIcon = <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
const BackIcon  = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7"/></svg>

// ─── Skeleton untuk halaman detail ──────────────────────────
function DetailSkeleton() {
  return (
    <div className="booking-detail-page">
      <div className="booking-detail-layout">
        <div className="bd-main-column">
          <div className="bd-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skel w={80} h={24} rounded />
              <Skel w={100} h={24} />
            </div>
            <Skel w="60%" h={32} />
            <Skel w="40%" h={16} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 8 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skel w="60%" h={12} />
                  <Skel w="80%" h={18} />
                  <Skel w="50%" h={12} />
                </div>
              ))}
            </div>
          </div>
          <div className="bd-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skel w="30%" h={20} />
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skel w={120} h={14} />
                  <Skel w={80} h={12} />
                </div>
                <Skel w={80} h={14} />
              </div>
            ))}
          </div>
        </div>
        <div className="bd-sidebar-column">
          <div className="bd-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skel w="40%" h={20} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Skel w={48} h={48} circle />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skel w={130} h={16} />
                <Skel w={80} h={12} />
              </div>
            </div>
            <Skel w="100%" h={14} />
            <Skel w="100%" h={14} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking]   = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [bookingRes, settingsRes] = await Promise.all([
          api.get(`/admin/bookings/${id}`),
          api.get('/admin/settings'),
        ])
        setBooking(bookingRes.data)
        setSettings(settingsRes.data)
      } catch (err) {
        setError('Booking tidak ditemukan atau terjadi kesalahan.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await api.patch(`/admin/bookings/${id}`, { status: newStatus })
      setBooking(prev => ({ ...prev, status: newStatus }))
    } catch {
      alert('Gagal mengubah status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) return <DetailSkeleton />

  if (error) return (
    <div className="booking-detail-page">
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <p style={{ color: 'var(--text-60)', marginBottom: '24px' }}>{error}</p>
        <button onClick={() => navigate('/admin/bookings')} className="admin-btn" style={{ width: 'auto', padding: '10px 24px' }}>
          ← Kembali ke Daftar Booking
        </button>
      </div>
    </div>
  )

  const b = booking
  const bookingDate = new Date(b.booking_date)
  const statusColor = b.status === 'Lunas' ? '#22c55e' : b.status === 'Pending' ? '#f59e0b' : '#ef4444'

  // Pesan WA admin ke customer — sertakan info rekening dari settings
  const buildWaMessage = () => {
    const payBank   = settings?.payment_bank   || ''
    const payNum    = settings?.payment_number || ''
    const payName   = settings?.payment_name   || ''
    const lines = [
      `Halo ${b.customer_name} 👋`,
      ``,
      `Booking kamu (${b.booking_code} - ${b.package_name}) sudah kami terima!`,
      ``,
      `📅 Tanggal: ${bookingDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `⏰ Jam: ${b.slot_time}`,
      `💰 Total: ${formatRp(b.total_price)}`,
      ``,
      ...(payBank && payNum ? [
        `Silakan transfer ke:`,
        `🏦 ${payBank}: ${payNum}`,
        `👤 a/n: ${payName}`,
        ``,
        `Mohon kirimkan bukti transfer untuk konfirmasi.`,
      ] : []),
      `Terima kasih! 🙏`,
    ].join('\n')
    return encodeURIComponent(lines)
  }

  const waLink = `https://wa.me/${b.customer_phone?.replace(/\D/g, '')}?text=${buildWaMessage()}`

  return (
    <div className="booking-detail-page">
      {/* Tombol Back */}
      <button
        onClick={() => navigate('/admin/bookings')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-60)', cursor: 'pointer', fontSize: '14px', fontWeight: 500, marginBottom: '20px', padding: 0 }}
      >
        {BackIcon} Kembali ke Daftar Booking
      </button>

      <div className="booking-detail-layout">

        {/* ─── LEFT COLUMN ─────────────────────────────── */}
        <div className="bd-main-column">

          {/* Header Card */}
          <div className="bd-card">
            <div className="bd-header-top">
              <div className="bd-header-left">
                <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                <span className="bd-code">{b.booking_code}</span>
              </div>
              <div>
                <div className="bd-total-label">Total</div>
                <div className="bd-total-value">{formatRp(b.total_price)}</div>
              </div>
            </div>

            <h1 className="bd-title">{b.package_name}</h1>
            <p className="bd-datetime">
              {bookingDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {b.slot_time}
            </p>

            <div className="bd-info-grid">
              <div className="bd-info-item">
                <h4>Paket</h4>
                <p>{b.package_name}</p>
              </div>
              <div className="bd-info-item">
                <h4>Tanggal</h4>
                <p>{bookingDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                <span>{bookingDate.getFullYear()}</span>
              </div>
              <div className="bd-info-item">
                <h4>Slot</h4>
                <p>{b.slot_time?.split(' - ')[0]}</p>
                <span>sampai {b.slot_time?.split(' - ')[1]}</span>
              </div>
              <div className="bd-info-item">
                <h4>Kode</h4>
                <p>{b.booking_code}</p>
              </div>
            </div>
          </div>

          {/* Rincian */}
          <div className="bd-card">
            <h3 className="bd-section-title">Rincian Pembayaran</h3>

            {/* Paket utama */}
            <div className="bd-rincian-item">
              <div className="bd-rincian-left">
                <h5>{b.package_name}</h5>
                <p>Paket utama</p>
              </div>
              <div className="bd-rincian-price">{formatRp(b.package?.price ?? (b.total_price - (b.addon_ids?.reduce((s, a) => s + a.price, 0) ?? 0)))}</div>
            </div>

            {/* Addon-addon */}
            {b.addon_ids && b.addon_ids.length > 0 && b.addon_ids.map((addon, i) => (
              <div key={i} className="bd-rincian-item">
                <div className="bd-rincian-left">
                  <h5>{addon.name}</h5>
                  <p>Add-on</p>
                </div>
                <div className="bd-rincian-price">{formatRp(addon.price)}</div>
              </div>
            ))}

            {/* Total */}
            <div className="bd-rincian-total">
              <h4>Total bayar</h4>
              <p>{formatRp(b.total_price)}</p>
            </div>
          </div>

          {/* Catatan */}
          {b.notes && (
            <div className="bd-note-card">
              <span className="bd-note-label">Catatan dari Customer</span>
              <p className="bd-note-text">"{b.notes}"</p>
            </div>
          )}

          {/* Aktivitas */}
          <div className="bd-card">
            <h3 className="bd-section-title">Aktivitas</h3>
            <div className="bd-activity-list">
              <div className="bd-activity-item">
                <div className={`bd-activity-icon ${b.status.toLowerCase()}`}>{CheckIcon}</div>
                <div className="bd-activity-content">
                  <h5>Status saat ini: {b.status}</h5>
                  <p>Update terakhir</p>
                </div>
              </div>
              <div className="bd-activity-item">
                <div className="bd-activity-icon booking">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div className="bd-activity-content">
                  <h5>Booking dibuat</h5>
                  <p>{new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN ────────────────────────────── */}
        <div className="bd-sidebar-column">

          {/* Customer Card */}
          <div className="bd-card">
            <h3 className="bd-section-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Customer</h3>
            <div className="bd-customer-header">
              <div className="bd-customer-avatar">{b.customer_name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="bd-customer-name">{b.customer_name}</div>
                <div className="bd-customer-badge">Customer</div>
              </div>
            </div>
            <div className="bd-customer-contact">
              <div className="bd-contact-item">{PhoneIcon} {b.customer_phone}</div>
              {b.customer_email && (
                <div className="bd-contact-item">{EmailIcon} {b.customer_email}</div>
              )}
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="bd-btn-wa" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 21.05a9.02 9.02 0 01-4.606-1.263l-.33-.195-3.418.897.913-3.333-.214-.34a9.035 9.035 0 117.655 4.234zM12.004 4.814a7.18 7.18 0 00-7.177 7.182c0 1.41.368 2.788 1.066 3.998l.278.483-.541 1.977 2.023-.53.468.258a7.151 7.151 0 003.883 1.13 7.18 7.18 0 007.177-7.183A7.18 7.18 0 0012.004 4.81z"/></svg>
              Chat WhatsApp
            </a>
          </div>

          {/* Status Card */}
          <div className="bd-card">
            <h3 className="bd-section-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Status Pembayaran</h3>
            <div className="bd-status-box">
              <div className="bd-status-icon" style={{ color: statusColor }}>{CheckIcon}</div>
              <div className="bd-status-text">
                <h5 style={{ color: statusColor }}>{b.status}</h5>
                <p>Status pembayaran booking</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              {['Pending', 'Lunas', 'Batal'].filter(s => s !== b.status).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updatingStatus}
                  className="bd-btn-outline"
                  style={{
                    opacity: updatingStatus ? 0.6 : 1,
                    background: s === 'Lunas' ? 'rgba(34,197,94,0.1)' : s === 'Batal' ? 'rgba(239,68,68,0.1)' : 'transparent',
                    color: s === 'Lunas' ? '#15803d' : s === 'Batal' ? '#b91c1c' : 'var(--text-60)',
                    borderColor: s === 'Lunas' ? 'rgba(34,197,94,0.3)' : s === 'Batal' ? 'rgba(239,68,68,0.3)' : 'var(--white-15)',
                  }}
                >
                  {updatingStatus ? 'Mengubah...' : `Tandai ${s}`}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
