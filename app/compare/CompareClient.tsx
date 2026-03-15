'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ALL_GPUS } from '@/lib/gpu-data'

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

  const getBest = (gpu: typeof ALL_GPUS[0]) => {
    if (!gpu.retailer_prices) return { price: gpu.current_price_usd, retailer: 'default', in_stock: gpu.in_stock, url: '' }
    
    const prices = Object.entries(gpu.retailer_prices)
      .map(([r, d]) => ({ retailer: r, ...d }))
      .filter(p => p.price > 0)
    
    if (!prices.length) return { price: gpu.current_price_usd, retailer: 'default', in_stock: gpu.in_stock, url: '' }
    
    const inStock = prices.filter(p => p.in_stock)
    const pool = inStock.length ? inStock : prices
    return pool.reduce((a, b) => a.price < b.price ? a : b)
  }

  const retailerNames: Record<string, string> = {
    amazon: 'Amazon',
    bestbuy: 'Best Buy',
    newegg: 'Newegg',
    bh_photo: 'B&H Photo',
    micro_center: 'Micro Center'
  }

  return (
    <main className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <Link href="/gpu" className="text-gray-400 hover:text-white text-sm">
            ← Back to GPUs
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Compare GPUs</h1>
          <p className="text-gray-400 mt-1">Select up to 4 GPUs ({selected.length}/4)</p>
        </div>

        {/* Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {ALL_GPUS.filter(g => g.active).map(gpu => {
            const isSel = selected.includes(gpu.id)
            const best = getBest(gpu)
            const diff = Math.round(((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100)
            
            return (
              <button
                key={gpu.id}
                onClick={() => toggle(gpu.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSel 
                    ? gpu.brand === 'nvidia' 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-red-500 bg-red-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className={`text-sm font-medium ${isSel ? (gpu.brand === 'nvidia' ? 'text-green-400' : 'text-red-400') : 'text-gray-400'}`}>
                  {gpu.model}
                </div>
                <div className="text-white font-bold text-lg mt-1">
                  ${best.price.toLocaleString()}
                </div>
                <div className={`text-xs ${diff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {diff < 0 ? '↓' : '↑'} {Math.abs(diff)}%
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {gpu.vram_gb}GB VRAM
                </div>
                {isSel && (
                  <div className="mt-2 text-xs text-green-400">✓ Selected</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Comparison */}
        {selectedData.length > 0 && (
          <div className="space-y-6">
            
            {/* Specs */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Specifications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Spec</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-4 text-white font-bold">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${gpu.brand === 'nvidia' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {gpu.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Architecture', getValue: (g: typeof ALL_GPUS[0]) => g.architecture },
                      { label: 'Generation', getValue: (g: typeof ALL_GPUS[0]) => g.generation },
                      { label: 'VRAM', getValue: (g: typeof ALL_GPUS[0]) => `${g.vram_gb} GB` },
                      { label: 'TDP', getValue: (g: typeof ALL_GPUS[0]) => `${g.tdp_watts}W` },
                      { label: 'Release Date', getValue: (g: typeof ALL_GPUS[0]) => new Date(g.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) },
                      { label: 'Availability', getValue: (g: typeof ALL_GPUS[0]) => g.in_stock ? '● In Stock' : '○ Out of Stock', className: (g: typeof ALL_GPUS[0]) => g.in_stock ? 'text-green-400' : 'text-red-400' },
                    ].map((row, idx) => (
                      <tr key={row.label} className={`border-b border-gray-800 ${idx % 2 ? 'bg-white/5' : ''}`}>
                        <td className="p-4 text-gray-400">{row.label}</td>
                        {selectedData.map(gpu => (
                          <td key={gpu.id} className={`p-4 ${row.className ? row.className(gpu) : 'text-white'}`}>
                            {row.getValue(gpu)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Pricing</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Retailer</th>
                      {selectedData.map(gpu => (
                        <th key={gpu.id} className="text-left p-4 text-white font-semibold">{gpu.model}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 bg-green-500/5">
                      <td className="p-4 text-green-400 font-semibold">Best Price</td>
                      {selectedData.map(gpu => {
                        const best = getBest(gpu)
                        const diff = Math.round(((best.price - gpu.msrp_usd) / gpu.msrp_usd) * 100)
                        return (
                          <td key={gpu.id} className="p-4">
                            <a 
                              href={best.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xl font-bold text-white hover:text-green-400"
                            >
                              ${best.price.toLocaleString()}
                            </a>
                            {diff !== 0 && (
                              <div className={`text-sm ${diff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {diff < 0 ? '↓' : '↑'} {Math.abs(diff)}% vs MSRP
                              </div>
                            )}
                            {best.retailer !== 'default' && (
                              <a 
                                href={best.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-sm text-gray-400 hover:text-white block mt-1"
                              >
                                at {retailerNames[best.retailer] || best.retailer} →
                              </a>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="p-4 text-gray-400">MSRP</td>
                      {selectedData.map(gpu => (
                        <td key={gpu.id} className="p-4 text-gray-400">${gpu.msrp_usd.toLocaleString()}</td>
                      ))}
                    </tr>
                    {['amazon', 'bestbuy', 'newegg'].map((retailer, idx) => (
                      <tr key={retailer} className={`border-b border-gray-800 ${idx % 2 ? 'bg-white/5' : ''}`}>
                        <td className="p-4 text-gray-400">{retailerNames[retailer]}</td>
                        {selectedData.map(gpu => {
                          const data = gpu.retailer_prices?.[retailer as keyof typeof gpu.retailer_prices]
                          if (!data) return <td key={gpu.id} className="p-4 text-gray-600">—</td>
                          return (
                            <td key={gpu.id} className="p-4">
                              <a 
                                href={data.url}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-white font-semibold hover:text-green-400"
                              >
                                ${data.price.toLocaleString()}
                              </a>
                              <div className={`text-sm ${data.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                {data.in_stock ? '● In Stock' : '○ Out of Stock'}
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

        {selectedData.length === 0 && (
          <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-white mb-2">No GPUs selected</h3>
            <p className="text-gray-400">Select GPUs above to compare</p>
          </div>
        )}
      </div>
    </main>
  )
}
