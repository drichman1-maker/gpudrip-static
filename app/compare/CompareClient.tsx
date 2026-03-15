'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_GPUS, GPU } from '@/lib/gpu-data'
import { 
  Check, 
  ChevronLeft, 
  ExternalLink, 
  X, 
  Share2, 
  Cpu, 
  Zap, 
  HardDrive, 
  Calendar,
  Package,
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const RETAILER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  amazon: { label: 'Amazon', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  bestbuy: { label: 'Best Buy', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  newegg: { label: 'Newegg', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  bh_photo: { label: 'B&H Photo', color: 'text-red-400', bg: 'bg-red-500/10' },
  micro_center: { label: 'Micro Center', color: 'text-purple-400', bg: 'bg-purple-500/10' },
}

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

  const shareComparison = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('compare', selected.join(','))
    navigator.clipboard.writeText(url.toString())
    alert('Comparison link copied!')
  }

  const clearComparison = () => {
    setSelected([])
    window.history.replaceState({}, '', '/compare')
  }

  const selectedData = ALL_GPUS.filter(g => selected.includes(g.id))

  const getBestPrice = (gpu: GPU) => {
    if (!gpu.retailer_prices) {
      return { price: gpu.current_price_usd, retailer: 'default', in_stock: gpu.in_stock, url: '' }
    }
    const prices = Object.entries(gpu.retailer_prices)
      .map(([r, d]) => ({ retailer: r, ...d }))
      .filter(p => p.price > 0)
    if (!prices.length) {
      return { price: gpu.current_price_usd, retailer: 'default', in_stock: gpu.in_stock, url: '' }
    }
    const inStock = prices.filter(p => p.in_stock)
    const pool = inStock.length ? inStock : prices
    return pool.reduce((a, b) => a.price < b.price ? a : b)
  }

  const getTop3Retailers = (gpu: GPU) => {
    if (!gpu.retailer_prices) return []
    return Object.entries(gpu.retailer_prices)
      .map(([retailer, data]) => ({ retailer, ...data }))
      .filter(p => p.price > 0)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/gpu" 
                className="text-gray-400 hover:text-white flex items-center gap-2 mb-3 transition-colors text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to GPUs
              </Link>
              <h1 className="text-4xl font-bold text-white">Compare GPUs</h1>
              <p className="text-gray-400 mt-2">Find the best graphics card for your needs</p>
            </div>
            
            {selected.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={shareComparison}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={clearComparison}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selection Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Select GPUs <span className="text-gray-500">({selected.length}/4)</span>
          </h2>
          {selected.length === 4 && (
            <span className="text-amber-400 text-sm font-medium">Maximum reached</span>
          )}
        </div>

        {/* GPU Grid - 3 columns for larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
          {ALL_GPUS.filter(g => g.active).map(gpu => {
            const isSelected = selected.includes(gpu.id)
            const best = getBestPrice(gpu)
            const diff = ((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100
            const isNvidia = gpu.brand === 'nvidia'
            
            return (
              <button
                key={gpu.id}
                onClick={() => toggle(gpu.id)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? isNvidia 
                      ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10' 
                      : 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                {/* Selected Checkmark */}
                {isSelected && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${isNvidia ? 'bg-green-500' : 'bg-red-500'}`}>
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}
                
                {/* Brand */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3 ${isNvidia ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isNvidia ? 'NVIDIA' : 'AMD'}
                </div>
                
                {/* Model */}
                <div className="font-bold text-white text-lg mb-4">
                  {gpu.model}
                </div>
                
                {/* Price Row */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">
                    ${best.price.toLocaleString()}
                  </span>
                </div>
                
                {/* Price Change */}
                <div className={`flex items-center gap-1 text-sm mb-4 ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-gray-500'}`}>
                  {diff > 0 ? <TrendingUp className="w-4 h-4" /> : diff < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                  <span className="font-medium">{diff > 0 ? '+' : ''}{diff.toFixed(0)}% vs MSRP</span>
                </div>
                
                {/* Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{gpu.vram_gb}GB VRAM</span>
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${gpu.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${gpu.in_stock ? 'bg-green-400' : 'bg-red-400'}`} />
                    {gpu.in_stock ? 'In Stock' : 'Out'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Comparison Section */}
        {selectedData.length > 0 && (
          <div className="space-y-8">
            
            {/* Specifications */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-blue-400" />
                  </div>
                  Specifications
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-5 text-gray-400 font-medium w-48 bg-[#0a0a0a]">Specification</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-5 min-w-[200px] bg-[#0a0a0a]">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${gpu.brand === 'nvidia' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <div className="text-white font-bold text-lg">{gpu.model}</div>
                              <div className="text-gray-500 text-sm">{gpu.generation}</div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { icon: Cpu, label: 'Architecture', get: (g: GPU) => g.architecture },
                      { icon: HardDrive, label: 'VRAM', get: (g: GPU) => `${g.vram_gb} GB` },
                      { icon: Zap, label: 'TDP', get: (g: GPU) => `${g.tdp_watts}W` },
                      { icon: Calendar, label: 'Release Date', get: (g: GPU) => new Date(g.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) },
                    ].map((row, idx) => (
                      <tr key={row.label} className={`border-b border-white/10 ${idx % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="p-5 text-gray-400 bg-[#0a0a0a]">
                          <div className="flex items-center gap-3">
                            <row.icon className="h-4 w-4 text-gray-500" />
                            {row.label}
                          </div>
                        </td>
                        {selectedData.map(gpu => (
                          <td key={gpu.id} className="p-5 text-white font-medium">
                            {row.get(gpu)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <td className="p-5 text-gray-400 bg-[#0a0a0a]">
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-gray-500" />
                          Availability
                        </div>
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${gpu.in_stock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            <span className={`w-2 h-2 rounded-full ${gpu.in_stock ? 'bg-green-400' : 'bg-red-400'}`} />
                            {gpu.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  Pricing & Availability
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-5 text-gray-400 font-medium w-48 bg-[#0a0a0a]">Retailer</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-5 min-w-[220px] bg-[#0a0a0a]">
                          <div className="text-white font-bold text-lg">{gpu.model}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Best Price */}
                    <tr className="border-b border-white/10 bg-green-500/[0.08]">
                      <td className="p-5 bg-[#0a0a0a]">
                        <span className="text-green-400 font-semibold flex items-center gap-2">
                          <TrendingDown className="w-4 h-4" />
                          Best Price
                        </span>
                      </td>
                      {selectedData.map(gpu => {
                        const best = getBestPrice(gpu)
                        const savings = gpu.msrp_usd - best.price
                        return (
                          <td key={gpu.id} className="p-5">
                            <a 
                              href={best.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-3xl font-bold text-white hover:text-green-400 transition-colors"
                            >
                              ${best.price.toLocaleString()}
                            </a>
                            {savings > 0 && (
                              <div className="text-sm text-green-400 font-medium mt-1">
                                Save ${savings.toLocaleString()}
                              </div>
                            )}
                            {best.retailer !== 'default' && (
                              <a 
                                href={best.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mt-2 transition-colors"
                              >
                                {RETAILER_CONFIG[best.retailer]?.label || best.retailer}
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </td>
                        )
                      })}
                    </tr>

                    {/* MSRP */}
                    <tr className="border-b border-white/10">
                      <td className="p-5 text-gray-400 font-medium bg-[#0a0a0a]">MSRP</td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-5 text-gray-500 text-lg">
                          ${gpu.msrp_usd.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* Retailers */}
                    {[0, 1, 2].map((index) => (
                      <tr key={index} className={`border-b border-white/10 ${index % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="p-5 text-gray-400 bg-[#0a0a0a]">
                          {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'} Option
                        </td>
                        {selectedData.map(gpu => {
                          const retailers = getTop3Retailers(gpu)
                          const retailer = retailers[index]
                          
                          if (!retailer) {
                            return (
                              <td key={gpu.id} className="p-5">
                                <span className="text-gray-600">—</span>
                              </td>
                            )
                          }
                          
                          const config = RETAILER_CONFIG[retailer.retailer]
                          
                          return (
                            <td key={gpu.id} className="p-5">
                              <a 
                                href={retailer.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl font-bold text-white hover:text-green-400 transition-colors"
                              >
                                ${retailer.price.toLocaleString()}
                              </a>
                              <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config?.bg || 'bg-gray-500/10'} ${config?.color || 'text-gray-400'}`}>
                                  {config?.label || retailer.retailer}
                                </span>
                                <span className={`text-sm font-medium ${retailer.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                  {retailer.in_stock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedData.length === 0 && (
          <div className="text-center py-20 bg-white/[0.03] rounded-2xl border border-white/10">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No GPUs selected</h3>
            <p className="text-gray-400 max-w-md mx-auto">Click on the GPU cards above to add them to your comparison. You can compare up to 4 graphics cards side by side.</p>
          </div>
        )}
      </div>
    </main>
  )
}
