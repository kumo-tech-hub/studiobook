import { useState, useEffect, useCallback, useRef } from 'react'
import '@/styles/packages.css'
import api from '@/services/api'

// --- ICON MAP untuk Add-on ---
const ICON_MAP = {
  print: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="2" width="12" height="10" rx="1"/><rect x="6" y="17" width="12" height="5" rx="1"/>
      <path d="M6 12H4a2 2 0 00-2 2v5h4v-5"/><path d="M18 12h2a2 2 0 012 2v5h-4v-5"/>
    </svg>
  ),
  bg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l4-4 4 4 4-4 4 4"/>
      <path d="M3 15l4 4 4-4 4 4 4-4"/>
    </svg>
  ),
  time: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  makeup: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="5"/><path d="M12 13v8m-4-4h8"/>
    </svg>
  ),
  sparkles: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
}

const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID')

export default function ManagePackages() {
  const [activeTab, setActiveTab] = useState('paket')
  const [packages, setPackages] = useState([])
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [features, setFeatures] = useState([{ text: '' }])
  const [previewImg, setPreviewImg] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const imageInputRef = useRef(null)

  // Fetch data dari API
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [pkgRes, addonRes] = await Promise.all([
        api.get('/packages'),
        api.get('/addons'),
      ])
      setPackages(pkgRes.data)
      setAddons(addonRes.data)
    } catch (err) {
      console.error('Gagal mengambil data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Toggle status aktif/nonaktif
  const toggleStatus = async (id, type) => {
    const endpoint = type === 'paket' ? `/admin/packages/${id}/status` : `/admin/addons/${id}/status`
    try {
      const res = await api.patch(endpoint)
      if (type === 'paket') {
        setPackages(prev => prev.map(p => p.id === id ? { ...p, is_active: res.data.is_active } : p))
      } else {
        setAddons(prev => prev.map(a => a.id === id ? { ...a, is_active: res.data.is_active } : a))
      }
    } catch (err) {
      alert('Gagal mengubah status.')
    }
  }

  // Buka form create
  const handleCreate = () => {
    setEditData(null)
    setFeatures([{ text: '' }])
    setPreviewImg(null)
    setShowForm(true)
  }

  // Buka form edit
  const handleEdit = (data) => {
    setEditData(data)
    // Parse features dari description (JSON string)
    let parsed = [{ text: data.description || '' }]
    try {
      if (data.description?.trim().startsWith('[')) {
        parsed = JSON.parse(data.description)
      }
    } catch (e) {}
    setFeatures(parsed)
    setPreviewImg(data.image_url || null)
    setShowForm(true)
  }

  // Hapus paket/addon
  const handleDelete = async (id, type) => {
    const endpoint = type === 'paket' ? `/admin/packages/${id}` : `/admin/addons/${id}`
    try {
      await api.delete(endpoint)
      if (type === 'paket') {
        setPackages(prev => prev.filter(p => p.id !== id))
      } else {
        setAddons(prev => prev.filter(a => a.id !== id))
      }
      setDeleteConfirm(null)
    } catch (err) {
      alert('Gagal menghapus data.')
    }
  }

  // Submit form
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const formEl = e.target

    try {
      if (activeTab === 'paket') {
        const formData = new FormData()
        formData.append('title', formEl.pkg_title.value)
        formData.append('price', formEl.pkg_price.value)
        const metaParts = [formEl.pkg_orang.value, formEl.pkg_waktu.value, formEl.pkg_foto.value].filter(Boolean)
        formData.append('meta', metaParts.join(' · '))
        formData.append('description', JSON.stringify(features))
        formData.append('is_special', formEl.pkg_special.checked ? '1' : '0')

        if (imageInputRef.current?.files[0]) {
          formData.append('image', imageInputRef.current.files[0])
        }

        if (editData) {
          formData.append('_method', 'PUT')
          await api.post(`/admin/packages/${editData.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          await api.post('/admin/packages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      } else {
        const payload = {
          name: formEl.addon_name.value,
          price: formEl.addon_price.value,
          description: formEl.addon_desc.value,
          icon_name: formEl.addon_icon.value,
        }
        if (editData) {
          await api.put(`/admin/addons/${editData.id}`, payload)
        } else {
          await api.post('/admin/addons', payload)
        }
      }

      await fetchData()
      setShowForm(false)
      setEditData(null)
    } catch (err) {
      alert('Gagal menyimpan. Cek kembali input Anda.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // --- FORM VIEW ---
  if (showForm) {
    return (
      <div className="packages-page">
        <div className="packages-header" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>
            {editData ? 'Edit' : 'Tambah'} {activeTab === 'paket' ? 'Paket Foto' : 'Add-on'}
          </h2>
          <button
            className="admin-btn"
            style={{ width: 'auto', padding: '10px 20px', margin: 0, background: 'transparent', color: 'var(--text)', border: '1px solid var(--white-15)' }}
            onClick={() => { setShowForm(false); setEditData(null) }}
          >
            Batal
          </button>
        </div>

        <div className="bd-card" style={{ maxWidth: 800 }}>
          <form onSubmit={handleSave}>
            {activeTab === 'paket' ? (
              <>
                {/* Nama Paket */}
                <div className="admin-form-group">
                  <label>Nama Paket</label>
                  <input name="pkg_title" type="text" className="admin-input" defaultValue={editData?.title || ''} required />
                </div>

                {/* Harga */}
                <div className="admin-form-group">
                  <label>Harga (angka saja, tanpa Rp)</label>
                  <input name="pkg_price" type="number" className="admin-input" defaultValue={editData?.price || ''} placeholder="125000" required />
                </div>

                {/* Meta info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Jumlah Orang</label>
                    <input name="pkg_orang" type="text" className="admin-input" defaultValue={editData?.meta?.split(' · ')[0] || ''} placeholder="1 orang" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Lama Sesi</label>
                    <input name="pkg_waktu" type="text" className="admin-input" defaultValue={editData?.meta?.split(' · ')[1] || ''} placeholder="30 min" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Jumlah Foto</label>
                    <input name="pkg_foto" type="text" className="admin-input" defaultValue={editData?.meta?.split(' · ')[2] || ''} placeholder="60+ foto" />
                  </div>
                </div>

                {/* Fitur / Keunggulan */}
                <div className="admin-form-group">
                  <label>Fitur / Keunggulan Paket</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {features.map((feature, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <textarea
                          className="admin-input"
                          rows="2"
                          style={{ resize: 'vertical', flex: 1 }}
                          placeholder="Penjelasan fitur..."
                          value={feature.text}
                          onChange={(e) => {
                            const updated = [...features]
                            updated[index].text = e.target.value
                            setFeatures(updated)
                          }}
                        />
                        {features.length > 1 && (
                          <button
                            type="button"
                            className="btn-delete"
                            style={{ border: 'none', padding: '10px', marginTop: '2px' }}
                            onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeatures([...features, { text: '' }])}
                    style={{ marginTop: '12px', background: 'transparent', border: '1px dashed var(--white-15)', padding: '8px 16px', borderRadius: '8px', color: 'var(--text-60)', cursor: 'pointer', fontSize: '13px' }}
                  >
                    + Tambah Fitur Baru
                  </button>
                </div>

                {/* Gambar */}
                <div className="admin-form-group">
                  <label>Gambar Paket</label>
                  {previewImg && (
                    <img src={previewImg} alt="Preview" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', marginBottom: 12 }} />
                  )}
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    className="admin-input"
                    style={{ padding: '10px 16px', background: 'var(--white-06)' }}
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) setPreviewImg(URL.createObjectURL(file))
                    }}
                  />
                </div>

                {/* Paket Spesial */}
                <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <input name="pkg_special" type="checkbox" id="pkg_special" defaultChecked={editData?.is_special || false} style={{ width: 18, height: 18 }} />
                  <label htmlFor="pkg_special" style={{ marginBottom: 0 }}>Tandai sebagai Paket Spesial (★)</label>
                </div>
              </>
            ) : (
              <>
                {/* Form Add-on */}
                <div className="admin-form-group">
                  <label>Nama Add-on</label>
                  <input name="addon_name" type="text" className="admin-input" defaultValue={editData?.name || ''} required />
                </div>
                <div className="admin-form-group">
                  <label>Harga (angka saja)</label>
                  <input name="addon_price" type="number" className="admin-input" defaultValue={editData?.price || ''} placeholder="50000" required />
                </div>
                <div className="admin-form-group">
                  <label>Deskripsi Singkat</label>
                  <input name="addon_desc" type="text" className="admin-input" defaultValue={editData?.description || ''} placeholder="Contoh: 4 lembar ukuran 4R" />
                </div>
                <div className="admin-form-group">
                  <label>Pilih Icon Add-on</label>
                  <select name="addon_icon" className="admin-input" defaultValue={editData?.icon_name || 'sparkles'}>
                    <option value="print">Cetak (Printer)</option>
                    <option value="bg">Background / Latar</option>
                    <option value="time">Waktu / Jam</option>
                    <option value="makeup">Makeup / Sentuhan</option>
                    <option value="sparkles">Lainnya (Bintang)</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="admin-btn" style={{ width: 'auto', padding: '12px 32px', marginTop: 16 }} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- LIST VIEW ---
  return (
    <div className="packages-page">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="bd-card" style={{ maxWidth: 380, width: '100%', textAlign: 'center', padding: '32px' }}>
            <h3 style={{ marginBottom: 12 }}>Hapus {deleteConfirm.type === 'paket' ? 'Paket' : 'Add-on'}?</h3>
            <p style={{ color: 'var(--text-60)', fontSize: '14px', marginBottom: 24 }}>
              <b>"{deleteConfirm.label}"</b> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--white-15)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.type)}
                className="btn-delete"
                style={{ padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="packages-header">
        <div className="tab-switcher">
          <button className={`tab-btn ${activeTab === 'paket' ? 'active' : ''}`} onClick={() => setActiveTab('paket')}>Paket foto</button>
          <button className={`tab-btn ${activeTab === 'addon' ? 'active' : ''}`} onClick={() => setActiveTab('addon')}>Add-on</button>
        </div>
        <button className="admin-btn" style={{ width: 'auto', padding: '10px 20px', margin: 0 }} onClick={handleCreate}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tambah
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-45)' }}>Memuat data...</div>
      ) : activeTab === 'paket' ? (
        <div className="packages-grid">
          {packages.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-45)' }}>
              Belum ada paket. Klik "+ Tambah" untuk membuat paket pertama.
            </div>
          ) : packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-image-wrapper">
                {pkg.image_url
                  ? <img src={pkg.image_url} alt={pkg.title} className="package-image" />
                  : <div style={{ width: '100%', height: '100%', background: 'var(--primary-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-45)', fontSize: 14 }}>Tanpa Gambar</div>
                }
              </div>

              <div className="package-details">
                <div className="card-top-header">
                  <h3 className="package-title">
                    {pkg.title}
                    {pkg.is_special && <span>★</span>}
                  </h3>
                  <label className={`toggle-wrapper ${!pkg.is_active ? 'inactive' : ''}`}>
                    <span>{pkg.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    <div className="switch">
                      <input type="checkbox" checked={pkg.is_active} onChange={() => toggleStatus(pkg.id, 'paket')} />
                      <span className="slider"></span>
                    </div>
                  </label>
                </div>

                <p className="package-meta">{pkg.meta}</p>
                <p className="package-desc">
                  {(() => {
                    try {
                      const parsed = JSON.parse(pkg.description)
                      if (Array.isArray(parsed)) return parsed.map(f => f.text).join(' · ')
                    } catch(e) {}
                    return pkg.description
                  })()}
                </p>

                <hr className="package-divider" />

                <div className="card-footer">
                  <span className="package-price">{pkg.price_label}</span>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(pkg)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => setDeleteConfirm({ id: pkg.id, label: pkg.title, type: 'paket' })}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="packages-grid">
          {addons.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-45)' }}>
              Belum ada add-on. Klik "+ Tambah" untuk membuat add-on pertama.
            </div>
          ) : addons.map((addon) => (
            <div key={addon.id} className="package-card addon-card">
              <div className="addon-icon-wrapper">
                {ICON_MAP[addon.icon_name] || ICON_MAP.sparkles}
              </div>

              <div className="package-details">
                <div className="card-top-header">
                  <h3 className="package-title">{addon.name}</h3>
                  <label className={`toggle-wrapper ${!addon.is_active ? 'inactive' : ''}`}>
                    <span>{addon.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    <div className="switch">
                      <input type="checkbox" checked={addon.is_active} onChange={() => toggleStatus(addon.id, 'addon')} />
                      <span className="slider"></span>
                    </div>
                  </label>
                </div>

                <p className="package-desc">{addon.description}</p>

                <hr className="package-divider" />

                <div className="card-footer">
                  <span className="package-price">{formatRupiah(addon.price)}</span>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(addon)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => setDeleteConfirm({ id: addon.id, label: addon.name, type: 'addon' })}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
