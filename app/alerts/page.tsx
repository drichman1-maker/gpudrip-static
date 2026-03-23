import type { Metadata } from 'next'
import AlertsClient from './AlertsClient'

export const metadata: Metadata = {
    title: 'Price Alerts — GPU Drip',
    description: 'Set up price alerts for your favorite GPUs. Get notified when prices drop.',
}

export const dynamic = 'force-static'

export default function AlertsPage() {
    return <AlertsClient />
}
