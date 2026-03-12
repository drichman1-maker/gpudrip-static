import { WithContext, FAQPage } from 'schema-dts';
import { JsonLd } from './json-ld';

interface GPUFAQSchemaProps {
  gpuName: string;
  brand: string;
  vram: number;
  architecture: string;
  tdp: number;
  msrp: number;
  currentPrice: number;
  retailers: string[];
}

export function GPUFAQSchema({ 
  gpuName, 
  brand, 
  vram, 
  architecture, 
  tdp, 
  msrp, 
  currentPrice,
  retailers 
}: GPUFAQSchemaProps) {
  const savings = msrp - currentPrice;
  const savingsPercent = msrp > 0 ? Math.round((savings / msrp) * 100) : 0;
  const retailerList = retailers.join(', ');
  
  const faqData: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the best price for ${gpuName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best price for ${gpuName} is currently $${currentPrice}. ${savings > 0 ? `You save $${savings} compared to the MSRP of $${msrp} (${savingsPercent}% off).` : ''} Prices are tracked across ${retailers.length} major retailers: ${retailerList}.`
        }
      },
      {
        "@type": "Question",
        "name": `Where can I buy ${gpuName} in stock?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${gpuName} is available from ${retailers.length} retailers: ${retailerList}. Check GPU Drip for real-time stock status and pricing across all major GPU retailers.`
        }
      },
      {
        "@type": "Question",
        "name": `Is the ${gpuName} good for gaming?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${gpuName} features ${vram}GB VRAM and ${architecture} architecture, making it ${vram >= 16 ? 'excellent' : vram >= 12 ? 'great' : 'good'} for gaming at ${vram >= 16 ? '4K and high refresh rate 1440p' : vram >= 12 ? '1440p and entry-level 4K' : '1080p and 1440p'} resolutions. The ${tdp}W TDP provides ${tdp > 300 ? 'high performance but requires robust cooling' : tdp > 200 ? 'solid performance with moderate power draw' : 'efficient performance with lower power consumption'}.`
        }
      },
      {
        "@type": "Question",
        "name": `${gpuName} vs competitors: Which should I buy?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${gpuName} competes with ${brand === 'NVIDIA' ? 'AMD Radeon cards in the same price range' : 'NVIDIA GeForce cards in the same price range'}. Use GPU Drip's comparison tool to see side-by-side specs, prices, and performance metrics. Consider your specific needs: ${vram >= 16 ? 'high-resolution gaming and content creation' : vram >= 12 ? '1440p gaming and streaming' : '1080p gaming and esports'} vs budget constraints.`
        }
      },
      {
        "@type": "Question",
        "name": `Should I buy ${gpuName} now or wait for a price drop?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${savings > 50 ? `With current savings of $${savings}, now is a good time to buy.` : `At $${currentPrice}, the ${gpuName} is selling near MSRP.`} GPU prices fluctuate based on stock availability, new releases, and seasonal sales. Set a price alert on GPU Drip to get notified immediately when the price drops. Historically, Black Friday and major GPU launches trigger the best deals.`
        }
      },
      {
        "@type": "Question",
        "name": `What power supply do I need for ${gpuName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${gpuName} has a ${tdp}W TDP. NVIDIA recommends a ${tdp <= 200 ? '550W' : tdp <= 300 ? '750W' : '850W or higher'} power supply for this GPU. Ensure your PSU has the appropriate power connectors and headroom for your entire system.`
        }
      }
    ]
  };

  return <JsonLd data={faqData} />;
}
