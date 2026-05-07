import { useState, useEffect, useMemo, useCallback } from 'react'
import '@/styles/slots.css'
import '@/styles/packages.css'
import api from '@/services/api'
import { SkeletonSlots } from '@/components/ui/Skeleton'

const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const DEFAULT_HOURS = DAY_ORDER.map((day) => ({
  day,
  start: '10:00',
  end: '22:00',
  duration: 45,
  active: true,
}))

export default function ManageSlots() {
  const [hours, setHours] = useState(DEFAULT_HOURS)
  const [blocked, setBlocked] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [blockDate, setBlockDate] = useState('')
  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [blockDesc, setBlockDesc] = useState('')
  const [blockSaving, setBlockSaving] = useState(false)

  // Preview state
  const [previewDay, setPreviewDay] = useState('Senin')

  // ─── Fetch data dari API ───────────────────────────────────────
  const fetchSchedule = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/schedule')
      if (res.data.hours.length > 0) {
        const sorted = [...DEFAULT_HOURS].map((def) => {
          const found = res.data.hours.find(h => h.day === def.day)
          return found || def
        })
        setHours(sorted)
      }
      setBlocked(res.data.blocked || [])
    } catch (err) {
      console.error('Gagal mengambil jadwal:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  // ─── Update field per hari (lokal) ────────────────────────────
  const toggleDay = (index) => {
    setHours(hours.map((h, i) => i === index ? { ...h, active: !h.active } : h))
  }

  const updateTime = (index, field, value) => {
    setHours(hours.map((h, i) => i === index ? { ...h, [field]: value } : h))
  }

  // ─── Simpan jam operasional ke API ────────────────────────────
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await api.post('/admin/schedule/hours', { hours })
      alert('Jadwal berhasil disimpan!')
    } catch (err) {
      alert('Gagal menyimpan jadwal. Coba lagi.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // ─── Tambah blokir tanggal ────────────────────────────────────
  const handleSaveBlock = async () => {
    if (!blockDate || !blockDesc) {
      alert('Tanggal dan Keterangan wajib diisi.')
      return
    }
    setBlockSaving(true)
    try {
      const res = await api.post('/admin/schedule/blocked', {
        date:       blockDate,
        desc:       blockDesc,
        start_time: blockStart || null,
        end_time:   blockEnd   || null,
      })
      setBlocked(prev => [...prev, res.data])
      setIsModalOpen(false)
      setBlockDate(''); setBlockStart(''); setBlockEnd(''); setBlockDesc('')
    } catch (err) {
      alert('Gagal menyimpan blokir. Coba lagi.')
      console.error(err)
    } finally {
      setBlockSaving(false)
    }
  }

  // ─── Hapus blokir tanggal ─────────────────────────────────────
  const removeBlocked = async (id) => {
    try {
      await api.delete(`/admin/schedule/blocked/${id}`)
      setBlocked(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      alert('Gagal menghapus blokir.')
    }
  }

  // ─── Preview slot generator ───────────────────────────────────
  const previewSlots = useMemo(() => {
    const dayConfig = hours.find(h => h.day === previewDay)
    if (!dayConfig || !dayConfig.active) return []

    const slots = []
    let current = new Date(`2026-01-01T${dayConfig.start}:00`)
    const end = new Date(`2026-01-01T${dayConfig.end}:00`)
    const durationMs = dayConfig.duration * 60000
    const bufferMs = 5 * 60000

    while (current.getTime() + durationMs <= end.getTime()) {
      const slotEnd = new Date(current.getTime() + durationMs)
      const fmt = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
      slots.push(`${fmt(current)} - ${fmt(slotEnd)}`)
      current = new Date(slotEnd.getTime() + bufferMs)
    }
    return slots
  }, [hours, previewDay])

  // ─── RENDER ───────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Atur Jadwal & Slot</h1>
        <button
          onClick={handleSaveAll}
          className="admin-btn"
          style={{ margin: 0, width: 'auto', padding: '10px 20px' }}
          disabled={saving || loading}
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {loading ? (
        <SkeletonSlots />
      ) : (
        <div className="slots-page">
          {/* ─── Kolom Kiri: Jam Operasional ─────────────────── */}
          <div className="slots-panel">
            <div>
              <span className="panel-label">Jam Operasional & Durasi</span>
              <h2 className="panel-title">Pengaturan per hari</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-45)', marginBottom: '16px' }}>
                Atur jam buka, tutup, dan durasi slot (termasuk 5 menit jeda) untuk setiap harinya.
              </p>
            </div>

            <div className="hours-list">
              {hours.map((h, i) => (
                <div key={h.day} className={`hour-row ${!h.active ? 'inactive' : ''}`} style={{ flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '8px' }}>
                    <span className="day-name" style={{ flex: 1 }}>{h.day}</span>
                    <label className="switch">
                      <input type="checkbox" checked={h.active} onChange={() => toggleDay(i)} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {h.active && (
                    <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
                      <div className="time-input-group" style={{ flex: 3 }}>
                        <input type="time" value={h.start} onChange={(e) => updateTime(i, 'start', e.target.value)} className="time-field" />
                        <span style={{ color: 'var(--text-60)' }}>-</span>
                        <input type="time" value={h.end} onChange={(e) => updateTime(i, 'end', e.target.value)} className="time-field" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <select
                          value={h.duration}
                          onChange={(e) => updateTime(i, 'duration', Number(e.target.value))}
                          className="time-field"
                          style={{ width: '100%', padding: '8px' }}
                        >
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>60 min</option>
                          <option value={90}>90 min</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Kolom Kanan: Blokir & Preview ──────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Panel Blokir Tanggal */}
            <div className="slots-panel">
              <div className="slots-panel-header">
                <div>
                  <span className="panel-label">Block Tanggal & Jam</span>
                  <h2 className="panel-title">Waktu tidak available</h2>
                </div>
                <button className="add-block-btn" onClick={() => setIsModalOpen(true)}>+ Tambah</button>
              </div>

              <div className="blocked-list">
                {blocked.length === 0 ? (
                  <div style={{ color: 'var(--text-45)', fontSize: '13px', fontStyle: 'italic' }}>
                    Tidak ada tanggal yang diblokir.
                  </div>
                ) : blocked.map((b) => (
                  <div key={b.id} className="blocked-item" style={{ alignItems: 'flex-start' }}>
                    <div className="blocked-info">
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="blocked-date" style={{ fontWeight: 600 }}>{b.date}</span>
                        <span style={{ fontSize: '12px', background: 'var(--primary-mid)', padding: '2px 6px', borderRadius: '4px' }}>
                          {b.timeRange}
                        </span>
                      </div>
                      <span className="blocked-desc">{b.desc}</span>
                    </div>
                    <button className="remove-block" onClick={() => removeBlocked(b.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Preview Slot */}
            <div className="slots-panel">
              <div>
                <span className="panel-label">Simulasi Slot</span>
                <h2 className="panel-title">Preview Jadwal</h2>
              </div>

              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <select
                  className="time-field"
                  style={{ width: '100%', padding: '10px' }}
                  value={previewDay}
                  onChange={(e) => setPreviewDay(e.target.value)}
                >
                  {hours.map(h => <option key={h.day} value={h.day}>Preview Hari {h.day}</option>)}
                </select>
              </div>

              {hours.find(h => h.day === previewDay)?.active ? (
                previewSlots.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                    {previewSlots.map((slot, idx) => (
                      <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--white-06)', padding: '8px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', color: 'var(--text)' }}>
                        {slot}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-45)', background: 'var(--primary-mid)', borderRadius: '8px' }}>
                    Durasi terlalu panjang untuk jam operasional ini.
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-45)', background: 'var(--primary-mid)', borderRadius: '8px' }}>
                  Studio tutup pada hari {previewDay}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Tambah Blokir ──────────────────────────── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="slots-panel" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '16px' }}>Tambah Blokir Tanggal</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-60)', marginBottom: '4px', display: 'block' }}>Tanggal *</label>
                <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} className="time-field" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-60)', marginBottom: '4px', display: 'block' }}>Rentang Jam (kosongkan jika seharian)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="time" value={blockStart} onChange={e => setBlockStart(e.target.value)} className="time-field" style={{ width: '100%' }} />
                  <span>-</span>
                  <input type="time" value={blockEnd} onChange={e => setBlockEnd(e.target.value)} className="time-field" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-60)', marginBottom: '4px', display: 'block' }}>Keterangan *</label>
                <input
                  type="text"
                  value={blockDesc}
                  onChange={e => setBlockDesc(e.target.value)}
                  className="time-field"
                  style={{ width: '100%' }}
                  placeholder="Contoh: Maintenance, Private Event"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setIsModalOpen(false); setBlockDate(''); setBlockStart(''); setBlockEnd(''); setBlockDesc('') }}
                style={{ padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-60)', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleSaveBlock}
                disabled={blockSaving}
                style={{ padding: '10px 16px', background: 'var(--text)', color: 'var(--primary)', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                {blockSaving ? 'Menyimpan...' : 'Simpan Blokir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
