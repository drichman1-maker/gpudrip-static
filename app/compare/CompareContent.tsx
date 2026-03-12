'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, X, Share2, Check } from 'lucide-react'
import { ALL_GPUS, GPU } from '@/lib/gpu-data'

export default function CompareContent() {
  const searchParams = useSearchParams()
  const [selectedGPUs, setSelectedGPUs] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  // Load selected GPUs from URL
  useEffect(() => {
    const compare = searchParams.get('compare')
    if (compare) {
      setSelectedGPUs(compare.split(',').filter(id => ALL_GPUS.some(g => g.id === id)))
    }
  }, [searchParams])

  // Update URL when selection changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (selectedGPUs.length > 0) {
      url.searchParams.set('compare', selectedGPUs.join(','))
    } else {
      url.searchParams.delete('compare')
    }
    window.history.replaceState({}, '', url.toString())
  }, [selectedGPUs])

  const toggleGPU = (id: string) => {
    setSelectedGPUs(prev => {
      if (prev.includes(id)) {
        return prev.filter(g => g !== id)
      }
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const shareComparison = () => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('compare', selectedGPUs.join(','))
    navigator.clipboard.writeText(url.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearComparison = () => {
    setSelectedGPUs([])
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/compare')
    }
  }

  const selectedGPUData = useMemo(() => {
    return ALL_GPUS.filter(gpu => selectedGPUs.includes(gpu.id))
  }, [selectedGPUs])

  const getPriceDisplay = (gpu: GPU) => {
    const price = gpu.current_price_usd
    const msrp = gpu.msrp_usd
    const diff = price - msrp
    const percent = Math.round((diff / msrp) * 100)
    
    return {
      price,
      diff,
      percent,
      isDeal: diff < 0
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <Link 
              href="/gpu" 
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to GPUs
            </Link>
            <h1 className="text-3xl font-bold text-white">Compare GPUs</h1>
            <p className="text-gray-400 mt-1">Select 2-4 GPUs to compare side-by-side</p>
          </div>
          {selectedGPUs.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={shareComparison}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Share'}
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

        {/* GPU Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Select GPUs ({selectedGPUs.length}/4)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_GPUS.filter(g => g.active).map(gpu => {
              const isSelected = selectedGPUs.includes(gpu.id)
              const priceInfo = getPriceDisplay(gpu)
              
              return (
                <button
                  key={gpu.id}
                  onClick={() => toggleGPU(gpu.id)}
                  className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                    isSelected
                      ? 'border-[#00ff88] bg-[#00ff88]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Brand indicator */}
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                    gpu.brand === 'nvidia' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  
                  <div className="text-2xl mb-2">🎮</div>
                  <div className="text-sm font-medium text-white truncate pr-4">{gpu.model}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    ${priceInfo.price}
                    {priceInfo.percent !== 0 && (
                      <span className={`ml-1 ${priceInfo.isDeal ? 'text-green-400' : 'text-red-400'}`}>
                        {priceInfo.isDeal ? '↓' : '↑'} {Math.abs(priceInfo.percent)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{gpu.vram_gb}GB VRAM</div>
                  
                  {isSelected && (
                    <div className="mt-2 text-xs text-[#00ff88] flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedGPUData.length > 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">GPU Comparison</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium sticky left-0 bg-[#0f0f0f] z-10">Feature</th>
                    {selectedGPUData.map(gpu => (
                      <th key={gpu.id} className="text-left p-4 min-w-[180px]">
                        <div className="text-white font-semibold">{gpu.model}</div>
                        <div className="text-sm text-gray-400">{gpu.architecture}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">Current Price</td>
                    {selectedGPUData.map(gpu => {
                      const info = getPriceDisplay(gpu)
                      return (
                        <td key={gpu.id} className="p-4">
                          <span className="text-2xl font-bold text-white">${info.price}</span>
                          {info.percent !== 0 && (
                            <span className={`ml-2 text-sm ${info.isDeal ? 'text-green-400' : 'text-red-400'}`}>
                              {info.isDeal ? '↓' : '↑'} {Math.abs(info.percent)}%
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>

                  {/* MSRP Row */}
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">MSRP</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4 text-gray-300">
                        ${gpu.msrp_usd}
                      </td>
                    ))}
                  </tr>

                  {/* Architecture */}
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">Architecture</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4 text-white">{gpu.architecture}</td>
                    ))}
                  </tr>

                  {/* Generation */}
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">Generation</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4 text-white">{gpu.generation}</td>
                    ))}
                  </tr>

                  {/* VRAM */}
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">VRAM</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4">
                        <span className="text-white font-semibold">{gpu.vram_gb} GB</span>
                      </td>
                    ))}
                  </tr>

                  {/* TDP */}
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">TDP (Power)</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4 text-white">{gpu.tdp_watts}W</td>
                    ))}
                  </tr>

                  {/* Release Date */}
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">Release Date</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4 text-white">
                        {new Date(gpu.release_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">Availability</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4">
                        {gpu.in_stock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                            Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-4 text-gray-400 sticky left-0 bg-[#0f0f0f] z-10">Actions</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-4">
                        <Link
                          href={`/gpu/${gpu.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] rounded-lg hover:bg-[#00ff88]/20 transition-colors text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-white mb-2">No GPUs selected</h3>
            <p className="text-gray-400">Select 2-4 GPUs above to start comparing</p>
          </div>
        )}
      </div>
    </div>
  )
}
