import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchGPUs } from '@/lib/api'
import type { GPUWithRetailers } from '@/lib/api'
import RetailerDropdown from '../RetailerDropdown'
import GPUSortClient from './GPUSortClient'

// Retailer configuration - matches GPU Drip backend retailers
const RETAILER_CONFIG: Record<string, {
  name: string
  displayName: string
  color: string
  description: string
  pros: string[]
  cons: string[]
  logo: string
  website: string
}> = {
  amazon: {
    name: 'Amazon',
    displayName: 'Amazon',
    color: '#FF9900',
    description: 'The world\'s largest online retailer with fast Prime shipping and reliable customer service. Amazon offers competitive pricing on GPUs with frequent discounts during Prime Day and Black Friday.',
    pros: ['Prime shipping', 'Easy returns', 'Customer reviews', 'A-to-Z Guarantee'],
    cons: ['Prices fluctuate frequently', '3rd party seller variability'],
    logo: 'AM',
    website: 'https://amazon.com'
  },
  bestbuy: {
    name: 'Best Buy',
    displayName: 'Best Buy',
    color: '#0046BE',
    description: 'Best Buy is a leading electronics retailer with physical store locations across the US. They offer Geek Squad support, price matching, and the My Best Buy rewards program.',
    pros: ['Physical stores', 'Geek Squad support', 'Price matching', 'Store pickup'],
    cons: ['Limited online discounts', 'Sales tax in most states'],
    logo: 'BB',
    website: 'https://bestbuy.com'
  },
  newegg: {
    name: 'Newegg',
    displayName: 'Newegg',
    color: '#F04F24',
    description: 'Newegg is a leading tech-focused e-retailer with competitive pricing on GPUs. Known for detailed product specs, customer reviews, and frequent Shell Shocker deals.',
    pros: ['Tech-focused expertise', 'Detailed specifications', 'Shell Shocker deals', 'Customer reviews'],
    cons: ['Primarily online only', 'Return shipping costs'],
    logo: 'NE',
    website: 'https://newegg.com'
  },
  bh: {
    name: 'B&H Photo',
    displayName: 'B&H Photo',
    color: '#E53935',
    description: 'B&H Photo Video is a trusted New York-based retailer specializing in electronics. Known for excellent customer service and tax-free shipping outside NY/NJ.',
    pros: ['No sales tax outside NY/NJ', 'Expert staff', 'Business accounts', 'Fast shipping'],
    cons: ['No physical stores outside NYC', 'Closed for Jewish holidays'],
    logo: 'BH',
    website: 'https://bhphotovideo.com'
  },
  microcenter: {
    name: 'Micro Center',
    displayName: 'Micro Center',
    color: '#0078D4',
    description: 'Micro Center is a computer and electronics retailer with physical stores in select US cities. Known for unbeatable in-store deals on GPUs, especially open-box and clearance items.',
    pros: ['Best in-store prices', 'Open-box deals', 'Knowledgeable staff', 'Same-day pickup'],
    cons: ['Limited store locations', 'In-store only for best deals'],
    logo: 'MC',
    website: 'https://microcenter.com'
  },
  adorama: {
    name: 'Adorama',
    displayName: 'Adorama',
    color: '#F37021',
    description: 'Adorama is a New York-based authorized electronics reseller known for competitive pricing and professional customer service. They offer tax-free shipping outside NY/NJ.',
    pros: ['No sales tax outside NY/NJ', 'Professional support', 'Business accounts'],
    cons: ['Limited physical presence', 'Smaller selection than major retailers'],
    logo: 'AD',
    website: 'https://adorama.com'
  },
  antonline: {
    name: 'Antonline',
    displayName: 'Antonline',
    color: '#00A651',
    description: 'Antonline is an authorized retailer for major brands offering competitive pricing and bundle deals on GPUs and PC components.',
    pros: ['Bundle deals', 'Authorized reseller', 'Competitive pricing'],
    cons: ['Lesser known brand', 'Limited physical presence'],
    logo: 'AN',
    website: 'https://antonline.com'
  },
  cdw: {
    name: 'CDW',
    displayName: 'CDW',
    color: '#C41230',
    description: 'CDW is a leading provider of technology solutions for business, government, and education. They offer GPUs with business pricing and volume discounts.',
    pros: ['Business pricing', 'Volume discounts', 'Dedicated account managers', 'Enterprise support'],
    cons: ['Business-focused', 'Higher prices for individuals'],
    logo: 'CD',
    website: 'https://cdw.com'
  }
}

