import { useState } from 'react'

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button
          className="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Studio<span>Book</span>
        </button>

        <ul className="nav-links">
          <li>
            <button onClick={() => scrollTo('cara-kerja')}>Cara kerja</button>
          </li>
          <li>
            <button onClick={() => scrollTo('paket')}>Paket</button>
          </li>
          <li>
            <button onClick={() => scrollTo('testimoni')}>Testimoni</button>
          </li>
          <li>
            <button className="nav-cta" onClick={() => scrollTo('booking')}>
              Booking sekarang
            </button>
          </li>
        </ul>

        <button
          className="hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-menu${open ? ' open' : ''}`} role="menu">
        <button onClick={() => { scrollTo('cara-kerja'); close() }}>Cara kerja</button>
        <button onClick={() => { scrollTo('paket'); close() }}>Paket foto</button>
        <button onClick={() => { scrollTo('testimoni'); close() }}>Testimoni</button>
        <button className="m-cta" onClick={() => { scrollTo('booking'); close() }}>
          Booking sekarang
        </button>
      </div>
    </nav>
  )
}
