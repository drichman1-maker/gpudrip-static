// API client for GPU Drip backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://gpudrip-backend.fly.dev'

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
  retailers: Record<string, RetailerData>
  stockStatus: 'in_stock' | 'out_of_stock' | 'unknown'
  stockVerified: boolean
}

export async function fetchGPUs(brand?: string): Promise<GPUWithRetailers[]> {
  const url = brand 
    ? `${API_BASE}/api/gpus?brand=${brand}`
    : `${API_BASE}/api/gpus`
  
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch GPUs')
  return res.json()
}

export async function fetchGPUBySlug(slug: string): Promise<GPUWithRetailers | null> {
  const res = await fetch(`${API_BASE}/api/gpus/${slug}`, { 
    next: { revalidate: 60 }
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch GPU')
  return res.json()
}

export async function fetchRetailers(): Promise<{ id: string; name: string; url: string }[]> {
  const res = await fetch(`${API_BASE}/api/retailers`, { 
    next: { revalidate: 3600 }
  })
  if (!res.ok) throw new Error('Failed to fetch retailers')
  return res.json()
}