'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_GPUS, GPU } from '@/lib/gpu-data'
import { Check, ChevronLeft, ExternalLink } from 'lucide-react'

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

  const formatRetailerName = (key: string) => {
    const names: Record<string, string> = {
      amazon: 'Amazon',
      bestbuy: 'Best Buy',
      newegg: 'Newegg',
      bh_photo: 'B&H Photo',
      micro_center: 'Micro Center'
    }
    return names[key] || key
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/gpu" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to GPUs
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Compare GPUs</h1>
          <p className="text-gray-400 mt-2">Select up to 4 graphics cards to compare side by side</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Counter */}
        <div className="mb-6">
          <span className="text-gray-400">Selected: </span>
          <span className={`font-semibold ${selected.length === 4 ? 'text-amber-400' : 'text-white'}`}>
            {selected.length}/4
          </span>
        </div>

        {/* GPU Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {ALL_GPUS.filter(g => g.active).map(gpu => {
            const isSelected = selected.includes(gpu.id)
            const best = getBestPrice(gpu)
            const diff = Math.round(((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100)
            const isNvidia = gpu.brand === 'nvidia'
            
            return (
              <button
                key={gpu.id}
                onClick={() => toggle(gpu.id)}
                className={`
                  relative p-5 rounded-xl border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? isNvidia 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-red-500 bg-red-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${isNvidia ? 'bg-green-500' : 'bg-red-500'}`}>
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}
                
                {/* Brand & Model Row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${isNvidia ? 'text-green-400' : 'text-red-400'}`}>
                      {isNvidia ? 'NVIDIA' : 'AMD'}
                    </div>
                    <div className="font-bold text-white text-xl">
                      {gpu.model}
                    </div>
                  </div>
                </div>
                
                {/* Price Row */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-white">
                    ${best.price.toLocaleString()}
                  </span>
                  <span className={`text-sm font-medium ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    {diff > 0 ? '+' : ''}{diff}%
                  </span>
                </div>
                
                {/* Footer Row */}
                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">{gpu.vram_gb}GB VRAM</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${gpu.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${gpu.in_stock ? 'bg-green-400' : 'bg-red-400'}`} />
                    {gpu.in_stock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Comparison Section */}
        {selectedData.length > 0 && (
          <div className="space-y-8">
            
            {/* Specs Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Specifications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium w-40">Spec</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-4 min-w-[160px]">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${gpu.brand === 'nvidia' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-white font-semibold">{gpu.model}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Architecture', get: (g: GPU) => g.architecture },
                      { label: 'Generation', get: (g: GPU) => g.generation },
                      { label: 'VRAM', get: (g: GPU) => `${g.vram_gb} GB` },
                      { label: 'TDP', get: (g: GPU) => `${g.tdp_watts}W` },
                      { label: 'Release Date', get: (g: GPU) => new Date(g.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) },
                      { label: 'Availability', get: (g: GPU) => g.in_stock ? 'In Stock' : 'Out of Stock', class: (g: GPU) => g.in_stock ? 'text-green-400' : 'text-red-400' },
                    ].map((row, idx) => (
                      <tr key={row.label} className="border-b border-gray-800 last:border-0">
                        <td className="p-4 text-gray-400 font-medium bg-gray-900">{row.label}</td>
                        {selectedData.map(gpu => (
                          <td key={gpu.id} className={`p-4 ${row.class ? row.class(gpu) : 'text-white'}`}>
                            {row.get(gpu)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Pricing</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium w-40">Retailer</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-4 min-w-[160px]">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${gpu.brand === 'nvidia' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-white font-semibold">{gpu.model}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Best Price */}
                    <tr className="border-b border-gray-800 bg-amber-500/5">
                      <td className="p-4 font-medium text-amber-400">Best Price</td>
                      {selectedData.map(gpu => {
                        const best = getBestPrice(gpu)
                        const diff = Math.round(((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100)
                        return (
                          <td key={gpu.id} className="p-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-white">${best.price.toLocaleString()}</span>
                              {diff !== 0 && (
                                <span className={`text-sm ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                  {diff > 0 ? '+' : ''}{diff}%
                                </span>
                              )}
                            </div>
                            {best.retailer !== 'default' && best.url && (
                              <a 
                                href={best.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mt-1"
                              >
                                {formatRetailerName(best.retailer)}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                    
                    {/* MSRP */}
                    <tr className="border-b border-gray-800">
                      <td className="p-4 text-gray-400 font-medium">MSRP</td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-gray-400">
                          ${gpu.msrp_usd.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Retailers */}
                    {['amazon', 'bestbuy', 'newegg'].map((retailer) => (
                      <tr key={retailer} className="border-b border-gray-800 last:border-0">
                        <td className="p-4 text-gray-400 font-medium">{formatRetailerName(retailer)}</td>
                        {selectedData.map(gpu => {
                          const data = gpu.retailer_prices?.[retailer as keyof typeof gpu.retailer_prices]
                          if (!data) return (
                            <td key={gpu.id} className="p-4">
                              <span className="text-gray-600">—</span>
                            </td>
                          )
                          return (
                            <td key={gpu.id} className="p-4">
                              <a 
                                href={data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white font-semibold hover:text-amber-400 transition-colors"
                              >
                                ${data.price.toLocaleString()}
                              </a>
                              <div className={`text-sm ${data.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                {data.in_stock ? 'In Stock' : 'Out of Stock'}
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
          <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No GPUs selected</h3>
            <p className="text-gray-400">Click on GPU cards above to compare up to 4 side by side</p>
          </div>
        )}
      </div>
    </main>
  )
}
