import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/BookingStore'
import Navbar from '@/components/layout/Navbar'
import '@/styles/booking.css'

const STEPS = ['PAKET', 'JADWAL', 'DATA DIRI', 'KONFIRMASI']

const formatRp = (n) => 'Rp' + n.toLocaleString('id-ID')

export default function CustomerForm() {
  const navigate = useNavigate()
  const { selectedPackage, selectedAddOns, selectedDate, selectedSlot, setCustomerInfo } = useBookingStore()

  const [form, setForm] = useState({ nama: '', whatsapp: '', email: '', catatan: '' })
  const [errors, setErrors] = useState({})

  const totalPrice = (selectedPackage?.price ?? 0) +
    (selectedAddOns ?? []).reduce((s, a) => s + (a.price * (a.qty || 1)), 0)

  const addonsLabel = (selectedAddOns ?? []).length > 0
    ? ` + ${selectedAddOns.map(a => `${a.name.split(' ')[0]}${a.qty > 1 ? ` (x${a.qty})` : ''}`).join(', ')}`
    : ''

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi'
    if (!form.whatsapp.trim()) e.whatsapp = 'Nomor WhatsApp wajib diisi'
    else if (!/^[0-9]{9,13}$/.test(form.whatsapp.replace(/\D/g, ''))) e.whatsapp = 'Format nomor tidak valid'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setCustomerInfo(form)
    navigate('/booking/konfirmasi')
  }

  return (
    <div className="booking-page">
      <div className="desktop-navbar-wrapper">
        <Navbar isBookingRoute={true} />
      </div>
      {/* Header */}
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate('/booking/jadwal')} aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="booking-header-text">
          <h1>Data diri</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item${i < 2 ? ' done' : i === 2 ? ' active' : ''}`}>
            <div className="step-circle">
              {i < 2
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="booking-desktop-layout">
        <div className="booking-main">
          <div className="booking-body">
            {/* Order summary */}
            <div className="order-summary-card">
              <div className="order-summary-title">Ringkasan pesanan</div>
              <div className="order-row">
                <span className="order-row-label">Paket</span>
                <span className="order-row-value">
                  {selectedPackage ? `${selectedPackage.name}${addonsLabel}` : '—'}
                </span>
              </div>
              <div className="order-row">
                <span className="order-row-label">Tanggal</span>
                <span className="order-row-value">{selectedDate ?? '—'}</span>
              </div>
              <div className="order-row">
                <span className="order-row-label">Jam</span>
                <span className="order-row-value">{selectedSlot ?? '—'}</span>
              </div>
              <div className="order-row total">
                <span className="order-row-label">Total</span>
                <span className="order-row-value">{formatRp(totalPrice)}</span>
              </div>
            </div>

            <div className="booking-section-label">Isi data diri kamu</div>

            <div className="form-group">
              <label className="form-label">
                Nama lengkap <span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="contoh: Sari Rahayu"
                value={form.nama}
                onChange={(e) => set('nama', e.target.value)}
              />
              {errors.nama && <div className="form-hint" style={{ color: 'var(--secondary)' }}>{errors.nama}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Nomor WhatsApp <span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="8123456789"
                type="tel"
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
              />
              <div className="form-hint">Konfirmasi booking akan dikirim ke nomor ini</div>
              {errors.whatsapp && <div className="form-hint" style={{ color: 'var(--secondary)' }}>{errors.whatsapp}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email <span style={{ fontSize: '12px', color: 'var(--text-45)', fontWeight: 400 }}>(opsional)</span>
              </label>
              <input
                className="form-input"
                placeholder="email@example.com"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              <div className="form-hint">Untuk kirim bukti booking via email</div>
              {errors.email && <div className="form-hint" style={{ color: 'var(--secondary)' }}>{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Catatan untuk admin</label>
              <textarea
                className="form-textarea"
                placeholder="contoh: minta background warna putih, bawa baju ganti 2 set..."
                value={form.catatan}
                onChange={(e) => set('catatan', e.target.value)}
              />
            </div>

            <div className="form-info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>Setelah submit, kamu akan diarahkan ke WhatsApp untuk konfirmasi final dengan admin studio.</p>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="booking-sidebar">
          <div className="summary-card-v2">
            <div className="summary-card">
              <span className="summary-label">RINGKASAN</span>
              <h2>Booking kamu</h2>

              <div className="summary-content">
                {selectedPackage ? (
                  <>
                    <div className="summary-item-main">
                      <div className="summary-item-info">
                        <h3>{selectedPackage.name}</h3>
                        <p>{selectedPackage.duration}</p>
                      </div>
                      <div className="summary-item-price">{selectedPackage.label}</div>
                    </div>

                    {selectedAddOns && selectedAddOns.length > 0 && (
                      <div className="summary-addons">
                        {selectedAddOns.map(a => (
                          <div key={a.id} className="summary-addon-row">
                            <span>{a.name} {a.qty > 1 ? `(x${a.qty})` : ''}</span>
                            <span>{a.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="summary-divider" />

                    <div className="summary-total-row" style={{ marginBottom: 12 }}>
                      <span>Tanggal</span>
                      <span style={{ color: 'var(--text)' }}>{selectedDate ?? '—'}</span>
                    </div>
                    <div className="summary-total-row">
                      <span>Jam</span>
                      <span style={{ color: 'var(--text)' }}>{selectedSlot ?? '—'}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total-row">
                      <span>Total</span>
                      <span className="total-amount">{formatRp(totalPrice)}</span>
                    </div>

                    <button className="sidebar-cta" onClick={handleSubmit}>
                      Lanjut ke Konfirmasi
                    </button>
                  </>
                ) : (
                  <p className="summary-empty">Pilih paket untuk melihat ringkasan</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="booking-footer">
        <div className="booking-footer-inner">
          <div className="footer-summary">
            <div className="footer-summary-main">{formatRp(totalPrice)}</div>
            <div className="footer-summary-sub">
              {selectedPackage ? `Paket ${selectedPackage.name}` : ''}
            </div>
          </div>
          <button className="footer-cta" onClick={handleSubmit}>
            Lanjut ke Konfirmasi
          </button>
        </div>
      </div>
    </div>
  )
}
