import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/BookingStore'
import Navbar from '@/components/layout/Navbar'
import '@/styles/booking.css'

const formatRp = (n) => 'Rp' + n.toLocaleString('id-ID')

const generateCode = () => {
  const now = new Date()
  const d = String(now.getDate()).padStart(2, '0')
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const r = String(Math.floor(Math.random() * 900) + 100)
  return `SB-${d}${m}-${r}`
}

const BOOKING_CODE = generateCode()

export default function BookingSuccess() {
  const navigate = useNavigate()
  const { selectedPackage, selectedAddOns, selectedDate, selectedSlot, resetBooking } = useBookingStore()
  const [copied, setCopied] = useState(false)

  const totalPrice = (selectedPackage?.price ?? 0) +
    (selectedAddOns ?? []).reduce((s, a) => s + (a.price * (a.qty || 1)), 0)

  const addonsLabel = (selectedAddOns ?? []).length > 0
    ? ` + ${selectedAddOns.map(a => `${a.name.split(' ')[0]}${a.qty > 1 ? ` (x${a.qty})` : ''}`).join(', ')}`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(BOOKING_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBackHome = () => {
    resetBooking()
    navigate('/')
  }

  return (
    <div className="success-page">
      <div className="desktop-navbar-wrapper">
        <Navbar isBookingRoute={true} />
      </div>
      {/* Header */}
      <div className="success-header">
        <span className="success-step-label">4 — Konfirmasi</span>
        <span className="success-badge">Booking sukses</span>
      </div>

      {/* Body */}
      <div className="booking-desktop-layout" style={{ justifyContent: 'center' }}>
        <div className="booking-main" style={{ maxWidth: '680px', flex: 'none', width: '100%' }}>
          <div className="success-body" style={{ padding: '0 0 60px 0', margin: '0 auto' }}>
        <div className="success-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="success-title">
          Booking <em>berhasil</em><br />dikirim!
        </h1>
        <p className="success-subtitle">
          Pesan WhatsApp kamu sudah terkirim.<br />
          Admin akan konfirmasi dalam 1×24 jam.
        </p>

        {/* Booking code */}
        <div className="booking-code-card">
          <div className="booking-code-label">Kode Booking</div>
          <div className="booking-code-row">
            <div className="booking-code-value">{BOOKING_CODE}</div>
            <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
              {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="success-details-card">
          <div className="success-detail-row">
            <div className="detail-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div className="detail-label">Tanggal & jam</div>
              <div className="detail-value">
                {selectedDate ?? '—'} · {selectedSlot ?? '—'}
              </div>
            </div>
          </div>
          <div className="success-detail-row">
            <div className="detail-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="7" width="18" height="13" rx="2"/>
                <circle cx="12" cy="13" r="3"/>
                <path d="M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"/>
              </svg>
            </div>
            <div>
              <div className="detail-label">Paket</div>
              <div className="detail-value">
                {selectedPackage ? `${selectedPackage.name}${addonsLabel}` : '—'}
              </div>
            </div>
          </div>
          <div className="success-detail-row">
            <div className="detail-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div>
              <div className="detail-label">Total</div>
              <div className="detail-value">{formatRp(totalPrice)}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <a
          href={`https://wa.me/6281234567890`}
          target="_blank"
          rel="noreferrer"
          className="wa-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Buka WhatsApp
        </a>
        <button className="back-home-btn" onClick={handleBackHome}>
          Kembali ke beranda
        </button>
          </div>
        </div>
      </div>
    </div>
  )
}
