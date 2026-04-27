import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar({ isBookingRoute = false }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const close = () => setOpen(false)

  const handleLogoClick = () => {
    if (isBookingRoute) {
      navigate('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="logo" onClick={handleLogoClick}>
          Studio<span>Book</span>
        </button>

        {!isBookingRoute ? (
          <ul className="nav-links">
            <li><button onClick={() => scrollTo('cara-kerja')}>Cara kerja</button></li>
            <li><button onClick={() => scrollTo('paket')}>Paket</button></li>
            <li><button onClick={() => scrollTo('testimoni')}>Testimoni</button></li>
            <li>
              <button className="nav-cta" onClick={() => scrollTo('booking')}>
                Booking sekarang
              </button>
            </li>
          </ul>
        ) : (
          <button className="nav-back-btn" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </button>
        )}

        {!isBookingRoute && (
          <button
            className="hamburger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        )}
      </div>

      {!isBookingRoute && (
        <div className={`mobile-menu${open ? ' open' : ''}`} role="menu">
          <button onClick={() => { scrollTo('cara-kerja'); close() }}>Cara kerja</button>
          <button onClick={() => { scrollTo('paket'); close() }}>Paket foto</button>
          <button onClick={() => { scrollTo('testimoni'); close() }}>Testimoni</button>
          <button className="m-cta" onClick={() => { scrollTo('booking'); close() }}>
            Booking sekarang
          </button>
        </div>
      )}
    </nav>
  )
}
