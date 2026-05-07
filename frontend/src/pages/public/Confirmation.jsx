import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/BookingStore'
import Navbar from '@/components/layout/Navbar'
import '@/styles/booking.css'

const STEPS = ['PAKET', 'JADWAL', 'DATA DIRI', 'KONFIRMASI']

const formatRp = (n) => 'Rp' + n.toLocaleString('id-ID')

export default function Confirmation() {
  const navigate = useNavigate()
  const { selectedPackage, selectedAddOns, selectedDate, selectedSlot, customerInfo } = useBookingStore()

  const totalPrice = (selectedPackage?.price ?? 0) +
    (selectedAddOns ?? []).reduce((s, a) => s + (a.price * (a.qty || 1)), 0)

  const addonsLabel = (selectedAddOns ?? []).length > 0
    ? ` + ${selectedAddOns.map(a => `${a.name.split(' ')[0]}${a.qty > 1 ? ` (x${a.qty})` : ''}`).join(', ')}`
    : ''

  const rows = [
    { label: 'Paket', value: selectedPackage ? `${selectedPackage.name}${addonsLabel}` : '—' },
    { label: 'Tanggal', value: selectedDate ?? '—' },
    { label: 'Jam', value: selectedSlot ?? '—' },
    { label: 'Nama', value: customerInfo?.nama ?? '—' },
    { label: 'WhatsApp', value: customerInfo?.whatsapp ? `+62${customerInfo.whatsapp}` : '—' },
    ...(customerInfo?.email ? [{ label: 'Email', value: customerInfo.email }] : []),
  ]

  const buildWaMessage = () => {
    const lines = [
      `Halo, saya ingin booking studio:`,
      `• Paket: ${selectedPackage?.name}${addonsLabel}`,
      `• Tanggal: ${selectedDate}`,
      `• Jam: ${selectedSlot}`,
      `• Nama: ${customerInfo?.nama}`,
      `• WhatsApp: +62${customerInfo?.whatsapp}`,
      customerInfo?.email ? `• Email: ${customerInfo.email}` : '',
      customerInfo?.catatan ? `• Catatan: ${customerInfo.catatan}` : '',
      `• Total: ${formatRp(totalPrice)}`,
    ].filter(Boolean).join('\n')
    return encodeURIComponent(lines)
  }

  const handleConfirm = () => {
    const waNumber = '6281234567890'
    window.open(`https://wa.me/${waNumber}?text=${buildWaMessage()}`, '_blank')
    navigate('/booking/sukses')
  }

  return (
    <div className="booking-page">
      <div className="desktop-navbar-wrapper">
        <Navbar isBookingRoute={true} />
      </div>
      {/* Header */}
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate('/booking/data-diri')} aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="booking-header-text">
          <h1>Konfirmasi</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item${i < 3 ? ' done' : ' active'}`}>
            <div className="step-circle">
              {i < 3
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="booking-desktop-layout" style={{ justifyContent: 'center' }}>
        <div className="booking-main" style={{ maxWidth: '680px', flex: 'none', width: '100%' }}>
          <div className="booking-body">
        <div className="booking-section-label">Ringkasan pesanan</div>

        <div className="order-summary-card confirmation-card">
          {rows.map((r) => (
            <div className="order-row" key={r.label}>
              <span className="order-row-label">{r.label}</span>
              <span className="order-row-value">{r.value}</span>
            </div>
          ))}
          {customerInfo?.catatan && (
            <div className="order-row">
              <span className="order-row-label">Catatan</span>
              <span className="order-row-value" style={{ maxWidth: '60%', textAlign: 'right' }}>
                {customerInfo.catatan}
              </span>
            </div>
          )}
          <div className="order-row total">
            <span className="order-row-label">Total</span>
            <span className="order-row-value">{formatRp(totalPrice)}</span>
          </div>
          </div>

          <div className="form-info-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>Klik tombol di bawah untuk membuka WhatsApp. Pesan sudah terisi otomatis — tinggal kirim ke admin untuk konfirmasi final.</p>
          </div>

          <button className="sidebar-cta" onClick={handleConfirm} style={{ marginTop: 24, display: 'none' }} id="desktop-confirm-btn">
            Kirim ke WhatsApp
          </button>
        </div>
      </div>
      </div>

      {/* Footer */}
      <div className="booking-footer">
        <div className="booking-footer-inner">
          <div className="footer-summary">
            <div className="footer-summary-main">{formatRp(totalPrice)}</div>
            <div className="footer-summary-sub">Konfirmasi via WhatsApp</div>
          </div>
          <button className="footer-cta" onClick={handleConfirm}>
            Kirim ke WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
