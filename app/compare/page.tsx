import { Metadata } from 'next'
import CompareClient from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare GPUs | GPU Drip',
  description: 'Compare GPU prices, specs, and performance side-by-side. Find the best graphics card for your needs.',
}

export default function ComparePage() {
  return <CompareClient />
}
