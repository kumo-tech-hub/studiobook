import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/services/api'
import '@/styles/landing.css'

import m1 from '@/assets/m1.jpg'
import m2 from '@/assets/m2.jpg'
import m3 from '@/assets/m3.jpg'
import m4 from '@/assets/m4.jpg'
import m5 from '@/assets/m5.jpg'
import m6 from '@/assets/m6.jpg'
import m7 from '@/assets/m7.jpg'

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '1',
    title: 'Pilih paket foto',
    desc: 'Pilih paket sesuai kebutuhanmu — solo, couple, keluarga, atau maternity. Harga tertera transparan.',
  },
  {
    num: '2',
    title: 'Tambah layanan ekstra',
    desc: 'Print foto, background tambahan, atau extra waktu bisa ditambahkan langsung dengan estimasi harga.',
  },
  {
    num: '3',
    title: 'Pilih tanggal & jam',
    desc: 'Kalender menampilkan slot yang masih tersedia secara real-time. Tidak ada lagi double booking.',
  },
  {
    num: '4',
    title: 'Konfirmasi via WhatsApp',
    desc: 'Pesan WA terisi otomatis dengan detail booking kamu. Tinggal kirim ke admin untuk konfirmasi final.',
  },
]

const TESTIMONIALS = [
  {
    text: 'Booking-nya gampang banget. Langsung tau slot mana yang kosong, tidak perlu nunggu reply WA berjam-jam. Hasilnya juga keren!',
    name: 'Sari Rahayu',
    role: 'Pelanggan · Paket Couple',
    initials: 'SR',
    color: '#C1121F',
  },
  {
    text: 'Sebagai pemilik studio, sekarang semua booking bisa saya pantau dari satu dashboard. Tidak ada lagi double booking dan laporan manual!',
    name: 'Budi Hartono',
    role: 'Admin · Luminary Studio',
    initials: 'BH',
    color: '#1D3557',
  },
  {
    text: 'Awalnya ragu, tapi ternyata proses booking cuma butuh 2 menit. Langsung dapat konfirmasi dan tidak perlu daftar akun dulu. Recommended!',
    name: 'Dewi Anggraini',
    role: 'Pelanggan · Paket Family',
    initials: 'DA',
    color: '#2B4875',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatRp = (n) => 'Rp' + n.toLocaleString('id-ID')


// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content ">
        <h1>
          Abadikan<br />
          <em>momen</em><br />
          terbaik.
        </h1>
        <p className="hero-sub">
          Booking sesi foto kapan saja, lihat slot tersedia secara real-time — tanpa perlu chat WA dan nunggu berjam-jam.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollTo('paket')}>
            Lihat paket foto
          </button>
          <button className="btn-ghost" onClick={() => scrollTo('cara-kerja')}>
            Bagaimana cara kerjanya?
          </button>
        </div>
      </div>
    </section>
  )
}

const MOSAIC_PHOTOS = [
  { src: m1, alt: 'Studio foto 1', cls: 'm1', position: 'center top'    },
  { src: m2, alt: 'Studio foto 2', cls: 'm2', position: 'center center' },
  { src: m3, alt: 'Studio foto 3', cls: 'm3', position: 'center top'    },
  { src: m4, alt: 'Studio foto 4', cls: 'm4', position: '100% 18%' },
  { src: m5, alt: 'Studio foto 5', cls: 'm5', position: '50% top'    },
  { src: m6, alt: 'Studio foto 6', cls: 'm6', position: 'center center' },
  { src: m7, alt: 'Studio foto 7', cls: 'm7', position: '30% 18%'    },
]

