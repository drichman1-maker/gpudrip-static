import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080808',
          borderRadius: 6,
          border: '2px solid #3b82f6',
        }}
      >
        <span style={{ color: '#3b82f6', fontSize: 18, fontWeight: 700 }}>G</span>
      </div>
    ),
    { ...size }
  )
}