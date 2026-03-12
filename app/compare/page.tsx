'use client'

import { Suspense } from 'react'
import CompareContent from './CompareContent'

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-400">Loading comparison...</div>
        </div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}
