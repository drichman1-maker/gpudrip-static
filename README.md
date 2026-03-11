# GPU Drip Static

Static version of GPU Drip with 22 GPUs hardcoded. No database required.

## Features

- ✅ 22 GPUs (NVIDIA RTX 5000/4000 series + AMD RX 9000/7000 series)
- ✅ Individual GPU detail pages
- ✅ Price alert landing page (coming soon)
- ✅ Fully static - no server required
- ✅ Optimized for Vercel deployment

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` folder.

## Deploy to Vercel

1. Push to GitHub repo
2. Import project in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

Or deploy directly:

```bash
vercel --prod
```

## Structure

- `/` - Homepage with all GPUs table
- `/gpu` - GPU listing page
- `/gpu/[slug]` - Individual GPU detail pages (22 pages)
- `/alerts` - Price alerts landing page

## GPU List

### NVIDIA Blackwell (RTX 5000)
- RTX 5090, 5080, 5070 Ti, 5070, 5060 Ti, 5060

### NVIDIA Ada Lovelace (RTX 4000)
- RTX 4090, 4080 Super, 4080, 4070 Ti Super, 4070 Ti, 4070 Super, 4070, 4060 Ti, 4060

### AMD RDNA 4 (RX 9000)
- RX 9070 XT, 9070, 9060 XT

### AMD RDNA 3 (RX 7000)
- RX 7900 XTX, 7900 XT, 7800 XT, 7700 XT, 7600
