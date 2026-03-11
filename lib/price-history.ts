// Price history data - 90 days of mock price data per GPU
// In production, this would come from a database or API

export type PricePoint = {
  date: string
  price: number
}

export type PriceHistory = {
  [gpuSlug: string]: PricePoint[]
}

// Generate realistic price history based on current price and MSRP
// Prices fluctuate around MSRP with some variance
function generatePriceHistory(currentPrice: number, msrp: number, days: number = 90): PricePoint[] {
  const history: PricePoint[] = []
  const now = new Date()
  
  let price = msrp * (0.9 + Math.random() * 0.3) // Start somewhere near MSRP
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Add some realistic daily variation (-2% to +2%)
    const dailyChange = (Math.random() - 0.5) * 0.04
    price = price * (1 + dailyChange)
    
    // Slowly trend toward current price
    const trendFactor = 0.01
    price = price * (1 - trendFactor) + currentPrice * trendFactor
    
    // Clamp to reasonable bounds
    price = Math.max(price, msrp * 0.7)
    price = Math.min(price, msrp * 1.5)
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price)
    })
  }
  
  // Force last price to match current price
  history[history.length - 1].price = currentPrice
  
  return history
}

// Pre-generated price history for all GPUs
export const PRICE_HISTORY: PriceHistory = {
  'rtx-5090': generatePriceHistory(2399, 1999),
  'rtx-5080': generatePriceHistory(1199, 999),
  'rtx-5070-ti': generatePriceHistory(849, 749),
  'rtx-5070': generatePriceHistory(629, 549),
  'rtx-5060-ti': generatePriceHistory(459, 429),
  'rtx-5060': generatePriceHistory(329, 299),
  'rtx-4090': generatePriceHistory(1799, 1599),
  'rtx-4080-super': generatePriceHistory(1049, 999),
  'rtx-4080': generatePriceHistory(999, 1199),
  'rtx-4070-ti-super': generatePriceHistory(849, 799),
  'rtx-4070-ti': generatePriceHistory(699, 799),
  'rtx-4070-super': generatePriceHistory(629, 599),
  'rtx-4070': generatePriceHistory(549, 599),
  'rtx-4060-ti': generatePriceHistory(379, 399),
  'rtx-4060': generatePriceHistory(289, 299),
  'rx-9070-xt': generatePriceHistory(649, 599),
  'rx-9070': generatePriceHistory(579, 549),
  'rx-9060-xt': generatePriceHistory(329, 299),
  'rx-7900-xtx': generatePriceHistory(899, 999),
  'rx-7900-xt': generatePriceHistory(749, 899),
  'rx-7800-xt': generatePriceHistory(479, 499),
  'rx-7700-xt': generatePriceHistory(419, 449),
  'rx-7600': generatePriceHistory(259, 269),
}

export function getPriceHistory(gpuSlug: string): PricePoint[] {
  return PRICE_HISTORY[gpuSlug] || []
}

// Get price stats for a GPU
export function getPriceStats(gpuSlug: string, currentPrice: number) {
  const history = getPriceHistory(gpuSlug)
  if (history.length === 0) return null
  
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