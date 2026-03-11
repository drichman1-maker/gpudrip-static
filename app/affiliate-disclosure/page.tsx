export const metadata = {
  title: 'Affiliate Disclosure | GPU Drip',
  description: 'GPU Drip is a free price tracking tool. We may earn commissions from affiliate links.',
}

export default function AffiliateDisclosure() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>Affiliate Disclosure</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>Last Updated: March 2026</p>

        <p style={{ marginBottom: 20 }}>
          GPU Drip is a free price tracking tool for graphics cards. We strive to provide accurate, up-to-date pricing information to help you make informed purchasing decisions.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Our Promise</h2>
        <p style={{ marginBottom: 20 }}>
          Our goal is to be transparent about how we monetize this site. We believe in honest, unbiased product recommendations.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Affiliate Links</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip participates in the Amazon Associates Program and other affiliate advertising programs. When you click on product links and make a purchase, we may earn a commission at <strong>no additional cost to you</strong>.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>How It Works</h2>
        <ul style={{ marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 12 }}>We link to retailers like Amazon, Best Buy, Newegg, and B&H Photo</li>
          <li style={{ marginBottom: 12 }}>If you click a link and buy something, we get a small commission</li>
          <li style={{ marginBottom: 12 }}>This helps us keep GPU Drip free and running</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Our Commitment</h2>
        <p style={{ marginBottom: 20 }}>
          <strong>Our recommendations are independent</strong>. We don't let affiliate partnerships influence our reviews or rankings. We show prices from multiple retailers so you can find the best deal—not just the one that pays us the most.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Questions?</h2>
        <p style={{ marginBottom: 20 }}>
          If you have questions about our affiliate relationships, contact us at: <span style={{ color: '#00ff88' }}>support@gpudrip.com</span>
        </p>

        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid #2d2d2d', color: '#666', fontSize: 14 }}>
          <p>© 2026 GPU Drip. All rights reserved.</p>
          <p style={{ marginTop: 8 }}>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </div>
    </div>
  )
}