function FotoSection() {
  return (
    <section className="foto-section" id="foto">
      <div className="foto-mosaic">
        {MOSAIC_PHOTOS.map((photo) => (
          <div key={photo.cls} className={`mosaic-block ${photo.cls}`}>
            <img
              src={photo.src}
              alt={photo.alt}
              className="mosaic-img"
              style={{ objectPosition: photo.position }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function HowSection({ packages }) {
  const [selectedPkg, setSelectedPkg] = useState(0)
  const displayPackages = packages.slice(0, 3)

  if (displayPackages.length === 0) return null

  return (
    <section className="section how-section" id="cara-kerja">
      <div className="section-inner">
        <div>
          <span className="section-tag">Cara kerja</span>
          <h2 className="section-title">Booking dalam<br />4 langkah mudah</h2>
          <p className="section-desc">
            Tidak perlu nunggu balasan WA. Proses booking selesai dalam hitungan menit dari HP kamu.
          </p>
        </div>

        <div className="how-grid">
          <div className="steps-list">
            {STEPS.map((step) => (
              <div className="step" key={step.num}>
                <div className="step-num">{step.num}</div>
                <div className="step-body">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="how-preview">
            <div className="how-preview-title">Preview — Pilih paket</div>
            <div className="progress-bar">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`progress-step${i === 0 ? ' active' : ''}`} />
              ))}
            </div>
            <div className="preview-pkg-list">
              {displayPackages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`preview-pkg${selectedPkg === i ? ' selected' : ''}`}
                  onClick={() => setSelectedPkg(i)}
                  role="radio"
                  aria-checked={selectedPkg === i}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedPkg(i)}
                >
                  <div>
                    <div className="preview-pkg-name">{pkg.title}</div>
                    <div className="preview-meta">{pkg.duration} menit</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="preview-pkg-price">Rp{pkg.price / 1000}rb</div>
                    <div className="preview-pkg-radio" />
                  </div>
                </div>
              ))}
            </div>
            <div className="preview-footer">
              <span className="preview-footer-label">Total sementara</span>
              <span className="preview-footer-total">
                {formatRp(displayPackages[selectedPkg]?.price || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PackagesSection({ packages, onBook, loading }) {
  return (
    <section className="section packages-section" id="paket">
      <div className="section-inner">
        <span className="section-tag">Paket foto</span>
        <h2 className="section-title">Temukan paket<br />yang pas buat kamu</h2>
        <p className="section-desc">
          Semua paket sudah termasuk akses studio, pencahayaan profesional, dan soft file hasil foto.
        </p>
        <div className="pkg-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-45)' }}>
              Memuat paket pilihan...
            </div>
          ) : packages.length > 0 ? (
            packages.map((pkg, i) => (
              <div key={pkg.id} className={`pkg-card${i === 1 ? ' featured' : ''}`}>
                <span className={`pkg-badge ${i === 1 ? 'hot' : 'default'}`}>
                  {i === 1 ? 'Terlaris' : 'Favorit'}
                </span>
                <div className="pkg-name">{pkg.title}</div>
                <div className="pkg-price">
                  Rp{pkg.price / 1000}<small>rb</small>
                </div>
                <div className="pkg-duration">{pkg.duration} menit sesi foto</div>
                <ul className="pkg-features">
                  {pkg.features?.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                  {!pkg.features && (
                    <>
                      <li>Soft file semua hasil foto</li>
                      <li>Peralatan studio lengkap</li>
                      <li>Asisten fotografer</li>
                    </>
                  )}
                </ul>
                <button className="pkg-btn" onClick={() => onBook(pkg.id)}>
                  Pilih paket ini
                </button>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-45)' }}>
              Belum ada paket yang tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="section testimonials-section" id="testimoni">
      <div className="section-inner">
        <span className="section-tag">Testimoni</span>
        <h2 className="section-title">Kata mereka yang<br />sudah membuktikan</h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card">
              <span className="testi-quote">&ldquo;</span>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <span className="testi-name">{t.name}</span>
                  <span className="testi-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ onBook }) {
  return (
    <section className="cta-section" id="booking">
      <div className="cta-inner">
        <span className="section-tag">Mulai sekarang</span>
        <h2 className="section-title">Siap foto hari ini?</h2>
        <p className="cta-desc">
          Slot tersedia terbatas setiap harinya. Booking sekarang sebelum penuh — tanpa perlu daftar akun.
        </p>
        <div className="cta-actions">
          <button className="btn-dark" onClick={() => onBook()}>
            Pilih paket foto
          </button>
          <button className="btn-white-ghost" onClick={() => scrollTo('cara-kerja')}>
            Pelajari cara kerja
          </button>
        </div>
        <p className="cta-note">Konfirmasi via WhatsApp · Gratis tanpa biaya tambahan</p>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/packages')
        // Filter hanya paket yang aktif
        setPackages(res.data.filter(p => p.is_active))
      } catch (err) {
        console.error('Gagal memuat paket:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const goToBooking = (pkgId) => {
    if (pkgId) {
      // Jika butuh simpan di store, bisa panggil setPackage(pkg) di sini
      navigate('/booking/paket')
    } else {
      navigate('/booking/paket')
    }
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <FotoSection />
      <HowSection packages={packages} />
      <PackagesSection packages={packages} onBook={goToBooking} loading={loading} />
      <TestimonialsSection />
      <CTASection onBook={() => goToBooking()} />
      <Footer />
      <button
        className="floating-cta"
        onClick={() => goToBooking()}
        aria-label="Booking sekarang"
      >
        Booking sekarang
      </button>
    </>
  )
}
