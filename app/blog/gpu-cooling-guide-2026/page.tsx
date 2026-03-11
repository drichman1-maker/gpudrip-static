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
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f0f0f0', marginTop: 12 }}>GPU Cooling in 2026: What Actually Matters</h1>
          <p style={{ fontSize: 18, color: '#888', marginTop: 8 }}>Best coolers, AIB models, and thermal performance explained.</p>
        </header>
        <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: 16, padding: 50, marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>❄️</div>
          <div style={{ color: '#fff' }}>Stay Cool 2026</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Cooling Types Compared</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: 12, textAlign: 'left', color: '#888' }}>Type</th>
                <th style={{ padding: 12, textAlign: 'left', color: '#22c55e' }}>Temps</th>
                <th style={{ padding: 12, textAlign: 'left', color: '#22c55e' }}>Noise</th>
              </tr>
            </thead>
            <tbody style={{ color: '#ccc' }}>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 12 }}>Dual-Fan (Reference)</td>
                <td style={{ padding: 12 }}>80-90°C</td>
                <td style={{ padding: 12 }}>45+ dB</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 12 }}>Triple-Fan (AIB)</td>
                <td style={{ padding: 12 }}>70-80°C</td>
                <td style={{ padding: 12 }}>35-45 dB</td>
              </tr>
              <tr>
                <td style={{ padding: 12 }}>AIO Liquid</td>
                <td style={{ padding: 12 }}>60-70°C</td>
                <td style={{ padding: 12 }}>30-35 dB</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Why Cooling Matters</h2>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li>High temps = throttling = lost performance</li>
            <li>Heat shortens GPU lifespan</li>
            <li>Hot GPU warms entire case</li>
            <li>With 575W TDP cards, cooling = performance</li>
          </ul>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Best AIB Cards 2026</h2>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li><strong>Gigabyte Aorus RTX 5080 Master</strong> — Best NVIDIA AIB, 3% factory OC</li>
            <li><strong>Sapphire Nitro+ RX 9070 XT</strong> — Best AMD AIB, $650-700</li>
            <li><strong>ASUS ROG Strix</strong> — Premium, 20-30% markup</li>
            <li><strong>MSI Suprim</strong> — Strong premium alternative</li>
          </ul>
        </div>
        <div style={{ background: '#22c55e15', padding: 24, borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ color: '#22c55e', marginBottom: 12 }}>When to Go Liquid</h3>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li>RTX 5090 or similar high-TDP cards</li>
            <li>AI workloads (sustained 100% load)</li>
            <li>Extreme overclocking</li>
            <li>Noise-sensitive environments</li>
          </ul>
        </div>
        <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 12, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ color: '#22c55e', marginBottom: 8 }}>✅ Triple-Fan AIB Best For</h4>
            <ul style={{ color: '#ccc', marginLeft: 16, lineHeight: 1.8 }}>
              <li>Most PC builders</li>
              <li>Best price/performance/noise balance</li>
              <li>Factory OC included</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ef4444', marginBottom: 8 }}>⚠️ Avoid</h4>
            <ul style={{ color: '#ccc', marginLeft: 16, lineHeight: 1.8 }}>
              <li>Poor case airflow</li>
              <li>Restricted space (3-slot cards)</li>
              <li>Vertical GPU mounting</li>
            </ul>
          </div>
        </div>
        <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 12 }}>
          <h3 style={{ color: '#f0f0f0', marginBottom: 12 }}>Pro Tips</h3>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li>Case airflow is king — more intake than exhaust</li>
            <li>Replace thermal paste every 2 years</li>
            <li>Use custom fan curves in MSI Afterburner</li>
            <li>Room temperature affects GPU temps by ~5°C</li>
          </ul>
        </div>
      </article>
    </div>
  )
}
