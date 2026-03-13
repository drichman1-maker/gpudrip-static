import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchGPUs } from '@/lib/api'
import BrandFilterGPUs from './brand-filter-gpus'

export const metadata: Metadata = {
    title: 'GPU Price Tracker — Live Prices, Deals & Stock Alerts',
    description: 'Track RTX 5090, RTX 5080, RX 9070 XT prices in real time. See deals, stock availability, and price history across Best Buy, Amazon, Newegg and more.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
    const gpus = await fetchGPUs()
    
    return (
        <div>
            {/* Hero */}
            <section style={{ padding: '60px 0 40px', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ maxWidth: 620 }}>
                        <div className="badge badge--blue" style={{ marginBottom: 16 }}>
                            ⚡ Live Price Intelligence
                        </div>
                        <h1 style={{ marginBottom: 16 }}>
                            Find the best GPU price.<br />
                            <span style={{ color: 'var(--blue)' }}>Before anyone else.</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.6, marginBottom: 28 }}>
                            Real-time price tracking across Best Buy, Amazon, Newegg and more.
                            Instant alerts when deals drop. 180-day price history.
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <Link href="/gpu" className="btn btn--primary" style={{ fontSize: 15, padding: '11px 22px' }}>
                                Browse All GPUs →
                            </Link>
                            <Link href="/alerts" className="btn btn--outline" style={{ fontSize: 15, padding: '11px 22px' }}>
                                🔔 Set Price Alert
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
                        {[
                            { label: 'GPUs Tracked', value: gpus.length.toString() },
                            { label: 'Active Deals', value: gpus.filter(g => g.price_change_percent < 0).length.toString() },
                            { label: 'Retailers', value: '8' },
                            { label: 'Last Updated', value: 'Live' },
                        ].map(({ label, value }) => (
                            <div key={label} className="stat">
                                <div className="stat__label">{label}</div>
                                <div className="stat__value" style={{ fontSize: '1.2rem' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured GPUs with Brand Filter */}
            <BrandFilterGPUs initialGPUs={gpus} />
        </div>
    )
}
