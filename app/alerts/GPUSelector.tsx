'use client'

import { useState, useRef, useEffect } from 'react'

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

interface GPUSelectorProps {
    gpus: GPU[]
    selectedGpu: string
    onSelect: (gpuId: string) => void
    loading?: boolean
}

const getBrandIcon = (brand: string) => {
    switch (brand) {
        case 'nvidia': return '🟢'
        case 'amd': return '🔴'
        case 'intel': return '🔵'
        default: return '⚪'
    }
}

const getBrandColor = (brand: string) => {
    switch (brand) {
        case 'nvidia': return '#76B900'
        case 'amd': return '#ED1C24'
        case 'intel': return '#0071c5'
        default: return 'var(--text-secondary)'
    }
}

const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'var(--red)'
    if (change < 0) return 'var(--green)'
    return 'var(--text-secondary)'
}

export default function GPUSelector({ gpus, selectedGpu, onSelect, loading }: GPUSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const selectedGpuData = gpus.find(g => g.id === selectedGpu)
    
    const filteredGPUs = gpus.filter(gpu => 
        gpu.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gpu.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gpu.generation.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort by brand (NVIDIA, AMD, Intel) and then by price descending
    const sortedGPUs = filteredGPUs.sort((a, b) => {
        // First by brand preference
        const brandOrder = { nvidia: 0, amd: 1, intel: 2 }
        const brandDiff = brandOrder[a.brand] - brandOrder[b.brand]
        if (brandDiff !== 0) return brandDiff
        
        // Then by price descending (highest first)
        return b.current_price_usd - a.current_price_usd
    })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleOpen = () => {
        setIsOpen(true)
        setTimeout(() => searchRef.current?.focus(), 100)
    }

    const handleSelect = (gpu: GPU) => {
        onSelect(gpu.id)
        setIsOpen(false)
        setSearchQuery('')
    }

    return (
        <div className="gpu-selector" ref={dropdownRef}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                Select GPU
            </label>
            
            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleOpen}
                style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${isOpen ? 'var(--border-focus)' : 'var(--border)'}`,
                    background: isOpen ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: 15,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                }}
                disabled={loading}
            >
                <div style={{ flex: 1 }}>
                    {selectedGpuData ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 16 }}>
                                {getBrandIcon(selectedGpuData.brand)}
                            </span>
                            <div>
                                <div style={{ fontWeight: 500, marginBottom: 2 }}>
                                    {selectedGpuData.model}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                    ${selectedGpuData.current_price_usd} · {selectedGpuData.vram_gb}GB · {selectedGpuData.generation}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>
                            Choose a GPU...
                        </span>
                    )}
                </div>
                <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s'
                }}>
                    ▼
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    maxHeight: 400,
                    overflow: 'hidden'
                }}>
                    {/* Search Input */}
                    <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search GPUs..."
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                fontSize: 14
                            }}
                        />
                    </div>

                    {/* GPU List */}
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {sortedGPUs.length > 0 ? (
                            sortedGPUs.map(gpu => (
                                <button
                                    key={gpu.id}
                                    type="button"
                                    onClick={() => handleSelect(gpu)}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        border: 'none',
                                        background: gpu.id === selectedGpu ? 'var(--bg-hover)' : 'transparent',
                                        color: 'var(--text-primary)',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        transition: 'background 0.1s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (gpu.id !== selectedGpu) {
                                            e.currentTarget.style.background = 'var(--bg-overlay)'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (gpu.id !== selectedGpu) {
                                            e.currentTarget.style.background = 'transparent'
                                        }
                                    }}
                                >
                                    <div style={{ 
                                        fontSize: 20, 
                                        color: getBrandColor(gpu.brand),
                                        minWidth: 24 
                                    }}>
                                        {getBrandIcon(gpu.brand)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontWeight: 500 }}>
                                                {gpu.model}
                                            </span>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 4,
                                                fontSize: 11,
                                                color: 'var(--text-muted)'
                                            }}>
                                                <span>{gpu.vram_gb}GB</span>
                                                <span>•</span>
                                                <span>{gpu.generation}</span>
                                                {!gpu.in_stock && (
                                                    <>
                                                        <span>•</span>
                                                        <span style={{ color: 'var(--red)' }}>Out of Stock</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 8,
                                            fontSize: 13,
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                                ${gpu.current_price_usd}
                                            </span>
                                            <span>MSRP: ${gpu.msrp_usd}</span>
                                            {gpu.price_change_percent !== 0 && (
                                                <span style={{ 
                                                    color: getPriceChangeColor(gpu.price_change_percent),
                                                    fontWeight: 500 
                                                }}>
                                                    {gpu.price_change_percent > 0 ? '+' : ''}{gpu.price_change_percent}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div style={{
                                padding: 20,
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                fontSize: 14
                            }}>
                                No GPUs found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .gpu-selector {
                    position: relative;
                }
            `}</style>
        </div>
    )
}