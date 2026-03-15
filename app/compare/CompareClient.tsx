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
  AlertCircle
} from 'lucide-react'

// Retailer config matching Mactrackr style
const RETAILER_CONFIG: Record<string, { label: string; color: string }> = {
  amazon: { label: 'Amazon', color: 'text-orange-400' },
  bestbuy: { label: 'Best Buy', color: 'text-blue-400' },
  newegg: { label: 'Newegg', color: 'text-yellow-400' },
  bh_photo: { label: 'B&H Photo', color: 'text-red-400' },
  micro_center: { label: 'Micro Center', color: 'text-purple-400' },
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

  const getAllRetailersSorted = (gpu: GPU) => {
    if (!gpu.retailer_prices) return []
    return Object.entries(gpu.retailer_prices)
      .map(([retailer, data]) => ({ retailer, ...data }))
      .filter(p => p.price > 0)
      .sort((a, b) => a.price - b.price)
  }

  const getTop3Retailers = (gpu: GPU) => {
    return getAllRetailersSorted(gpu).slice(0, 3)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/gpu" 
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to GPUs
            </Link>
            <h1 className="text-3xl font-bold text-white">Compare GPUs</h1>
            <p className="text-gray-400 mt-1">Compare specs and find the best prices across retailers</p>
          </div>
          
          {selected.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={shareComparison}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={clearComparison}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Product Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Select GPUs ({selected.length}/4)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_GPUS.filter(g => g.active).map(gpu => {
              const isSelected = selected.includes(gpu.id)
              const best = getBestPrice(gpu)
              const isNvidia = gpu.brand === 'nvidia'
              
              return (
                <button
                  key={gpu.id}
                  onClick={() => toggle(gpu.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    isSelected
                      ? isNvidia 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-red-500 bg-red-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${isNvidia ? 'text-green-400' : 'text-red-400'}`}>
                    {isNvidia ? 'NVIDIA' : 'AMD'}
                  </div>
                  <div className="text-sm font-medium text-white truncate mb-1">{gpu.model}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    From ${best.price.toLocaleString()}
                  </div>
                  {isSelected && (
                    <div className={`mt-2 text-xs flex items-center gap-1 ${isNvidia ? 'text-green-400' : 'text-red-400'}`}>
                      <Check className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comparison Tables */}
        {selectedData.length > 0 && (
          <div className="space-y-6">
            
            {/* Specifications */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  Specifications
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 font-medium sticky left-0 bg-[#0a0a0a] min-w-[140px]">Spec</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-4 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${gpu.brand === 'nvidia' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <div className="text-white font-bold text-lg">{gpu.model}</div>
                              <div className="text-sm text-gray-400">{gpu.generation}</div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-gray-400 sticky left-0 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-gray-500" />
                          Architecture
                        </div>
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-white font-medium">{gpu.architecture}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <td className="p-4 text-gray-400 sticky left-0 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-gray-500" />
                          VRAM
                        </div>
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-white font-medium">{gpu.vram_gb} GB</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-gray-400 sticky left-0 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-gray-500" />
                          TDP
                        </div>
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-white font-medium">{gpu.tdp_watts}W</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <td className="p-4 text-gray-400 sticky left-0 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          Release Date
                        </div>
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-white font-medium">
                          {new Date(gpu.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-gray-400 sticky left-0 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          Availability
                        </div>
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className={`p-4 font-medium ${gpu.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                          {gpu.in_stock ? 'In Stock' : 'Out of Stock'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Pricing & Availability
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Top retailers by price
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 font-medium sticky left-0 bg-[#0a0a0a] min-w-[140px]">Retailer</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-4 min-w-[220px]">
                          <div className="text-white font-semibold">{gpu.model}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Best Price */}
                    <tr className="border-b border-white/10 bg-green-500/5">
                      <td className="p-4 text-green-400 font-semibold sticky left-0 bg-[#0a0a0a]">
                        Best Price
                      </td>
                      {selectedData.map(gpu => {
                        const best = getBestPrice(gpu)
                        const savings = gpu.msrp_usd - best.price
                        return (
                          <td key={gpu.id} className="p-4">
                            <a 
                              href={best.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-2xl font-bold text-white hover:text-green-400 transition-colors"
                            >
                              ${best.price.toLocaleString()}
                            </a>
                            {savings > 0 && (
                              <div className="text-sm text-green-400">
                                Save ${savings.toLocaleString()}
                              </div>
                            )}
                            {best.retailer !== 'default' && (
                              <a 
                                href={best.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mt-1"
                              >
                                {RETAILER_CONFIG[best.retailer]?.label || best.retailer}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </td>
                        )
                      })}
                    </tr>

                    {/* MSRP */}
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-gray-400 font-medium sticky left-0 bg-[#0a0a0a]">
                        MSRP
                      </td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-gray-400">
                          ${gpu.msrp_usd.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* Top 3 Retailers */}
                    {[0, 1, 2].map((index) => (
                      <tr key={index} className={`border-b border-white/10 ${index % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="p-4 text-gray-400 sticky left-0 bg-[#0a0a0a]">
                          {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'} Option
                        </td>
                        {selectedData.map(gpu => {
                          const retailers = getTop3Retailers(gpu)
                          const retailer = retailers[index]
                          
                          if (!retailer) {
                            return (
                              <td key={gpu.id} className="p-4 text-gray-600">
                                <span>—</span>
                              </td>
                            )
                          }
                          
                          const config = RETAILER_CONFIG[retailer.retailer]
                          
                          return (
                            <td key={gpu.id} className="p-4">
                              <a 
                                href={retailer.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white font-semibold hover:text-green-400 transition-colors"
                              >
                                ${retailer.price.toLocaleString()}
                              </a>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={config?.color || 'text-gray-400'}>
                                  {config?.label || retailer.retailer}
                                </span>
                                <span className={`text-sm ${retailer.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                  {retailer.in_stock ? '● In Stock' : '○ Out of Stock'}
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
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No GPUs selected</h3>
            <p className="text-gray-400">Select GPUs above to compare up to 4 side by side</p>
          </div>
        )}
      </div>
    </main>
  )
}
