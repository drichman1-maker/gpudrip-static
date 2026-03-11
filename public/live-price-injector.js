// Live price injector with stock tracking
(function() {
  console.log('Live price injector starting...');
  
  const LIVE_PRICE_CACHE_KEY = 'gpu-live-prices-v5';
  const CACHE_DURATION = 5 * 60 * 1000; 
  const HYDRATION_DELAY = 1500;

  async function fetchLivePrices() {
    const cached = localStorage.getItem(LIVE_PRICE_CACHE_KEY);
    if (cached) {
      try {
        const { prices, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('Using cached prices');
          return prices;
        }
      } catch(e) {}
    }

    console.log('Fetching fresh prices from API...');
    try {
      const res = await fetch('/api/prices');
      const data = await res.json();
      if (data.success && data.prices['gpu-drip']) {
        localStorage.setItem(LIVE_PRICE_CACHE_KEY, JSON.stringify({
          prices: data.prices['gpu-drip'],
          timestamp: Date.now()
        }));
        return data.prices['gpu-drip'];
      }
    } catch (e) {
      console.error('Failed to fetch live prices:', e);
    }
    return [];
  }

  function updateTablePrices(prices) {
    if (!prices.length) return;

    const priceMap = {};
    prices.forEach(p => { 
      priceMap[p.name] = p;
      priceMap[p.name.toLowerCase().replace(/\s+/g, '')] = p;
    });

    // Update all tables on the page
    document.querySelectorAll('table').forEach(table => {
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const firstCell = row.querySelector('td:first-child');
        if (!firstCell) return;
        
        const link = firstCell.querySelector('a');
        let gpuName = link ? link.textContent.trim() : '';
        
        if (!gpuName) {
          gpuName = firstCell.firstChild ? firstCell.firstChild.textContent.trim() : '';
        }
        
        if (!gpuName) return;
        
        let priceData = priceMap[gpuName];
        
        if (!priceData) {
          const normalized = gpuName.toLowerCase().replace(/\s+/g, '');
          priceData = priceMap[normalized];
        }
        
        if (!priceData) {
          for (const name in priceMap) {
            if (gpuName.toLowerCase().includes(name.toLowerCase())) {
              priceData = priceMap[name];
              break;
            }
          }
        }
        
        if (priceData) {
          console.log('Updating', gpuName, 'to', priceData.price, 'stock:', priceData.stock);
          
          const cells = row.querySelectorAll('td');
          
          // Update price
          let priceCell = null;
          for (let i = 1; i < Math.min(cells.length, 5); i++) {
            const cell = cells[i];
            const text = cell.textContent;
            if (text.includes('$') && /\d+/.test(text)) {
              priceCell = cell;
              break;
            }
          }
          
          if (priceCell) {
            const newPrice = '$' + priceData.price.toLocaleString();
            priceCell.textContent = newPrice;
          }
          
          // Update status with price change or deal
          if (priceData.alert) {
            const statusCell = Array.from(cells).find(c => 
              c.textContent.includes('Surge') || c.textContent.includes('Deal')
            );
            if (statusCell) {
              statusCell.textContent = 'DEAL';
              statusCell.style.background = '#10b981';
              statusCell.style.color = 'white';
              statusCell.style.padding = '4px 10px';
              statusCell.style.borderRadius = '4px';
              statusCell.style.fontSize = '12px';
              statusCell.style.fontWeight = '600';
              statusCell.style.display = 'inline-block';
            }
          }
          
          // Update stock status (last cell)
          const lastCell = cells[cells.length - 1];
          if (lastCell && priceData.stock) {
            if (priceData.stock === 'in_stock') {
              lastCell.textContent = 'In Stock';
              lastCell.style.color = '#10b981';
              lastCell.style.fontWeight = '600';
            } else if (priceData.stock === 'out_of_stock') {
              lastCell.textContent = 'Out of Stock';
              lastCell.style.color = '#ef4444';
              lastCell.style.fontWeight = '600';
            }
            // If unknown, leave as is
          }
        }
      });
    });
  }

  async function init() {
    console.log('Initializing live prices...');
    await new Promise(resolve => setTimeout(resolve, HYDRATION_DELAY));
    
    const prices = await fetchLivePrices();
    updateTablePrices(prices);
    
    setInterval(async () => {
      const newPrices = await fetchLivePrices();
      updateTablePrices(newPrices);
    }, CACHE_DURATION);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
