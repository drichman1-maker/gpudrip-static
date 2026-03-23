import type { Metadata } from 'next'
import { fetchGPUs } from '@/lib/api'
import GPUListingClient from './gpu-listing-client'

export const metadata: Metadata = {
    title: 'All GPUs — Price Tracker',
    description: 'Browse all GPUs with specs, MSRPs, and retailer links. RTX 5090, RTX 5080, RX 9070 XT and more.',
}

// Static export for Vercel
export const dynamic = 'force-static'

export default async function GPUListingPage() {
    const gpus = await fetchGPUs()
    const activeGPUs = gpus.filter(g => g.active)
    return <GPUListingClient initialGPUs={activeGPUs as any} />
}
