"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type RetailerData = {
  name: string
  url: string
  price: number
  inStock: boolean | null
  verified: boolean
}

export type GPUWithRetailers = {
  id: string
  slug: string
  model: string
  brand: 'nvidia' | 'amd'
  architecture: string
  generation: string
  vram_gb: number
  tdp_watts: number
  msrp_usd: number
  current_price_usd: number
  in_stock: boolean
  price_change_percent: number
  release_date: string
  active: boolean
  retailers: Record<string, RetailerData>
  stockStatus: 'in_stock' | 'out_of_stock' | 'unknown'
  stockVerified: boolean
}

type BrandFilterGPUsProps = {
  initialGPUs: GPUWithRetailers[]
}

export default function BrandFilterGPUs({ initialGPUs }: BrandFilterGPUsProps) {
    const [brand, setBrand] = useState<'all'|'nvidia'|'amd'>('all');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'default'|'deals'|'price-low'|'price-high'>('default');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const filtered = initialGPUs.filter(g => {
        const matchesBrand = brand === 'all' || g.brand === brand;
        const matchesSearch = !search || g.model.toLowerCase().includes(search.toLowerCase());
        return matchesBrand && matchesSearch;
    });

    // Sort by deals (highest savings first), then price, then name
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'deals') {
            // Sort by price_change_percent (most negative = best deal)
            return a.price_change_percent - b.price_change_percent;
        } else if (sortBy === 'price-low') {
            return a.current_price_usd - b.current_price_usd;
        } else if (sortBy === 'price-high') {
            return b.current_price_usd - a.current_price_usd;
        }
        // Default: by price_change_percent (deals first)
        return a.price_change_percent - b.price_change_percent;
    });

    const handleBrandChange = (newBrand: 'all'|'nvidia'|'amd') => {
        setBrand(newBrand);
        setMobileMenuOpen(false);
    };

    return (
        <section className="container" style={{ padding: '48px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ marginBottom: 8 }}>Popular GPUs</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Live prices for the most tracked cards</p>
                </div>
                
                <input
                    type="text"
                    placeholder="Search GPUs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '8px 16px',
                        fontSize: 14,
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: 8,
                        color: '#fff',
                        outline: 'none',
                        marginRight: 16,
                    }}
                />
                
                {/* Desktop: Button row */}
                <div style={{ display: 'flex', gap: 6 }} className="desktop-filters">
                    <button 
                        className={`btn ${brand === 'all' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setBrand('all')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >All</button>
                    <button 
                        className={`btn ${brand === 'nvidia' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setBrand('nvidia')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >NVIDIA</button>
                    <button 
                        className={`btn ${brand === 'amd' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setBrand('amd')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >AMD</button>
                </div>

                {/* Mobile: Dropdown */}
                <div style={{ display: 'none' }} className="mobile-filters">
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="btn btn--ghost"
                            style={{ 
                                padding: '6px 14px', 
                                fontSize: 13,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            Brand: {brand === 'all' ? 'All' : brand.toUpperCase()}
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ 
                                transform: mobileMenuOpen ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s'
                            }}>
                                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        
                        {mobileMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: 4,
                                background: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: 8,
                                padding: '4px',
                                minWidth: 120,
                                zIndex: 100,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                            }}>
                                <button 
                                    onClick={() => handleBrandChange('all')}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        background: brand === 'all' ? '#00ff88' : 'transparent',
                                        color: brand === 'all' ? '#000' : '#fff',
                                        border: 'none',
                                        borderRadius: 4,
                                        fontSize: 13,
                                        cursor: 'pointer'
                                    }}
                                >All</button>
                                <button 
                                    onClick={() => handleBrandChange('nvidia')}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        background: brand === 'nvidia' ? '#76b900' : 'transparent',
                                        color: brand === 'nvidia' ? '#000' : '#fff',
                                        border: 'none',
                                        borderRadius: 4,
                                        fontSize: 13,
                                        cursor: 'pointer'
                                    }}
                                >NVIDIA</button>
                                <button 
                                    onClick={() => handleBrandChange('amd')}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        background: brand === 'amd' ? '#ed1c24' : 'transparent',
                                        color: brand === 'amd' ? '#fff' : '#fff',
                                        border: 'none',
                                        borderRadius: 4,
                                        fontSize: 13,
                                        cursor: 'pointer'
                                    }}
                                >AMD</button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{
                            padding: '6px 12px',
                            fontSize: 13,
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: 6,
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="default">Sort: Best Deals</option>
                        <option value="deals">Best Deals</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>GPU</th>
                                <th>MSRP</th>
                                <th>Current Price</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.slice(0, 10).map(gpu => {
                                const isDeal = gpu.price_change_percent < 0;
                                const isSurge = gpu.price_change_percent > 0;
                                
                                return (
                                    <tr 
                                        key={gpu.id} 
                                        onClick={() => router.push(`/gpu/${gpu.slug}`)}
                                        style={{ cursor: 'pointer' }}
                                        className="hover-row"
                                    >
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{gpu.model}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{gpu.brand.toUpperCase()}</div>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                                            ${gpu.msrp_usd}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>
                                            ${gpu.current_price_usd}
                                            {gpu.price_change_percent !== 0 && (
                                                <span style={{ 
                                                    marginLeft: 8, 
                                                    fontSize: 12,
                                                    color: isDeal ? 'var(--green)' : 'var(--red)'
                                                }}>
                                                    {isDeal ? '↓' : '↑'} {Math.abs(gpu.price_change_percent)}%
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${isDeal ? 'badge--green' : isSurge ? 'badge--red' : 'badge--gray'}`}>
                                                {isDeal ? 'Deal' : isSurge ? 'Surge' : 'Retail'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/gpu/${gpu.slug}`} className="btn btn--ghost" style={{ fontSize: 12 }} tabIndex={-1}>
                                                View →
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Link href="/gpu" className="btn btn--ghost">
                    View all {initialGPUs.length} GPUs →
                </Link>
            </div>

            {/* Mobile responsive styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-filters {
                        display: none !important;
                    }
                    .mobile-filters {
                        display: block !important;
                    }
                }
                @media (min-width: 769px) {
                    .desktop-filters {
                        display: flex !important;
                    }
                    .mobile-filters {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