// Normalize retailer ID from URL slug
function normalizeRetailerId(id: string): string {
  const aliases: Record<string, string> = {
    'bh-photo': 'bh',
    'b-and-h': 'bh',
    'micro-center': 'microcenter',
    'best-buy': 'bestbuy'
  }
  return aliases[id] || id
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { retailerId: string } 
}): Promise<Metadata> {
  const normalizedId = normalizeRetailerId(params.retailerId)
  const retailer = RETAILER_CONFIG[normalizedId]
  
  if (!retailer) {
    return { title: 'Retailer Not Found | GPU Drip' }
  }

  return {
    title: `${retailer.displayName} GPU Prices & Deals | GPU Drip`,
    description: `Find the best GPU prices at ${retailer.displayName}. Compare RTX 5090, RTX 5080, RX 9070 XT prices and availability. Track deals and set price alerts.`,
    openGraph: {
      title: `${retailer.displayName} GPU Prices - GPU Drip`,
      description: `Compare GPU prices at ${retailer.displayName}. Find the best deals on NVIDIA and AMD graphics cards.`
    }
  }
}

// Format price helper
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Get best price for a GPU across all retailers
function getBestPrice(gpu: GPUWithRetailers): { price: number; retailer: string } | null {
  const retailers = gpu.retailers || {}
  let bestPrice: number | null = null
  let bestRetailer = ''

  Object.entries(retailers).forEach(([name, data]) => {
    if (data.price && (bestPrice === null || data.price < bestPrice)) {
      bestPrice = data.price
      bestRetailer = name
    }
  })

  return bestPrice ? { price: bestPrice, retailer: bestRetailer } : null
}

// Generate static paths for all retailers
export async function generateStaticParams() {
  return [
    { retailerId: 'amazon' },
    { retailerId: 'bestbuy' },
    { retailerId: 'newegg' },
    { retailerId: 'bh' },
    { retailerId: 'microcenter' },
    { retailerId: 'adorama' },
    { retailerId: 'antonline' },
    { retailerId: 'cdw' },
    // Aliases for SEO-friendly URLs
    { retailerId: 'best-buy' },
    { retailerId: 'bh-photo' },
    { retailerId: 'micro-center' },
  ]
}

