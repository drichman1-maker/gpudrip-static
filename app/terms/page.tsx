export const metadata = {
  title: 'Terms of Service | GPU Drip',
  description: 'GPU Drip terms of service - using our GPU price tracking tool.',
}

export default function Terms() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>Terms of Service</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>Last Updated: March 2026</p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Acceptance of Terms</h2>
        <p style={{ marginBottom: 20 }}>
          By accessing and using GPU Drip, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Use License</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip is provided as a free price tracking tool. You may use this site for personal, non-commercial purposes. You may not copy, modify, or distribute the content without our written permission.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Price Accuracy</h2>
        <p style={{ marginBottom: 20 }}>
          We strive to provide accurate pricing information, but we cannot guarantee that all prices are current or correct. Always verify prices with the retailer before making a purchase.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Affiliate Relationships</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip participates in affiliate programs. When you click retailer links and make a purchase, we may earn a commission. This does not influence our price tracking or rankings.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Disclaimer</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip is provided "as is" without any representations or warranties, express or implied. We make no representations or warranties in relation to this website or the information provided.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Limitation of Liability</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special, or consequential loss.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Contact Us</h2>
        <p style={{ marginBottom: 20 }}>
          For questions about these terms, contact us at: <span style={{ color: '#00ff88' }}>support@gpudrip.com</span>
        </p>

        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid #2d2d2d', color: '#666', fontSize: 14 }}>
          <p>© 2026 GPU Drip. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}