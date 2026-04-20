import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchRefurbGPUs } from '@/lib/api'

export const metadata: Metadata = {
    title: 'Refurbished GPUs — Certified Deals & Price Tracker',
    description: 'Track certified refurbished GPU prices across Amazon, eBay, Adorama, and more. Save 20–40% vs MSRP on RTX 4090, RTX 4080, RX 7900 XTX and more.',
    openGraph: {
        title: 'Refurbished GPU Deals — GPU Drip',
        description: 'Live prices on certified refurbished GPUs. Updated daily.',
    },
}

export const dynamic = 'force-static'

const RETAILER_LABELS: Record<string, string> = {
    amazon: 'Amazon',
    ebay: 'eBay',
    adorama: 'Adorama',
    bh: 'B&H Photo',
    bestbuy: 'Best Buy',
    newegg: 'Newegg',
    microcenter: 'Micro Center',
    abt: 'ABT',
}

export default async function RefurbPage() {
    const gpus = await fetchRefurbGPUs()
    const inStock = gpus.filter(g => g.inStock)
    const outOfStock = gpus.filter(g => !g.inStock)

    return (
        <div>
            <section style={{ padding: '48px 0 32px', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ maxWidth: 640 }}>
                        <div className="badge badge--green" style={{ marginBottom: 14 }}>♻️ Refurbished</div>
                        <h1 style={{ marginBottom: 12 }}>Refurbished GPUs</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
                            Certified refurbished GPUs from Amazon Renewed, Adorama, and more.
                            Save 20–40% vs MSRP with buyer protection — same GPU, lower price.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

                {/* In-stock refurb */}
                {inStock.length > 0 && (
                    <div style={{ marginBottom: 48 }}>
                        <h2 style={{ fontSize: 18, marginBottom: 20 }}>
                            In Stock Now
                            <span className="badge badge--green" style={{ fontSize: 11, marginLeft: 10 }}>{inStock.length} available</span>
                        </h2>
                        <div className="card" style={{ padding: 0 }}>
                            <div className="table-wrap">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>GPU</th>
                                            <th>MSRP</th>
                                            <th>Refurb Price</th>
                                            <th>Savings</th>
                                            <th>Retailer</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inStock.map(g => (
                                            <tr key={g.id}>
                                                <td>
                                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{g.name.replace(' (Refurbished)', '')}</div>
                                                    {g.specs.vram && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{g.specs.vram} VRAM</div>}
                                                </td>
                                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                                                    ${g.msrp.toLocaleString()}
                                                </td>
                                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>
                                                    {g.lowestPrice ? `$${g.lowestPrice.toLocaleString()}` : '—'}
                                                </td>
                                                <td>
                                                    {g.savingsPct && g.savingsPct > 0 ? (
                                                        <span className="badge badge--green" style={{ fontSize: 11 }}>
                                                            -{g.savingsPct}% off
                                                        </span>
                                                    ) : '—'}
                                                </td>
                                                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                    {g.lowestRetailer ? (RETAILER_LABELS[g.lowestRetailer] ?? g.lowestRetailer) : '—'}
                                                </td>
                                                <td>
                                                    {g.lowestAffiliateUrl || g.lowestUrl ? (
                                                        <a
                                                            href={g.lowestAffiliateUrl || g.lowestUrl || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn--primary"
                                                            style={{ fontSize: 12, padding: '6px 14px' }}
                                                        >
                                                            Buy →
                                                        </a>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* All retailer prices for each in-stock GPU */}
                {inStock.length > 0 && (
                    <div style={{ marginBottom: 48 }}>
                        <h2 style={{ fontSize: 18, marginBottom: 20 }}>All Refurb Prices by GPU</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {inStock.map(g => {
                                const allPrices = Object.entries(g.prices).filter(([, v]) => v.price > 0)
                                return (
                                    <div key={g.id} className="card">
                                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                                            {g.name.replace(' (Refurbished)', '')}
                                            {g.specs.vram && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 13, marginLeft: 8 }}>{g.specs.vram}</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                            {allPrices.map(([retailer, data]) => (
                                                <a
                                                    key={retailer}
                                                    href={(data as any).affiliateUrl || data.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2,
                                                        padding: '10px 14px',
                                                        background: (data as any).status === 'in_stock' ? 'rgba(0,255,136,0.06)' : 'var(--surface)',
                                                        border: `1px solid ${(data as any).status === 'in_stock' ? 'var(--green)' : 'var(--border)'}`,
                                                        borderRadius: 8,
                                                        textDecoration: 'none',
                                                        minWidth: 120,
                                                    }}
                                                >
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                        {RETAILER_LABELS[retailer] ?? retailer}
                                                    </div>
                                                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: (data as any).status === 'in_stock' ? 'var(--green)' : 'var(--text-muted)' }}>
                                                        ${(data as any).price.toLocaleString()}
                                                    </div>
                                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                                        {(data as any).status === 'in_stock' ? 'In Stock' : 'OOS'}
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* OOS watchlist */}
                {outOfStock.length > 0 && (
                    <div style={{ marginBottom: 48 }}>
                        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Price Alert Watchlist</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                            Currently out of stock — set an alert to be notified when back in.
                        </p>
                        <div className="card" style={{ padding: 0 }}>
                            <div className="table-wrap">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>GPU</th>
                                            <th>MSRP</th>
                                            <th>Last Seen</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outOfStock.map(g => (
                                            <tr key={g.id}>
                                                <td style={{ fontWeight: 600, fontSize: 14 }}>{g.name.replace(' (Refurbished)', '')}</td>
                                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>${g.msrp.toLocaleString()}</td>
                                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                                                    {g.lowestPrice ? `$${g.lowestPrice.toLocaleString()}` : '—'}
                                                </td>
                                                <td>
                                                    <Link href="/alerts" className="btn btn--ghost" style={{ fontSize: 12 }}>
                                                        🔔 Alert Me
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info box */}
                <div className="card" style={{ background: 'var(--blue-dim)', borderColor: 'var(--border-focus)' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 20 }}>ℹ️</span>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 6 }}>About refurbished GPUs</div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                                We track <strong>certified refurbished</strong> listings from Amazon Renewed, Adorama, B&H, and eBay.
                                These come with seller warranties and buyer protection. Avoid "used" listings without certification.
                                Savings vs MSRP shown are calculated against new retail price — street prices may be lower.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
