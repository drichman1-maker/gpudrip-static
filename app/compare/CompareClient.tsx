'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_GPUS, GPU, RETAILER_LABELS } from '@/lib/gpu-data'

export default function CompareClient() {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const compare = params.get('compare')
    if (compare) {
      const valid = compare.split(',').filter(id => ALL_GPUS.some(g => g.id === id))
      setSelected(valid.slice(0, 4))
    }
  }, [])

  const toggle = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(g => g !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const selectedData = ALL_GPUS.filter(g => selected.includes(g.id))

  const getBest = (gpu: GPU) => {
    if (!gpu.retailer_prices) return null
    const prices = Object.entries(gpu.retailer_prices)
      .map(([r, d]) => ({ retailer: r, ...d }))
      .filter(p => p.price > 0)
    if (!prices.length) return null
    const inStock = prices.filter(p => p.in_stock)
    const pool = inStock.length ? inStock : prices
    return pool.reduce((a, b) => a.price < b.price ? a : b)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '80px 16px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/gpu" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to GPUs
          </Link>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginTop: '16px' }}>
            Compare GPUs
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>
            Select up to 4 GPUs to compare specs and prices ({selected.length}/4)
          </p>
        </div>

        {/* GPU Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {ALL_GPUS.filter(g => g.active).map(gpu => {
            const isSel = selected.includes(gpu.id)
            const best = getBest(gpu)
            const diff = best ? Math.round(((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100) : 0
            
            return (
              <button
                key={gpu.id}
                onClick={() => toggle(gpu.id)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${isSel ? (gpu.brand === 'nvidia' ? '#22c55e' : '#ef4444') : '#2a2a2a'}`,
                  background: isSel ? (gpu.brand === 'nvidia' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)') : '#141414',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 500, color: isSel ? (gpu.brand === 'nvidia' ? '#4ade80' : '#f87171') : '#9ca3af' }}>
                  {gpu.model}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
                  ${best ? best.price.toLocaleString() : gpu.current_price_usd.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: diff < 0 ? '#4ade80' : '#f87171' }}>
                  {diff < 0 ? '↓' : '↑'} {Math.abs(diff)}%
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  {gpu.vram_gb}GB • {gpu.tdp_watts}W
                </div>
                {isSel && (
                  <div style={{ fontSize: '12px', color: '#4ade80', marginTop: '8px' }}>✓ Selected</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Comparison Tables */}
        {selectedData.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Specs */}
            <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>Specifications</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#9ca3af', fontWeight: 500, minWidth: '120px' }}>Spec</th>
                    {selectedData.map(gpu => (
                      <th key={gpu.id} style={{ padding: '16px', textAlign: 'left', color: 'white', minWidth: '180px' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: gpu.brand === 'nvidia' ? '#22c55e' : '#ef4444',
                          marginRight: '8px'
                        }} />
                        {gpu.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Architecture', key: 'architecture' },
                    { label: 'Generation', key: 'generation' },
                    { label: 'VRAM', key: 'vram', format: (g: GPU) => `${g.vram_gb} GB` },
                    { label: 'TDP', key: 'tdp', format: (g: GPU) => `${g.tdp_watts}W` },
                    { label: 'Release Date', key: 'date', format: (g: GPU) => new Date(g.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) },
                    { label: 'Availability', key: 'stock', format: (g: GPU) => g.in_stock ? '● In Stock' : '○ Out of Stock' },
                  ].map((row, idx) => (
                    <tr key={row.key} style={{ borderBottom: '1px solid #2a2a2a', background: idx % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td style={{ padding: '16px', color: '#9ca3af' }}>{row.label}</td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} style={{ padding: '16px', color: row.key === 'stock' ? (gpu.in_stock ? '#4ade80' : '#f87171') : 'white' }}>
                          {row.format ? row.format(gpu) : (gpu as any)[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing */}
            <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #2a2a2a', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>Pricing</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#9ca3af', fontWeight: 500, minWidth: '120px' }}>Retailer</th>
                    {selectedData.map(gpu => (
                      <th key={gpu.id} style={{ padding: '16px', textAlign: 'left', color: 'white', minWidth: '180px' }}>
                        {gpu.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Best Price */}
                  <tr style={{ borderBottom: '1px solid #2a2a2a', background: 'rgba(34,197,94,0.05)' }}>
                    <td style={{ padding: '16px', color: '#4ade80', fontWeight: 600 }}>Best Price</td>
                    {selectedData.map(gpu => {
                      const best = getBest(gpu)
                      const diff = best ? Math.round(((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100) : 0
                      return (
                        <td key={gpu.id} style={{ padding: '16px' }}>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                            ${best ? best.price.toLocaleString() : gpu.current_price_usd.toLocaleString()}
                          </div>
                          {diff !== 0 && (
                            <div style={{ fontSize: '12px', color: diff < 0 ? '#4ade80' : '#f87171' }}>
                              {diff < 0 ? '↓' : '↑'} {Math.abs(diff)}% vs MSRP
                            </div>
                          )}
                          {best && (
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                              at {RETAILER_LABELS[best.retailer] || best.retailer}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  {/* MSRP */}
                  <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '16px', color: '#9ca3af' }}>MSRP</td>
                    {selectedData.map(gpu => (
                      <td key={gpu.id} style={{ padding: '16px', color: '#9ca3af' }}>
                        ${gpu.msrp_usd.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  {/* Per-retailer */}
                  {['amazon', 'bestbuy', 'newegg'].map((retailer, idx) => (
                    <tr key={retailer} style={{ borderBottom: '1px solid #2a2a2a', background: idx % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td style={{ padding: '16px', color: '#9ca3af' }}>{RETAILER_LABELS[retailer]}</td>
                      {selectedData.map(gpu => {
                        const data = gpu.retailer_prices?.[retailer as keyof typeof gpu.retailer_prices]
                        if (!data) return <td key={gpu.id} style={{ padding: '16px', color: '#6b7280' }}>—</td>
                        return (
                          <td key={gpu.id} style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 600, color: 'white' }}>${data.price.toLocaleString()}</div>
                            <div style={{ fontSize: '12px', color: data.in_stock ? '#4ade80' : '#f87171' }}>
                              {data.in_stock ? '● In Stock' : '○ Out of Stock'}
                            </div>
                            <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#60a5fa' }}>
                              View →
                            </a>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px', background: '#141414', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
            <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>No GPUs selected</h3>
            <p style={{ color: '#9ca3af' }}>Select GPUs above to compare</p>
          </div>
        )}
      </div>
    </div>
  )
}
