import { useState } from 'react'
import '@/styles/packages.css'

// Import assets
import m1 from '@/assets/m1.jpg'
import m2 from '@/assets/m2.jpg'
import m3 from '@/assets/m3.jpg'
import m4 from '@/assets/m4.jpg'

const INITIAL_PACKAGES = [
  {
    id: 1,
    title: 'Solo Session',
    meta: '1 orang · 30 min · 60+ foto',
    desc: 'Untuk satu orang. 30 menit studio, semua hasil file.',
    price: 'Rp 125.000',
    image: m1,
    active: true,
    isSpecial: false
  },
  {
    id: 2,
    title: 'Duo Frame',
    meta: '2 orang · 45 min · 100+ foto',
    desc: 'Berdua. Paling banyak diambil buat best-friend atau couple.',
    price: 'Rp 185.000',
    image: m2,
    active: true,
    isSpecial: true
  },
  {
    id: 3,
    title: 'Squad Session',
    meta: '3-4 orang · 60 min · 150+ foto',
    desc: 'Bareng-bareng, sampai 4 orang. 60 menit full.',
    price: 'Rp 265.000',
    image: m3,
    active: true,
    isSpecial: false
  },
  {
    id: 4,
    title: 'Family Edition',
    meta: '5-8 orang · 90 min · 200+ foto + cetak',
    desc: 'Satu ruang, satu frame, seluruh keluarga. Termasuk cetak 5R.',
    price: 'Rp 425.000',
    image: m4,
    active: true,
    isSpecial: false
  }
]

const ADDONS = [
  {
    id: 'print',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="6" y="2" width="12" height="10" rx="1"/><rect x="6" y="17" width="12" height="5" rx="1"/>
        <path d="M6 12H4a2 2 0 00-2 2v5h4v-5"/><path d="M18 12h2a2 2 0 012 2v5h-4v-5"/>
      </svg>
    ),
    name: 'Cetak foto tambahan',
    desc: '4 lembar ukuran 4R',
    price: 'Rp 50.000',
    active: true
  },
  {
    id: 'bg',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l4-4 4 4 4-4 4 4"/>
        <path d="M3 15l4 4 4-4 4 4 4-4"/>
      </svg>
    ),
    name: 'Background extra',
    desc: '1 background tambahan',
    price: 'Rp 75.000',
    active: true
  },
  {
    id: 'time',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    name: 'Extra waktu',
    desc: 'Tambah 30 menit sesi',
    price: 'Rp 100.000',
    active: true
  },
  {
    id: 'makeup',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="5"/><path d="M12 13v8m-4-4h8"/>
      </svg>
    ),
    name: 'Makeup artist',
    desc: 'Touch up profesional',
    price: 'Rp 150.000',
    active: true
  },
]

export default function ManagePackages() {
  const [activeTab, setActiveTab] = useState('paket')
  const [packages, setPackages] = useState(INITIAL_PACKAGES)
  const [addons, setAddons] = useState(ADDONS)

  const toggleStatus = (id, type = 'paket') => {
    if (type === 'paket') {
      setPackages(packages.map(pkg => 
        pkg.id === id ? { ...pkg, active: !pkg.active } : pkg
      ))
    } else {
      setAddons(addons.map(addon => 
        addon.id === id ? { ...addon, active: !addon.active } : addon
      ))
    }
  }

  return (
    <div className="packages-page">
      <div className="packages-header">
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${activeTab === 'paket' ? 'active' : ''}`}
            onClick={() => setActiveTab('paket')}
          >
            Paket foto
          </button>
          <button 
            className={`tab-btn ${activeTab === 'addon' ? 'active' : ''}`}
            onClick={() => setActiveTab('addon')}
          >
            Add-on
          </button>
        </div>
      </div>

      {activeTab === 'paket' ? (
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-image-wrapper">
                <img src={pkg.image} alt={pkg.title} className="package-image" />
              </div>
              
              <div className="package-details">
                <div className="card-top-header">
                  <h3 className="package-title">
                    {pkg.title}
                    {pkg.isSpecial && <span>★</span>}
                  </h3>
                  
                  <label className={`toggle-wrapper ${!pkg.active ? 'inactive' : ''}`}>
                    <span>{pkg.active ? 'Aktif' : 'Nonaktif'}</span>
                    <div className="switch">
                      <input 
                        type="checkbox" 
                        checked={pkg.active} 
                        onChange={() => toggleStatus(pkg.id, 'paket')}
                      />
                      <span className="slider"></span>
                    </div>
                  </label>
                </div>

                <p className="package-meta">{pkg.meta}</p>
                <p className="package-desc">{pkg.desc}</p>
                
                <hr className="package-divider" />
                
                <div className="card-footer">
                  <span className="package-price">{pkg.price}</span>
                  
                  <div className="action-btns">
                    <button className="btn-edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button className="btn-delete">
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
          {addons.map((addon) => (
            <div key={addon.id} className="package-card addon-card">
              <div className="addon-icon-wrapper">
                {addon.icon}
              </div>
              
              <div className="package-details">
                <div className="card-top-header">
                  <h3 className="package-title">{addon.name}</h3>
                  
                  <label className={`toggle-wrapper ${!addon.active ? 'inactive' : ''}`}>
                    <span>{addon.active ? 'Aktif' : 'Nonaktif'}</span>
                    <div className="switch">
                      <input 
                        type="checkbox" 
                        checked={addon.active} 
                        onChange={() => toggleStatus(addon.id, 'addon')}
                      />
                      <span className="slider"></span>
                    </div>
                  </label>
                </div>

                <p className="package-desc">{addon.desc}</p>
                
                <hr className="package-divider" />
                
                <div className="card-footer">
                  <span className="package-price">{addon.price}</span>
                  
                  <div className="action-btns">
                    <button className="btn-edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button className="btn-delete">
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
