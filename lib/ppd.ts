// Performance-per-Dollar (PPD) utility for GPU Drip

// MSRP values from seed data for stable market baseline
const GPU_MSRPS: Record<string, number> = {
  'rtx-5090': 1999, 'rtx-5080': 999, 'rtx-5070-ti': 749, 'rtx-5070': 549,
  'rtx-5060-ti': 429, 'rtx-5060': 299,
  'rtx-4090': 1599, 'rtx-4080-super': 999, 'rtx-4080': 1199, 'rtx-4070-ti-super': 799,
  'rtx-4070-ti': 799, 'rtx-4070-super': 599, 'rtx-4070': 599, 'rtx-4060-ti': 399, 'rtx-4060': 299,
  'rx-9070-xt': 599, 'rx-9070': 549, 'rx-9060-xt': 299,
  'rx-7900-xtx': 999, 'rx-7900-xt': 899, 'rx-7800-xt': 499, 'rx-7700-xt': 449, 'rx-7600': 269,
  'rtx-3090': 1499, 'rtx-3080-ti': 1199, 'rtx-3080': 699, 'rtx-3070-ti': 599,
  'rtx-3070': 499, 'rtx-3060-ti': 399, 'rtx-3060': 329,
  'rx-6900-xt': 999, 'rx-6800-xt': 649, 'rx-6800': 579, 'rx-6700-xt': 479,
  'rx-6600-xt': 379, 'rx-6600': 329,
  'arc-a770': 329, 'arc-a750': 249,
}

let _msrpMedian: number | null = null

function getMSRPMedian(): number {
  if (_msrpMedian !== null) return _msrpMedian
  const values = Object.values(GPU_MSRPS).sort((a, b) => a - b)
  const mid = Math.floor(values.length / 2)
  _msrpMedian = values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2
  return _msrpMedian
}

/** PPD = benchmark_score / price, normalized against MSRP median */
export function computePPD(benchmarkScore: number, price: number): number {
  if (!benchmarkScore || !price || price <= 0) return 0
  const raw = benchmarkScore / price
  const median = getMSRPMedian()
  return median > 0 ? raw / median : raw
}

/** Get PPD color: green (great) → yellow (ok) → red (poor) */
export function getPPDColor(ppd: number): string {
  if (ppd >= 30) return '#22c55e'  // green - excellent value
  if (ppd >= 20) return '#84cc16'  // lime - great value
  if (ppd >= 15) return '#eab308'  // yellow - good value
  if (ppd >= 10) return '#f97316'  // orange - fair value
  return '#ef4444'                 // red - poor value
}

/** Get PPD rating label */
export function getPPDRating(ppd: number): string {
  if (ppd >= 30) return 'Best Value'
  if (ppd >= 20) return 'Great Value'
  if (ppd >= 15) return 'Good Value'
  if (ppd >= 10) return 'Fair'
  return 'Below Avg'
}

/** Check if GPU is in top 20% PPD (for Value Badge on homepage) */
export function isTop20PPD(ppd: number, allPPDs: number[]): boolean {
  if (allPPDs.length === 0) return false
  const sorted = [...allPPDs].sort((a, b) => b - a)
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
