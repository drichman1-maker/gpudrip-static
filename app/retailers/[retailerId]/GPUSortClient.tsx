'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { GPUWithRetailers } from '@/lib/api'

type GPUSortProps = {
  inStockGPUs: (GPUWithRetailers & { retailerPrice: number; savings: number; savingsPercent: number })[]
  outOfStockGPUs: (GPUWithRetailers & { retailerPrice: number; savings: number; savingsPercent: number })[]
  retailerId: string
  retailerColor: string
  retailerName: string
}

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'vram', label: 'VRAM: High → Low' },
]

const BRAND_PILLS = [
  { key: 'all', label: 'All' },
  { key: 'nvidia', label: 'NVIDIA' },
  { key: 'amd', label: 'AMD' },
  { key: 'intel', label: 'Intel' },
]

function getBestPrice(gpu: GPUWithRetailers) {
  const retailers = gpu.retailers || {}
  let best = { retailer: '', price: Infinity }
  for (const [key, data] of Object.entries(retailers)) {
    if (data.price && data.price > 0 && data.price < best.price) {
      best = { retailer: key, price: data.price }
    }
  }
  return best.price === Infinity ? null : best
}

function sortGPUs(
  gpus: GPUSortProps['inStockGPUs'],
  sortBy: string
): GPUSortProps['inStockGPUs'] {
  const sorted = [...gpus]
  switch (sortBy) {
    case 'price-desc':
      sorted.sort((a, b) => (b.retailerPrice || 0) - (a.retailerPrice || 0))
      break
    case 'discount':
      sorted.sort((a, b) => (b.savingsPercent || 0) - (a.savingsPercent || 0))
      break
    case 'name':
      sorted.sort((a, b) => (a.model || '').localeCompare(b.model || ''))
      break
    case 'vram':
      sorted.sort((a, b) => (b.vram_gb || 0) - (a.vram_gb || 0))
      break
    case 'price-asc':
    default:
      sorted.sort((a, b) => (a.retailerPrice || 0) - (b.retailerPrice || 0))
      break
  }
  return sorted
}

function filterByBrand(
  gpus: GPUSortProps['inStockGPUs'],
  brand: string
): GPUSortProps['inStockGPUs'] {
  if (brand === 'all') return gpus
  return gpus.filter(g => (g.brand || '').toLowerCase() === brand)
}

function GPUCard({ gpu, retailerId, retailerColor }: {
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
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          color: gpu.brand === 'nvidia' ? '#76b900' : gpu.brand === 'amd' ? '#ed1c24' : '#0071c5',
          background: gpu.brand === 'nvidia' ? 'rgba(118,185,0,0.1)' : gpu.brand === 'amd' ? 'rgba(237,28,36,0.1)' : 'rgba(0,113,197,0.1)',
          padding: '2px 8px',
          borderRadius: 4,
        }}>
          {gpu.brand}
        </span>
        {gpu.savingsPercent > 0 && (
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#00ff88',
            background: 'rgba(0,255,136,0.1)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            -{gpu.savingsPercent}%
          </span>
        )}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
        {gpu.model}
      </h3>

      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
        {gpu.vram_gb}GB • {gpu.tdp_watts}W
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: retailerColor }}>
            ${gpu.retailerPrice?.toLocaleString()}
          </div>
          {gpu.msrp_usd > gpu.retailerPrice && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ${gpu.msrp_usd?.toLocaleString()}
            </div>
          )}
        </div>
        {isBestPrice && (
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#00ff88',
            background: 'rgba(0,255,136,0.15)',
            padding: '3px 8px',
            borderRadius: 4,
          }}>
            Best Price
          </span>
        )}
      </div>
    </Link>
  )
}

export default function GPUSortClient({ inStockGPUs, outOfStockGPUs, retailerId, retailerColor, retailerName }: GPUSortProps) {
  const [sortBy, setSortBy] = useState('price-asc')
  const [brandFilter, setBrandFilter] = useState('all')
  const [isOpen, setIsOpen] = useState(false)

  // Compute brand counts
  const allGPUs = [...inStockGPUs, ...outOfStockGPUs]
  const brandCounts: Record<string, number> = { all: allGPUs.length }
  allGPUs.forEach(g => {
    const b = (g.brand || '').toLowerCase()
    brandCounts[b] = (brandCounts[b] || 0) + 1
  })

  // Filter then sort
  const filteredInStock = filterByBrand(inStockGPUs, brandFilter)
  const filteredOutOfStock = filterByBrand(outOfStockGPUs, brandFilter)
  const sortedInStock = sortGPUs(filteredInStock, sortBy)
  const sortedOutOfStock = sortGPUs(filteredOutOfStock, sortBy)

  const selectedLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Price: Low → High'

  return (
    <div>
      {/* Brand Pill Toggles */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}>
        {BRAND_PILLS.filter(p => p.key === 'all' || (brandCounts[p.key] || 0) > 0).map(pill => {
          const isActive = brandFilter === pill.key
          const pillColor = pill.key === 'nvidia' ? '#76b900' : pill.key === 'amd' ? '#ed1c24' : pill.key === 'intel' ? '#0071c5' : '#00ff88'
          return (
            <button
              key={pill.key}
              onClick={() => setBrandFilter(pill.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: isActive ? `1px solid ${pillColor}` : '1px solid var(--border)',
                background: isActive ? `${pillColor}20` : 'var(--card)',
                color: isActive ? pillColor : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {pill.label}
              <span style={{
                fontSize: 11,
                opacity: 0.7,
              }}>
                ({brandCounts[pill.key] || 0})
              </span>
            </button>
          )
        })}
      </div>

      {/* Sort Dropdown */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem' }}>
          Available GPUs at {retailerName}
        </h2>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              fontSize: 14,
              cursor: 'pointer',
              minWidth: 180,
              justifyContent: 'space-between',
            }}
          >
            <span>Sort: {selectedLabel}</span>
            <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {isOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              minWidth: 200,
              zIndex: 50,
              overflow: 'hidden',
            }}>
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => { setSortBy(option.value); setIsOpen(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 16px',
                    background: sortBy === option.value ? 'rgba(0,255,136,0.1)' : 'transparent',
                    border: 'none',
                    color: sortBy === option.value ? '#00ff88' : 'var(--text-secondary)',
                    fontSize: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {option.label}
                  {sortBy === option.value && ' ✓'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredInStock.length === 0 && filteredOutOfStock.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p>No GPUs currently listed from this retailer.</p>
          <Link href="/gpu" style={{ display: 'inline-block', marginTop: 16, color: '#00ff88', textDecoration: 'underline' }}>
            Browse all GPUs →
          </Link>
        </div>
      ) : (
        <div>
          {sortedInStock.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ marginBottom: 16, fontSize: 14, color: '#00ff88', textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                In Stock ({sortedInStock.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {sortedInStock.map(gpu => (
                  <GPUCard key={gpu.id} gpu={gpu} retailerId={retailerId} retailerColor={retailerColor} />
                ))}
              </div>
            </div>
          )}

          {sortedOutOfStock.length > 0 && (
            <div>
              <h3 style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                Out of Stock ({sortedOutOfStock.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, opacity: 0.6 }}>
                {sortedOutOfStock.map(gpu => (
                  <GPUCard key={gpu.id} gpu={gpu} retailerId={retailerId} retailerColor={retailerColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
