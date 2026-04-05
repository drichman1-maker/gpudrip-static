'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import GPUSelector from './GPUSelector'
import { useAuth } from '@/lib/auth-context'

const BACKEND_URL = 'https://gpudrip-backend.fly.dev'

// Fallback GPU data in case API fails
const FALLBACK_GPUS: GPU[] = [
    {
        id: 'rtx-5090',
        model: 'NVIDIA RTX 5090',
        current_price_usd: 1999,
        msrp_usd: 1999,
        brand: 'nvidia',
        manufacturer: 'NVIDIA',
        architecture: 'Blackwell',
        generation: 'RTX 50',
        vram_gb: 32,
        in_stock: true,
        price_change_percent: 0
    },
    {
        id: 'rtx-5080',
        model: 'NVIDIA RTX 5080',
        current_price_usd: 1299,
        msrp_usd: 1299,
        brand: 'nvidia',
        manufacturer: 'NVIDIA',
        architecture: 'Blackwell',
        generation: 'RTX 50',
        vram_gb: 16,
        in_stock: true,
        price_change_percent: 0
    },
    {
        id: 'rtx-5070-ti',
        model: 'NVIDIA RTX 5070 Ti',
        current_price_usd: 899,
        msrp_usd: 899,
        brand: 'nvidia',
        manufacturer: 'NVIDIA',
        architecture: 'Blackwell',
        generation: 'RTX 50',
        vram_gb: 16,
        in_stock: true,
        price_change_percent: 0
    },
    {
        id: 'rx-9070-xt',
        model: 'AMD Radeon RX 9070 XT',
        current_price_usd: 899,
        msrp_usd: 899,
        brand: 'amd',
        manufacturer: 'AMD',
        architecture: 'RDNA 4',
        generation: 'RX 9000',
        vram_gb: 16,
        in_stock: true,
        price_change_percent: 0
    },
    {
        id: 'rx-9070',
        model: 'AMD Radeon RX 9070',
        current_price_usd: 649,
        msrp_usd: 649,
        brand: 'amd',
        manufacturer: 'AMD',
        architecture: 'RDNA 4',
        generation: 'RX 9000',
        vram_gb: 12,
        in_stock: true,
        price_change_percent: 0
    }
]

interface GPU {
    id: string
    model: string
    current_price_usd: number
    msrp_usd: number
    brand: 'nvidia' | 'amd' | 'intel'
    architecture: string
    generation: string
    vram_gb: number
    in_stock?: boolean
    price_change_percent: number
    manufacturer?: string
}

interface Alert {
    id: string
    gpu_id: string
    gpu_name: string
    target_price: number
    current_price?: number
    is_active: boolean
    created_at: string
}

