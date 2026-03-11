"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ALL_GPUS, GPU } from '@/lib/gpu-data'

// Benchmark data
const BENCHMARKS: Record<string, { timeSpy: number; fps1080p: number; fps1440p: number }> = {
    'rtx-5090': { timeSpy: 38000, fps1080p: 280, fps1440p: 220 },
    'rtx-5080': { timeSpy: 34000, fps1080p: 250, fps1440p: 195 },
    'rtx-5070-ti': { timeSpy: 28000, fps1080p: 210, fps1440p: 165 },
    'rtx-5070': { timeSpy: 24000, fps1080p: 180, fps1440p: 140 },
    'rtx-4090': { timeSpy: 36000, fps1080p: 260, fps1440p: 200 },
    'rtx-4080-super': { timeSpy: 28000, fps1080p: 200, fps1440p: 155 },
    'rtx-4080': { timeSpy: 26500, fps1080p: 190, fps1440p: 148 },
    'rtx-4070-ti-super': { timeSpy: 25000, fps1080p: 175, fps1440p: 135 },
    'rtx-4070-ti': { timeSpy: 22000, fps1080p: 160, fps1440p: 125 },
    'rtx-4070-super': { timeSpy: 20000, fps1080p: 148, fps1440p: 115 },
    'rtx-4070': { timeSpy: 18500, fps1080p: 138, fps1440p: 108 },
    'rtx-4060-ti': { timeSpy: 13500, fps1080p: 110, fps1440p: 85 },
    'rtx-4060': { timeSpy: 10500, fps1080p: 90, fps1440p: 68 },
    'rx-9070-xt': { timeSpy: 26000, fps1080p: 195, fps1440p: 155 },
    'rx-9070': { timeSpy: 22000, fps1080p: 168, fps1440p: 132 },
    'rx-7900-xtx': { timeSpy: 25000, fps1080p: 185, fps1440p: 145 },
    'rx-7900-xt': { timeSpy: 22000, fps1080p: 165, fps1440p: 128 },
    'rx-7800-xt': { timeSpy: 17500, fps1080p: 135, fps1440p: 105 },
    'rx-7700-xt': { timeSpy: 15500, fps1080p: 118, fps1440p: 92 },
    'rx-7600': { timeSpy: 10500, fps1080p: 85, fps1440p: 65 },
    'rx-7600-xt': { timeSpy: 12500, fps1080p: 98, fps1440p: 75 },
}

// Get tier from GPU model
function getTier(model: string): 'entry' | 'mid' | 'high' {
    const m = model.toLowerCase();
    if (m.includes('4060') || m.includes('7600')) return 'entry';
    if (m.includes('4070') || m.includes('7700') || m.includes('7800')) return 'mid';
    return 'high';
}

// Get VRAM from model
function getVRAM(model: string): number {
    const m = model.toLowerCase();
    if (m.includes('5090') || m.includes('4090') || m.includes('7900')) return 24;
    if (m.includes('5080') || m.includes('4080') || m.includes('7800')) return 16;
    if (m.includes('5070') || m.includes('4070') || m.includes('7700')) return 12;
    return 8;
}

const TIER_COLORS = {
    entry: { bg: '#166534', text: '#22c55e' },
    mid: { bg: '#854d0e', text: '#eab308' },
    high: { bg: '#991b1b', text: '#f87171' },
};

const VRAM_OPTIONS = ['all', '8', '12', '16', '24'];
const TIER_OPTIONS = ['all', 'entry', 'mid', 'high'];

