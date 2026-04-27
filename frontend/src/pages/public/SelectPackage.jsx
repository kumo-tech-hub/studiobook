import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/BookingStore'
import Navbar from '@/components/layout/Navbar'
import '@/styles/booking.css'

const PACKAGES = [
  {
    id: 'basic',
    badge: 'SOLO · 1 ORANG',
    name: 'Basic',
    duration: '60 menit',
    price: 150000,
    label: 'Rp150',
    unit: 'rb',
    features: ['1 background pilihan', 'Cetak 2 foto 4R', 'Soft file semua', 'Props dasar'],
  },
  {
    id: 'couple',
    badge: 'TERLARIS · 2 ORANG',
    badgeHot: true,
    name: 'Couple',
    duration: '90 menit',
    price: 250000,
    label: 'Rp250',
    unit: 'rb',
    features: ['2 background pilihan', 'Cetak 4 foto 4R', 'Soft file semua', 'Props lengkap'],
  },
  {
    id: 'family',
    badge: 'KELUARGA · MAX 6',
    name: 'Family',
    duration: '120 menit',
    price: 400000,
    label: 'Rp400',
    unit: 'rb',
    features: ['3 background pilihan', 'Cetak 8 foto 4R', 'Soft file semua', 'Album digital'],
  },
]

const ADDONS = [
  {
    id: 'print',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="6" y="2" width="12" height="10" rx="1"/><rect x="6" y="17" width="12" height="5" rx="1"/>
        <path d="M6 12H4a2 2 0 00-2 2v5h4v-5"/><path d="M18 12h2a2 2 0 012 2v5h-4v-5"/>
      </svg>
    ),
    name: 'Cetak foto tambahan',
    desc: '4 lembar ukuran 4R',
    price: 50000,
    label: '+Rp50rb',
  },
  {
    id: 'bg',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l4-4 4 4 4-4 4 4"/>
        <path d="M3 15l4 4 4-4 4 4 4-4"/>
      </svg>
    ),
    name: 'Background extra',
    desc: '1 background tambahan',
    price: 75000,
    label: '+Rp75rb',
  },
  {
    id: 'time',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    name: 'Extra waktu',
    desc: 'Tambah 30 menit sesi',
    price: 100000,
    label: '+Rp100rb',
  },
  {
    id: 'makeup',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="5"/><path d="M12 13v8m-4-4h8"/>
      </svg>
    ),
    name: 'Makeup artist',
    desc: 'Touch up profesional',
    price: 150000,
    label: '+Rp150rb',
  },
]

const formatRp = (n) => 'Rp' + n.toLocaleString('id-ID')

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const STEPS = ['PAKET', 'JADWAL', 'DATA DIRI', 'KONFIRMASI']

export default function SelectPackage() {
  const navigate = useNavigate()
  const { setPackage, setAddOns } = useBookingStore()

  const [selectedPkg, setSelectedPkg] = useState(null)
  const [checkedAddons, setCheckedAddons] = useState([])

  const toggleAddon = (id) =>
    setCheckedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )

  const pkg = PACKAGES.find((p) => p.id === selectedPkg)
  const addonsTotal = ADDONS.filter((a) => checkedAddons.includes(a.id))
    .reduce((s, a) => s + a.price, 0)
  const total = (pkg?.price ?? 0) + addonsTotal

  const handleContinue = () => {
    if (!pkg) return
    setPackage(pkg)
    setAddOns(ADDONS.filter((a) => checkedAddons.includes(a.id)))
    navigate('/booking/jadwal')
  }

  return (
    <div className="booking-page">
      <div className="desktop-navbar-wrapper">
        <Navbar isBookingRoute={true} />
      </div>
      {/* Header */}
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate('/')} aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="booking-header-text">
          <h1>Pilih paket</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item${i === 0 ? ' active' : ''}`}>
            <div className="step-circle">{i + 1}</div>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="booking-desktop-layout">
        <div className="booking-main">
          <div className="booking-body">
            <div className="booking-section-label">Pilih paket foto</div>

            <div className="packages-grid">
              {PACKAGES.map((p) => (
                <div
                  key={p.id}
                  className={`pkg-select-card${selectedPkg === p.id ? ' selected' : ''}`}
                  onClick={() => setSelectedPkg(p.id)}
                  role="radio"
                  aria-checked={selectedPkg === p.id}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedPkg(p.id)}
                >
                  <div className="pkg-select-top">
                    <div>
                      <div className="pkg-select-meta">
                        <span className={`pkg-select-badge${p.badgeHot ? ' hot' : ''}`}>{p.badge}</span>
                      </div>
                      <div className="pkg-select-name">{p.name}</div>
                      <div className="pkg-select-duration">{p.duration}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div className="pkg-select-price-wrap">
                        <div className="pkg-select-price">{p.label}<small>{p.unit}</small></div>
                      </div>
                      <div className="radio-circle">
                        {selectedPkg === p.id && <div className="radio-dot" />}
                      </div>
                    </div>
                  </div>
                  <ul className="pkg-select-features">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="booking-section-label" style={{ marginTop: 32 }}>
              Tambah layanan ekstra (opsional)
            </div>

            {ADDONS.map((a) => {
              const isChecked = checkedAddons.includes(a.id)
              return (
                <div
                  key={a.id}
                  className={`addon-item${isChecked ? ' checked' : ''}`}
                  onClick={() => toggleAddon(a.id)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleAddon(a.id)}
                >
                  <div className="addon-icon">{a.icon}</div>
                  <div className="addon-info">
                    <div className="addon-name">{a.name}</div>
                    <div className="addon-desc">{a.desc}</div>
                  </div>
                  <div className="addon-price">{a.label}</div>
                  <div className="checkbox">{isChecked && <CheckIcon />}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="booking-sidebar">
          <div className="summary-card-v2">
            <div className="summary-card">
              <span className="summary-label">RINGKASAN</span>
              <h2>Booking kamu</h2>

              <div className="summary-content">
                {pkg ? (
                  <>
                    <div className="summary-item-main">
                      <div className="summary-item-info">
                        <h3>{pkg.name}</h3>
                        <p>{pkg.duration}</p>
                      </div>
                      <div className="summary-item-price">{pkg.label}</div>
                    </div>

                    {checkedAddons.length > 0 && (
                      <div className="summary-addons">
                        {ADDONS.filter(a => checkedAddons.includes(a.id)).map(a => (
                          <div key={a.id} className="summary-addon-row">
                            <span>{a.name}</span>
                            <span>{a.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="summary-divider" />

                    <div className="summary-total-row">
                      <span>Total</span>
                      <span className="total-amount">{formatRp(total)}</span>
                    </div>

                    <button className="sidebar-cta" onClick={handleContinue} disabled={!selectedPkg}>
                      Lanjut ke jadwal
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
            <div className="footer-summary-main">
              {pkg ? `Paket ${pkg.name}` : 'Belum dipilih'}
            </div>
            <div className="footer-summary-sub">
              {checkedAddons.length > 0
                ? `+${checkedAddons.length} layanan ekstra`
                : 'Tidak ada tambahan'}
            </div>
          </div>
          <div className="footer-total">{pkg ? formatRp(total) : '—'}</div>
          <button className="footer-cta" onClick={handleContinue} disabled={!selectedPkg}>
            Lanjut ke Jadwal
          </button>
        </div>
      </div>
    </div>
  )
}
