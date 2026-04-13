// Price history API client
// Fetches real price history from gpudrip-backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gpudrip-backend-icy-night-2201.fly.dev'

export type PricePoint = {
  date: string
  price: number
}

export type PriceHistoryResponse = {
  slug: string
  model: string
  msrp: number
  currentPrice: number
  timeframe: string
  dataPoints: number
  history: PricePoint[]
}

// Fetch price history from API (client-side only)
export async function fetchPriceHistory(gpuSlug: string, days: number = 90): Promise<PricePoint[]> {
  try {
    const url = `${API_BASE_URL}/api/gpus/${gpuSlug}/price-history?days=${days}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price history: ${response.status}`)
    }
    
    const data: PriceHistoryResponse = await response.json()
    return data.history || []
  } catch (error) {
    console.error('[PriceHistory] Error:', error)
    return []
  }
}

// Synchronous fallback for static generation (returns empty array)
export function getPriceHistory(gpuSlug: string): PricePoint[] {
  // During static generation, return empty array
  // Client-side will fetch real data
  if (typeof window === 'undefined') {
    return []
  }
  
  // Client-side: fetch from API (but this function is sync, so return empty)
  // Use fetchPriceHistory for async fetching
  return []
}

// Get price stats for a GPU
export function getPriceStats(history: PricePoint[], currentPrice: number) {
  if (!history || history.length === 0) return null
  
  const prices = history.map(p => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  
  // Calculate 30, 60, 90 day prices
  const getPriceAtDay = (daysAgo: number) => {
    const index = Math.max(0, history.length - 1 - daysAgo)
    return history[index]?.price || currentPrice
  }
  
  return {
    current: currentPrice,
    min: minPrice,
    max: maxPrice,
    avg: Math.round(avgPrice),
    day30: getPriceAtDay(30),
    day60: getPriceAtDay(60),
    day90: getPriceAtDay(90),
  }
}