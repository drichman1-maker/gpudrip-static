import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to price data (workspace root)
const PRICE_DATA_DIR = path.join(process.cwd(), '..', 'data', 'prices')

export async function GET() {
  try {
    const projects = ['gpu-drip', 'mactrackr', 'babygear', 'health-index']
    const prices: Record<string, any[]> = {}
    
    for (const project of projects) {
      const filePath = path.join(PRICE_DATA_DIR, `${project}.jsonl`)
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.trim().split('\n').filter(Boolean)
        
        // Get last entry for each product
        const latest: Record<string, any> = {}
        for (const line of lines) {
          try {
            const entry = JSON.parse(line)
            latest[entry.name] = entry
          } catch {}
        }
        
        prices[project] = Object.values(latest)
      } else {
        prices[project] = []
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      prices
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
