'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'GPUs', color: '#fff', border: '#333' },
  { href: '/compare', label: 'Compare', color: '#ff6b35', border: '#ff6b35' },
  { href: '/retailers', label: 'Retailers', color: '#FF9900', border: '#FF9900' },
  { href: '/blog', label: 'Blog', color: '#22c55e', border: '#22c55e' },
  { href: '/alerts', label: 'Alerts', color: '#4a90e2', border: '#4a90e2' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mobile-nav">
      {/* Hamburger button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hamburger-btn"
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/></>
          )}
        </svg>
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-link"
                style={{ 
                  color: item.color,
                  borderColor: item.border 
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .mobile-nav {
          display: none;
        }
        
        @media (max-width: 768px) {
          .mobile-nav {
            display: block;
          }
        }
        
        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }
        
        .hamburger-btn:hover {
          background: #262626;
        }
        
        .mobile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          left: 0;
          margin-top: 8px;
          padding: 0 16px;
          z-index: 1000;
        }
        
        .mobile-menu-inner {
          background: rgba(10, 10, 10, 0.98);
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        
        .mobile-nav-link {
          display: block;
          padding: 12px 16px;
          background: #1a1a1a;
          border: 1px solid;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
          transition: all 0.15s ease;
        }
        
        .mobile-nav-link:hover {
          background: #262626;
          transform: translateY(-1px);
        }
        
        .mobile-nav-link:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
