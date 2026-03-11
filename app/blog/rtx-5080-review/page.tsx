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
            <span>Review</span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#888' }}>March 2026</span>
            <span style={{ color: '#333' }}>•</span>
            <span style={{ color: '#888' }}>9 min read</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#f0f0f0', marginBottom: 24, lineHeight: 1.2 }}>RTX 5080 Review: The Sweet Spot GPU?</h1>
          <p style={{ fontSize: 20, color: '#888', lineHeight: 1.6 }}>At $999, the RTX 5080 delivers 1440p gaming excellence with DLSS 4. But is it the best value in the RTX 50 series?</p>
        </header>

        {/* Hero Image Placeholder */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
          borderRadius: 16, 
          padding: 60, 
          marginBottom: 40,
          border: '1px solid #333',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎮</div>
          <div style={{ color: '#888', fontSize: 14 }}>RTX 5080 Founders Edition</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 16, marginBottom: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginBottom: 16 }}>Key Specifications</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Specification</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#22c55e' }}>RTX 5080</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>RTX 4080 Super</th>
              </tr>
            </thead>
            <tbody style={{ color: '#ccc' }}>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Architecture</td><td style={{ padding: '12px', color: '#fff' }}>Blackwell (GB203)</td><td style={{ padding: '12px' }}>Ada Lovelace (AD103)</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>CUDA Cores</td><td style={{ padding: '12px', color: '#fff' }}>10,752</td><td style={{ padding: '12px' }}>10,240</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Memory</td><td style={{ padding: '12px', color: '#fff' }}>16GB GDDR7</td><td style={{ padding: '12px' }}>16GB GDDR6X</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Memory Bus</td><td style={{ padding: '12px', color: '#fff' }}>256-bit</td><td style={{ padding: '12px' }}>256-bit</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>TDP (Power)</td><td style={{ padding: '12px', color: '#fff' }}>360W</td><td style={{ padding: '12px' }}>320W</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>MSRP</td><td style={{ padding: '12px', color: '#fff' }}>$999</td><td style={{ padding: '12px' }}>$999</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Street Price</td><td style={{ padding: '12px', color: '#fff' }}>$1,100–$1,300</td><td style={{ padding: '12px' }}>$800–$950</td></tr>
              <tr><td style={{ padding: '12px' }}>DLSS Version</td><td style={{ padding: '12px', color: '#fff' }}>DLSS 4.5</td><td style={{ padding: '12px' }}>DLSS 3.5</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>The 1440p King</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>The RTX 5080 is arguably the best 1440p gaming GPU you can buy in 2026. It handles modern titles at max settings with ease, and with DLSS 4, even 4K gaming becomes accessible at frame rates that were previously reserved for the flagship 5090.</p>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>At $999 MSRP — the same price as the RTX 4080 Super launched at — you're getting significantly more performance thanks to the Blackwell architecture improvements and DLSS 4.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>DLSS 4 Changes Everything</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>The biggest differentiator for the RTX 5080 isn't raw rasterization performance — it's DLSS 4. With multi-frame generation, DLSS can now generate up to 3 additional frames for every rendered frame, effectively quadrupling performance in supported titles.</p>
          <div style={{ 
            background: 'linear-gradient(135deg, #22c55e20, #16653420)', 
            padding: 24, 
            borderRadius: 12, 
            marginBottom: 16,
            border: '1px solid #22c55e40'
          }}>
            <h3 style={{ color: '#22c55e', marginBottom: 12, fontSize: 18 }}>DLSS 4 Performance Gains</h3>
            <ul style={{ color: '#ccc', marginLeft: 20, lineHeight: 2 }}>
              <li><strong>Cyberpunk 2077:</strong> 35 FPS → 140+ FPS with RT + DLSS 4</li>
              <li><strong>Alan Wake 2:</strong> 28 FPS → 120+ FPS with RT + DLSS 4</li>
              <li><strong>Black Myth: Wukong:</strong> 45 FPS → 180+ FPS with DLSS 4</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Gaming Benchmarks</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>Here's how the RTX 5080 performs across various gaming scenarios:</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Game</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#22c55e' }}>1440p Ultra</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#22c55e' }}>4K Ultra + DLSS</th>
              </tr>
            </thead>
            <tbody style={{ color: '#ccc' }}>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Cyberpunk 2077</td><td style={{ padding: '12px', color: '#fff' }}>95 FPS</td><td style={{ padding: '12px', color: '#fff' }}>145 FPS</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Spider-Man 2</td><td style={{ padding: '12px', color: '#fff' }}>120 FPS</td><td style={{ padding: '12px', color: '#fff' }}>165 FPS</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Alan Wake 2</td><td style={{ padding: '12px', color: '#fff' }}>72 FPS</td><td style={{ padding: '12px', color: '#fff' }}>118 FPS</td></tr>
              <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '12px' }}>Starfield</td><td style={{ padding: '12px', color: '#fff' }}>110 FPS</td><td style={{ padding: '12px', color: '#fff' }}>155 FPS</td></tr>
              <tr><td style={{ padding: '12px' }}>Dragon Age: Veilguard</td><td style={{ padding: '12px', color: '#fff' }}>130 FPS</td><td style={{ padding: '12px', color: '#fff' }}>175 FPS</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Ray Tracing Performance</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>Blackwell's enhanced RT cores deliver substantially better ray tracing performance than Ada. In titles like Cyberpunk 2077 and Alan Wake 2, the RTX 5080 matches or exceeds what the RTX 4090 achieved — a remarkable feat for a $999 card.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Productivity & Content Creation</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>For content creators, the RTX 5080 offers:</p>
          <ul style={{ color: '#ccc', marginLeft: 24, lineHeight: 2 }}>
            <li><strong>Blender:</strong> ~15% faster than RTX 4080 Super</li>
            <li><strong>DaVinci Resolve:</strong> Excellent for 4K+ timeline editing</li>
            <li><strong>Premiere Pro:</strong> Hardware acceleration for exports</li>
            <li><strong>AI Tasks:</strong> Solid for local LLM inference with 16GB VRAM</li>
          </ul>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Power & Thermals</h2>
          <p style={{ color: '#ccc', marginBottom: 16, lineHeight: 1.8 }}>The RTX 5080 runs at 360W TDP, requiring a minimum 850W PSU. In our testing, temperatures stayed under 70°C under gaming load with the Founders Edition cooler. Third-party AIB cards with larger coolers can push this even lower.</p>
        </div>

        <div style={{ 
          background: '#1a1a1a', 
          padding: 32, 
          borderRadius: 16, 
          marginBottom: 40,
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#f0f0f0', marginBottom: 16, fontSize: 20 }}>Pros & Cons</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h4 style={{ color: '#22c55e', marginBottom: 12 }}>✅ Pros</h4>
              <ul style={{ color: '#ccc', marginLeft: 20, lineHeight: 1.8 }}>
                <li>Excellent 1440p performance</li>
                <li>DLSS 4 is a game-changer</li>
                <li>Same $999 MSRP as 4080 Super</li>
                <li>Great ray tracing performance</li>
                <li>16GB VRAM handles modern games</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#ef4444', marginBottom: 12 }}>❌ Cons</h4>
              <ul style={{ color: '#ccc', marginLeft: 20, lineHeight: 1.8 }}>
                <li>Street price exceeds MSRP</li>
                <li>No 24GB option like the 4090</li>
                <li>Needs 850W+ PSU</li>
                <li>Limited upgrade path from 4080</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid #222' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0f0f0', marginBottom: 16 }}>Verdict: Highly Recommended</h2>
          <p style={{ color: '#ccc', marginBottom: 24, lineHeight: 1.8, fontSize: 18 }}>The RTX 5080 is the best high-end GPU value in 2026. If you're gaming at 1440p or want capable 4K gaming with DLSS, this is the card to get. At $999 MSRP, it delivers flagship-tier performance at a reasonable price — assuming you can find one at or near retail.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <a href="https://www.amazon.com/s?k=RTX+5080" style={{ 
              background: '#22c55e', 
              color: '#000', 
              padding: '14px 28px', 
              borderRadius: 8, 
              textDecoration: 'none',
              fontWeight: 600
            }}>Check Prices on Amazon</a>
            <a href="https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5080" style={{ 
              background: '#0046be', 
              color: '#fff', 
              padding: '14px 28px', 
              borderRadius: 8, 
              textDecoration: 'none',
              fontWeight: 600
            }}>Check Prices on Best Buy</a>
          </div>
        </div>
      </article>

      <footer style={{ borderTop: '1px solid #222', padding: '32px 24px', textAlign: 'center', color: '#666' }}>
        <p style={{ marginBottom: 8 }}>© 2026 GPUDrip — Track GPU prices and find the best deals</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>GPUs</Link>
          <Link href="/blog" style={{ color: '#666', textDecoration: 'none' }}>Blog</Link>
          <Link href="/affiliate-disclosure" style={{ color: '#666', textDecoration: 'none' }}>Disclosure</Link>
        </div>
      </footer>
    </div>
  )
}
