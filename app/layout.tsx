import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { OrganizationSchema, WebSiteSchema } from '@/components/schema'
import { AuthProvider } from '@/lib/auth-context'
import MobileNav from './components/MobileNav'
import AuthButton from './components/AuthButton'

export const metadata: Metadata = {
    title: { default: 'GPU Drip — GPU Price Tracker & Deal Alerts', template: '%s | GPU Drip' },
    description: 'Track GPU prices across Best Buy, Amazon, Newegg and more. Get deal alerts and price comparisons for RTX 5090, RTX 5080, RX 9070 XT, and all major GPUs.',
    keywords: ['GPU price tracker', 'RTX 5090 price', 'GPU deals', 'graphics card price comparison', 'GPU stock alerts'],
    authors: [{ name: 'GPU Drip' }],
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
    openGraph: {
        type: 'website',
        siteName: 'GPU Drip',
        title: 'GPU Drip — GPU Price Tracker & Deal Alerts',
        description: 'Real-time GPU price tracking, deal detection, and stock alerts across all major retailers.',
        url: 'https://gpudrip.com',
        images: [
            {
                url: 'https://gpudrip.com/og-image.png?v=3',
                width: 1200,
                height: 630,
                alt: 'GPU Drip - Live GPU Price Tracking',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@gpudrip',
        title: 'GPU Drip — GPU Price Tracker & Deal Alerts',
        description: 'Real-time GPU price tracking, deal detection, and stock alerts across all major retailers.',
        images: ['https://gpudrip.com/og-image.png?v=3'],
    },
    robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <OrganizationSchema />
                <WebSiteSchema />
                {/* Privacy-friendly analytics by Plausible */}
                <script async src="https://plausible.io/js/pa-iobsueqPzkvBY3RDkLkeI.js"></script>
                <script dangerouslySetInnerHTML={{__html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}}; plausible.init()`}} />
                <script src="/live-price-injector.js" />
                
                {/* Google Analytics 4 */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-LQ4NHSL67V"></script>
                <script dangerouslySetInnerHTML={{__html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-LQ4NHSL67V');
                `}} />
            </head>
            <body>
                <AuthProvider>
                <nav className="nav" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a' }}>
                    <div className="container nav__inner">
                        <Link href="/" className="nav__brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', 
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" style={{ display: 'inline-block' }}>
                                    <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                                </svg>
                            </div>
                            <span style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                                GPU<span style={{ color: '#00ff88' }}>Drip</span>
                            </span>
                        </Link>
                        <div className="nav__links" style={{ display: 'flex', gap: 8 }}>
                            {/* Desktop links - hidden on mobile */}
                            <div className="desktop-links" style={{ display: 'flex', gap: 8 }}>
                                <Link href="/gpu" className="nav__link" style={{ background: '#1a1a1a', padding: '8px 16px', borderRadius: 8, border: '1px solid #333', color: '#fff', fontWeight: 600, fontSize: 14 }}>GPUs</Link>
                                <Link href="/compare" className="nav__link" style={{ background: '#1a1a1a', padding: '8px 16px', borderRadius: 8, border: '1px solid #ff6b35', color: '#ff6b35', fontWeight: 600, fontSize: 14 }}>Compare</Link>
                                <Link href="/retailers" className="nav__link" style={{ background: '#1a1a2e', padding: '8px 16px', borderRadius: 8, border: '1px solid #FF9900', color: '#FF9900', fontWeight: 600, fontSize: 14 }}>Retailers</Link>
                                <Link href="/refurb" className="nav__link" style={{ background: '#001a0d', padding: '8px 16px', borderRadius: 8, border: '1px solid #00ff88', color: '#00ff88', fontWeight: 600, fontSize: 14 }}>Refurb</Link>
                                <Link href="/blog" className="nav__link" style={{ background: '#1a3a1a', padding: '8px 16px', borderRadius: 8, border: '1px solid #22c55e', color: '#22c55e', fontWeight: 600, fontSize: 14 }}>Blog</Link>
                                <Link href="/alerts" className="nav__link" style={{ background: '#1a1a3a', padding: '8px 16px', borderRadius: 8, border: '1px solid #4a90e2', color: '#4a90e2', fontWeight: 600, fontSize: 14 }}>Alerts</Link>
                                <div style={{ marginLeft: 8 }}>
                                    <AuthButton variant="nav" />
                                </div>
                            </div>
                            {/* Mobile hamburger - shown on mobile */}
                            <div className="mobile-menu-container" style={{ position: 'relative' }}>
                                <MobileNav />
                            </div>
                        </div>
                    </div>
                </nav>
                <main>{children}</main>
                <footer style={{
                    borderTop: '1px solid var(--border)',
                    padding: '32px 0',
                    marginTop: '80px',
                }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 800, fontSize: 15 }}>GPU<span style={{ color: '#00ff88' }}>Drip</span></span>
                                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>— Price intelligence for GPUs</span>
                            </div>
                            <div style={{ display: 'flex', gap: 20 }}>
                                {[['How to Use', '/how-to'], ['About', '/about'], ['Contact', '/contact'], ['Terms', '/terms'], ['Privacy', '/privacy']].map(([label, href]) => (
                                    <a key={href} href={href} style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</a>
                                ))}
                            </div>
                        </div>
                        <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                            Prices subject to change. GPU Drip does not sell products. We may earn affiliate commissions from qualifying purchases — this does not affect our pricing data or rankings.
                        </p>
                    </div>
                </footer>
                </AuthProvider>
            </body>
        </html>
    )
}