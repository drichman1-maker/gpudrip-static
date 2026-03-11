import Link from 'next/link'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ borderBottom: '1px solid #222', padding: '16px 24px', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.8)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #22c55e, #166534)', borderRadius: 8 }}></div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f0' }}>GPUDrip</span>
        </Link>
      </header>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <header style={{ marginBottom: 32 }}>
          <span style={{ color: '#22c55e', fontSize: 14 }}>Guide • March 2026 • 8 min read</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f0f0f0', marginTop: 12 }}>Best GPU for 1440p Gaming in 2026</h1>
          <p style={{ fontSize: 18, color: '#888', marginTop: 8 }}>Every budget covered. From budget builds to high-end flagships.</p>
        </header>
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius: 16, padding: 50, marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>🎮</div>
          <div style={{ color: '#fff' }}>1440p Gaming Sweet Spot</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Best Overall Value</h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 12, border: '1px solid #22c55e' }}>
            <h3 style={{ color: '#22c55e' }}>AMD RX 9070 XT — $599</h3>
            <p style={{ color: '#ccc', marginTop: 8 }}>131-180+ FPS at 1440p. Beats cards costing $200 more.</p>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Budget Option</h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 12 }}>
            <h3 style={{ color: '#f97316' }}>RTX 5060 Ti — $429</h3>
            <p style={{ color: '#ccc', marginTop: 8 }}>Solid 1440p performance for the price. Good for entry-level.</p>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>High Performance</h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 12 }}>
            <h3 style={{ color: '#f97316' }}>RTX 5080 — $999</h3>
            <p style={{ color: '#ccc', marginTop: 8 }}>175-185 FPS. Ultimate 1440p with DLSS 4.</p>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Recommendation by Budget</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody style={{ color: '#ccc' }}>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: 12 }}><strong>Under $400</strong></td><td style={{ padding: 12 }}>RTX 5060</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: 12 }}><strong>$400-600</strong></td><td style={{ padding: 12 }}>RX 9070 XT, RTX 4070 Super</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: 12 }}><strong>$600-1000</strong></td><td style={{ padding: 12 }}>RX 9070 XT, RTX 5070 Ti</td></tr>
              <tr><td style={{ padding: 12 }}><strong>$1000+</strong></td><td style={{ padding: 12 }}>RTX 5080</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 12 }}>
          <h3 style={{ color: '#f0f0f0', marginBottom: 12 }}>Bottom Line</h3>
          <p style={{ color: '#ccc', lineHeight: 1.8 }}>For most gamers, the RX 9070 XT at $599 is the sweet spot. It handles any 1440p game at high settings with room to spare.</p>
        </div>
      </article>
    </div>
  )
}
