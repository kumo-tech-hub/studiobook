import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/styles/admin.css'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const setAdmin = useAuthStore((state) => state.setAdmin)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // For now, bypass auth
    setAdmin({ email })
    navigate('/admin/dashboard')
  }

  return (
    <div className="admin-login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-logo">
          <div className="login-logo-icon">S</div>
          <div className="login-logo-text">
            Studio<span>Book.</span> / admin
          </div>
        </div>

        {/* Large translucent camera background */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="camera-bg">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>

        <div className="login-hero-text">
          <div className="login-hero-label">Studiobook - Admin</div>
          <h1 className="login-hero-title">
            Satu tempat<br />
            untuk semua <em>booking.</em>
          </h1>

          <div className="login-stats">
            <div className="stat-item">
              <h4>42</h4>
              <p>Booking minggu ini</p>
            </div>
            <div className="stat-item">
              <h4>Rp 8,4jt</h4>
              <p>Pemasukan April</p>
            </div>
            <div className="stat-item">
              <h4>96%</h4>
              <p>Occupancy</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-form-container">
          <span className="login-form-label">Masuk sebagai admin</span>
          <h2 className="login-form-title">Selamat datang kembali.</h2>
          <p className="login-form-desc">
            Masuk untuk mengelola booking hari ini, update paket, atau lihat laporan.
          </p>

          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label>Email</label>
              <input
                type="email"
                className="admin-input"
                placeholder="admin@studiobook.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                Ingat saya
              </label>
              <a href="#" className="forgot-link">Lupa password?</a>
            </div>

            <button type="submit" className="admin-btn">
              Masuk dashboard
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>

          <div className="admin-footer-note">
            Studio baru? Hubungi tim StudioBook untuk onboarding -{' '}
            <a href="mailto:hello@studiobook.id">hello@studiobook.id</a>
          </div>
        </div>
      </div>
    </div>
  )
}
