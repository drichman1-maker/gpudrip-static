'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

type PricePoint = {
  date: string
  price: number
}

type PriceChartProps = {
  data: PricePoint[]
  currentPrice: number
  msrp: number
  gpuModel: string
}

export default function PriceChart({ data, currentPrice, msrp, gpuModel }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<'30' | '60' | '90'>('30')
  
  // Filter data based on time range
  const getFilteredData = () => {
    const days = parseInt(timeRange)
    return data.slice(-days)
  }
  
  const chartData = getFilteredData()
  
  // Format date for X-axis
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload[0].value
      const isDeal = price < msrp
      const isSurge = price > msrp * 1.1
      
      return (
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 8,
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <p style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>
            {new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>
            ${price}
          </p>
          <p style={{ 
            color: isDeal ? '#22c55e' : isSurge ? '#ef4444' : '#888', 
            fontSize: 12,
            marginTop: 4
          }}>
            {isDeal ? '↓ Deal' : isSurge ? '↑ Surge' : '→ Average'}
          </p>
        </div>
      )
    }
    return null
  }
  
  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const priceRange = maxPrice - minPrice
  const yAxisDomain = [minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1]
  
  return (
    <div>
      {/* Time Range Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['30', '60', '90'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: timeRange === range ? '#2563eb' : '#1a1a1a',
              color: timeRange === range ? '#fff' : '#888',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            {range} Days
          </button>
        ))}
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#2a2a2a' }}
              axisLine={{ stroke: '#2a2a2a' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#2a2a2a' }}
              axisLine={{ stroke: '#2a2a2a' }}
              domain={yAxisDomain}
              tickFormatter={(value) => `$${value}`}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={msrp} 
              stroke="#666" 
              strokeDasharray="5 5" 
              label={{ 
                value: 'MSRP', 
                position: 'right', 
                fill: '#666', 
                fontSize: 11 
              }} 
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, fontSize: 12, color: '#666' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 20, height: 2, background: '#2563eb', borderRadius: 1 }}></span>
          Price
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 20, height: 1, background: '#666', borderStyle: 'dashed' }}></span>
          MSRP (${msrp})
        </span>
      </div>
    </div>
  )
}