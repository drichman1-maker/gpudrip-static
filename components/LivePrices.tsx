'use client'

import { useState, useEffect } from 'react'

type PriceData = {
  name: string
  price: number
  threshold: number
  alert: boolean
  url: string
  timestamp: string
}

type Props = {
  onDealsUpdate?: (count: number) => void
}

export default function LivePrices({ onDealsUpdate }: Props) {
  const [prices, setPrices] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('/api/prices')
        const data = await res.json()
        
        if (data.success) {
          const gpuPrices = data.prices['gpu-drip'] || []
          setPrices(gpuPrices)
          setLastUpdate(data.timestamp)
          
          // Count deals (alert = true)
          const dealCount = gpuPrices.filter((p: PriceData) => p.alert).length
          onDealsUpdate?.(dealCount)
        } else {
          setError(data.error || 'Failed to fetch prices')
        }
      } catch (err) {
        setError('Failed to connect')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [onDealsUpdate])

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-3">Live Prices</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-3">Live Prices</h3>
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">Live Prices</h3>
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Updated {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {prices.length === 0 ? (
        <p className="text-gray-400">No price data available</p>
      ) : (
        <div className="space-y-2">
          {prices.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg transition-colors ${
                item.alert 
                  ? 'bg-red-900/30 border border-red-800 hover:bg-red-900/50' 
                  : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{item.name}</span>
                <div className="text-right">
                  <span className="text-green-400 font-bold">${item.price.toLocaleString()}</span>
                  {item.alert && (
                    <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                      DEAL
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
