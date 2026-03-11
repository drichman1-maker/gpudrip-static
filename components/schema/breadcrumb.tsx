import { WithContext, BreadcrumbList, ListItem } from 'schema-dts';
import { JsonLd } from './json-ld';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const itemList: ListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": {
      "@type": "Thing",
      "@id": `https://gpudrip.com${item.url}`,
      "name": item.name
    }
  }));

  const breadcrumbData: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemList
  };

  return <JsonLd data={breadcrumbData} />;
}