export default function GPUListingClient({ initialGPUs }: { initialGPUs: GPU[] }) {
    const [brand, setBrand] = useState<'all'|'nvidia'|'amd'>('all')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<'price-asc'|'price-desc'|'name'|'benchmark' | 'fps'>('name')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [vram, setVram] = useState<string>('all')
    const [tier, setTier] = useState<string>('all')
    const router = useRouter()

    const allGPUs = initialGPUs.filter(g => {
        const matchesBrand = brand === 'all' || g.brand === brand;
        const matchesSearch = !search || g.model.toLowerCase().includes(search.toLowerCase());
        const matchesStock = !inStockOnly || g.in_stock;
        const gpuVram = getVRAM(g.model);
        const matchesVRAM = vram === 'all' || gpuVram === parseInt(vram);
        const gpuTier = getTier(g.model);
        const matchesTier = tier === 'all' || gpuTier === tier;
        return matchesBrand && matchesSearch && matchesStock && matchesVRAM && matchesTier;
    }).sort((a, b) => {
        const aBench = BENCHMARKS[a.id] || { timeSpy: 0, fps1080p: 0, fps1440p: 0 };
        const bBench = BENCHMARKS[b.id] || { timeSpy: 0, fps1080p: 0, fps1440p: 0 };
        
        if (sort === 'price-asc') return a.current_price_usd - b.current_price_usd;
        if (sort === 'price-desc') return b.current_price_usd - a.current_price_usd;
        if (sort === 'benchmark') return bBench.timeSpy - aBench.timeSpy;
        if (sort === 'fps') return bBench.fps1440p - aBench.fps1440p;
        return a.model.localeCompare(b.model);
    })

    return (
        <div className="container" style={{ padding: '48px 24px' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, display: 'inline-block' }}>
                ← Back to home
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ marginBottom: 8 }}>All GPUs</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Browse {allGPUs.length} GPUs
                    </p>
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

                <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                        className={`btn ${sort === 'price-asc' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setSort('price-asc')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >$ Low</button>
                    <button 
                        className={`btn ${sort === 'price-desc' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setSort('price-desc')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >$ High</button>
                    <button 
                        className={`btn ${sort === 'benchmark' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setSort('benchmark')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >Benchmark</button>
                    <button 
                        className={`btn ${sort === 'name' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setSort('name')}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                    >A-Z</button>
                </div>

                <button 
                    className={`btn ${inStockOnly ? 'btn--primary' : 'btn--ghost'}`}
                    onClick={() => setInStockOnly(!inStockOnly)}
                    style={{ padding: '6px 14px', fontSize: 13, marginLeft: 16 }}
                >
                    {inStockOnly ? '✓ In Stock' : 'In Stock Only'}
                </button>
            </div>

            {/* VRAM Filter */}
            <div style={{ marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#888', marginRight: 8 }}>VRAM:</span>
                {VRAM_OPTIONS.map(v => (
                    <button
                        key={v}
                        onClick={() => setVram(v)}
                        style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 16,
                            border: 'none',
                            background: vram === v ? '#2563eb' : '#1a1a1a',
                            color: vram === v ? '#fff' : '#888',
                            cursor: 'pointer',
                        }}
                    >
                        {v === 'all' ? 'All' : v + 'GB'}
                    </button>
                ))}
            </div>

            {/* Tier Filter */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#888', marginRight: 8 }}>Tier:</span>
                {TIER_OPTIONS.map(t => (
                    <button
                        key={t}
                        onClick={() => setTier(t)}
                        style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 16,
                            border: 'none',
                            background: tier === t 
                                ? (t === 'entry' ? TIER_COLORS.entry.bg : t === 'mid' ? TIER_COLORS.mid.bg : TIER_COLORS.high.bg)
                                : '#1a1a1a',
                            color: tier === t 
                                ? (t === 'entry' ? TIER_COLORS.entry.text : t === 'mid' ? TIER_COLORS.mid.text : TIER_COLORS.high.text)
                                : '#888',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                        }}
                    >
                        {t === 'all' ? 'All' : t}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333' }}>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>GPU</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>Tier</th>
                            <th style={{ textAlign: 'left', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>VRAM</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>Price</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>Time Spy</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>1080p</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>1440p</th>
                            <th style={{ textAlign: 'right', padding: '12px 16px', color: '#888', fontSize: 12, fontWeight: 600 }}>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allGPUs.map(gpu => {
                            const bench = BENCHMARKS[gpu.id] || { timeSpy: 0, fps1080p: 0, fps1440p: 0 };
                            const gpuTier = getTier(gpu.model);
                            const gpuVram = getVRAM(gpu.model);
                            
                            return (
                                <tr key={gpu.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '16px' }}>
                                        <Link href={`/gpu/${gpu.id}`} style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                                            {gpu.model}
                                        </Link>
                                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{gpu.brand === 'nvidia' ? 'NVIDIA' : 'AMD'}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: 12,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: TIER_COLORS[gpuTier].bg,
                                            color: TIER_COLORS[gpuTier].text,
                                            textTransform: 'capitalize',
                                        }}>
                                            {gpuTier}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#ccc', fontFamily: 'monospace' }}>{gpuVram}GB</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#22c55e' }}>${gpu.current_price_usd}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', color: '#ccc' }}>{bench.timeSpy ? bench.timeSpy.toLocaleString() : 'N/A'}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', color: '#ccc' }}>{bench.fps1080p ? bench.fps1080p + ' fps' : 'N/A'}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', color: '#ccc' }}>{bench.fps1440p ? bench.fps1440p + ' fps' : 'N/A'}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        {gpu.in_stock ? (
                                            <span style={{ color: '#22c55e', fontSize: 12 }}>✓ In Stock</span>
                                        ) : (
                                            <span style={{ color: '#ef4444', fontSize: 12 }}>Out of Stock</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {allGPUs.length === 0 && (
                <div style={{ textAlign: 'center', padding: 48, color: '#666' }}>
                    No GPUs match your filters. Try adjusting your search or filters.
                </div>
            )}
        </div>
    )
}
