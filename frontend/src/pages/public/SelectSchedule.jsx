import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/store/BookingStore'
import Navbar from '@/components/layout/Navbar'
import '@/styles/booking.css'

const DAYS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAY_NAMES = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

const SLOTS = [
  { time: '08.00', full: true },
  { time: '09.30', full: true },
  { time: '11.00', full: false },
  { time: '13.00', full: false },
  { time: '14.30', full: false },
  { time: '16.00', full: false },
  { time: '17.30', full: true },
  { time: '19.00', full: false },
  { time: '20.30', full: false },
]

const STEPS = ['PAKET', 'JADWAL', 'DATA DIRI', 'KONFIRMASI']

const formatRp = (n) => 'Rp' + n.toLocaleString('id-ID')

export default function SelectSchedule() {
  const navigate = useNavigate()
  const { selectedPackage, selectedAddOns, setDate, setSlot } = useBookingStore()

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const totalPrice = (selectedPackage?.price ?? 0) +
    (selectedAddOns ?? []).reduce((s, a) => s + a.price, 0)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isPast = (d) => new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
  const isSelected = (d) => selectedDate === d && viewMonth === (selectedDate?.month ?? -1)

  const handleDateClick = (d) => {
    if (isPast(d)) return
    setSelectedDate({ day: d, month: viewMonth, year: viewYear })
    setSelectedSlot(null)
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return null
    const date = new Date(selectedDate.year, selectedDate.month, selectedDate.day)
    return `${DAY_NAMES[date.getDay()]}, ${selectedDate.day} ${MONTHS[selectedDate.month]} ${selectedDate.year}`
  }

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return
    setDate(formatSelectedDate())
    setSlot(selectedSlot + ' WIB')
    navigate('/booking/data-diri')
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate('/booking/paket')} aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="booking-header-text">
          <h1>Pilih jadwal</h1>
          {selectedPackage && (
            <p>Paket {selectedPackage.name} · {formatRp(totalPrice)}</p>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="step-indicator">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item${i === 0 ? ' done' : i === 1 ? ' active' : ''}`}>
            <div className="step-circle">
              {i === 0
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
            <div className="booking-section-label">Pilih tanggal</div>

            {/* Calendar */}
            <div className="calendar-header">
              <div className="calendar-month">{MONTHS[viewMonth]} {viewYear}</div>
              <div className="cal-nav-group">
                <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
                <button className="cal-nav-btn" onClick={nextMonth}>›</button>
              </div>
            </div>

            <div className="calendar-grid">
              {DAYS.map((d) => (
                <div key={d} className="cal-day-label">{d}</div>
              ))}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`e-${i}`} className="cal-day empty" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1
                const past = isPast(d)
                const sel = selectedDate?.day === d && selectedDate?.month === viewMonth && selectedDate?.year === viewYear
                const tod = isToday(d)
                return (
                  <div
                    key={d}
                    className={`cal-day${past ? ' past' : ''}${tod && !sel ? ' today' : ''}${sel ? ' selected' : ''}${!past && !sel ? ' has-slot' : ''}`}
                    onClick={() => handleDateClick(d)}
                  >
                    {d}
                  </div>
                )
              })}
            </div>

            {selectedDate && (
              <>
                <div className="booking-section-label" style={{ marginTop: 32 }}>Pilih jam sesi</div>
                <div className="slots-grid">
                  {SLOTS.map((s) => (
                    <button
                      key={s.time}
                      className={`slot-btn${s.full ? ' full' : ''}${selectedSlot === s.time ? ' selected' : ''}`}
                      onClick={() => !s.full && setSelectedSlot(s.time)}
                      disabled={s.full}
                    >
                      <span className="slot-time">{s.time}</span>
                      <span className="slot-status">{s.full ? 'Penuh' : 'Tersedia'}</span>
                    </button>
                  ))}
                </div>
                <div className="slot-legend">
                  <div className="legend-item"><div className="legend-dot selected" />Dipilih</div>
                  <div className="legend-item"><div className="legend-dot available" />Tersedia</div>
                  <div className="legend-item"><div className="legend-dot full" />Penuh</div>
                </div>
              </>
            )}
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

                    <div className="summary-total-row">
                      <span>Total</span>
                      <span className="total-amount">{formatRp(totalPrice)}</span>
                    </div>

                    <button className="sidebar-cta" onClick={handleContinue} disabled={!selectedDate || !selectedSlot}>
                      Lanjut ke Data Diri
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
              {selectedDate ? formatSelectedDate() : 'Pilih tanggal'}
            </div>
            <div className="footer-summary-sub">
              {selectedSlot ? `${selectedSlot} WIB` : 'Belum ada jam'}
            </div>
          </div>
          <button
            className="footer-cta"
            onClick={handleContinue}
            disabled={!selectedDate || !selectedSlot}
          >
            Lanjut ke Data Diri
          </button>
        </div>
      </div>
    </div>
  )
}
