export const metadata = {
  title: 'Contact | GPU Drip',
  description: 'Contact GPU Drip - questions, feedback, and business inquiries.',
}

export default function Contact() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>Contact GPU Drip</h1>
        <p style={{ color: '#888', marginBottom: 48 }}>Have questions? We're here to help.</p>

        {/* Contact Info */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: 12, 
          padding: 32, 
          marginBottom: 32,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Get in Touch</h2>
          
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>📧</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Email</h3>
            </div>
            <p style={{ color: '#00ff88', marginLeft: 36 }}>support@gpudrip.com</p>
            <p style={{ color: '#666', fontSize: 14, marginLeft: 36, marginTop: 4 }}>We typically respond within 24-48 hours</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>📍</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Location</h3>
            </div>
            <p style={{ color: '#aaa', marginLeft: 36 }}>Remote-first, USA</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: 12, 
          padding: 32, 
          marginBottom: 32,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Common Questions</h2>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>How do price alerts work?</h3>
            <p style={{ color: '#aaa' }}>Sign in with Google, select a GPU, set your target price, and we'll email you when it drops to that price.</p>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Is GPU Drip free?</h3>
            <p style={{ color: '#aaa' }}>Yes! GPU Drip is completely free. We earn a small commission from affiliate links at no extra cost to you.</p>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>How often are prices updated?</h3>
            <p style={{ color: '#aaa' }}>We check prices multiple times per day. Each price shows when it was last verified.</p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Which retailers do you track?</h3>
            <p style={{ color: '#aaa' }}>Amazon, Best Buy, Newegg, B&H Photo, Micro Center, Adorama, Antonline, and CDW.</p>
          </div>
        </div>

        {/* Business */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: 12, 
          padding: 32,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Business Inquiries</h2>
          <p style={{ color: '#aaa', marginBottom: 12 }}>For partnerships, advertising, or press inquiries:</p>
          <p style={{ color: '#00ff88' }}>business@gpudrip.com</p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid #2d2d2d', color: '#666', fontSize: 14 }}>
          <p>© 2026 GPU Drip. All rights reserved.</p>
          <p style={{ marginTop: 8 }}>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </div>
    </div>
  )
}
