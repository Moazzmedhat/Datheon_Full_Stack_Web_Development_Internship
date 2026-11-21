/**
 * main.js — Entry point. Wires all modules together.
 *
 * Boot sequence:
 *  1. Initialise UI components (cart drawer, filters)
 *  2. Fetch products from the API
 *  3. Render the catalog; wire up filter changes
 */

import { fetchProducts }                        from './api.js';
import { initCartDrawer }                       from './ui/cartDrawer.js';
import { initFilters, updateCount }             from './ui/filters.js';
import { showLoading, showError, renderProducts, setProductMap } from './ui/productGrid.js';

/** @type {Product[]} All products from the API (never mutated). */
let allProducts = [];

/** @type {string} Currently active category filter key. */
let activeCategory = 'all';

/* ================================================================
   Boot
   ================================================================ */

// 1. Initialise cart drawer (subscribes to state internally)
initCartDrawer();

// 2. Initialise filter buttons
initFilters(key => {
  activeCategory = key;
  applyFilter();
});

// 3. Load products
loadProducts();

/* ================================================================
   Product loading
   ================================================================ */

async function loadProducts() {
  showLoading();
  try {
    allProducts = await fetchProducts();
    setProductMap(allProducts);  // give productGrid the lookup map
    applyFilter();               // render with current filter (default: 'all')
  } catch (err) {
    console.error('Failed to fetch products:', err);
    showError(loadProducts);     // pass ourselves as the retry callback
  }
}

/* ================================================================
   Filtering
   ================================================================ */

/**
 * Filter allProducts by activeCategory and re-render.
 */
function applyFilter() {
  const filtered = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  renderProducts(filtered);
  updateCount(filtered.length, activeCategory);
}
