import { useParams } from 'react-router-dom'
import '@/styles/admin.css'

export default function BookingDetail() {
  const { id } = useParams()

  // Icons
  const PhoneIcon = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
  const EmailIcon = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  const CheckIcon = <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
  
  return (
    <div className="booking-detail-page">
      <div className="booking-detail-layout">
        
        {/* LEFT COLUMN */}
        <div className="bd-main-column">
          
          {/* Header Card */}
          <div className="bd-card">
            <div className="bd-header-top">
              <div className="bd-header-left">
                <span className="status-badge lunas">Lunas</span>
                <span className="bd-code">{id || 'BK-2041'}</span>
              </div>
              <div>
                <div className="bd-total-label">Total</div>
                <div className="bd-total-value">Rp 225.000</div>
              </div>
            </div>
            
            <h1 className="bd-title">Duo Frame</h1>
            <p className="bd-datetime">24 Apr 2026 • 14:00 - 14:45</p>

            <div className="bd-info-grid">
              <div className="bd-info-item">
                <h4>Paket</h4>
                <p>Duo Frame</p>
                <span>45 menit • 2 orang</span>
              </div>
              <div className="bd-info-item">
                <h4>Tanggal</h4>
                <p>26 Apr</p>
                <span>Minggu 2026</span>
              </div>
              <div className="bd-info-item">
                <h4>Slot</h4>
                <p>14:00</p>
                <span>sampai 14:45</span>
              </div>
              <div className="bd-info-item">
                <h4>Booth</h4>
                <p>Booth A</p>
                <span>Backdrop #14 Cream</span>
              </div>
            </div>
          </div>

          {/* Rincian Card */}
          <div className="bd-card">
            <h3 className="bd-section-title">Rincian</h3>
            
            <div className="bd-rincian-item">
              <div className="bd-rincian-left">
                <h5>Duo Frame</h5>
                <p>1 sesi • 45 menit</p>
              </div>
              <div className="bd-rincian-price">Rp 185.000</div>
            </div>

            <div className="bd-rincian-item">
              <div className="bd-rincian-left">
                <h5>Retouch Premium</h5>
                <p>1 foto</p>
              </div>
              <div className="bd-rincian-price">Rp 50.000</div>
            </div>

            <div className="bd-rincian-total">
              <h4>Total bayar</h4>
              <p>Rp 225.000</p>
            </div>
          </div>

          {/* Aktivitas Card */}
          <div className="bd-card">
            <h3 className="bd-section-title">Aktivitas</h3>
            
            <div className="bd-activity-list">
              <div className="bd-activity-item">
                <div className="bd-activity-icon lunas">{CheckIcon}</div>
                <div className="bd-activity-content">
                  <h5>Status diubah jadi Lunas</h5>
                  <p>14:12 • oleh Rizky K.</p>
                </div>
              </div>

              <div className="bd-activity-item">
                <div className="bd-activity-icon wa">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 21.05a9.02 9.02 0 01-4.606-1.263l-.33-.195-3.418.897.913-3.333-.214-.34a9.035 9.035 0 117.655 4.234zM12.004 4.814a7.18 7.18 0 00-7.177 7.182c0 1.41.368 2.788 1.066 3.998l.278.483-.541 1.977 2.023-.53.468.258a7.151 7.151 0 003.883 1.13 7.18 7.18 0 007.177-7.183A7.18 7.18 0 0012.004 4.81zM15.93 13.914c-.215-.108-1.272-.628-1.468-.7-.197-.072-.34-.108-.484.108-.143.215-.555.7-.68.843-.125.144-.25.162-.465.054-.215-.108-.908-.335-1.73-1.07-.64-.572-1.07-1.279-1.196-1.494-.125-.215-.013-.331.094-.439.097-.096.215-.25.322-.376.108-.125.143-.215.215-.358.072-.143.036-.269-.018-.376-.054-.108-.484-1.166-.663-1.597-.175-.42-.35-.362-.484-.368h-.412c-.143 0-.376.054-.573.269-.197.215-.752.735-.752 1.793 0 1.058.77 2.08 8.78 1.144 1.143.917 2.76 1.185 3.197 1.25.34.054 1.056-.43 1.207-.843.151-.412.151-.77.108-.843-.043-.072-.151-.116-.366-.224z"/></svg>
                </div>
                <div className="bd-activity-content">
                  <h5>Customer konfirmasi via WhatsApp</h5>
                  <p>11:40 • oleh Auto-detect</p>
                </div>
              </div>

              <div className="bd-activity-item">
                <div className="bd-activity-icon booking">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div className="bd-activity-content">
                  <h5>Booking tersimpan</h5>
                  <p>11:38 • oleh Customer</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="bd-sidebar-column">
          
          {/* Customer Card */}
          <div className="bd-card">
            <h3 className="bd-section-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Customer</h3>
            
            <div className="bd-customer-header">
              <div className="bd-customer-avatar">A</div>
              <div>
                <div className="bd-customer-name">Anindya Paramita</div>
                <div className="bd-customer-badge">Booking ke-3</div>
              </div>
            </div>

            <div className="bd-customer-contact">
              <div className="bd-contact-item">
                {PhoneIcon}
                +62 812-3344-1290
              </div>
              <div className="bd-contact-item">
                {EmailIcon}
                anindya@gmail.com
              </div>
            </div>

            <button className="bd-btn-wa">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 21.05a9.02 9.02 0 01-4.606-1.263l-.33-.195-3.418.897.913-3.333-.214-.34a9.035 9.035 0 117.655 4.234zM12.004 4.814a7.18 7.18 0 00-7.177 7.182c0 1.41.368 2.788 1.066 3.998l.278.483-.541 1.977 2.023-.53.468.258a7.151 7.151 0 003.883 1.13 7.18 7.18 0 007.177-7.183A7.18 7.18 0 0012.004 4.81zM15.93 13.914c-.215-.108-1.272-.628-1.468-.7-.197-.072-.34-.108-.484.108-.143.215-.555.7-.68.843-.125.144-.25.162-.465.054-.215-.108-.908-.335-1.73-1.07-.64-.572-1.07-1.279-1.196-1.494-.125-.215-.013-.331.094-.439.097-.096.215-.25.322-.376.108-.125.143-.215.215-.358.072-.143.036-.269-.018-.376-.054-.108-.484-1.166-.663-1.597-.175-.42-.35-.362-.484-.368h-.412c-.143 0-.376.054-.573.269-.197.215-.752.735-.752 1.793 0 1.058.77 2.08 8.78 1.144 1.143.917 2.76 1.185 3.197 1.25.34.054 1.056-.43 1.207-.843.151-.412.151-.77.108-.843-.043-.072-.151-.116-.366-.224z"/></svg>
              Chat WhatsApp
            </button>
          </div>

          {/* Status Card */}
          <div className="bd-card">
            <h3 className="bd-section-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Status pembayaran</h3>
            
            <div className="bd-status-box">
              <div className="bd-status-icon">{CheckIcon}</div>
              <div className="bd-status-text">
                <h5>Lunas</h5>
                <p>Dikonfirmasi 14:12 WIB</p>
              </div>
            </div>

            <button className="bd-btn-outline">Ubah status</button>
          </div>

          {/* Notes Card */}
          <div className="bd-note-card">
            <span className="bd-note-label">Catatan dari Customer</span>
            <p className="bd-note-text">
              "Mau backdrop cream kalau masih kosong, nuansa warm. Thanks!"
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
