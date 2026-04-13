// Performance-per-Dollar (PPD) utility for GPU Drip

/**
 * PPD Scaling:
 * Raw PPD = benchmark_score / current_price
 * Scaled to 0-100 where ~55 raw PPD ≈ 100 (best current value)
 * This gives meaningful spread: budget GPUs score 60-100, flagships 25-50
 */

// Fixed reference: top-end raw PPD observed in current market (~57)
// Using a fixed constant keeps scores stable across rebuilds
const REF_RAW_PPD = 55

/**
 * PPD = benchmark_score / price, scaled to ~0-100
 */
export function computePPD(benchmarkScore: number, price: number): number {
  if (!benchmarkScore || !price || price <= 0) return 0
  const raw = benchmarkScore / price
  return Math.round((raw / REF_RAW_PPD) * 100) / 100
}

/** Get PPD color: green (great) → yellow (ok) → red (poor) */
export function getPPDColor(ppd: number): string {
  if (ppd >= 90) return '#22c55e'  // green - exceptional
  if (ppd >= 70) return '#84cc16'  // lime - great value
  if (ppd >= 50) return '#eab308'  // yellow - good value
  if (ppd >= 35) return '#f97316'  // orange - fair value
  return '#ef4444'                 // red - below avg
}

/** Get PPD rating label */
export function getPPDRating(ppd: number): string {
  if (ppd >= 90) return 'Exceptional'
  if (ppd >= 70) return 'Great Value'
  if (ppd >= 50) return 'Good Value'
  if (ppd >= 35) return 'Fair'
  return 'Below Avg'
}

/** Check if GPU is in top 20% PPD (for Value Badge on homepage) */
export function isTop20PPD(ppd: number, allPPDs: number[]): boolean {
  if (allPPDs.length === 0) return false
  const sorted = [...allPPDs].filter(p => p > 0).sort((a, b) => b - a)
  if (sorted.length === 0) return false
  const threshold = sorted[Math.floor(sorted.length * 0.2)]
  return ppd >= threshold
}

/** Get PSU recommendation color */
export function getPSUColor(recommendedPSU: number): string {
  if (recommendedPSU <= 550) return '#22c55e'
  if (recommendedPSU <= 750) return '#eab308'
  if (recommendedPSU <= 850) return '#f97316'
  return '#ef4444'
}
