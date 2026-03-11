export const metadata = {
  title: 'About | GPU Drip',
  description: 'About GPU Drip - free GPU price tracking for gamers and builders.',
}

export default function About() {
  return (
    <div style={{ 
      background: '#0a0a0a', 
      minHeight: '100vh',
      padding: '48px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      lineHeight: 1.6,
      color: '#f5f5f5'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>About GPU Drip</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>Last Updated: March 2026</p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Our Mission</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip was built to help gamers, PC builders, and enthusiasts find the best GPU prices across major retailers. We track prices so you don't have to.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>What We Do</h2>
        <ul style={{ marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 12 }}>Track GPU prices from Amazon, Best Buy, Newegg, B&H Photo, and more</li>
          <li style={{ marginBottom: 12 }}>Monitor price history to help you spot trends</li>
          <li style={{ marginBottom: 12 }}>Send price drop alerts so you never miss a deal</li>
          <li style={{ marginBottom: 12 }}>Filter by brand (NVIDIA, AMD, Intel) and model</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Why We're Free</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip is free because we participate in affiliate programs. When you click our links and make a purchase, we earn a small commission—at no extra cost to you. This helps us keep the site running.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Our Promise</h2>
        <p style={{ marginBottom: 20 }}>
          <strong>Independent recommendations.</strong> We show prices from multiple retailers because we want you to find the best deal—not the one that pays us the most. Our rankings are based on price and availability, nothing else.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Contact Us</h2>
        <p style={{ marginBottom: 20 }}>
          Have questions, suggestions, or just want to say hi? Reach out at: <span style={{ color: '#00ff88' }}>support@gpudrip.com</span>
        </p>

        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid #2d2d2d', color: '#666', fontSize: 14 }}>
          <p>© 2026 GPU Drip. All rights reserved.</p>
          <p style={{ marginTop: 8 }}>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </div>
    </div>
  )
}