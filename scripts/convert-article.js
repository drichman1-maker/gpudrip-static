#!/usr/bin/env node
/**
 * Robust HTML to TSX Converter for GPU Drip Articles
 * Properly converts CSS classes to inline styles
 */

const fs = require('fs');
const path = require('path');

function convertHtmlToTsx(htmlPath, outputDir) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // 1. Strip BOM and invisible characters
  html = html.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // 2. Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Article';
  
  // 3. Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (!bodyMatch) throw new Error('Could not find <body> tag');
  let bodyContent = bodyMatch[1];
  
  // 4. Remove <style> and <script> blocks
  bodyContent = bodyContent.replace(/<style[\s\S]*?<\/style>/gi, '');
  bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  // 5. Extract and parse CSS from style blocks
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const cssRules = {};
  if (styleMatch) {
    const css = styleMatch[1];
    // Parse CSS rules
    const ruleRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    while ((match = ruleRegex.exec(css)) !== null) {
      const className = match[1];
      const properties = match[2];
      // Convert CSS properties to JS style object
      const styleObj = {};
      properties.split(';').forEach(prop => {
        const [key, value] = prop.split(':').map(s => s.trim());
        if (key && value) {
          if (key.startsWith('--')) return; // Skip CSS variables
          const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
          styleObj[camelKey] = value;
        }
      });
      cssRules[className] = styleObj;
    }
  }
  
  // 6. Replace remaining class= with className= FIRST
  bodyContent = bodyContent.replace(/class="/g, 'className="');
  
  // 7. Apply CSS classes as inline styles AFTER className conversion
  Object.keys(cssRules).forEach(className => {
    const styleObj = cssRules[className];
    const styleStr = Object.entries(styleObj)
      .map(([k, v]) => `${k}: '${v}'`)
      .join(', ');
    
    // Replace className="className" with style={{ ... }}
    const regex = new RegExp(`className="${className}"`, 'g');
    bodyContent = bodyContent.replace(regex, `style={{ ${styleStr} }}`);
  });
  
  // 7b. Convert inline style="..." to style={{ ... }}
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, styleStr) => {
    const styleObj = {};
    styleStr.split(';').forEach(part => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key && value) {
        if (key.startsWith('--')) return;
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[camelKey] = value;
      }
    });
    const entries = Object.entries(styleObj).map(([k, v]) => `${k}: '${v}'`).join(', ');
    return `style={{ ${entries} }}`;
  });
  
  // 8. Convert self-closing tags
  bodyContent = bodyContent.replace(/<(img|br|hr|input|meta|link)([^>]*)>/gi, (match, tag, attrs) => {
    return `<${tag}${attrs} />`;
  });
  
  // 9. Fix HTML entities
  bodyContent = bodyContent
    .replace(/&gt;/g, '&gt;')
    .replace(/&lt;/g, '&lt;')
    .replace(/&amp;/g, '&amp;')
    .replace(/&quot;/g, '&quot;')
    .replace(/&#39;/g, "&#39;")
    .replace(/&nbsp;/g, '&nbsp;');
  
  // 10. Convert HTML comments to JSX
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
  
  // 11. Replace <a> with Next.js Link
  bodyContent = bodyContent.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (match, href, text) => {
    return `<Link href="${href}" style={{ textDecoration: 'none' }}>${text}</Link>`;
  });
  
  // 12. Wrap in container
  bodyContent = `<div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', fontFamily: 'system-ui, sans-serif' }}>
${bodyContent}
</div>`;
  
  // 13. Extract page title
  const h1Match = bodyContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const pageTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : title.split('|')[0].trim();
  
  // 14. Create TSX
  const tsx = `import Link from 'next/link'

export const dynamic = 'force-static'

export default function Page() {
  return (
    ${bodyContent}
  )
}
`;
  
  return { tsx, pageTitle };
}

if (require.main === module) {
  const inputFile = process.argv[2];
  const outputDir = process.argv[3] || '.';
  
  if (!inputFile) {
    console.error('Usage: node convert-article.js <input.html> [output-dir]');
    process.exit(1);
  }
  
  try {
    const { tsx, pageTitle } = convertHtmlToTsx(inputFile, outputDir);
    
    const slug = pageTitle.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const outputPath = path.join(outputDir, slug, 'page.tsx');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, tsx);
    
    console.log(`✓ Converted: ${inputFile}`);
    console.log(`  → ${outputPath}`);
    console.log(`  Title: "${pageTitle}"`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = { convertHtmlToTsx };
