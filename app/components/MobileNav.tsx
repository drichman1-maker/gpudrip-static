'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { href: '/gpu', label: 'GPUs', color: '#fff', border: '#333' },
  { href: '/compare', label: 'Compare', color: '#ff6b35', border: '#ff6b35' },
  { href: '/retailers', label: 'Retailers', color: '#FF9900', border: '#FF9900' },
  { href: '/blog', label: 'Blog', color: '#22c55e', border: '#22c55e' },
  { href: '/alerts', label: 'Alerts', color: '#4a90e2', border: '#4a90e2' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signInWithGoogle, signOut } = useAuth()

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
            
            {/* Auth Section Divider */}
            <div style={{ height: 1, background: '#333', margin: '8px 0' }} />
            
            {/* Mobile Auth Button */}
            {loading ? (
              <div className="mobile-nav-link" style={{ color: '#888', borderColor: '#333' }}>
                Loading...
              </div>
            ) : user ? (
              <>
                <div style={{ 
                  padding: '12px 16px',
                  color: '#00ff88',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: '#000',
                    fontWeight: 700
                  }}>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {user.email?.split('@')[0]}
                </div>
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="mobile-nav-link"
                  style={{ 
                    color: '#ef4444',
                    borderColor: '#ef4444',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle()
                  setIsOpen(false)
                }}
                className="mobile-nav-link"
                style={{ 
                  color: '#4a90e2',
                  borderColor: '#4a90e2',
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In with Google
              </button>
            )}
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
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          z-index: 1000;
        }
        
        .mobile-menu-inner {
          background: rgba(15, 15, 15, 0.98);
          border: 1px solid #333;
          border-radius: 12px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
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
          text-align: left;
          transition: all 0.15s ease;
          white-space: nowrap;
          touch-action: manipulation;
        }
        
        .mobile-nav-link:hover {
          background: #262626;
        }
      `}</style>
    </div>
  )
}
