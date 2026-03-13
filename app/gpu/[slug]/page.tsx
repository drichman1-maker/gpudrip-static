import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchGPUBySlug, fetchGPUs } from '@/lib/api'
import { getPriceHistory, getPriceStats } from '@/lib/price-history'
import { GPUProductSchema, BreadcrumbSchema, GPUFAQSchema } from '@/components/schema'
import PriceChart from '@/components/price-chart'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const gpu = await fetchGPUBySlug(slug)
    if (!gpu) return { title: 'GPU Not Found' }

    const savings = gpu.msrp_usd - gpu.current_price_usd
    const savingsText = savings > 0 ? ` Save $${savings} off MSRP.` : ''

    return {
        title: `${gpu.model} Price Tracker & Deals — $${gpu.current_price_usd}`,
        description: `Track ${gpu.model} prices across retailers. Current: $${gpu.current_price_usd} | MSRP: $${gpu.msrp_usd}.${savingsText} ${gpu.vram_gb}GB VRAM, ${gpu.architecture} architecture. Get price alerts.`,
        keywords: [`${gpu.model} price`, `${gpu.model} deals`, `${gpu.brand} GPU price tracker`, `buy ${gpu.model}`, `GPU price comparison`],
        openGraph: {
            title: `${gpu.model} — $${gpu.current_price_usd} (${savings > 0 ? `Save $${savings}` : 'At MSRP'})`,
            description: `Track ${gpu.model} prices across Best Buy, Amazon, Newegg and more. ${gpu.vram_gb}GB VRAM, ${gpu.tdp_watts}W TDP. Get price alerts.`,
        },
    }
}

export const dynamic = 'force-dynamic'

