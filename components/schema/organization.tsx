import { WithContext, Organization, WebSite, ImageObject } from 'schema-dts';
import { JsonLd } from './json-ld';

const logoData: ImageObject = {
  "@type": "ImageObject",
  "url": "https://gpudrip.com/favicon.svg",
  "width": "512",
  "height": "512"
};

const organizationData: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GPU Drip",
  "url": "https://gpudrip.com",
  "logo": logoData,
  "description": "Real-time GPU price tracking, deal detection, and stock alerts across all major retailers.",
  "sameAs": [
    "https://twitter.com/gpudrip"
  ]
};

const websiteData: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GPU Drip",
  "url": "https://gpudrip.com",
  "description": "Track GPU prices across Best Buy, Amazon, Newegg and more. Get deal alerts and price comparisons for RTX 5090, RTX 5080, RX 9070 XT, and all major GPUs.",
  "publisher": {
    "@type": "Organization",
    "name": "GPU Drip"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://gpudrip.com/gpu?q={search_term_string}"
    },
    "query": "required name=search_term_string"
  }
};

export function OrganizationSchema() {
  return <JsonLd data={organizationData} />;
}

export function WebSiteSchema() {
  return <JsonLd data={websiteData} />;
}
