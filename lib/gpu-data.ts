// Retailer price info
export type RetailerPrice = {
  price: number
  in_stock: boolean
  url: string
  verified?: boolean
}

export type GPURetailerPrices = {
  amazon?: RetailerPrice
  bestbuy?: RetailerPrice
  newegg?: RetailerPrice
  bh_photo?: RetailerPrice
  micro_center?: RetailerPrice
}

// Static GPU data - 22 GPUs
export type GPU = {
  id: string
  slug: string
  model: string
  brand: 'nvidia' | 'amd' | 'intel'
  architecture: string
  generation: string
  vram_gb: number
  tdp_watts: number
  msrp_usd: number
  current_price_usd: number
  in_stock?: boolean
  price_change_percent: number
  release_date: string
  active: boolean
  retailer_prices?: GPURetailerPrices
}

export const ALL_GPUS: GPU[] = [
  // NVIDIA Blackwell (RTX 5000)
  {
    id: 'rtx-5090', slug: 'rtx-5090', model: 'RTX 5090', brand: 'nvidia', architecture: 'Blackwell', generation: 'RTX 5000',
    vram_gb: 32, tdp_watts: 575, msrp_usd: 1999, current_price_usd: 2399, in_stock: false, price_change_percent: 20, release_date: '2025-01-30', active: true,
    retailer_prices: {
      amazon: { price: 2499, in_stock: false, url: 'https://www.amazon.com/s?k=RTX+5090&ref=nb_sb_noss', verified: true },
      bestbuy: { price: 2399, in_stock: false, url: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5090', verified: true },
      newegg: { price: 2399, in_stock: false, url: 'https://www.newegg.com/p/pl?d=rtx+5090', verified: true },
    }
  },
  {
    id: 'rtx-5080', slug: 'rtx-5080', model: 'RTX 5080', brand: 'nvidia', architecture: 'Blackwell', generation: 'RTX 5000',
    vram_gb: 16, tdp_watts: 360, msrp_usd: 999, current_price_usd: 1199, in_stock: false, price_change_percent: 20, release_date: '2025-01-30', active: true,
    retailer_prices: {
      amazon: { price: 1199, in_stock: false, url: 'https://www.amazon.com/s?k=RTX+5080&ref=nb_sb_noss', verified: true },
      bestbuy: { price: 1199, in_stock: false, url: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5080', verified: true },
      newegg: { price: 1199, in_stock: false, url: 'https://www.newegg.com/p/pl?d=rtx+5080', verified: true },
    }
  },
  { id: 'rtx-5070-ti', slug: 'rtx-5070-ti', model: 'RTX 5070 Ti', brand: 'nvidia', architecture: 'Blackwell', generation: 'RTX 5000', vram_gb: 16, tdp_watts: 300, msrp_usd: 749, current_price_usd: 849, in_stock: false, price_change_percent: 13, release_date: '2025-02-20', active: true },
  {
    id: 'rtx-5070', slug: 'rtx-5070', model: 'RTX 5070', brand: 'nvidia', architecture: 'Blackwell', generation: 'RTX 5000',
    vram_gb: 12, tdp_watts: 250, msrp_usd: 549, current_price_usd: 629, in_stock: true, price_change_percent: 15, release_date: '2025-03-05', active: true,
    retailer_prices: {
      amazon: { price: 629, in_stock: true, url: 'https://www.amazon.com/s?k=RTX+5070&ref=nb_sb_noss', verified: true },
      bestbuy: { price: 629, in_stock: true, url: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5070', verified: true },
      newegg: { price: 629, in_stock: true, url: 'https://www.newegg.com/p/pl?d=rtx+5070', verified: true },
    }
  },
  { id: 'rtx-5060-ti', slug: 'rtx-5060-ti', model: 'RTX 5060 Ti', brand: 'nvidia', architecture: 'Blackwell', generation: 'RTX 5000', vram_gb: 16, tdp_watts: 180, msrp_usd: 429, current_price_usd: 459, in_stock: true, price_change_percent: 7, release_date: '2025-03-20', active: true },
  { id: 'rtx-5060', slug: 'rtx-5060', model: 'RTX 5060', brand: 'nvidia', architecture: 'Blackwell', generation: 'RTX 5000', vram_gb: 8, tdp_watts: 150, msrp_usd: 299, current_price_usd: 329, in_stock: true, price_change_percent: 10, release_date: '2025-04-15', active: true },
  // NVIDIA Ada Lovelace (RTX 4000)
  { id: 'rtx-4090', slug: 'rtx-4090', model: 'RTX 4090', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 24, tdp_watts: 450, msrp_usd: 1599, current_price_usd: 1799, in_stock: false, price_change_percent: 13, release_date: '2022-10-12', active: true },
  { id: 'rtx-4080-super', slug: 'rtx-4080-super', model: 'RTX 4080 Super', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 16, tdp_watts: 320, msrp_usd: 999, current_price_usd: 1049, in_stock: true, price_change_percent: 5, release_date: '2024-01-31', active: true },
  { id: 'rtx-4080', slug: 'rtx-4080', model: 'RTX 4080', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 16, tdp_watts: 320, msrp_usd: 1199, current_price_usd: 999, in_stock: true, price_change_percent: -17, release_date: '2022-11-16', active: true },
  { id: 'rtx-4070-ti-super', slug: 'rtx-4070-ti-super', model: 'RTX 4070 Ti Super', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 16, tdp_watts: 285, msrp_usd: 799, current_price_usd: 849, in_stock: true, price_change_percent: 6, release_date: '2024-01-24', active: true },
  { id: 'rtx-4070-ti', slug: 'rtx-4070-ti', model: 'RTX 4070 Ti', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 12, tdp_watts: 285, msrp_usd: 799, current_price_usd: 699, in_stock: true, price_change_percent: -13, release_date: '2023-01-05', active: true },
  { id: 'rtx-4070-super', slug: 'rtx-4070-super', model: 'RTX 4070 Super', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 12, tdp_watts: 220, msrp_usd: 599, current_price_usd: 629, in_stock: true, price_change_percent: 5, release_date: '2024-01-17', active: true },
  { id: 'rtx-4070', slug: 'rtx-4070', model: 'RTX 4070', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 12, tdp_watts: 200, msrp_usd: 599, current_price_usd: 549, in_stock: true, price_change_percent: -8, release_date: '2023-04-13', active: true },
  { id: 'rtx-4060-ti', slug: 'rtx-4060-ti', model: 'RTX 4060 Ti', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 8, tdp_watts: 160, msrp_usd: 399, current_price_usd: 379, in_stock: true, price_change_percent: -5, release_date: '2023-05-24', active: true },
  { id: 'rtx-4060', slug: 'rtx-4060', model: 'RTX 4060', brand: 'nvidia', architecture: 'Ada Lovelace', generation: 'RTX 4000', vram_gb: 8, tdp_watts: 115, msrp_usd: 299, current_price_usd: 289, in_stock: true, price_change_percent: -3, release_date: '2023-06-29', active: true },
  // AMD RDNA 4 (RX 9000)
  {
    id: 'rx-9070-xt', slug: 'rx-9070-xt', model: 'RX 9070 XT', brand: 'amd', architecture: 'RDNA 4', generation: 'RX 9000',
    vram_gb: 16, tdp_watts: 304, msrp_usd: 599, current_price_usd: 649, in_stock: false, price_change_percent: 8, release_date: '2025-03-19', active: true,
    retailer_prices: {
      amazon: { price: 649, in_stock: false, url: 'https://www.amazon.com/s?k=RX+9070+XT&ref=nb_sb_noss', verified: true },
      bestbuy: { price: 649, in_stock: false, url: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+9070+xt', verified: true },
      newegg: { price: 649, in_stock: false, url: 'https://www.newegg.com/p/pl?d=rx+9070+xt', verified: true },
    }
  },
  {
    id: 'rx-9070', slug: 'rx-9070', model: 'RX 9070', brand: 'amd', architecture: 'RDNA 4', generation: 'RX 9000',
    vram_gb: 16, tdp_watts: 220, msrp_usd: 549, current_price_usd: 579, in_stock: true, price_change_percent: 5, release_date: '2025-03-19', active: true,
    retailer_prices: {
      amazon: { price: 579, in_stock: true, url: 'https://www.amazon.com/s?k=RX+9070&ref=nb_sb_noss', verified: true },
      bestbuy: { price: 579, in_stock: true, url: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+9070', verified: true },
      newegg: { price: 579, in_stock: true, url: 'https://www.newegg.com/p/pl?d=rx+9070', verified: true },
    }
  },
  { id: 'rx-9060-xt', slug: 'rx-9060-xt', model: 'RX 9060 XT', brand: 'amd', architecture: 'RDNA 4', generation: 'RX 9000', vram_gb: 16, tdp_watts: 150, msrp_usd: 299, current_price_usd: 329, in_stock: true, price_change_percent: 10, release_date: '2025-06-05', active: true },
  // AMD RDNA 3 (RX 7000)
  { id: 'rx-7900-xtx', slug: 'rx-7900-xtx', model: 'RX 7900 XTX', brand: 'amd', architecture: 'RDNA 3', generation: 'RX 7000', vram_gb: 24, tdp_watts: 355, msrp_usd: 999, current_price_usd: 899, in_stock: true, price_change_percent: -10, release_date: '2022-12-13', active: true },
  { id: 'rx-7900-xt', slug: 'rx-7900-xt', model: 'RX 7900 XT', brand: 'amd', architecture: 'RDNA 3', generation: 'RX 7000', vram_gb: 20, tdp_watts: 300, msrp_usd: 899, current_price_usd: 749, in_stock: true, price_change_percent: -17, release_date: '2022-12-13', active: true },
  { id: 'rx-7800-xt', slug: 'rx-7800-xt', model: 'RX 7800 XT', brand: 'amd', architecture: 'RDNA 3', generation: 'RX 7000', vram_gb: 16, tdp_watts: 263, msrp_usd: 499, current_price_usd: 479, in_stock: true, price_change_percent: -4, release_date: '2023-09-06', active: true },
  { id: 'rx-7700-xt', slug: 'rx-7700-xt', model: 'RX 7700 XT', brand: 'amd', architecture: 'RDNA 3', generation: 'RX 7000', vram_gb: 12, tdp_watts: 245, msrp_usd: 449, current_price_usd: 419, in_stock: true, price_change_percent: -7, release_date: '2023-09-07', active: true },
  { id: 'rx-7600', slug: 'rx-7600', model: 'RX 7600', brand: 'amd', architecture: 'RDNA 3', generation: 'RX 7000', vram_gb: 8, tdp_watts: 165, msrp_usd: 269, current_price_usd: 259, in_stock: true, price_change_percent: -4, release_date: '2023-05-25', active: true },
  // NVIDIA RTX 30 Series (Popular)
  { id: 'rtx-3090', slug: 'rtx-3090', model: 'RTX 3090', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 24, tdp_watts: 350, msrp_usd: 1499, current_price_usd: 999, in_stock: true, price_change_percent: -33, release_date: '2020-09-24', active: true },
  { id: 'rtx-3080-ti', slug: 'rtx-3080-ti', model: 'RTX 3080 Ti', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 12, tdp_watts: 350, msrp_usd: 1199, current_price_usd: 799, in_stock: true, price_change_percent: -33, release_date: '2021-06-03', active: true },
  { id: 'rtx-3080', slug: 'rtx-3080', model: 'RTX 3080', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 10, tdp_watts: 320, msrp_usd: 699, current_price_usd: 549, in_stock: true, price_change_percent: -21, release_date: '2020-09-17', active: true },
  { id: 'rtx-3070-ti', slug: 'rtx-3070-ti', model: 'RTX 3070 Ti', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 8, tdp_watts: 290, msrp_usd: 599, current_price_usd: 449, in_stock: true, price_change_percent: -25, release_date: '2021-05-31', active: true },
  { id: 'rtx-3070', slug: 'rtx-3070', model: 'RTX 3070', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 8, tdp_watts: 220, msrp_usd: 499, current_price_usd: 379, in_stock: true, price_change_percent: -24, release_date: '2020-10-29', active: true },
  { id: 'rtx-3060-ti', slug: 'rtx-3060-ti', model: 'RTX 3060 Ti', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 8, tdp_watts: 200, msrp_usd: 399, current_price_usd: 329, in_stock: true, price_change_percent: -18, release_date: '2020-12-02', active: true },
  { id: 'rtx-3060', slug: 'rtx-3060', model: 'RTX 3060', brand: 'nvidia', architecture: 'Ampere', generation: 'RTX 3000', vram_gb: 12, tdp_watts: 170, msrp_usd: 329, current_price_usd: 299, in_stock: true, price_change_percent: -9, release_date: '2021-02-25', active: true },
  // AMD RX 6000 Series (Popular)
  { id: 'rx-6900-xt', slug: 'rx-6900-xt', model: 'RX 6900 XT', brand: 'amd', architecture: 'RDNA 2', generation: 'RX 6000', vram_gb: 16, tdp_watts: 300, msrp_usd: 999, current_price_usd: 649, in_stock: true, price_change_percent: -35, release_date: '2020-12-08', active: true },
  { id: 'rx-6800-xt', slug: 'rx-6800-xt', model: 'RX 6800 XT', brand: 'amd', architecture: 'RDNA 2', generation: 'RX 6000', vram_gb: 16, tdp_watts: 300, msrp_usd: 649, current_price_usd: 499, in_stock: true, price_change_percent: -23, release_date: '2020-11-18', active: true },
  { id: 'rx-6800', slug: 'rx-6800', model: 'RX 6800', brand: 'amd', architecture: 'RDNA 2', generation: 'RX 6000', vram_gb: 16, tdp_watts: 250, msrp_usd: 579, current_price_usd: 449, in_stock: true, price_change_percent: -22, release_date: '2020-11-18', active: true },
  { id: 'rx-6700-xt', slug: 'rx-6700-xt', model: 'RX 6700 XT', brand: 'amd', architecture: 'RDNA 2', generation: 'RX 6000', vram_gb: 12, tdp_watts: 230, msrp_usd: 479, current_price_usd: 329, in_stock: true, price_change_percent: -31, release_date: '2021-03-03', active: true },
  { id: 'rx-6600-xt', slug: 'rx-6600-xt', model: 'RX 6600 XT', brand: 'amd', architecture: 'RDNA 2', generation: 'RX 6000', vram_gb: 8, tdp_watts: 160, msrp_usd: 379, current_price_usd: 279, in_stock: true, price_change_percent: -26, release_date: '2021-07-30', active: true },
  { id: 'rx-6600', slug: 'rx-6600', model: 'RX 6600', brand: 'amd', architecture: 'RDNA 2', generation: 'RX 6000', vram_gb: 8, tdp_watts: 132, msrp_usd: 329, current_price_usd: 219, in_stock: true, price_change_percent: -33, release_date: '2021-10-13', active: true },
  // Intel Arc (Emerging)
  { id: 'arc-a770', slug: 'arc-a770', model: 'Arc A770', brand: 'intel', architecture: 'Alchemist', generation: 'Arc', vram_gb: 16, tdp_watts: 225, msrp_usd: 329, current_price_usd: 299, in_stock: true, price_change_percent: -9, release_date: '2022-10-12', active: true },
  { id: 'arc-a750', slug: 'arc-a750', model: 'Arc A750', brand: 'intel', architecture: 'Alchemist', generation: 'Arc', vram_gb: 8, tdp_watts: 190, msrp_usd: 249, current_price_usd: 229, in_stock: true, price_change_percent: -8, release_date: '2022-10-12', active: true },
]

export function getGPUBySlug(slug: string): GPU | undefined {
  return ALL_GPUS.find(gpu => gpu.slug === slug)
}

export function getAllGPUSlugs(): string[] {
  return ALL_GPUS.map(gpu => gpu.slug)
}

// Retailer affiliate links
export const RETAILER_URLS: Record<string, Record<string, string>> = {
  'rtx-5090': {
    amazon: 'https://www.amazon.com/s?k=RTX+5090&ref=nb_sb_noss',
    bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5090',
    newegg: 'https://www.newegg.com/p/pl?d=rtx+5090',
  },
  'rtx-5080': {
    amazon: 'https://www.amazon.com/s?k=RTX+5080&ref=nb_sb_noss',
    bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5080',
    newegg: 'https://www.newegg.com/p/pl?d=rtx+5080',
  },
  'rtx-5070-ti': {
    amazon: 'https://www.amazon.com/s?k=RTX+5070+Ti&ref=nb_sb_noss',
    bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5070+ti',
    newegg: 'https://www.newegg.com/p/pl?d=rtx+5070+ti',
  },
  'rtx-5070': {
    amazon: 'https://www.amazon.com/s?k=RTX+5070&ref=nb_sb_noss',
    bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+5070',
    newegg: 'https://www.newegg.com/p/pl?d=rtx+5070',
  },
  'rx-9070-xt': {
    amazon: 'https://www.amazon.com/s?k=RX+9070+XT&ref=nb_sb_noss',
    bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+9070+xt',
    newegg: 'https://www.newegg.com/p/pl?d=rx+9070+xt',
  },
  'rx-9070': {
    amazon: 'https://www.amazon.com/s?k=RX+9070&ref=nb_sb_noss',
    bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+9070',
    newegg: 'https://www.newegg.com/p/pl?d=rx+9070',
  },
}

export const RETAILER_LABELS: Record<string, string> = {
  bestbuy: 'Best Buy',
  amazon: 'Amazon',
  newegg: 'Newegg',
  bh_photo: 'B&H Photo',
  micro_center: 'Micro Center',
  adorama: 'Adorama',
  antonline: 'Antonline',
  cdw: 'CDW',
  intel: '#0071c5',
}

export const RETAILER_COLORS: Record<string, string> = {
  bestbuy: '#0046be',
  amazon: '#ff9900',
  newegg: '#f04c24',
  bh_photo: '#cc0000',
  micro_center: '#f15a29',
  adorama: '#333333',
  antonline: '#0077c8',
  cdw: '#0077c8',
}
// Add more retailer URLs
RETAILER_URLS['rtx-4090'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4090&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4090',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4090',
}
RETAILER_URLS['rtx-4080-super'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4080+Super&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4080+super',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4080+super',
}
RETAILER_URLS['rtx-4070-ti-super'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4070+Ti+Super&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4070+ti+super',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4070+ti+super',
}
RETAILER_URLS['rtx-4070-super'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4070+Super&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4070+super',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4070+super',
}
RETAILER_URLS['rtx-4070'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4070&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4070',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4070',
}
RETAILER_URLS['rtx-4070-ti'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4070+Ti&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4070+ti',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4070+ti',
}
RETAILER_URLS['rx-7900-xtx'] = {
  amazon: 'https://www.amazon.com/s?k=RX+7900+XTX&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+7900+xtx',
  newegg: 'https://www.newegg.com/p/pl?d=rx+7900+xtx',
}
RETAILER_URLS['rx-7800-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+7800+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+7800+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+7800+xt',
}
RETAILER_URLS['rx-7700-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+7700+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+7700+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+7700+xt',
}
RETAILER_URLS['rx-7600'] = {
  amazon: 'https://www.amazon.com/s?k=RX+7600&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+7600',
  newegg: 'https://www.newegg.com/p/pl?d=rx+7600',
}
RETAILER_URLS['rx-7600-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+7600+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+7600+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+7600+xt',
}

// Add missing GPU retailer URLs
RETAILER_URLS['rtx-4060'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4060&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4060',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4060',
}
RETAILER_URLS['rtx-4060-ti'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4060+Ti&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4060+ti',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4060+ti',
}
RETAILER_URLS['rtx-4080'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+4080&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+4080',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+4080',
}
// RTX 30 Series
RETAILER_URLS['rtx-3090'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3090&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3090',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3090',
}
RETAILER_URLS['rtx-3080-ti'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3080+Ti&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3080+ti',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3080+ti',
}
RETAILER_URLS['rtx-3080'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3080&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3080',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3080',
}
RETAILER_URLS['rtx-3070-ti'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3070+Ti&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3070+ti',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3070+ti',
}
RETAILER_URLS['rtx-3070'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3070&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3070',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3070',
}
RETAILER_URLS['rtx-3060-ti'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3060+Ti&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3060+ti',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3060+ti',
}
RETAILER_URLS['rtx-3060'] = {
  amazon: 'https://www.amazon.com/s?k=RTX+3060&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rtx+3060',
  newegg: 'https://www.newegg.com/p/pl?d=rtx+3060',
}
// AMD RX 6000 Series
RETAILER_URLS['rx-6900-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+6900+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+6900+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+6900+xt',
}
RETAILER_URLS['rx-6800-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+6800+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+6800+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+6800+xt',
}
RETAILER_URLS['rx-6800'] = {
  amazon: 'https://www.amazon.com/s?k=RX+6800&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+6800',
  newegg: 'https://www.newegg.com/p/pl?d=rx+6800',
}
RETAILER_URLS['rx-6700-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+6700+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+6700+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+6700+xt',
}
RETAILER_URLS['rx-6600-xt'] = {
  amazon: 'https://www.amazon.com/s?k=RX+6600+XT&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+6600+xt',
  newegg: 'https://www.newegg.com/p/pl?d=rx+6600+xt',
}
RETAILER_URLS['rx-6600'] = {
  amazon: 'https://www.amazon.com/s?k=RX+6600&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=rx+6600',
  newegg: 'https://www.newegg.com/p/pl?d=rx+6600',
}
// Intel Arc
RETAILER_URLS['arc-a770'] = {
  amazon: 'https://www.amazon.com/s?k=Arc+A770&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=arc+a770',
  newegg: 'https://www.newegg.com/p/pl?d=arc+a770',
}
RETAILER_URLS['arc-a750'] = {
  amazon: 'https://www.amazon.com/s?k=Arc+A750&ref=nb_sb_noss',
  bestbuy: 'https://www.bestbuy.com/site/searchpage.jsp?st=arc+a750',
  newegg: 'https://www.newegg.com/p/pl?d=arc+a750',
}

// Helper function to add new retailers to existing GPU entries
function addRetailerToGPU(gpuSlug: string, retailer: string, url: string) {
  if (!RETAILER_URLS[gpuSlug]) {
    RETAILER_URLS[gpuSlug] = {}
  }
  RETAILER_URLS[gpuSlug][retailer] = url
}

// Add new retailers to existing GPU URLs
const NEW_RETAILERS = ['bh_photo', 'micro_center', 'adorama', 'antonline']
const GPU_SLUGS = Object.keys(RETAILER_URLS)

GPU_SLUGS.forEach(slug => {
  const gpuModel = slug.replace(/-/g, ' ').toUpperCase()
  
  // B&H Photo - comprehensive GPU selection
  addRetailerToGPU(slug, 'bh_photo', `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(gpuModel)}`)
  
  // Micro Center - wide GPU selection, especially new launches
  addRetailerToGPU(slug, 'micro_center', `https://www.microcenter.com/search/search_results.aspx?search_query=${encodeURIComponent(gpuModel)}`)
  
  // Adorama - good for pro/workstation GPUs
  addRetailerToGPU(slug, 'adorama', `https://www.adorama.com/l/?q=${encodeURIComponent(gpuModel)}`)
  
  // Antonline - authorized reseller with good stock
  addRetailerToGPU(slug, 'antonline', `https://www.antonline.com/search?q=${encodeURIComponent(gpuModel)}`)
})

// CDW - Enterprise/workstation focus (high-end cards only)
const WORKSTATION_GPUS = ['rtx-5090', 'rtx-5080', 'rtx-5070-ti', 'rtx-4090', 'rtx-4080-super', 'rtx-4070-ti-super', 'rx-7900-xtx', 'rx-7900-xt']
WORKSTATION_GPUS.forEach(slug => {
  const gpuModel = slug.replace(/-/g, ' ').toUpperCase()
  addRetailerToGPU(slug, 'cdw', `https://www.cdw.com/search/?key=${encodeURIComponent(gpuModel)}`)
})