export default async function GPUPage({ params }: Props) {
    const { slug } = await params
    const gpu = await fetchGPUBySlug(slug)

    if (!gpu) {
        notFound()
    }

    const retailerData = gpu.retailers || {}
    const priceHistory = getPriceHistory(slug)
    const priceStats = getPriceStats(slug, gpu.current_price_usd)
    const retailerNames = Object.values(retailerData).map(r => r.name)
    const savings = gpu.msrp_usd - gpu.current_price_usd
    const savingsPercent = gpu.msrp_usd > 0 ? Math.round((savings / gpu.msrp_usd) * 100) : 0

    // Build retailer offers for schema
    const retailerOffers = Object.entries(retailerData).map(([retailer, data]) => ({
        retailer: data.name,
        price: data.price,
        availability: (data.inStock ? 'InStock' : 'OutOfStock') as 'InStock' | 'OutOfStock',
        url: data.url
    }));

    // Generate content based on GPU specs
    const getUseCase = () => {
        if (gpu.vram_gb >= 24) return 'ideal for 4K gaming, VR, and professional content creation including video editing and 3D rendering'
        if (gpu.vram_gb >= 16) return 'perfect for high-refresh 1440p gaming, 4K entry-level gaming, and content creation workflows'
        if (gpu.vram_gb >= 12) return 'great for 1440p gaming at high settings, streaming, and light content creation'
        if (gpu.vram_gb >= 8) return 'suitable for 1080p and 1440p gaming at medium to high settings, esports, and general productivity'
        return 'good for 1080p gaming and everyday computing tasks'
    }

    const getPowerAdvice = () => {
        if (gpu.tdp_watts >= 400) return 'requires a high-end 850W+ power supply with robust cooling'
        if (gpu.tdp_watts >= 300) return 'needs a 750W+ power supply and adequate case ventilation'
        if (gpu.tdp_watts >= 200) return 'works with a 650W+ power supply in most systems'
        return 'efficient enough for 550W power supplies in standard builds'
    }

    const getCompetitor = () => {
        if (gpu.brand === 'nvidia') {
            if (gpu.vram_gb >= 24) return 'AMD RX 7900 XTX'
            if (gpu.vram_gb >= 16) return 'AMD RX 7900 XT or RX 7800 XT'
            if (gpu.vram_gb >= 12) return 'AMD RX 7700 XT'
            if (gpu.vram_gb >= 8) return 'AMD RX 7600 or RX 6650 XT'
            return 'AMD RX 6600'
        } else {
            if (gpu.vram_gb >= 24) return 'NVIDIA RTX 4090'
            if (gpu.vram_gb >= 16) return 'NVIDIA RTX 4080 or RTX 4070 Ti Super'
            if (gpu.vram_gb >= 12) return 'NVIDIA RTX 4070'
            if (gpu.vram_gb >= 8) return 'NVIDIA RTX 4060 Ti'
            return 'NVIDIA RTX 4060'
        }
    }

    return (
        <div className="container" style={{ padding: '48px 24px' }}>
            {/* Schema Markup */}
            <GPUProductSchema
                name={gpu.model}
                brand={gpu.brand}
                description={`${gpu.model} - ${gpu.architecture} architecture, ${gpu.vram_gb}GB VRAM, ${gpu.tdp_watts}W TDP`}
                offers={retailerOffers.length > 0 ? retailerOffers : [{
                    retailer: 'Various Retailers',
                    price: gpu.current_price_usd,
                    availability: 'InStock',
                    url: `https://gpudrip.com/gpu/${slug}`
                }]}
                msrp={gpu.msrp_usd}
            />
            <GPUFAQSchema
                gpuName={gpu.model}
                brand={gpu.brand}
                vram={gpu.vram_gb}
                architecture={gpu.architecture}
                tdp={gpu.tdp_watts}
                msrp={gpu.msrp_usd}
                currentPrice={gpu.current_price_usd}
                retailers={retailerNames}
            />
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'GPUs', url: '/gpu' },
                { name: gpu.model, url: `/gpu/${slug}` }
            ]} />

            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, display: 'inline-block' }}>
                ← Back to all GPUs
            </Link>

            {/* Header */}
            <section style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <span className="badge badge--blue">
                                {gpu.brand.toUpperCase()} · {gpu.generation}
                            </span>
                            {gpu.stockVerified ? (
                                gpu.stockStatus === 'in_stock' ? (
                                    <span className="badge" style={{ background: '#166534', color: '#fff' }}>
                                        ✓ In Stock
                                    </span>
                                ) : gpu.stockStatus === 'out_of_stock' ? (
                                    <span className="badge" style={{ background: '#991b1b', color: '#fff' }}>
                                        ✗ Out of Stock
                                    </span>
                                ) : (
                                    <span className="badge" style={{ background: '#ca8a04', color: '#fff' }}>
                                        ⚠ Check Stock
                                    </span>
                                )
                            ) : (
                                <span className="badge" style={{ background: '#ca8a04', color: '#fff' }}>
                                    ⚠ Check Stock
                                </span>
                            )}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 8 }}>
                            {gpu.model}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
                            {gpu.architecture} architecture · {gpu.vram_gb}GB VRAM · {gpu.tdp_watts}W TDP
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>Current Price</div>
                        <div className="price price--lg" style={{ color: '#22c55e' }}>${gpu.current_price_usd}</div>
                        {savings > 0 && (
                            <div style={{ fontSize: 14, color: '#22c55e', marginTop: 4 }}>Save ${savings} ({savingsPercent}%)</div>
                        )}
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>MSRP: ${gpu.msrp_usd}</div>
                    </div>
                </div>
            </section>

            {/* Specs */}
            <section className="card" style={{ marginBottom: 32 }}>
                <h2 style={{ marginBottom: 20 }}>Specifications</h2>
                <div className="grid-3" style={{ marginBottom: 8 }}>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Architecture</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{gpu.architecture}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>VRAM</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{gpu.vram_gb}GB GDDR</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>TDP</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{gpu.tdp_watts}W</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Release Date</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{new Date(gpu.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Generation</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{gpu.generation}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>MSRP</div>
                        <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>${gpu.msrp_usd}</div>
                    </div>
                </div>
            </section>

            {/* Retailers */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ marginBottom: 20 }}>Where to Buy</h2>
                <div className="grid-3">
                    {Object.entries(retailerData).map(([retailer, data]) => {
                        // Determine stock display based on verified status
                        const isVerified = data.verified === true
                        const stockStatus = isVerified
                            ? (data.inStock ? 'In Stock' : 'Out of Stock')
                            : 'Check Stock'
                        const stockColor = isVerified
                            ? (data.inStock ? '#22c55e' : '#ef4444')
                            : '#eab308'
                        
                        return (
                            <a
                                key={retailer}
                                href={data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card card--hover"
                                style={{ display: 'block', textAlign: 'center', padding: 24 }}
                            >
                                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{data.name}</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>${data.price}</div>
                                <div style={{ fontSize: 12, color: stockColor, fontWeight: 500 }}>
                                    {isVerified ? (data.inStock ? '✓ In Stock' : '✗ Out of Stock') : '⚠ Check Stock'}
                                </div>
                            </a>
                        )
                    })}
                    {Object.keys(retailerData).length === 0 && (
                        <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                            Retailer links coming soon
                        </div>
                    )}
                </div>
            </section>

            {/* Price Alert CTA */}
            <section className="card" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue)', marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h3 style={{ marginBottom: 4 }}>🔔 Get Price Alerts</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                            We'll notify you when the {gpu.model} drops in price
                        </p>
                    </div>
                    <Link href="/alerts" className="btn btn--primary">
                        Set Alert
                    </Link>
                </div>
            </section>

            {/* Price History */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 20 }}>Price History</h2>
                
                {/* Stats Cards */}
                {priceStats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
                        <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: 20 }}>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Current</div>
                            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${priceStats.current}</div>
                            <div style={{ fontSize: 12, color: priceStats.current < priceStats.avg ? '#22c55e' : '#ef4444', marginTop: 4 }}>
                                {priceStats.current < priceStats.avg ? '↓' : '↑'} {Math.round(Math.abs((priceStats.current - priceStats.avg) / priceStats.avg) * 100)}% vs avg
                            </div>
                        </div>
                        <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: 20 }}>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>30 Day Avg</div>
                            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${priceStats.day30}</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Low: ${priceStats.min}</div>
                        </div>
                        <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: 20 }}>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>90 Day Low</div>
                            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#22c55e' }}>${priceStats.min}</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>High: ${priceStats.max}</div>
                        </div>
                        <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 12, padding: 20 }}>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>vs MSRP</div>
                            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: gpu.current_price_usd < gpu.msrp_usd ? '#22c55e' : '#ef4444' }}>
                                {gpu.current_price_usd < gpu.msrp_usd ? '↓' : '↑'}${Math.abs(gpu.current_price_usd - gpu.msrp_usd)}
                            </div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>MSRP: ${gpu.msrp_usd}</div>
                        </div>
                    </div>
                )}
                
                {/* Chart */}
                {priceHistory.length > 0 && (
                    <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 24 }}>
                        <PriceChart 
                            data={priceHistory} 
                            currentPrice={gpu.current_price_usd} 
                            msrp={gpu.msrp_usd}
                            gpuModel={gpu.model}
                        />
                    </div>
                )}
            </section>

            {/* SEO Content Section - 300+ words */}
            <section className="card" style={{ marginBottom: 32 }}>
                <h2 style={{ marginBottom: 20 }}>About the {gpu.model}</h2>
                
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <p style={{ marginBottom: 16 }}>
                        The {gpu.model} is {getUseCase()}. Built on {gpu.brand}'s {gpu.architecture} architecture 
                        and released in {new Date(gpu.release_date).getFullYear()}, this GPU features {gpu.vram_gb}GB of GDDR memory 
                        and a {gpu.tdp_watts}W TDP, {getPowerAdvice()}.
                    </p>
                    
                    <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 12px', fontSize: 18 }}>Current Pricing & Availability</h3>
                    <p style={{ marginBottom: 16 }}>
                        The {gpu.model} is currently available from {retailerNames.length} major retailers: {retailerNames.join(', ')}. 
                        The best price is ${gpu.current_price_usd}
                        {savings > 0 ? `, which represents a ${savingsPercent}% savings off the MSRP of $${gpu.msrp_usd}` : `, selling at MSRP of $${gpu.msrp_usd}`}. 
                        GPU prices fluctuate frequently based on stock levels, cryptocurrency mining demand, and new product launches. 
                        Prices on GPU Drip are updated regularly to ensure you're seeing the most current deals.
                    </p>
                    
                    <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 12px', fontSize: 18 }}>Should You Buy Now?</h3>
                    <p style={{ marginBottom: 16 }}>
                        {savings > 50 
                            ? `With current savings of $${savings}, now is a great time to buy the ${gpu.model}. `
                            : `At $${gpu.current_price_usd}, the ${gpu.model} is ${savings > 0 ? 'slightly below' : 'at'} MSRP. `
                        }
                        GPU prices typically drop during major sales events like Black Friday and Prime Day, but can spike during 
                        cryptocurrency booms or when new generations launch. If you're not in a rush, set a price alert on GPU Drip 
                        to get notified immediately when the price drops below your target.
                    </p>
                    
                    <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 12px', fontSize: 18 }}>{gpu.model} vs {getCompetitor()}</h3>
                    <p style={{ marginBottom: 16 }}>
                        The main competitor to the {gpu.model} is the {getCompetitor()}. Both cards target the same price segment 
                        but offer different strengths. {gpu.brand === 'nvidia' ? 'NVIDIA typically leads in ray tracing performance and DLSS technology, while AMD offers more VRAM for the price' : 'AMD typically offers more VRAM and better price-to-performance ratios, while NVIDIA leads in ray tracing and DLSS support'}. 
                        Use GPU Drip's comparison tool to see detailed specs side-by-side and determine which GPU offers the best 
                        value for your specific needs.
                    </p>
                    
                    <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 12px', fontSize: 18 }}>Power Supply Requirements</h3>
                    <p>
                        The {gpu.model} has a {gpu.tdp_watts}W TDP (Thermal Design Power). For optimal performance and stability, 
                        {gpu.tdp_watts <= 200 
                            ? 'a 550W-650W power supply is sufficient for most builds' 
                            : gpu.tdp_watts <= 300 
                                ? 'NVIDIA/AMD recommends a 750W power supply' 
                                : 'you\'ll need an 850W or higher power supply with proper cooling'
                        }. 
                        Make sure your PSU has the correct power connectors (usually {gpu.tdp_watts >= 300 ? '2x 8-pin or 12VHPWR' : '1x 8-pin or 6-pin'}). 
                        Undervolting can reduce power consumption by 10-20% while maintaining performance.
                    </p>
                </div>
                
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                    Prices tracked across {retailerNames.length} retailers • Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </section>
        </div>
    )
}
