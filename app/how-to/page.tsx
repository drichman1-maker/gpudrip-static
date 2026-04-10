export const metadata = {
  title: 'How to Use GPU Drip | GPU Price Tracking Guide',
  description: 'Complete guide to using GPU Drip - find deals, set price alerts, compare GPUs, and track prices.',
}

export default function HowTo() {
  return (
    <div style={{ 
      background: '#0a0a0a', 
      minHeight: '100vh',
      padding: '48px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      lineHeight: 1.6,
      color: '#f5f5f5'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>How to Use GPU Drip</h1>
        <p style={{ color: '#888', fontSize: '1.25rem', marginBottom: 48 }}>
          The complete guide to finding the best GPU deals
        </p>

        {/* Browse GPUs */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            🖥️ Browsing GPUs
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ol style={{ paddingLeft: 24, color: '#ccc' }}>
              <li style={{ marginBottom: 12 }}><strong>Visit the homepage</strong> to see all 38 tracked GPUs</li>
              <li style={{ marginBottom: 12 }}><strong>Filter by brand:</strong> NVIDIA (RTX 50/40/30 series), AMD (RX 9000/7000), or Intel (Arc)</li>
              <li style={{ marginBottom: 12 }}><strong>Sort by:</strong> Price, Value Score, VRAM, or Name</li>
              <li style={{ marginBottom: 12 }}><strong>Click any GPU</strong> to see detailed pricing and specs</li>
            </ol>
          </div>
        </section>

        {/* GPU Details */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            🔍 GPU Detail Page
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <p style={{ color: '#ccc', marginBottom: 16 }}>Click any GPU card to see:</p>
            <ul style={{ paddingLeft: 24, color: '#ccc' }}>
              <li style={{ marginBottom: 8 }}>✓ <strong>Current prices</strong> from all tracked retailers</li>
              <li style={{ marginBottom: 8 }}>✓ <strong>Price history chart</strong> (30/60/90 days)</li>
              <li style={{ marginBottom: 8 }}>✓ <strong>Value Score</strong> (performance per dollar)</li>
              <li style={{ marginBottom: 8 }}>✓ <strong>Stock status</strong> at each retailer</li>
              <li style={{ marginBottom: 8 }}>✓ <strong>Full specs:</strong> VRAM, architecture, TDP, ports</li>
              <li style={{ marginBottom: 8 }}>✓ <strong>Buy links</strong> to each retailer</li>
            </ul>
          </div>
        </section>

        {/* Setting Alerts */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            🔔 Setting Up Price Alerts
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <p style={{ color: '#ccc', marginBottom: 16 }}>Get notified when GPU prices drop:</p>
            <ol style={{ paddingLeft: 24, color: '#ccc' }}>
              <li style={{ marginBottom: 12 }}><strong>Sign in</strong> with Google (navbar → Sign In)</li>
              <li style={{ marginBottom: 12 }}><strong>Go to Alerts</strong> page</li>
              <li style={{ marginBottom: 12 }}><strong>Select GPU(s)</strong> to track (up to 5)</li>
              <li style={{ marginBottom: 12 }}><strong>Enter target price</strong> per GPU</li>
              <li style={{ marginBottom: 12 }}><strong>Click "Create Alert"</strong></li>
            </ol>
            <p style={{ color: '#888', fontSize: 14, marginTop: 16 }}>
              We check prices multiple times daily and email you when your target is hit.
            </p>
          </div>
        </section>

        {/* Comparing GPUs */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            📊 Comparing GPUs
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ol style={{ paddingLeft: 24, color: '#ccc' }}>
              <li style={{ marginBottom: 12 }}>Go to the <a href="/compare" style={{ color: '#00ff88' }}>Compare page</a></li>
              <li style={{ marginBottom: 12 }}>Select 2-4 GPUs to compare</li>
              <li style={{ marginBottom: 12 }}>View specs, prices, and value scores side by side</li>
              <li style={{ marginBottom: 12 }}>See which GPU offers the best performance per dollar</li>
            </ol>
          </div>
        </section>

        {/* Retailers */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            🏪 Tracked Retailers
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ul style={{ paddingLeft: 24, color: '#ccc', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <li>• <strong>Amazon</strong> - Fast shipping, wide stock</li>
              <li>• <strong>Best Buy</strong> - In-store pickup, returns</li>
              <li>• <strong>Newegg</strong> - PC builder hub</li>
              <li>• <strong>B&H Photo</strong> - Pro gear, no tax outside NY</li>
              <li>• <strong>Micro Center</strong> - Best in-store deals</li>
              <li>• <strong>Adorama</strong> - Tech retailer</li>
              <li>• <strong>Antonline</strong> - Bundle deals</li>
              <li>• <strong>CDW</strong> - Business gear</li>
            </ul>
          </div>
        </section>

        {/* Value Score */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            📈 Understanding Value Score
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <p style={{ color: '#ccc', marginBottom: 12 }}>
              <strong>Value Score</strong> = Performance ÷ Price
            </p>
            <p style={{ color: '#aaa', marginBottom: 12 }}>
              A higher score means more performance per dollar. Use it to find the best bang-for-buck GPU.
            </p>
            <ul style={{ paddingLeft: 24, color: '#888', fontSize: 14 }}>
              <li>Based on benchmark performance (3DMark, gaming FPS)</li>
              <li>Updated when prices change</li>
              <li>Compare across generations (RTX 40 vs RTX 50)</li>
            </ul>
          </div>
        </section>

        {/* Tips */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            💡 Pro Tips
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ul style={{ paddingLeft: 24, color: '#ccc' }}>
              <li style={{ marginBottom: 12 }}>✓ <strong>Best time to buy:</strong> Black Friday, Prime Day, new gen releases</li>
              <li style={{ marginBottom: 12 }}>✓ <strong>Refresh cycles:</strong> NVIDIA releases ~2 years, AMD ~1.5 years</li>
              <li style={{ marginBottom: 12 }}>✓ <strong>Stock alerts:</strong> High-demand cards sell out fast—check often</li>
              <li style={{ marginBottom: 12 }}>✓ <strong>Used/Refurbished:</strong> eBay and r/hardwareswap for deals</li>
              <li style={{ marginBottom: 12 }}>✓ <strong>Price history:</strong> Check 90-day charts before buying</li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: '#00ff88' }}>
            ❓ FAQ
          </h2>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              padding: 20,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontWeight: 600, marginBottom: 8 }}>How often are prices updated?</h3>
              <p style={{ color: '#aaa' }}>Multiple times per day. Each price shows when it was last verified.</p>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              padding: 20,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Is GPU Drip free?</h3>
              <p style={{ color: '#aaa' }}>Yes! We earn affiliate commissions when you buy through our links—at no extra cost to you.</p>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              padding: 20,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Do you track international prices?</h3>
              <p style={{ color: '#aaa' }}>Currently US-only. We track USD prices from US retailers.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ 
          background: 'rgba(0,255,136,0.1)', 
          borderRadius: 12, 
          padding: 32, 
          textAlign: 'center',
          border: '1px solid rgba(0,255,136,0.3)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Ready to Find Your GPU?</h2>
          <p style={{ color: '#aaa', marginBottom: 20 }}>Browse GPUs or set up your first price alert.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{ 
              background: '#00ff88', 
              color: '#000', 
              padding: '12px 24px', 
              borderRadius: 8, 
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              Browse GPUs
            </a>
            <a href="/alerts" style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              padding: '12px 24px', 
              borderRadius: 8, 
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Set Up Alerts
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
