'use client'

import { useState } from 'react'
import Link from 'next/link'

export const dynamic = 'force-static'

const posts = [
    {
        id: "gpu-lifespan-guide",
        title: "How Long Do GPUs Actually Last? A Complete Guide",
        excerpt: "The realistic lifespan of graphics cards — and exactly how to maximize yours.",
        date: "March 6, 2026",
        readTime: "8 min read"
    },
    {
        id: "rtx-5070-ti-deep-dive",
        title: "RTX 5070 Ti Deep Dive: Is This the Sweet Spot GPU of 2026?",
        excerpt: "With prices from $749 to $999, the RTX 5070 Ti promises sweet spot performance — but has important asterisks.",
        date: "March 6, 2026",
        readTime: "10 min read"
    },
    {
        id: "future-of-gpus-2027-and-beyond",
        title: "The Future of GPUs: What's Coming in 2027 and Beyond",
        excerpt: "From NVIDIA's exaflop Rubin Ultra to AMD's unified chiplet strategy — the GPU roadmap that will define the next decade.",
        date: "March 6, 2026",
        readTime: "12 min read"
    },
    {
        id: "rtx-5080-review",
        title: "RTX 5080 Review: The Sweet Spot GPU?",
        excerpt: "At $999, the RTX 5080 delivers 1440p gaming excellence with DLSS 4. But is it the best value in the RTX 50 series?",
        date: "March 6, 2026",
        readTime: "9 min read"
    },
    {
        id: "rtx-50-series-buyers-guide",
        title: "RTX 50-Series Buyer's Guide: Which GPU to Buy in 2026",
        excerpt: "Breaking down the RTX 5090, 5080, 5070 Ti, and 5070 — performance, pricing, and availability.",
        date: "March 20, 2026",
        readTime: "10 min read"
    },
    {
        id: "rx-9070-xt-review",
        title: "AMD RX 9070 XT Review: The Value King of 2026",
        excerpt: "At $599, this card outperforms cards costing hundreds more. The definitive review.",
        date: "March 19, 2026",
        readTime: "10 min read"
    },
    {
        id: "gpu-cooling-guide-2026",
        title: "GPU Cooling in 2026: What Actually Matters",
        excerpt: "Best coolers, AIB models, and thermal performance explained.",
        date: "March 18, 2026",
        readTime: "8 min read"
    },
    {
        id: "best-gpu-1440p-gaming-2026",
        title: "Best GPU for 1440p Gaming in 2026",
        excerpt: "Every budget covered. From budget builds to high-end flagships.",
        date: "March 18, 2026",
        readTime: "8 min read"
    },
    {
        id: "best-budget-gpu-2026",
        title: "Best Budget GPU 2026: Under $500",
        excerpt: "You don't need to spend $1,000 to get great gaming performance.",
        date: "March 17, 2026",
        readTime: "8 min read"
    },
    {
        id: "best-gpu-video-editing-2026",
        title: "Best GPU for Video Editing in 2026",
        excerpt: "From 4K timeline scrubbing to exports, we rank the best GPUs for Premiere Pro, DaVinci Resolve.",
        date: "March 10, 2026",
        readTime: "7 min read"
    },
    {
        id: "gpu-power-supply-guide",
        title: "GPU Power Supply Guide: What Wattage Do You Need?",
        excerpt: "Don't blow up your PC. We break down PSU requirements for every GPU.",
        date: "March 5, 2026",
        readTime: "6 min read"
    },
    {
        id: "best-gpu-4k-gaming-2026",
        title: "Best GPU for 4K Gaming 2026",
        excerpt: "Ultra settings at 3840×2160 require serious firepower. These are the only GPUs that can handle it.",
        date: "March 1, 2026",
        readTime: "9 min read"
    },
    {
        id: "rtx-5070-ti-vs-rx-9070-xt",
        title: "RX 9070 XT vs RTX 5070 Ti: Head-to-Head",
        excerpt: "Which mid-range GPU offers the best value? We break down the numbers.",
        date: "February 25, 2026",
        readTime: "6 min read"
    },

    {
        id: "gpu-shortage-explained",
        title: "Why Are RTX 5090 & 5080 Still Out of Stock?",
        excerpt: "Supply chain issues, scalpers, and demand — what's really causing the GPU shortage.",
        date: "February 15, 2026",
        readTime: "5 min read"
    },
    {
        id: "amd-vs-nvidia-2026",
        title: "AMD vs NVIDIA 2026: Which GPU Is Right for You?",
        excerpt: "Head-to-head comparison. Which ecosystem wins in 2026?",
        date: "February 10, 2026",
        readTime: "6 min read"
    },
]

export default function BlogPage() {
    const [search, setSearch] = useState('')
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
            <div style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Link href="/" style={{ color: '#888', fontSize: 14, marginBottom: 32, display: 'inline-block', textDecoration: 'none' }}>
                    ← Back to home
                </Link>

                <h1 style={{ 
                    fontSize: 'clamp(2rem, 5vw, 3rem)', 
                    fontWeight: 800, 
                    marginBottom: 12,
                    color: '#fff'
                }}>
                    Blog
                </h1>
                <p style={{ color: '#888', fontSize: 18, marginBottom: 24, maxWidth: 600 }}>
                    GPU buying guides, price tracking tips, and market insights.
                </p>
                
                <div style={{ marginBottom: 48 }}>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            maxWidth: 400,
                            padding: '14px 20px',
                            fontSize: 16,
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: 12,
                            color: '#fff',
                            outline: 'none',
                        }}
                    />
                    {search && (
                        <p style={{ color: '#888', marginTop: 12, fontSize: 14 }}>
                            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: 24 
                }}>
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            style={{
                                display: 'block',
                                background: '#141414',
                                border: '1px solid #2a2a2a',
                                borderRadius: 12,
                                padding: 24,
                                transition: 'all 0.2s',
                                textDecoration: 'none',
                            }}
                        >
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 8, 
                                fontSize: 12, 
                                color: '#888',
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <h2 style={{ 
                                fontSize: 18, 
                                fontWeight: 700, 
                                marginBottom: 12,
                                lineHeight: 1.4,
                                color: '#fff'
                            }}>
                                {post.title}
                            </h2>
                            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>
                                {post.excerpt}
                            </p>
                            <div style={{ 
                                marginTop: 16, 
                                color: '#22c55e', 
                                fontSize: 14,
                                fontWeight: 600
                            }}>
                                Read more →
                            </div>
                        </Link>
                    ))}
                </div>
                
                {filteredPosts.length === 0 && (
                    <p style={{ color: '#888', textAlign: 'center', padding: 48, fontSize: 16 }}>
                        No articles found matching "{search}"
                    </p>
                )}
            </div>
        </div>
    )
}
