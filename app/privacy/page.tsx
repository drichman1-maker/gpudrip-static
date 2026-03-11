export const metadata = {
  title: 'Privacy Policy | GPU Drip',
  description: 'GPU Drip privacy policy - how we handle your data.',
}

export default function Privacy() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>Privacy Policy</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>Last Updated: March 2026</p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Overview</h2>
        <p style={{ marginBottom: 20 }}>
          GPU Drip ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our GPU price tracking platform.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Information We Collect</h2>
        <p style={{ marginBottom: 12, color: '#00ff88', fontWeight: 600 }}>Personal Information:</p>
        <p style={{ marginBottom: 20 }}>Email address (when subscribing to price alerts)</p>
        
        <p style={{ marginBottom: 12, color: '#00ff88', fontWeight: 600 }}>Usage Data:</p>
        <ul style={{ marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Pages viewed</li>
          <li style={{ marginBottom: 8 }}>Searches performed</li>
          <li style={{ marginBottom: 8 }}>Features used</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>How We Use Your Information</h2>
        <p style={{ marginBottom: 20 }}>We use the information we collect to:</p>
        <ul style={{ marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Provide price tracking and alert services</li>
          <li style={{ marginBottom: 8 }}>Improve our platform and user experience</li>
          <li style={{ marginBottom: 8 }}>Send notifications about price changes</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Cookies</h2>
        <p style={{ marginBottom: 20 }}>
          We use cookies to analyze site traffic and optimize your experience. You can disable cookies in your browser settings.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Third-Party Services</h2>
        <p style={{ marginBottom: 20 }}>We use third-party services including:</p>
        <ul style={{ marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Amazon Associates Program</li>
          <li style={{ marginBottom: 8 }}>eBay Partner Network</li>
          <li style={{ marginBottom: 8 }}>Analytics providers (for site improvements only)</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Your Rights</h2>
        <p style={{ marginBottom: 20 }}>You have the right to:</p>
        <ul style={{ marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Access your personal information</li>
          <li style={{ marginBottom: 8 }}>Request deletion of your data</li>
          <li style={{ marginBottom: 8 }}>Opt-out of marketing communications</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '40px 0 16px' }}>Contact Us</h2>
        <p style={{ marginBottom: 20 }}>
          For privacy questions, contact us at: <span style={{ color: '#00ff88' }}>support@gpudrip.com</span>
        </p>

        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid #2d2d2d', color: '#666', fontSize: 14 }}>
          <p>© 2026 GPU Drip. All rights reserved.</p>
          <p style={{ marginTop: 8 }}>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </div>
    </div>
  )
}
