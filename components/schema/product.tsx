import { WithContext, Product, AggregateOffer, Offer } from 'schema-dts';
import { JsonLd } from './json-ld';

interface RetailerOffer {
  retailer: string;
  price: number;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
}

interface GPUProductSchemaProps {
  name: string;
  brand: string;
  description: string;
  image?: string;
  offers: RetailerOffer[];
  msrp?: number;
  rating?: {
    value: number;
    count: number;
  };
}

export function GPUProductSchema({ 
  name, 
  brand, 
  description, 
  image, 
  offers, 
  msrp,
  rating 
}: GPUProductSchemaProps) {
  const lowPrice = Math.min(...offers.map(o => o.price));
  const highPrice = Math.max(...offers.map(o => o.price));
  
  const offerList: Offer[] = offers.map(offer => ({
    "@type": "Offer",
    "price": offer.price.toFixed(2),
    "priceCurrency": "USD",
    "availability": `https://schema.org/${offer.availability}`,
    "seller": {
      "@type": "Organization",
      "name": offer.retailer
    },
    "url": offer.url
  }));

  const aggregateOffer: AggregateOffer = {
    "@type": "AggregateOffer",
    "lowPrice": lowPrice.toFixed(2),
    "highPrice": highPrice.toFixed(2),
    "priceCurrency": "USD",
    "offerCount": offers.length,
    "offers": offerList
  };

  const productData: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": image || `https://gpudrip.com/images/gpus/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": aggregateOffer
  };

  // Add MSRP if available
  if (msrp) {
    (productData as any).msrp = {
      "@type": "PriceSpecification",
      "price": msrp.toFixed(2),
      "priceCurrency": "USD"
    };
  }

  // Add aggregate rating if available
  if (rating) {
    productData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating.value.toString(),
      "reviewCount": rating.count
    };
  }

  return <JsonLd data={productData} />;
}
