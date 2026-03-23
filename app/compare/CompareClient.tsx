'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchGPUs, GPUWithRetailers } from '@/lib/api'
import {
  Check,
  ChevronLeft,
  X,
  Share2,
  Cpu,
  HardDrive,
  Zap,
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Gauge,
  Thermometer,
  Monitor
} from 'lucide-react'

const RETAILER_CONFIG: Record<string, { label: string; color: string }> = {
  amazon: { label: 'Amazon', color: '#ff9900' },
  bestbuy: { label: 'Best Buy', color: '#0046be' },
  newegg: { label: 'Newegg', color: '#f7c22f' },
  bh_photo: { label: 'B&H Photo', color: '#e11d48' },
  micro_center: { label: 'Micro Center', color: '#a855f7' },
  adorama: { label: 'Adorama', color: '#ec4899' },
  antonline: { label: 'Antonline', color: '#06b6d4' },
  cdw: { label: 'CDW', color: '#6366f1' },
}

const BRAND_COLORS = {
  nvidia: { bg: '#166534', text: '#22c55e', border: '#22c55e' },
  amd: { bg: '#7f1d1d', text: '#f87171', border: '#ef4444' },
  intel: { bg: '#1e3a8a', text: '#60a5fa', border: '#3b82f6' },
}

export default function CompareClient() {
  const [selected, setSelected] = useState<string[]>([])
  const [gpus, setGpus] = useState<GPUWithRetailers[]>([])
  const [loading, setLoading] = useState(true)
  const [showShareToast, setShowShareToast] = useState(false)

  useEffect(() => {
    fetchGPUs().then(data => {
      setGpus(data.filter(g => g.active))
      setLoading(false)
    })

    const params = new URLSearchParams(window.location.search)
    const compare = params.get('compare')
    if (compare) {
      const ids = compare.split(',')
      setSelected(ids.slice(0, 4))
    }
  }, [])

  const toggle = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(g => g !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const shareComparison = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('compare', selected.join(','))
    navigator.clipboard.writeText(url.toString())
    setShowShareToast(true)
    setTimeout(() => setShowShareToast(false), 2000)
  }

  const clearComparison = () => {
    setSelected([])
    window.history.replaceState({}, '', '/compare')
  }

  const selectedData = gpus.filter(g => selected.includes(g.id))

  const getBestPrice = (gpu: GPUWithRetailers) => {
    if (!gpu.retailers) {
      return { price: gpu.current_price_usd, retailer: 'default', inStock: gpu.in_stock }
    }
    const prices = Object.entries(gpu.retailers)
      .map(([r, d]) => ({ retailer: r, ...d }))
      .filter(p => p.price > 0)
    if (!prices.length) {
      return { price: gpu.current_price_usd, retailer: 'default', inStock: gpu.in_stock }
    }
    const inStock = prices.filter(p => p.inStock)
    const pool = inStock.length ? inStock : prices
    return pool.reduce((a, b) => a.price < b.price ? a : b)
  }

  const getValueScore = (gpu: GPUWithRetailers) => {
    const price = gpu.current_price_usd
    const vram = gpu.vram_gb
    if (price === 0) return 0
    return ((vram * 100) / price * 100).toFixed(1)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Share Toast */}
      {showShareToast && (
        <div style={{
          position: 'fixed',
          top: 16,
          right: 16,
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 8,
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Check size={16} />
          Link copied!
        </div>
      )}

      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #262626', 
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Link 
                href="/gpu" 
                style={{ color: '#737373', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, textDecoration: 'none' }}
              >
                <ChevronLeft size={16} />
                Back to GPUs
              </Link>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#fff' }}>Compare GPUs</h1>
              <p style={{ margin: '4px 0 0 0', color: '#737373', fontSize: 14 }}>
                Select up to 4 GPUs to compare side by side
              </p>
            </div>
            
            {selected.length > 0 && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={shareComparison}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  onClick={clearComparison}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8,
                    color: '#f87171',
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <X size={16} />
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Selection Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 500 }}>
              Selected: <span style={{ color: '#737373' }}>{selected.length}/4</span>
            </span>
            {selected.length > 0 && (
              <span style={{ 
                padding: '4px 12px', 
                backgroundColor: '#7c3aed20', 
                color: '#a78bfa',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500
              }}>
                {selected.length} GPU{selected.length !== 1 ? 's' : ''} selected
              </span>
            )}
            {selected.length === 4 && (
              <span style={{ color: '#fbbf24', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={14} />
                Maximum reached
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* GPU Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
            Loading GPUs...
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 16,
            marginBottom: selectedData.length > 0 ? 48 : 0
          }}>
            {gpus.map(gpu => {
              const isSelected = selected.includes(gpu.id)
              const best = getBestPrice(gpu)
              const diff = ((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100
              const brandColors = BRAND_COLORS[gpu.brand]
              const valueScore = getValueScore(gpu)
              
              return (
                <button
                  key={gpu.id}
                  onClick={() => toggle(gpu.id)}
                  style={{
                    position: 'relative',
                    padding: 20,
                    borderRadius: 12,
                    border: isSelected ? `2px solid ${brandColors.border}` : '1px solid #262626',
                    backgroundColor: isSelected ? `${brandColors.bg}40` : '#141414',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 0 20px ${brandColors.bg}30` : 'none'
                  }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: brandColors.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={14} color="#000" strokeWidth={3} />
                    </div>
                  )}

                  {/* Brand Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    borderRadius: 4,
                    backgroundColor: brandColors.bg,
                    color: brandColors.text,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 12
                  }}>
                    {gpu.brand}
                  </div>

                  {/* Model Name */}
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#fff'
                  }}>
                    {gpu.model}
                  </h3>

                  {/* Specs Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: '#737373', fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <HardDrive size={14} />
                      {gpu.vram_gb}GB
                    </span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#444' }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Thermometer size={14} />
                      {gpu.tdp_watts}W
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
                      ${best.price.toLocaleString()}
                    </span>
                  </div>

                  {/* MSRP Comparison */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4, 
                    fontSize: 13,
                    color: diff > 0 ? '#f87171' : diff < 0 ? '#22c55e' : '#737373',
                    marginBottom: 12
                  }}>
                    {diff > 0 ? <TrendingUp size={14} /> : diff < 0 ? <TrendingDown size={14} /> : null}
                    <span>{diff > 0 ? '+' : ''}{diff.toFixed(0)}% vs MSRP</span>
                  </div>

                  {/* Footer: Stock + Value */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ 
                      fontSize: 13, 
                      color: gpu.in_stock ? '#22c55e' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span style={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: gpu.in_stock ? '#22c55e' : '#ef4444' 
                      }} />
                      {gpu.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a855f7' }}>
                      <Gauge size={14} />
                      Value: {valueScore}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Comparison Section */}
        {selectedData.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={20} color="#fff" />
              </div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#fff' }}>Comparison</h2>
            </div>

            {/* Comparison Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${selectedData.length}, 1fr)`, 
              gap: 16,
              marginBottom: 32
            }}>
              {selectedData.map(gpu => {
                const brandColors = BRAND_COLORS[gpu.brand]
                const best = getBestPrice(gpu)
                const savings = gpu.msrp_usd - best.price
                const valueScore = getValueScore(gpu)

                return (
                  <div key={gpu.id} style={{
                    backgroundColor: '#141414',
                    border: `1px solid ${brandColors.border}40`,
                    borderRadius: 12,
                    padding: 20,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${brandColors.border}, transparent)`
                    }} />

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: 4,
                      backgroundColor: brandColors.bg,
                      color: brandColors.text,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 12
                    }}>
                      {gpu.brand}
                    </div>

                    <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600, color: '#fff' }}>
                      {gpu.model}
                    </h3>

                    {/* Price Section */}
                    <div style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                      borderRadius: 8, 
                      padding: 16,
                      marginBottom: 16
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: '#22c55e' }}>
                        ${best.price.toLocaleString()}
                      </div>
                      {savings > 0 && (
                        <div style={{ fontSize: 14, color: '#22c55e', marginTop: 4 }}>
                          Save ${savings.toLocaleString()}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: '#737373', marginTop: 8 }}>
                        MSRP: ${gpu.msrp_usd.toLocaleString()}
                      </div>
                    </div>

                    {/* Specs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#737373' }}>Architecture</span>
                        <span style={{ color: '#fff' }}>{gpu.architecture}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#737373' }}>VRAM</span>
                        <span style={{ color: '#fff' }}>{gpu.vram_gb} GB</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#737373' }}>TDP</span>
                        <span style={{ color: '#fff' }}>{gpu.tdp_watts}W</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#737373' }}>Release</span>
                        <span style={{ color: '#fff' }}>{new Date(gpu.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#737373' }}>Value Score</span>
                        <span style={{ color: '#a855f7', fontWeight: 600 }}>{valueScore}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#737373' }}>Availability</span>
                        <span style={{ color: gpu.in_stock ? '#22c55e' : '#ef4444' }}>
                          {gpu.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Best Price Retailer */}
                    {best.retailer !== 'default' && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #262626' }}>
                        <div style={{ fontSize: 12, color: '#737373', marginBottom: 4 }}>Best Price At</div>
                        <div style={{ 
                          fontSize: 14, 
                          color: RETAILER_CONFIG[best.retailer]?.color || '#fff',
                          fontWeight: 500
                        }}>
                          {RETAILER_CONFIG[best.retailer]?.label || best.retailer}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedData.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: '#141414',
            borderRadius: 12,
            border: '1px dashed #333'
          }}>
            <Monitor size={48} color="#333" style={{ marginBottom: 16 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#fff' }}>Select GPUs to Compare</h3>
            <p style={{ margin: 0, color: '#737373', fontSize: 14 }}>
              Click on the GPU cards above to add them to your comparison
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
