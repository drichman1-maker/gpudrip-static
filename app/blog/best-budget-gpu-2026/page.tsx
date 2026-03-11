import Link from 'next/link'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ borderBottom: '1px solid #222', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #22c55e, #166534)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f0' }}>GPUDrip</span>
            </Link>
            <nav style={{ display: 'flex', gap: 16 }}>
              <Link href="/" style={{ fontSize: 14, color: '#888', textDecoration: 'none' }}>GPUs</Link>
              <Link href="/blog" style={{ fontSize: 14, color: '#22c55e', textDecoration: 'none' }}>Blog</Link>
            </nav>
          </div>
        </div>
      </header>

      <article style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <header style={{ marginBottom: 48, borderBottom: '1px solid #222', paddingBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#22c55e', marginBottom: 16 }}>
            <span>Buyer's Guide</span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#888' }}>March 2026</span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#888' }}>8 min read</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#f0f0f0', marginBottom: 24, lineHeight: 1.2 }}>Best Budget GPU 2026: Under $500</h1>
          <p style={{ fontSize: 20, color: '#888', lineHeight: 1.6 }}>You don't need to spend $1,000 to get great gaming performance.</p>
        </header>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 16, marginBottom: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginBottom: 16 }}>The Sweet Spot for Gamers</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>The $250-$500 price range is where most PC gamers shop. Today's budget GPUs deliver performance that would have cost $800+ just a few years ago.</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(231,76,60,0.15) 0%, rgba(231,76,60,0.05) 100%)', borderRadius: 20, padding: 32, marginBottom: 32, border: '1px solid rgba(255,255,255,0.1)', borderTop: '4px solid #ED1C24' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <span style={{ background: '#ED1C24', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: '0.9em', fontWeight: 700, textTransform: 'uppercase' }}>Best Budget GPU</span>
            <span style={{ background: '#ED1C24', color: '#fff', padding: '10px 24px', borderRadius: 50, fontWeight: 900, fontSize: '1.4em' }}>$379</span>
          </div>
          <h3 style={{ fontSize: '2em', fontWeight: 900, color: '#fff', marginBottom: 20 }}>AMD Radeon RX 7800 XT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, padding: 20, background: 'rgba(0,0,0,0.3)', borderRadius: 12, marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '1.6em', fontWeight: 900, color: '#ED1C24' }}>16GB</span><span style={{ fontSize: '0.8em', color: '#888' }}>GDDR6</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '1.6em', fontWeight: 900, color: '#ED1C24' }}>256-bit</span><span style={{ fontSize: '0.8em', color: '#888' }}>Memory Bus</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '1.6em', fontWeight: 900, color: '#ED1C24' }}>77</span><span style={{ fontSize: '0.8em', color: '#888' }}>FPS 1440p</span></div>
            <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '1.6em', fontWeight: 900, color: '#ED1C24' }}>263W</span><span style={{ fontSize: '0.8em', color: '#888' }}>TDP</span></div>
          </div>
          <p style={{ color: '#ccc', marginBottom: 20, lineHeight: 1.8 }}>The RX 7800 XT delivers incredible 1440p performance at under $400. It beats the RTX 4070 in raw performance while costing significantly less.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div><h4 style={{ color: '#22c55e', marginBottom: 8 }}>Why Buy</h4><ul style={{ color: '#ddd', marginLeft: 20, lineHeight: 2 }}><li>Best 1440p performance per dollar</li><li>16GB VRAM future-proofs</li><li>Beats RTX 4070 for less</li></ul></div>
            <div><h4 style={{ color: '#e74c3c', marginBottom: 8 }}>Why Skip</h4><ul style={{ color: '#ddd', marginLeft: 20, lineHeight: 2 }}><li>Ray tracing behind NVIDIA</li><li>No DLSS support</li></ul></div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Runner Up: RTX 4060 Ti</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>At $349, NVIDIA's RTX 4060 Ti offers DLSS and superior ray tracing. Great for users who prioritize those features.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Best Value: RX 7600</h2>
          <p style={{ color: '#ccc', marginBottom: 24, lineHeight: 1.8 }}>For $249, the RX 7600 handles 1080p max settings with ease. Perfect for first-time builders or upgrades.</p>
        </div>

        <section style={{ marginBottom: 48 }}>
          <div style={{ background: '#22c55e', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <h2 style={{ color: '#000', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Track Prices on GPUDrip</h2>
            <p style={{ color: 'rgba(0,0,0,0.7)', marginBottom: 16 }}>Get alerts when budget GPUs drop in price.</p>
            <Link href="/" style={{ display: 'inline-block', background: '#000', color: '#22c55e', padding: '12px 24px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>Track Now</Link>
          </div>
        </section>
      </article>

      <footer style={{ borderTop: '1px solid #222', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#888' }}>
            <Link href="/privacy" style={{ color: '#888', textDecoration: 'none', marginRight: 8 }}>Privacy</Link>
            <span style={{ color: '#333', marginRight: 8 }}>|</span>
            <Link href="/blog" style={{ color: '#888', textDecoration: 'none', marginLeft: 8 }}>Blog</Link>
          </p>
          <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>© 2026 GPUDrip</p>
        </div>
      </footer>
    </div>
  )
}