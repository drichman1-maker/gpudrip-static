'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, Share2, Check } from 'lucide-react'
import { ALL_GPUS, GPU } from '@/lib/gpu-data'

const BRAND_STYLES = {
  nvidia: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    dot: 'bg-green-500',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12.02 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.56 2 12.02 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    )
  },
  amd: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-500',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    )
  }
}

export default function CompareClient() {
  const [selectedGPUs, setSelectedGPUs] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from URL after mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const compare = params.get('compare')
      if (compare) {
        setSelectedGPUs(compare.split(',').filter(id => ALL_GPUS.some(g => g.id === id)))
      }
    }
  }, [])

  // Update URL when selection changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (selectedGPUs.length > 0) {
      url.searchParams.set('compare', selectedGPUs.join(','))
    } else {
      url.searchParams.delete('compare')
    }
    window.history.replaceState({}, '', url.toString())
  }, [selectedGPUs, mounted])

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
    return { price, diff, percent, isDeal: diff < 0 }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <Link href="/gpu" className="text-gray-400 hover:text-white flex items-center gap-2 mb-3 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to GPUs
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Compare GPUs</h1>
            <p className="text-gray-400 mt-2 text-base">Select 2-4 GPUs to compare side-by-side</p>
          </div>
          {selectedGPUs.length > 0 && (
            <div className="flex gap-3">
              <button onClick={shareComparison} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all text-sm font-medium">
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              <button onClick={clearComparison} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium">
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* GPU Selector */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-5">
            Select GPUs <span className="text-gray-500 font-normal">({selectedGPUs.length}/4)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {ALL_GPUS.filter(g => g.active).map(gpu => {
              const isSelected = selectedGPUs.includes(gpu.id)
              const priceInfo = getPriceDisplay(gpu)
              const brandStyle = BRAND_STYLES[gpu.brand]
              
              return (
                <button key={gpu.id} onClick={() => toggleGPU(gpu.id)} 
                  className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected ? `${brandStyle.bg} ${brandStyle.border}` : 'bg-[#141414] border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#1a1a1a]'
                  }`}>
                  {isSelected && (
                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${brandStyle.bg} ${brandStyle.border} flex items-center justify-center`}>
                      <Check className={`h-3.5 w-3.5 ${brandStyle.text}`} />
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${brandStyle.bg} ${brandStyle.text} flex items-center justify-center mb-3`}>
                    {brandStyle.icon}
                  </div>
                  <div className="font-semibold text-white text-sm leading-tight mb-1 pr-6">{gpu.model}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">${priceInfo.price.toLocaleString()}</span>
                    {priceInfo.percent !== 0 && (
                      <span className={`text-xs font-medium ${priceInfo.isDeal ? 'text-green-400' : 'text-red-400'}`}>
                        {priceInfo.isDeal ? '↓' : '↑'} {Math.abs(priceInfo.percent)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{gpu.vram_gb}GB • {gpu.tdp_watts}W</div>
                  {isSelected && (
                    <div className={`mt-3 text-xs font-medium ${brandStyle.text} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${brandStyle.dot}`} />
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
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-semibold text-white">GPU Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left p-5 text-gray-400 font-medium sticky left-0 bg-[#141414] z-10 min-w-[140px]">Feature</th>
                    {selectedGPUData.map(gpu => {
                      const brandStyle = BRAND_STYLES[gpu.brand]
                      return (
                        <th key={gpu.id} className="text-left p-5 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${brandStyle.dot}`} />
                            <span className="text-white font-bold text-lg">{gpu.model}</span>
                          </div>
                          <div className="text-sm text-gray-500">{gpu.architecture}</div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]/50">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">Current Price</td>
                    {selectedGPUData.map(gpu => {
                      const info = getPriceDisplay(gpu)
                      return (
                        <td key={gpu.id} className="p-5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">${info.price.toLocaleString()}</span>
                            {info.percent !== 0 && (
                              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${info.isDeal ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {info.isDeal ? '↓' : '↑'} {Math.abs(info.percent)}%
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">MSRP</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-5 text-gray-300">${gpu.msrp_usd.toLocaleString()}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]/50">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">Architecture</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-5 text-white font-medium">{gpu.architecture}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">Generation</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-5 text-white">{gpu.generation}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]/50">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">VRAM</td>
                    {selectedGPUData.map(gpu => {
                      const maxVram = Math.max(...selectedGPUData.map(g => g.vram_gb))
                      const isBest = gpu.vram_gb === maxVram
                      return (
                        <td key={gpu.id} className="p-5">
                          <span className={`text-lg font-bold ${isBest ? 'text-green-400' : 'text-white'}`}>{gpu.vram_gb} GB</span>
                          {isBest && selectedGPUData.length > 1 && (
                            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Best</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">TDP</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-5 text-white">{gpu.tdp_watts}W</td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]/50">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">Release Date</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-5 text-gray-300">
                        {new Date(gpu.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#2a2a2a]">
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">Availability</td>
                    {selectedGPUData.map(gpu => (
                      <td key={gpu.id} className="p-5">
                        {gpu.in_stock ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                            Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-5 text-gray-400 sticky left-0 bg-[#141414] z-10 font-medium">Actions</td>
                    {selectedGPUData.map(gpu => {
                      const brandStyle = BRAND_STYLES[gpu.brand]
                      return (
                        <td key={gpu.id} className="p-5">
                          <Link href={`/gpu/${gpu.slug}`} className={`inline-flex items-center gap-2 px-4 py-2.5 ${brandStyle.bg} border ${brandStyle.border} ${brandStyle.text} rounded-xl hover:opacity-80 transition-all text-sm font-medium`}>
                            View Details
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#141414] border border-[#2a2a2a] rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No GPUs selected</h3>
            <p className="text-gray-400">Select 2-4 GPUs above to start comparing</p>
          </div>
        )}
      </div>
    </div>
  )
}
