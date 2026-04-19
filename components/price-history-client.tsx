'use client'

import { useState, useEffect } from 'react'
import PriceChart from './price-chart'
import { fetchPriceHistory, getPriceStats } from '@/lib/price-history'
import type { PricePoint } from '@/lib/price-history'

type PriceHistoryClientProps = {
  gpuSlug: string
  gpuModel: string
  currentPrice: number
  msrp: number
}

export default function PriceHistoryClient({ 
  gpuSlug, 
  gpuModel, 
  currentPrice, 
  msrp 
}: PriceHistoryClientProps) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPriceHistory() {
      try {
        setLoading(true)
        const url = `https://agg-api-hub.fly.dev/api/gpudrip/products/${gpuSlug}/price-history?days=90`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        // Normalize: history entries have {date, retailer, price} — pick lowest price per day
        const byDay: Record<string, number> = {}
        for (const entry of (data.history || [])) {
          const day = entry.date.slice(0, 10)
          if (!byDay[day] || entry.price < byDay[day]) {
            byDay[day] = entry.price
          }
        }
        const normalized = Object.entries(byDay)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, price]) => ({ date, price }))
        setPriceHistory(normalized)
        setError(null)
      } catch (err: any) {
        console.error('[DEBUG] Failed to load price history:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPriceHistory()
  }, [gpuSlug])

  const priceStats = priceHistory.length > 0 ? getPriceStats(priceHistory, currentPrice) : null

  if (loading) {
    return (
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ marginBottom: 20 }}>Price History</h2>
        <div style={{ 
          background: '#1a1a1a', 
          borderRadius: 12, 
          padding: 48,
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid #333',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading price history...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </section>
    )
  }

  if (error || priceHistory.length === 0) {
    return (
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ marginBottom: 20 }}>Price History</h2>
        <div style={{ 
          background: '#1a1a1a', 
          borderRadius: 12, 
          padding: 32,
          textAlign: 'center'
        }}>
          <p style={{ color: '#888', marginBottom: 8 }}>
            📊 Price tracking starts soon
          </p>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
            History will appear after 24h of monitoring
          </p>
          <p style={{ color: '#555', fontSize: 12 }}>
            History will appear after the first scraper run.
          </p>
        </div>
      </section>
    )
  }

  return (
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
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: currentPrice < msrp ? '#22c55e' : '#ef4444' }}>
              {currentPrice < msrp ? '↓' : '↑'}${Math.abs(currentPrice - msrp)}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>MSRP: ${msrp}</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 24 }}>
        <PriceChart
          data={priceHistory}
          currentPrice={currentPrice}
          msrp={msrp}
          gpuModel={gpuModel}
        />
      </div>
    </section>
  )
}
