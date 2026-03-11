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
            <span>Comparison</span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#888' }}>March 2026</span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#888' }}>6 min read</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#f0f0f0', marginBottom: 24, lineHeight: 1.2 }}>AMD vs NVIDIA 2026: Which GPU Is Right for You?</h1>
          <p style={{ fontSize: 20, color: '#888', lineHeight: 1.6 }}>Head-to-head comparison. Which ecosystem wins in 2026?</p>
        </header>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 16, marginBottom: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginBottom: 16 }}>The Battle Lines</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>After years of NVIDIA dominance, AMD has finally delivered competitive GPUs. Here's how they stack up in 2026.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>AMD's Strengths</h2>
          <ul style={{ color: '#ccc', marginLeft: 24, lineHeight: 2 }}>
            <li>Better rasterization performance per dollar</li>
            <li>More VRAM at lower price points</li>
            <li>FSR is open standard, works on more hardware</li>
            <li>Competitive pricing challenges NVIDIA</li>
          </ul>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>NVIDIA's Strengths</h2>
          <ul style={{ color: '#ccc', marginLeft: 24, lineHeight: 2 }}>
            <li>Superior ray tracing performance</li>
            <li>DLSS 4 with Multi Frame Generation</li>
            <li>Better content creation (NVENC, CUDA)</li>
            <li>Mature driver ecosystem</li>
          </ul>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(74,144,226,0.2) 100%)', border: '2px solid #22c55e', padding: 32, borderRadius: 20, marginBottom: 40 }}>
          <h2 style={{ color: '#22c55e', fontSize: '1.8em', fontWeight: 800, marginBottom: 20 }}>Quick Verdict</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 12 }}><h4 style={{ color: '#ED1C24', marginBottom: 8 }}>Pure Gaming Value</h4><p style={{ color: '#aaa', fontSize: '0.9em' }}><strong>AMD RX 9070 XT</strong> — Best fps per dollar.</p></div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 12 }}><h4 style={{ color: '#22c55e', marginBottom: 8 }}>Feature-Focused</h4><p style={{ color: '#aaa', fontSize: '0.9em' }}><strong>NVIDIA RTX 5070 Ti</strong> — DLSS, RT, CUDA.</p></div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 12 }}><h4 style={{ color: '#4a90e2', marginBottom: 8 }}>Content Creation</h4><p style={{ color: '#aaa', fontSize: '0.9em' }}><strong>NVIDIA RTX 4090</strong> — 32GB VRAM, NVENC.</p></div>
          </div>
        </div>

        <section style={{ marginBottom: 48 }}>
          <div style={{ background: '#22c55e', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <h2 style={{ color: '#000', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Track Prices on GPUDrip</h2>
            <p style={{ color: 'rgba(0,0,0,0.7)', marginBottom: 16 }}>Get alerts when GPUs drop in price.</p>
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
