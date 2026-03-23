'use client'

import { useState } from 'react'
import Link from 'next/link'

const RETAILERS = [
  { id: 'amazon', name: 'Amazon', color: '#FF9900' },
  { id: 'bestbuy', name: 'Best Buy', color: '#0046BE' },
  { id: 'newegg', name: 'Newegg', color: '#F04F24' },
  { id: 'bh', name: 'B&H Photo', color: '#E53935' },
  { id: 'microcenter', name: 'Micro Center', color: '#0078D4' },
  { id: 'adorama', name: 'Adorama', color: '#F37021' },
  { id: 'antonline', name: 'Antonline', color: '#00A651' },
  { id: 'cdw', name: 'CDW', color: '#C41230' },
]

export default function RetailerDropdown({ currentRetailer }: { currentRetailer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const current = RETAILERS.find(r => r.id === currentRetailer) || RETAILERS[0]

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text)',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: current.color
        }} />
        <span>{current.name}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 8,
            minWidth: 200,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            zIndex: 50,
            overflow: 'hidden'
          }}>
            {RETAILERS.map((retailer) => (
              <Link
                key={retailer.id}
                href={`/retailers/${retailer.id}`}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontSize: 14,
                  background: retailer.id === currentRetailer ? 'rgba(255,255,255,0.05)' : 'transparent',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = retailer.id === currentRetailer ? 'rgba(255,255,255,0.05)' : 'transparent'
                }}
              >
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: retailer.color
                }} />
                <span style={{ fontWeight: retailer.id === currentRetailer ? 600 : 400 }}>
                  {retailer.name}
                </span>
                {retailer.id === currentRetailer && (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#00ff88" 
                    strokeWidth="2"
                    style={{ marginLeft: 'auto' }}
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
