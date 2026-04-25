import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import '@/styles/landing.css'

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

const PREVIEW_PACKAGES = [
  { name: 'Paket Basic',  meta: '60 menit · 1 orang',  price: 'Rp150rb', total: 'Rp150.000' },
  { name: 'Paket Couple', meta: '90 menit · 2 orang',  price: 'Rp250rb', total: 'Rp250.000' },
  { name: 'Paket Family', meta: '120 menit · max 6',   price: 'Rp400rb', total: 'Rp400.000' },
]

const PACKAGES = [
  {
    badge: 'Solo', badgeVariant: 'default',
    name: 'Basic', price: 'Rp150', unit: 'rb',
    duration: '60 menit · 1 orang',
    features: ['1 background pilihan', 'Cetak 2 foto ukuran 4R', 'Soft file semua hasil foto', 'Penggunaan props dasar'],
    featured: false,
  },
  {
    badge: 'Terlaris', badgeVariant: 'hot',
    name: 'Couple', price: 'Rp250', unit: 'rb',
    duration: '90 menit · 2 orang',
    features: ['2 background pilihan', 'Cetak 4 foto ukuran 4R', 'Soft file semua hasil foto', 'Penggunaan props lengkap', '1 foto frame digital'],
    featured: true,
  },
  {
    badge: 'Keluarga', badgeVariant: 'pro',
    name: 'Family', price: 'Rp400', unit: 'rb',
    duration: '120 menit · max 6 orang',
    features: ['3 background pilihan', 'Cetak 8 foto ukuran 4R', 'Soft file semua hasil foto', 'Penggunaan props lengkap', 'Album digital eksklusif'],
    featured: false,
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

const handleBooking = () => alert('Fitur booking akan segera tersedia!')

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">Sistem booking studio</div>
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

      <div className="hero-visual">
        <div className="hero-mosaic">
          <div className="mosaic-block m1">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" aria-hidden="true">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <circle cx="12" cy="13" r="3" />
              <path d="M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" />
            </svg>
          </div>
          <div className="mosaic-block m2" />
          <div className="mosaic-block m3" />
          <div className="mosaic-block m4" />
          <div className="mosaic-block m5">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="mosaic-block m6" />
          <div className="mosaic-block m7" />
        </div>
        <div className="hero-float-card">
          <div className="float-dot" />
          <div className="float-text">
            <strong>12 slot tersedia</strong> hari ini
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <div className="stats-wrap">
      <div className="stats-inner">
        <div className="stat-item">
          <span className="stat-num">2rb<sup>+</sup></span>
          <span className="stat-label">Sesi foto</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">98<sup>%</sup></span>
          <span className="stat-label">Kepuasan pelanggan</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">15<sup>+</sup></span>
          <span className="stat-label">Studio bergabung</span>
        </div>
      </div>
    </div>
  )
}

function HowSection() {
  const [selectedPkg, setSelectedPkg] = useState(0)

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
              {PREVIEW_PACKAGES.map((pkg, i) => (
                <div
                  key={pkg.name}
                  className={`preview-pkg${selectedPkg === i ? ' selected' : ''}`}
                  onClick={() => setSelectedPkg(i)}
                  role="radio"
                  aria-checked={selectedPkg === i}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedPkg(i)}
                >
                  <div>
                    <div className="preview-pkg-name">{pkg.name}</div>
                    <div className="preview-meta">{pkg.meta}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="preview-pkg-price">{pkg.price}</div>
                    <div className="preview-pkg-radio" />
                  </div>
                </div>
              ))}
            </div>
            <div className="preview-footer">
              <span className="preview-footer-label">Total sementara</span>
              <span className="preview-footer-total">
                {PREVIEW_PACKAGES[selectedPkg].total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PackagesSection() {
  return (
    <section className="section packages-section" id="paket">
      <div className="section-inner">
        <span className="section-tag">Paket foto</span>
        <h2 className="section-title">Temukan paket<br />yang pas buat kamu</h2>
        <p className="section-desc">
          Semua paket sudah termasuk akses studio, pencahayaan profesional, dan soft file hasil foto.
        </p>
        <div className="pkg-grid">
          {PACKAGES.map((pkg) => (
            <div key={pkg.name} className={`pkg-card${pkg.featured ? ' featured' : ''}`}>
              <span className={`pkg-badge ${pkg.badgeVariant}`}>{pkg.badge}</span>
              <div className="pkg-name">{pkg.name}</div>
              <div className="pkg-price">
                {pkg.price}<small>{pkg.unit}</small>
              </div>
              <div className="pkg-duration">{pkg.duration}</div>
              <ul className="pkg-features">
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className="pkg-btn" onClick={handleBooking}>
                Pilih paket ini
              </button>
            </div>
          ))}
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

function CTASection() {
  return (
    <section className="cta-section" id="booking">
      <div className="cta-inner">
        <span className="section-tag">Mulai sekarang</span>
        <h2 className="section-title">Siap foto hari ini?</h2>
        <p className="cta-desc">
          Slot tersedia terbatas setiap harinya. Booking sekarang sebelum penuh — tanpa perlu daftar akun.
        </p>
        <div className="cta-actions">
          <button className="btn-dark" onClick={() => scrollTo('paket')}>
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

function FooterSection() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <button
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Studio<span>Book</span>
          </button>
          <p className="footer-tagline">
            Sistem booking studio foto modern untuk UMKM Indonesia. Ringan, mudah, dan terjangkau.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigasi</h4>
          <ul>
            <li><button onClick={() => scrollTo('cara-kerja')}>Cara kerja</button></li>
            <li><button onClick={() => scrollTo('paket')}>Paket foto</button></li>
            <li><button onClick={() => scrollTo('testimoni')}>Testimoni</button></li>
            <li><button onClick={() => scrollTo('booking')}>Booking sekarang</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Studio</h4>
          <ul>
            <li><a href="#">Tentang kami</a></li>
            <li><a href="#">Daftarkan studio</a></li>
            <li><a href="#">Kebijakan privasi</a></li>
            <li><a href="#">Hubungi kami</a></li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <span>© 2026 StudioBook. Semua hak dilindungi.</span>
        <span>Dibuat dengan ❤ untuk studio foto Indonesia</span>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="landing-root">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowSection />
      <PackagesSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
      <button
        className="floating-cta"
        onClick={() => scrollTo('paket')}
        aria-label="Booking sekarang"
      >
        Booking sekarang
      </button>
    </div>
  )
}
