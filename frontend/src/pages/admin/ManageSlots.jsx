import { useState } from 'react'
import '@/styles/slots.css'
import '@/styles/packages.css' // Reusing toggle styles

const INITIAL_HOURS = [
  { day: 'Senin', start: '10:00', end: '22:00', active: true },
  { day: 'Selasa', start: '10:00', end: '22:00', active: true },
  { day: 'Rabu', start: '10:00', end: '22:00', active: true },
  { day: 'Kamis', start: '10:00', end: '22:00', active: true },
  { day: 'Jumat', start: '10:00', end: '23:00', active: true },
  { day: 'Sabtu', start: '09:00', end: '23:00', active: true },
  { day: 'Minggu', start: '09:00', end: '22:00', active: true },
]

const INITIAL_BLOCKED = [
  { id: 1, date: '28 April 2026', desc: 'Libur - maintenance studio' },
  { id: 2, date: '1 Mei 2026', desc: 'Libur Hari Buruh' },
  { id: 3, date: '17 – 18 Mei 2026', desc: 'Private event' },
]

export default function ManageSlots() {
  const [hours, setHours] = useState(INITIAL_HOURS)
  const [duration, setDuration] = useState(45)
  const [blocked, setBlocked] = useState(INITIAL_BLOCKED)

  const toggleDay = (index) => {
    setHours(hours.map((h, i) => i === index ? { ...h, active: !h.active } : h))
  }

  const updateTime = (index, field, value) => {
    setHours(hours.map((h, i) => i === index ? { ...h, [field]: value } : h))
  }

  const removeBlocked = (id) => {
    setBlocked(blocked.filter(b => b.id !== id))
  }

  return (
    <div className="slots-page">
      {/* Left Column: Opening Hours */}
      <div className="slots-panel">
        <div>
          <span className="panel-label">Jam Operasional</span>
          <h2 className="panel-title">Studio buka kapan?</h2>
        </div>
        
        <div className="hours-list">
          {hours.map((h, i) => (
            <div key={h.day} className={`hour-row ${!h.active ? 'inactive' : ''}`}>
              <span className="day-name">{h.day}</span>
              
              <div className="time-input-group">
                <input 
                  type="text" 
                  value={h.start} 
                  onChange={(e) => updateTime(i, 'start', e.target.value)}
                  className="time-field"
                />
                <input 
                  type="text" 
                  value={h.end} 
                  onChange={(e) => updateTime(i, 'end', e.target.value)}
                  className="time-field"
                />
              </div>

              <label className="switch" style={{ marginLeft: 'auto' }}>
                <input 
                  type="checkbox" 
                  checked={h.active} 
                  onChange={() => toggleDay(i)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Duration & Block Dates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Duration Panel */}
        <div className="slots-panel">
          <div>
            <span className="panel-label">Durasi Slot</span>
            <h2 className="panel-title">Panjang per sesi</h2>
          </div>

          <div className="duration-grid">
            {[30, 45, 60, 90].map((d) => (
              <button 
                key={d} 
                className={`duration-opt ${duration === d ? 'active' : ''}`}
                onClick={() => setDuration(d)}
              >
                {d} min
              </button>
            ))}
          </div>

          <p className="duration-help">
            Slot akan di-generate setiap {duration} menit, dengan 5 menit buffer di antara sesi.
          </p>
        </div>

        {/* Blocked Dates Panel */}
        <div className="slots-panel">
          <div className="slots-panel-header">
            <div>
              <span className="panel-label">Block Tanggal</span>
              <h2 className="panel-title">Tanggal tidak available</h2>
            </div>
            <button className="add-block-btn">+ Tambah</button>
          </div>

          <div className="blocked-list">
            {blocked.map((b) => (
              <div key={b.id} className="blocked-item">
                <div className="blocked-info">
                  <span className="blocked-date">{b.date}</span>
                  <span className="blocked-desc">{b.desc}</span>
                </div>
                <button 
                  className="remove-block"
                  onClick={() => removeBlocked(b.id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
