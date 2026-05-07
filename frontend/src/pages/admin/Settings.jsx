import { useState, useRef, useEffect } from 'react'
import '@/styles/admin.css'
import api from '@/services/api'
import { Skel } from '@/components/ui/Skeleton'

const BANK_OPTIONS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Gopay', 'OVO', 'Dana']

// ⚠️ Harus di luar komponen Settings agar tidak di-remount setiap render
function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: '13px', color: 'var(--text-60)', marginBottom: '8px', display: 'block' }}>{label}</label>
      {children}
    </div>
  )
}

export default function Settings() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  const [profile, setProfile]   = useState({ studio_name: '', studio_desc: '' })
  const [contact, setContact]   = useState({ contact_phone: '', contact_email: '', contact_address: '', contact_ig: '' })
  const [payment, setPayment]   = useState({ payment_bank: 'BCA', payment_number: '', payment_name: '' })

  const fileInputRef = useRef(null)

  // ─── Fetch dari API ────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/settings')
        const d = res.data
        setProfile({ studio_name: d.studio_name, studio_desc: d.studio_desc })
        setContact({ contact_phone: d.contact_phone, contact_email: d.contact_email, contact_address: d.contact_address, contact_ig: d.contact_ig })
        setPayment({ payment_bank: d.payment_bank, payment_number: d.payment_number, payment_name: d.payment_name })
      } catch (err) {
        console.error('Gagal memuat settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])


  // ─── Simpan ke API ─────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/admin/settings', { ...profile, ...contact, ...payment })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Gagal menyimpan pengaturan.')
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="settings-page" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Pengaturan Sistem</h1>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="admin-btn"
          style={{ margin: 0, width: 'auto', padding: '12px 24px', opacity: saving || loading ? 0.7 : 1 }}
        >
          {saving ? 'Menyimpan...' : saved ? '✓ Tersimpan' : 'Simpan Perubahan'}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {[...Array(2)].map((_, col) => (
            <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="dash-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Skel w="40%" h={18} />
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Skel w={80} h={80} circle />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Skel w={120} h={14} /><Skel w={80} h={12} />
                  </div>
                </div>
                {[...Array(3)].map((_, i) => <div key={i}><Skel w="40%" h={12} style={{ marginBottom: 6 }} /><Skel w="100%" h={38} /></div>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* KOLOM KIRI — Profil Studio & Pembayaran */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h3 className="dash-panel-title">Profil Studio</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <Field label="Nama Studio">
                  <input type="text" className="admin-input" value={profile.studio_name} onChange={e => setProfile(p => ({ ...p, studio_name: e.target.value }))} style={{ width: '100%' }} />
                </Field>

                <Field label="Deskripsi Singkat">
                  <textarea className="admin-input" value={profile.studio_desc} onChange={e => setProfile(p => ({ ...p, studio_desc: e.target.value }))} style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
                </Field>

                <div style={{ height: '1px', background: 'var(--white-06)', margin: '8px 0' }} />

                <div className="dash-panel-header" style={{ padding: 0 }}>
                  <h3 className="dash-panel-title" style={{ fontSize: '15px' }}>Konfigurasi Pembayaran</h3>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-45)', marginBottom: '4px' }}>
                  Info ini akan muncul di pesan WA admin ke customer.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Bank / E-Wallet">
                    <select className="admin-input" value={payment.payment_bank} onChange={e => setPayment(p => ({ ...p, payment_bank: e.target.value }))} style={{ width: '100%' }}>
                      {BANK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Nomor Rekening / No. HP">
                    <input type="text" className="admin-input" value={payment.payment_number} onChange={e => setPayment(p => ({ ...p, payment_number: e.target.value }))} style={{ width: '100%' }} />
                  </Field>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Atas Nama (A.N)">
                      <input type="text" className="admin-input" value={payment.payment_name} onChange={e => setPayment(p => ({ ...p, payment_name: e.target.value }))} style={{ width: '100%' }} />
                    </Field>
                  </div>
                </div>

                {/* Preview pesan WA */}
                <div style={{ marginTop: '8px', background: 'var(--primary-mid)', borderRadius: '10px', padding: '16px', fontSize: '12px', lineHeight: 1.6, border: '1px solid var(--white-06)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-45)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Preview Pesan WA ke Customer</div>
                  <div style={{ color: 'var(--text-60)', whiteSpace: 'pre-line' }}>
                    {`Halo 👋 Booking kamu sudah kami terima!\n\n💰 Total: Rp ...\n\nSilakan transfer ke:\n🏦 ${payment.payment_bank}: ${payment.payment_number || '—'}\n👤 a/n: ${payment.payment_name || '—'}\n\nMohon kirimkan bukti transfer. Terima kasih! 🙏`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN — Info Kontak */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h3 className="dash-panel-title">Info Kontak</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <Field label="Nomor WhatsApp / Telepon">
                  <input type="text" className="admin-input" value={contact.contact_phone} onChange={e => setContact(c => ({ ...c, contact_phone: e.target.value }))} style={{ width: '100%' }} />
                </Field>
                <Field label="Alamat Email">
                  <input type="email" className="admin-input" value={contact.contact_email} onChange={e => setContact(c => ({ ...c, contact_email: e.target.value }))} style={{ width: '100%' }} />
                </Field>
                <Field label="Akun Instagram">
                  <input type="text" className="admin-input" value={contact.contact_ig} onChange={e => setContact(c => ({ ...c, contact_ig: e.target.value }))} style={{ width: '100%' }} />
                </Field>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Alamat Lengkap Studio">
                    <textarea className="admin-input" value={contact.contact_address} onChange={e => setContact(c => ({ ...c, contact_address: e.target.value }))} style={{ width: '100%', minHeight: '100px', resize: 'vertical' }} />
                  </Field>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
