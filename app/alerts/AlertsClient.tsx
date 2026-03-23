'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import GPUSelector from './GPUSelector'

const BACKEND_URL = 'https://gpudrip-backend.fly.dev'

// Fallback GPU data in case API fails
const FALLBACK_GPUS: GPU[] = [
    {
        id: 'rtx-5090',
        model: 'NVIDIA RTX 5090',
        current_price_usd: 1999,
        msrp_usd: 1999,
        brand: 'nvidia',
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
    const [gpus, setGpus] = useState<GPU[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedGpu, setSelectedGpu] = useState('')
    const [targetPrice, setTargetPrice] = useState('')
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [userAlerts, setUserAlerts] = useState<Alert[]>([])
    const [showManage, setShowManage] = useState(false)
    const [manageEmail, setManageEmail] = useState('')

    // Fetch GPUs on mount
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/gpus`)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then(data => {
                setGpus(data.gpus || [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load GPUs, using fallback data:', err)
                // Use fallback data if API fails
                setGpus(FALLBACK_GPUS)
                setLoading(false)
            })
    }, [])

    // Update target price when GPU selected
    useEffect(() => {
        if (selectedGpu) {
            const gpu = gpus.find(g => g.id === selectedGpu)
            if (gpu) {
                // Suggest 10% below current price
                const suggested = Math.floor(gpu.current_price_usd * 0.9)
                setTargetPrice(suggested.toString())
            }
        }
    }, [selectedGpu, gpus])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedGpu || !targetPrice || !email) return

        setSubmitting(true)
        setMessage(null)

        const gpu = gpus.find(g => g.id === selectedGpu)
        if (!gpu) return

        try {
            const response = await fetch(`${BACKEND_URL}/api/alerts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    gpu_id: selectedGpu,
                    gpu_name: gpu.model,
                    target_price: parseInt(targetPrice),
                }),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: `Alert set for ${gpu.model} at $${targetPrice}! Check your email to confirm.` })
                setSelectedGpu('')
                setTargetPrice('')
            } else {
                const err = await response.json()
                setMessage({ type: 'error', text: err.error || 'Failed to create alert' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setSubmitting(false)
        }
    }

    const fetchUserAlerts = async () => {
        if (!manageEmail) return
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/alerts?email=${encodeURIComponent(manageEmail)}`)
            if (response.ok) {
                const data = await response.json()
                setUserAlerts(data.alerts || [])
            }
        } catch (err) {
            console.error('Failed to fetch alerts:', err)
        }
    }

    const deleteAlert = async (alertId: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/alerts/${alertId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: manageEmail }),
            })

            if (response.ok) {
                setUserAlerts(userAlerts.filter(a => a.id !== alertId))
            }
        } catch (err) {
            console.error('Failed to delete alert:', err)
        }
    }

    const selectedGpuData = gpus.find(g => g.id === selectedGpu)

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

            {/* Create Alert Form */}
            <div className="card" style={{ 
                padding: 40, 
                marginBottom: 32, 
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.3s ease'
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
                            selectedGpu={selectedGpu}
                            onSelect={setSelectedGpu}
                            loading={loading}
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

                    {/* Email */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', marginBottom: 10, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 44px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-elevated)',
                                    color: 'var(--text-primary)',
                                    fontSize: 15,
                                    outline: 'none',
                                    transition: 'border-color 0.15s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                required
                            />
                            <div style={{
                                position: 'absolute',
                                left: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: 16,
                                color: 'var(--text-muted)'
                            }}>
                                📧
                            </div>
                        </div>
                        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                            You'll receive a confirmation email before alerts start.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting || !selectedGpu || !targetPrice || !email}
                        style={{
                            width: '100%',
                            padding: '16px 24px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: submitting || !selectedGpu || !targetPrice || !email 
                                ? 'var(--bg-hover)' 
                                : 'linear-gradient(135deg, var(--blue), var(--purple))',
                            color: submitting || !selectedGpu || !targetPrice || !email 
                                ? 'var(--text-muted)' 
                                : '#fff',
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: submitting || !selectedGpu || !targetPrice || !email ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s',
                            transform: submitting ? 'scale(0.98)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                            if (!submitting && selectedGpu && targetPrice && email) {
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
                                Creating Alert...
                            </span>
                        ) : (
                            <>🎯 Create Price Alert</>
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
                        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                            <input
                                type="email"
                                value={manageEmail}
                                onChange={(e) => setManageEmail(e.target.value)}
                                placeholder="Enter your email"
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: 8,
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)'
                                }}
                            />
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
                                🔍 Load Alerts
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
                        ) : manageEmail ? (
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