// Page component
export default async function RetailerPage({ 
  params 
}: { 
  params: { retailerId: string } 
}) {
  const normalizedId = normalizeRetailerId(params.retailerId)
  const retailer = RETAILER_CONFIG[normalizedId]

  if (!retailer) {
    notFound()
  }

  // Fetch all GPUs
  const gpus = await fetchGPUs()
  const activeGPUs = gpus.filter(g => g.active)

  // Filter GPUs that have prices from this retailer
  const retailerGPUs = activeGPUs.filter(gpu => {
    const retailers = gpu.retailers || {}
    return retailers[normalizedId] && retailers[normalizedId].price > 0
  })

  // Sort by price (lowest first)
  const sortedGPUs = retailerGPUs.sort((a, b) => {
    const priceA = a.retailers[normalizedId]?.price || Infinity
    const priceB = b.retailers[normalizedId]?.price || Infinity
    return priceA - priceB
  })

  // Calculate savings vs MSRP
  const gpusWithSavings = sortedGPUs.map(gpu => {
    const retailerPrice = gpu.retailers[normalizedId]?.price || 0
    const msrp = gpu.msrp_usd || 0
    const savings = msrp > retailerPrice ? msrp - retailerPrice : 0
    const savingsPercent = msrp > 0 ? Math.round((savings / msrp) * 100) : 0
    return { ...gpu, retailerPrice, savings, savingsPercent }
  })

  // Separate in-stock and out-of-stock
  const inStockGPUs = gpusWithSavings.filter(g => 
    g.retailers[normalizedId]?.inStock !== false
  )
  const outOfStockGPUs = gpusWithSavings.filter(g => 
    g.retailers[normalizedId]?.inStock === false
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '48px 0 32px', 
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%)'
      }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: 24 }}>
            <Link href="/" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Home
            </Link>
            <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {retailer.displayName}
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 24, 
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            {/* Retailer Logo/Icon */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: retailer.color + '20',
              border: `2px solid ${retailer.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 800,
              color: retailer.color,
              flexShrink: 0
            }}>
              {retailer.logo}
            </div>

            {/* Retailer Info */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '2.5rem' }}>
                  GPU Prices
                </h1>
                <RetailerDropdown currentRetailer={normalizedId} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
                {retailer.description}
              </p>
              
              {/* Stats */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#00ff88' }}>
                    {inStockGPUs.length}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>In Stock</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {retailerGPUs.length}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total GPUs</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {gpusWithSavings.filter(g => g.savings > 0).length}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>On Sale</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Retailers Navigation */}
      <section style={{ padding: '24px 0', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            flexWrap: 'wrap' 
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14, whiteSpace: 'nowrap' }}>
              Compare retailers:
            </span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.entries(RETAILER_CONFIG)
                .filter(([id]) => id !== normalizedId)
                .map(([id, config]) => (
                  <Link
                    key={id}
                    href={`/retailers/${id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      background: config.color + '15',
                      border: `1px solid ${config.color}30`,
                      borderRadius: 6,
                      color: config.color,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: config.color + '25',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700
                    }}>
                      {config.logo}
                    </span>
                    <span>{config.displayName}</span>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {/* Pros */}
            <div style={{
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: 12,
              padding: 20
            }}>
              <h3 style={{ color: '#00ff88', marginBottom: 12, fontSize: 16 }}>
                ✓ Pros
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)' }}>
                {retailer.pros.map((pro, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 14 }}>{pro}</li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div style={{
              background: 'rgba(255,107,53,0.05)',
              border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: 12,
              padding: 20
            }}>
              <h3 style={{ color: '#ff6b35', marginBottom: 12, fontSize: 16 }}>
                ✗ Cons
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)' }}>
                {retailer.cons.map((con, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 14 }}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GPU Listings */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <GPUSortClient
            inStockGPUs={inStockGPUs}
            outOfStockGPUs={outOfStockGPUs}
            retailerId={normalizedId}
            retailerColor={retailer.color}
            retailerName={retailer.displayName}
          />
        </div>
      </section>

      {/* Related Links footer */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/gpu" style={{ color: '#00ff88', textDecoration: 'none', fontSize: 14 }}>
              Browse All GPUs →
            </Link>
            <Link href="/compare" style={{ color: '#00ff88', textDecoration: 'none', fontSize: 14 }}>
              Compare Prices →
            </Link>
            <Link href="/alerts" style={{ color: '#00ff88', textDecoration: 'none', fontSize: 14 }}>
              Set Price Alerts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// GPU Card Component
function GPUCard({ 
  gpu, 
  retailerId, 
  retailerColor 
}: { 
  gpu: GPUWithRetailers & { retailerPrice: number; savings: number; savingsPercent: number }
  retailerId: string
  retailerColor: string
}) {
  const retailerData = gpu.retailers[retailerId]
  const bestPrice = getBestPrice(gpu)
  const isBestPrice = bestPrice?.retailer === retailerId

  return (
    <Link
      href={`/gpu/${gpu.slug}`}
      style={{
        display: 'block',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 16,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          color: gpu.brand === 'nvidia' ? '#76b900' : gpu.brand === 'amd' ? '#ed1c24' : '#0071c5'
        }}>
          {gpu.brand}
        </span>
        {gpu.savings > 0 && (
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#00ff88',
            background: 'rgba(0,255,136,0.1)',
            padding: '2px 8px',
            borderRadius: 4
          }}>
            Save {gpu.savingsPercent}%
          </span>
        )}
      </div>

      {/* GPU Name */}
      <h4 style={{ marginBottom: 8, fontSize: 16, fontWeight: 600 }}>
        {gpu.model}
      </h4>

      {/* Specs */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 12,
        fontSize: 12,
        color: 'var(--text-muted)'
      }}>
        <span>{gpu.vram_gb}GB VRAM</span>
        <span>{gpu.tdp_watts}W TDP</span>
      </div>

      {/* Price Section */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#00ff88' }}>
            {formatPrice(gpu.retailerPrice)}
          </div>
          {gpu.msrp_usd > gpu.retailerPrice && (
            <div style={{ 
              fontSize: 12, 
              color: 'var(--text-muted)',
              textDecoration: 'line-through'
            }}>
              MSRP {formatPrice(gpu.msrp_usd)}
            </div>
          )}
        </div>
        
        {isBestPrice && (
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#00ff88',
            background: 'rgba(0,255,136,0.15)',
            padding: '4px 8px',
            borderRadius: 4
          }}>
            Best Price
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div style={{ 
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: retailerData?.inStock !== false ? '#00ff88' : '#ff6b35'
        }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {retailerData?.inStock !== false ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </Link>
  )
}
