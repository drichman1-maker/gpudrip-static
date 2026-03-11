import type { Metadata } from 'next'
import { ALL_GPUS } from '@/lib/gpu-data'
import GPUListingClient from './gpu-listing-client'

export const metadata: Metadata = {
    title: 'All GPUs — Price Tracker',
    description: 'Browse all 22 GPUs with specs, MSRPs, and retailer links. RTX 5090, RTX 5080, RX 9070 XT and more.',
}

export const dynamic = 'force-static'

export default function GPUListingPage() {
    return <GPUListingClient initialGPUs={ALL_GPUS} />
}