export default function AlertsClient() {
    let auth
    let authError = null
    
    try {
        auth = useAuth()
        console.log('[AlertsClient] Auth loaded:', { user: auth?.user?.email, loading: auth?.loading })
    } catch (err: any) {
        authError = err
        console.error('[AlertsClient] Auth context error:', err.message)
    }
    
    const user = auth?.user || null
    const signInWithGoogle = auth?.signInWithGoogle || (async () => { console.warn('Google sign-in not available') })
    const authLoading = auth?.loading || false
    
    const [gpus, setGpus] = useState<GPU[]>(FALLBACK_GPUS)
    const [loading, setLoading] = useState(false)
    const [selectedGpus, setSelectedGpus] = useState<string[]>([])
    const [targetPrice, setTargetPrice] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [userAlerts, setUserAlerts] = useState<Alert[]>([])
    const [showManage, setShowManage] = useState(false)

    // Fetch GPUs on mount
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/gpus`)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then(data => {
                const gpuData = Array.isArray(data) ? data : (data.gpus || [])
                // Map brand to manufacturer for GPUSelector
                const processedGpus = gpuData.map((g: any) => ({
                    ...g,
                    manufacturer: g.brand === 'nvidia' ? 'NVIDIA' : g.brand === 'amd' ? 'AMD' : 'Intel'
                }))
                setGpus(processedGpus)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load GPUs, using fallback data:', err)
                // Use fallback data if API fails
                setGpus(FALLBACK_GPUS)
                setLoading(false)
            })
    }, [])

    // Update target price when first GPU selected
    useEffect(() => {
        if (selectedGpus.length > 0) {
            const gpu = gpus.find(g => g.id === selectedGpus[0])
            if (gpu) {
                // Suggest 10% below current price
                const suggested = Math.floor(gpu.current_price_usd * 0.9)
                setTargetPrice(suggested.toString())
            }
        }
    }, [selectedGpus, gpus])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedGpus.length === 0 || !targetPrice || !user?.email) return
        
        const email = user.email

        setSubmitting(true)
        setMessage(null)

        const targetPriceNum = parseInt(targetPrice)
        const results = []
        const errors = []

        // Create alerts for all selected GPUs
        for (const gpuId of selectedGpus) {
            const gpu = gpus.find(g => g.id === gpuId)
            if (!gpu) continue

            try {
                const response = await fetch(`${BACKEND_URL}/api/alerts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.toLowerCase().trim(),
                        gpu_id: gpuId,
                        gpu_name: gpu.model,
                        target_price: targetPriceNum,
                    }),
                })

                if (response.ok) {
                    results.push(gpu.model)
                } else {
                    const err = await response.json()
                    errors.push(`${gpu.model}: ${err.error || 'Failed'}`)
                }
            } catch (err) {
                errors.push(`${gpu.model}: Network error`)
            }
        }

        if (results.length > 0) {
            const gpuNames = results.length === 1 ? results[0] : `${results.length} GPUs`
            setMessage({ 
                type: 'success', 
                text: `Alert${results.length > 1 ? 's' : ''} set for ${gpuNames} at $${targetPrice}! Check your email to confirm.` 
            })
            setSelectedGpus([])
            setTargetPrice('')
        }

        if (errors.length > 0) {
            setMessage({ type: 'error', text: errors.join(', ') })
        }

        setSubmitting(false)
    }

    const fetchUserAlerts = async () => {
        if (!user?.email) return
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/alerts?email=${encodeURIComponent(user.email)}`)
            if (response.ok) {
                const data = await response.json()
                setUserAlerts(data.alerts || [])
            }
        } catch (err) {
            console.error('Failed to fetch alerts:', err)
        }
    }

    const deleteAlert = async (alertId: string) => {
        if (!user?.email) return
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/alerts/${alertId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            })

            if (response.ok) {
                setUserAlerts(userAlerts.filter(a => a.id !== alertId))
            }
        } catch (err) {
            console.error('Failed to delete alert:', err)
        }
    }

    const selectedGpuData = selectedGpus.length > 0 ? gpus.find(g => g.id === selectedGpus[0]) : null

    return (
        <div className="container" style={{ padding: '48px 24px', maxWidth: 700 }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, display: 'inline-block' }}>
                ← Back to all GPUs
            </Link>

            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    marginBottom: 20,
                    padding: '16px 28px',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.12))',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.1)'
                }}>
                    <span style={{ fontSize: '2rem' }}>🔔</span>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        GPU Price Alerts
                    </h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.6, maxWidth: 580, margin: '0 auto' }}>
                    Get instant email notifications when GPU prices drop to your target. Track any of our <strong style={{ color: 'var(--blue)' }}>38 GPUs</strong> across <strong style={{ color: 'var(--blue)' }}>8 retailers</strong> with 24/7 monitoring.
                </p>
            </div>

            {/* Auth Error Display */}
            {authError && (
                <div className="card" style={{ 
                    padding: 20, 
                    marginBottom: 24, 
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius-lg)',
                    color: '#ef4444'
                }}>
                    <strong>Auth Error:</strong> {authError.message}
                </div>
            )}

            {/* Sign In Prompt */}
            {!user && !authLoading && (
                <div className="card" style={{ 
                    padding: 40, 
                    marginBottom: 32, 
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center'
                }}>
                    <div style={{ 
                        width: 64,
                        height: 64,
                        borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.12))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        margin: '0 auto 20px'
                    }}>
                        🔔
                    </div>
                    <h2 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                        Sign in to Create Alerts
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                        Get instant email notifications when GPU prices drop to your target.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                        <button
                            onClick={async () => {
                                console.log('[Alerts] Google sign-in clicked')
                                try {
                                    await signInWithGoogle()
                                } catch (err) {
                                    console.error('[Alerts] Google sign-in failed:', err)
                                }
                            }}
                            style={{
                                padding: '14px 28px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: '#fff',
                                color: '#374151',
                                fontSize: 15,
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 12
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
                    </div>
                </div>
            )}

            {/* Create Alert Form */}
            <div className="card" style={{ 
                padding: 40, 
                marginBottom: 32, 
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.3s ease',
                opacity: user ? 1 : 0.6
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18
                    }}>
                        🎯
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>Set New Price Alert</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {/* GPU Selection */}
                    <div style={{ marginBottom: 24 }}>
                        <GPUSelector
                            gpus={gpus}
                            selectedGpus={selectedGpus}
                            onSelect={setSelectedGpus}
                            disabled={submitting}
                        />
                    </div>

                    {/* Target Price */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 10, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                            Target Price (USD)
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0,
                            position: 'relative',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            transition: 'border-color 0.15s'
                        }}>
                            <div style={{ 
                                padding: '14px 16px', 
                                fontSize: 16, 
                                color: 'var(--text-secondary)',
                                borderRight: '1px solid var(--border)',
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
                            }}>
                                $
                            </div>
                            <input
                                type="number"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                                placeholder="Enter target price"
                                style={{
                                    flex: 1,
                                    padding: '14px 16px',
                                    border: 'none',
                                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                                    background: 'transparent',
                                    color: 'var(--text-primary)',
                                    fontSize: 15,
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                        {selectedGpuData && targetPrice && (
                            <div style={{ 
                                marginTop: 12, 
                                padding: 12,
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                fontSize: 13
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        Current price: <strong style={{ color: 'var(--text-primary)' }}>${selectedGpuData.current_price_usd}</strong>
                                    </span>
                                    <span style={{ 
                                        color: parseInt(targetPrice) < selectedGpuData.current_price_usd ? 'var(--green)' : 'var(--red)',
                                        fontWeight: 500 
                                    }}>
                                        {Math.round((1 - parseInt(targetPrice) / selectedGpuData.current_price_usd) * 100)}% {parseInt(targetPrice) < selectedGpuData.current_price_usd ? 'cheaper' : 'more expensive'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

          {/* Email from OAuth */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 10, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              Email
            </label>
            <div style={{ 
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              color: user?.email ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 15
            }}>
              📧 {user?.email || (authLoading ? 'Loading...' : 'Not signed in')}
            </div>
            {!user && !authLoading && (
              <p style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>
                Please sign in above to create alerts.
              </p>
            )}
            {user && (
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                Alerts will be sent to this email address.
              </p>
            )}
          </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting || selectedGpus.length === 0 || !targetPrice || !user}
                        style={{
                            width: '100%',
                            padding: '16px 24px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: submitting || selectedGpus.length === 0 || !targetPrice || !user 
                                ? 'var(--bg-hover)' 
                                : 'linear-gradient(135deg, var(--blue), var(--purple))',
                            color: submitting || selectedGpus.length === 0 || !targetPrice || !user 
                                ? 'var(--text-muted)' 
                                : '#fff',
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: submitting || selectedGpus.length === 0 || !targetPrice || !user ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s',
                            transform: submitting ? 'scale(0.98)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                            if (!submitting && selectedGpus.length > 0 && targetPrice && user) {
                                e.currentTarget.style.transform = 'scale(1.02)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.3)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        {submitting ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <span style={{ 
                                    width: 16, 
                                    height: 16, 
                                    border: '2px solid transparent',
                                    borderTop: '2px solid currentColor',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></span>
                                Creating {selectedGpus.length > 1 ? `${selectedGpus.length} Alerts` : 'Alert'}...
                            </span>
                        ) : !user ? (
                            'Sign in to Create Alert'
                        ) : (
                            <>🎯 Create {selectedGpus.length > 1 ? `${selectedGpus.length} Price Alerts` : 'Price Alert'}</>
                        )}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <div style={{
                        marginTop: 16,
                        padding: '12px 16px',
                        borderRadius: 8,
                        background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        color: message.type === 'success' ? '#22c55e' : '#ef4444'
                    }}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Manage Alerts */}
            <div className="card" style={{ 
                padding: 32,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16
                    }}>
                        ⚙️
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Manage Your Alerts</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
                    View and manage your existing price alerts.
                </p>

                {!showManage ? (
                    <button 
                        onClick={() => setShowManage(true)}
                        style={{
                            padding: '12px 20px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-primary)',
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)'
                            e.currentTarget.style.borderColor = 'var(--border-focus)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-elevated)'
                            e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                    >
                        👁️ View My Alerts
                    </button>
                ) : (
                    <div>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                            <div style={{ 
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-secondary)'
                            }}>
                                📧 {user?.email || 'Loading...'}
                            </div>
                            <button 
                                onClick={fetchUserAlerts}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    minWidth: '120px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.3)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                🔍 Load My Alerts
                            </button>
                        </div>

                        {userAlerts.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {userAlerts.map(alert => (
                                    <div 
                                        key={alert.id}
                                        style={{
                                            padding: 16,
                                            background: 'var(--bg-elevated)',
                                            borderRadius: 8,
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: 4 }}>{alert.gpu_name}</div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                                Target: ${alert.target_price} · 
                                                {alert.is_active ? (
                                                    <span style={{ color: '#22c55e' }}>Active</span>
                                                ) : (
                                                    <span style={{ color: '#6b7280' }}>Paused</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteAlert(alert.id)}
                                            style={{
                                                padding: '6px 12px',
                                                background: 'rgba(239,68,68,0.1)',
                                                border: '1px solid rgba(239,68,68,0.3)',
                                                borderRadius: 6,
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: 13
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : user?.email ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>
                                No alerts found for this email.
                            </p>
                        ) : null}
                    </div>
                )}
            </div>

            {/* How It Works */}
            <div style={{ 
                marginTop: 40, 
                padding: 32, 
                background: 'var(--bg-surface)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--green), var(--blue))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16
                    }}>
                        ❓
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>How It Works</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                    <div style={{ 
                        textAlign: 'center',
                        padding: 20,
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        transition: 'transform 0.2s ease'
                    }}>
                        <div style={{ 
                            fontSize: 36, 
                            marginBottom: 12,
                            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>1️⃣</div>
                        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16, color: 'var(--text-primary)' }}>Select GPU</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            Choose from 38 tracked GPUs across all major brands
                        </div>
                    </div>
                    <div style={{ 
                        textAlign: 'center',
                        padding: 20,
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        transition: 'transform 0.2s ease'
                    }}>
                        <div style={{ 
                            fontSize: 36, 
                            marginBottom: 12,
                            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>2️⃣</div>
                        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16, color: 'var(--text-primary)' }}>Set Target Price</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            We'll monitor and watch for price drops to your target
                        </div>
                    </div>
                    <div style={{ 
                        textAlign: 'center',
                        padding: 20,
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        transition: 'transform 0.2s ease'
                    }}>
                        <div style={{ 
                            fontSize: 36, 
                            marginBottom: 12,
                            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>3️⃣</div>
                        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16, color: 'var(--text-primary)' }}>Get Notified</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            Instant email notifications when your target price is hit
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ 
                marginTop: 24, 
                padding: 20, 
                background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(139,92,246,0.1))', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(139,92,246,0.3)',
                textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#a78bfa' }}>38</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>GPUs Tracked</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#a78bfa' }}>8</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Retailers</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#a78bfa' }}>24/7</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Monitoring</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
