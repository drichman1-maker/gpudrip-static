'use client'

import React from 'react'
import { useAuth } from '@/lib/auth-context'

interface AuthButtonProps {
  variant?: 'nav' | 'alerts' // Different styling for nav vs alerts page
}

export default function AuthButton({ variant = 'nav' }: AuthButtonProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return (
      <div style={{
        padding: variant === 'nav' ? '8px 16px' : '14px 28px',
        color: '#888',
        fontSize: variant === 'nav' ? 14 : 15,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
        <div style={{
          width: 16,
          height: 16,
          border: '2px solid #333',
          borderTopColor: '#00ff88',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        Loading...
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (user) {
    // Signed in state
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {/* User avatar/email - hidden on mobile */}
        <div style={{
          display: variant === 'nav' ? 'none' : 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'rgba(0, 255, 136, 0.1)',
          borderRadius: 8,
          border: '1px solid rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
          fontSize: 14,
          fontWeight: 500
        }}>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%'
              }}
            />
          ) : (
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#000',
              fontWeight: 700
            }}>
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <span style={{ 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {user.email?.split('@')[0]}
          </span>
        </div>

        <button
          onClick={signOut}
          style={{
            padding: variant === 'nav' ? '8px 16px' : '12px 24px',
            borderRadius: 8,
            border: '1px solid #ef4444',
            background: variant === 'nav' ? 'transparent' : 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontSize: variant === 'nav' ? 13 : 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = variant === 'nav' ? 'transparent' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign Out
        </button>
      </div>
    )
  }

  // Signed out state
  if (variant === 'alerts') {
    // Alerts page version - full sign in prompt
    return (
      <button
        onClick={signInWithGoogle}
        style={{
          padding: '14px 28px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: '#fff',
          color: '#374151',
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    )
  }

  // Nav bar version - compact
  return (
    <button
      onClick={signInWithGoogle}
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid #333',
        background: '#1a1a2e',
        color: '#4a90e2',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#1a1a3a'
        e.currentTarget.style.borderColor = '#4a90e2'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#1a1a2e'
        e.currentTarget.style.borderColor = '#333'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign In
    </button>
  )
}
