// GPU utility functions

/** Get PSU recommendation color based on wattage */
export function getPSUColor(recommendedPSU: number): string {
  if (recommendedPSU <= 550) return '#22c55e'
  if (recommendedPSU <= 750) return '#eab308'
  if (recommendedPSU <= 850) return '#f97316'
  return '#ef4444'
}
