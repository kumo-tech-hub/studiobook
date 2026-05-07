/**
 * Reusable Skeleton Loading Components
 * Import this in any page that needs loading states.
 */

import '@/styles/skeleton.css'

// ─── Generic skeleton block ────────────────────────────────────────
export function Skel({ w, h = 18, rounded = false, circle = false, style = {} }) {
  return (
    <div
      className={`skeleton ${circle ? 'skeleton-circle' : rounded ? 'skeleton-pill' : ''}`}
      style={{ width: w, height: h, ...style }}
    />
  )
}

// ─── Skeleton for a table row (8 columns) ─────────────────────────
export function SkeletonTableRow({ cols = 8 }) {
  const widths = [160, 90, 100, 90, 100, 80, 80, 70]
  return (
    <tr className="skeleton-row">
      {[...Array(cols)].map((_, i) => (
        <td key={i} style={{ padding: '16px 12px' }}>
          <div className="skel-cell" style={{ width: widths[i] || 80 }} />
        </td>
      ))}
    </tr>
  )
}

// ─── Skeleton for a card grid (package cards) ─────────────────────
export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--primary-light)',
      border: '1px solid var(--white-06)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skel w="60%" h={22} />
        <Skel w="80%" h={14} />
        <Skel w="90%" h={14} />
        <div style={{ height: 1, background: 'var(--white-06)', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skel w={80} h={18} />
          <Skel w={100} h={32} rounded />
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton for the two-column Slots page ───────────────────────
export function SkeletonSlots() {
  return (
    <div className="slots-page">
      {/* Kiri: Jam Operasional */}
      <div className="slots-panel" style={{ gap: 20 }}>
        <Skel w="40%" h={13} />
        <Skel w="70%" h={30} />
        <Skel w="100%" h={14} />
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Skel w={60} h={18} />
            <Skel h={38} style={{ flex: 2, borderRadius: 20 }} />
            <Skel h={38} style={{ flex: 1, borderRadius: 20 }} />
            <Skel w={40} h={24} rounded />
          </div>
        ))}
      </div>
      {/* Kanan: Blokir & Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="slots-panel" style={{ gap: 16 }}>
          <Skel w="40%" h={13} />
          <Skel w="60%" h={30} />
          {[...Array(3)].map((_, i) => <Skel key={i} h={64} style={{ borderRadius: 8 }} />)}
        </div>
        <div className="slots-panel" style={{ gap: 16 }}>
          <Skel w="35%" h={13} />
          <Skel w="50%" h={30} />
          <Skel h={42} rounded />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[...Array(9)].map((_, i) => <Skel key={i} h={36} style={{ borderRadius: 6 }} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
