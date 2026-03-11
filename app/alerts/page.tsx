import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Price Alerts — GPU Drip',
    description: 'Set up price alerts for your favorite GPUs. Get notified when prices drop.',
}

export const dynamic = 'force-static'

export default function AlertsPage() {
    return (
        <div className="container" style={{ padding: '48px 24px', maxWidth: 600 }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, display: 'inline-block' }}>
                ← Back to all GPUs
            </Link>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h1 style={{ marginBottom: 16 }}>🔔 Price Alerts</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
                    Get notified when GPU prices drop. Set your target price and we'll email you when deals are available.
                </p>
            </div>

            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
                <h2 style={{ marginBottom: 12 }}>Coming Soon</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                    Price alerts are currently under development. In the meantime, bookmark this page and check back regularly for the latest GPU deals.
                </p>
                <Link href="/" className="btn btn--primary">
                    Browse GPUs
                </Link>
            </div>

            <div style={{ marginTop: 48, padding: 24, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: 12 }}>How It Will Work</h3>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <li style={{ marginBottom: 8 }}>✅ Select any GPU you want to track</li>
                    <li style={{ marginBottom: 8 }}>✅ Set your target price</li>
                    <li style={{ marginBottom: 8 }}>✅ Choose your notification frequency</li>
                    <li style={{ marginBottom: 8 }}>✅ Get instant alerts when prices drop</li>
                </ul>
            </div>
        </div>
    )
}
