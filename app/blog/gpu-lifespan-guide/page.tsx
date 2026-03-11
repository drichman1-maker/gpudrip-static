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
          <span style={{ color: '#22c55e', fontSize: 14 }}>Guide • March 6, 2026 • 8 min read</span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f0f0f0', marginTop: 12 }}>How Long Do GPUs Actually Last?</h1>
          <p style={{ fontSize: 18, color: '#888', marginTop: 8 }}>The realistic lifespan of graphics cards — and how to maximize yours.</p>
        </header>
        <div style={{ background: 'linear-gradient(135deg, #166534, #22c55e)', borderRadius: 16, padding: 50, marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>⏱️</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, marginBottom: 24 }}>
          <h2 style={{ color: '#22c55e', marginBottom: 12 }}>Lifespan by Use Case</h2>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li><strong>Casual gaming:</strong> 5-7+ years physical, 4-6 relevant</li>
            <li><strong>Heavy gaming:</strong> 3-5 years</li>
            <li><strong>Mining/AI (24/7):</strong> 1-3 years — avoid used mining cards</li>
          </ul>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f0f0f0', marginBottom: 12 }}>Key Factors</h2>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li>🔥 <strong>Temperature:</strong> #1 killer. Keep below 80°C. Every 10°C = 30% shorter life</li>
            <li>� dust buildup: Clean every 3-6 months</li>
            <li>⚡ Overclocking: Voltage accelerates wear</li>
            <li>🔌 PSU quality: Don't cheap out</li>
          </ul>
        </div>
        <div style={{ background: '#22c55e15', padding: 24, borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ color: '#22c55e', marginBottom: 12 }}>Maintenance (Every 3-6 Months)</h3>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li>Clean dust from heatsink and fans</li>
            <li>Check temps under load (HWMonitor)</li>
            <li>Verify case airflow</li>
          </ul>
        </div>
        <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ color: '#f0f0f0', marginBottom: 12 }}>Undervolting: Best ROI</h3>
          <p style={{ color: '#ccc', lineHeight: 1.8 }}>Reduce voltage 50-100mV in MSI Afterburner. Many get 10-15°C drop with ZERO performance loss.</p>
        </div>
        <div style={{ background: '#ef444415', padding: 24, borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ color: '#ef4444', marginBottom: 12 }}>🚨 Warning Signs</h3>
          <ul style={{ color: '#ccc', lineHeight: 2 }}>
            <li>Artificating pixels / screen flicker</li>
            <li>Unexpected crashes</li>
            <li>Fan noise increase</li>
            <li>Driver errors / "display driver stopped responding"</li>
          </ul>
        </div>
        <div style={{ background: '#1a1a1a', padding: 24, borderRadius: 12 }}>
          <h3 style={{ color: '#f0f0f0', marginBottom: 12 }}>Bottom Line</h3>
          <p style={{ color: '#ccc', lineHeight: 1.8 }}>3-5 years of relevant gaming for mid-range, 5-7 for high-end with good care. Keep it cool, keep it clean, and replace thermal paste every 2 years.</p>
        </div>
      </article>
    </div>
  )
}
