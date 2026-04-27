
const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}


export default function C() {

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
