// API client — fetches from agg-api-hub (live scraped + manual prices)
const AGG_BASE = 'https://agg-api-hub.fly.dev'

// ── Types ────────────────────────────────────────────────────────────────────

export type RetailerData = {
  name: string
  url: string
  affiliateUrl?: string | null
  price: number
  inStock: boolean | null
  verified: boolean
}

export type GPUWithRetailers = {
  id: string
  slug: string
  model: string
  brand: 'nvidia' | 'amd' | 'intel'
  architecture: string
  generation: string
  vram_gb: number
  tdp_watts: number
  msrp_usd: number
  current_price_usd: number
  in_stock: boolean
  price_change_percent: number
  release_date: string
  active: boolean
  benchmark_score?: number | null
  recommended_psu?: number | null
  retailers: Record<string, RetailerData>
  stockStatus: 'in_stock' | 'out_of_stock' | 'unknown'
  stockVerified: boolean
}

export type RefurbGPU = {
  id: string
  slug: string
  name: string
  model: string
  brand: string
  msrp: number
  msrp_usd: number
  specs: { vram?: string; tdp?: string; architecture?: string }
  inStock: boolean
  lowestPrice: number | null
  lowestRetailer: string | null
  lowestUrl: string | null
  lowestAffiliateUrl: string | null
  savingsPct: number | null
  prices: Record<string, { price: number; status: string; url: string; affiliateUrl: string | null }>
  retailers: { name: string; url: string; price: number; inStock: boolean; verified: boolean }[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RETAILER_NAMES: Record<string, string> = {
  amazon: 'Amazon',
  bestbuy: 'Best Buy',
  newegg: 'Newegg',
  bh: 'B&H Photo',
  microcenter: 'Micro Center',
  adorama: 'Adorama',
  antonline: 'Antonline',
  cdw: 'CDW',
  ebay: 'eBay',
  abt: 'ABT',
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseNumber(s: string | null | undefined): number {
  if (!s) return 0
  return parseInt(String(s).replace(/[^0-9]/g, '')) || 0
}

function stripBrandPrefix(name: string): string {
  return name
    .replace(/^NVIDIA\s+/i, '')
    .replace(/^AMD\s+/i, '')
    .replace(/^Intel\s+/i, '')
    .trim()
}

function deriveBrand(name: string, specs: any): 'nvidia' | 'amd' | 'intel' {
  const n = name.toLowerCase()
  if (n.includes('rtx') || n.includes('gtx') || n.includes('nvidia')) return 'nvidia'
  if (n.includes('rx ') || n.includes('radeon') || n.includes('amd')) return 'amd'
  if (n.includes('arc') || n.includes('intel')) return 'intel'
  const arch = String(specs?.architecture || '').toLowerCase()
  if (arch.includes('ada') || arch.includes('ampere') || arch.includes('turing')) return 'nvidia'
  if (arch.includes('rdna') || arch.includes('navi')) return 'amd'
  return 'nvidia'
}

function deriveArchitecture(model: string, specs: any): string {
  if (specs?.architecture) return String(specs.architecture)
  const m = model.toLowerCase()
  if (m.match(/rtx\s*[56]\d{3}/)) return 'Blackwell'
  if (m.match(/rtx\s*4\d{3}/)) return 'Ada Lovelace'
  if (m.match(/rtx\s*3\d{3}/)) return 'Ampere'
  if (m.match(/rtx\s*2\d{3}|gtx\s*16/)) return 'Turing'
  if (m.match(/rx\s*[789]\d{3}/)) return 'RDNA 3/4'
  if (m.match(/rx\s*[56]\d{3}/)) return 'RDNA 2/3'
  if (m.includes('arc')) return 'Xe HPG'
  return 'Unknown'
}

function deriveGeneration(model: string): string {
  const m = model.toLowerCase()
  if (m.match(/rtx\s*50/)) return 'RTX 5000'
  if (m.match(/rtx\s*40/)) return 'RTX 4000'
  if (m.match(/rtx\s*30/)) return 'RTX 3000'
  if (m.match(/rx\s*9\d{3}/)) return 'RX 9000'
  if (m.match(/rx\s*7\d{3}/)) return 'RX 7000'
  if (m.match(/rx\s*6\d{3}/)) return 'RX 6000'
  if (m.includes('arc')) return 'Arc'
  return 'Other'
}

function derivePSU(tdp: number): number {
  if (tdp >= 500) return 1000
  if (tdp >= 400) return 850
  if (tdp >= 300) return 750
  if (tdp >= 200) return 650
  return 550
}

// ── Mapper ───────────────────────────────────────────────────────────────────

function mapProduct(p: any): GPUWithRetailers {
  const model = stripBrandPrefix(p.name || '')
  const brand = deriveBrand(p.name || '', p.specs)
  const specs = p.specs || {}
  const vram_gb = parseNumber(specs.vram)
  const tdp_watts = parseNumber(specs.tdp)
  const benchmark_score = specs.benchmark ? parseNumber(String(specs.benchmark)) : null

  const retailers: Record<string, RetailerData> = {}
  let lowestPrice = Infinity
  let anyInStock = false
  let stockVerified = false

  for (const [key, data] of Object.entries<any>(p.prices || {})) {
    if (!data?.price) continue
    const inStock = data.status === 'in_stock'
    retailers[key] = {
      name: RETAILER_NAMES[key] ?? key,
      url: data.affiliateUrl || data.url || '',
      affiliateUrl: data.affiliateUrl || null,
      price: data.price,
      inStock,
      verified: data.verified ?? false,
    }
    if (data.price < lowestPrice) lowestPrice = data.price
    if (inStock) anyInStock = true
    if (data.verified) stockVerified = true
  }

  const current_price_usd = lowestPrice === Infinity ? 0 : lowestPrice

  return {
    id: p.id,
    slug: p.slug,
    model,
    brand,
    architecture: deriveArchitecture(model, specs),
    generation: deriveGeneration(model),
    vram_gb,
    tdp_watts,
    msrp_usd: p.msrp || 0,
    current_price_usd,
    in_stock: anyInStock,
    price_change_percent: 0,
    release_date: '',
    active: true,
    benchmark_score,
    recommended_psu: derivePSU(tdp_watts),
    retailers,
    stockStatus: anyInStock ? 'in_stock' : current_price_usd > 0 ? 'out_of_stock' : 'unknown',
    stockVerified,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchGPUs(): Promise<GPUWithRetailers[]> {
  const res = await fetch(`${AGG_BASE}/api/gpudrip/products`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Failed to fetch GPUs: ${res.status}`)
  const products: any[] = await res.json()
  return products
    .filter((p) => !p.isRefurb && !p.slug?.startsWith('refurb-'))
    .map(mapProduct)
}

export async function fetchGPUBySlug(slug: string): Promise<GPUWithRetailers | null> {
  const res = await fetch(`${AGG_BASE}/api/gpudrip/products/${slug}`, {
    next: { revalidate: 300 },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to fetch GPU: ${res.status}`)
  return mapProduct(await res.json())
}

export async function fetchRefurbGPUs(): Promise<RefurbGPU[]> {
  const res = await fetch(`${AGG_BASE}/api/gpudrip/products`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) return []
  const products: any[] = await res.json()
  return products
    .filter((p) => p.isRefurb || p.slug?.startsWith('refurb-'))
    .map((p) => {
      const model = stripBrandPrefix(p.name || '')
      const retailerList = Object.entries<any>(p.prices || {})
        .filter(([, d]) => d?.price)
        .map(([key, d]) => ({
          name: RETAILER_NAMES[key] ?? key,
          url: d.affiliateUrl || d.url || '',
          price: d.price,
          inStock: d.status === 'in_stock',
          verified: d.verified ?? false,
        }))

      // Compute lowest in-stock price
      const inStockRetailers = Object.entries<any>(p.prices || {}).filter(
        ([, d]) => d?.price && d.status === 'in_stock'
      )
      const lowestEntry = inStockRetailers.sort(([, a], [, b]) => a.price - b.price)[0]
      const lowestPrice = lowestEntry ? lowestEntry[1].price : null
      const lowestRetailer = lowestEntry ? lowestEntry[0] : null
      const lowestUrl = lowestEntry ? lowestEntry[1].url || null : null
      const lowestAffiliateUrl = lowestEntry ? lowestEntry[1].affiliateUrl || null : null
      const msrp = p.msrp || 0
      const savingsPct = lowestPrice && msrp > 0 ? Math.round((1 - lowestPrice / msrp) * 100) : null

      // Prices map for the "all prices" section
      const prices: Record<string, any> = {}
      for (const [key, d] of Object.entries<any>(p.prices || {})) {
        if (d?.price) prices[key] = { price: d.price, status: d.status, url: d.url, affiliateUrl: d.affiliateUrl }
      }

      return {
        id: p.id,
        slug: p.slug,
        name: p.name || '',
        model,
        brand: deriveBrand(p.name || '', p.specs),
        msrp,
        msrp_usd: msrp,
        specs: { vram: p.specs?.vram, tdp: p.specs?.tdp, architecture: p.specs?.architecture },
        inStock: inStockRetailers.length > 0,
        lowestPrice,
        lowestRetailer,
        lowestUrl,
        lowestAffiliateUrl,
        savingsPct,
        prices,
        retailers: retailerList,
      }
    })
}

export async function fetchRetailers(): Promise<{ id: string; name: string; url: string }[]> {
  return Object.entries(RETAILER_NAMES).map(([id, name]) => ({ id, name, url: '' }))
}
