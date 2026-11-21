/**
 * ui/productGrid.js — Renders the product catalog into #product-grid.
 *
 * Uses event delegation on the grid container so we don't attach one
 * listener per card — a single listener handles all "Add to Cart" clicks.
 */

import { escapeHTML, buildStars, formatCurrency } from '../utils.js';
import { addItem } from '../state.js';

/** @type {Product[]} All products currently displayed. */
let _products = [];

/** Map from product id → Product (for fast lookup in event delegation). */
let _productMap = new Map();

const grid = /** @type {HTMLElement} */ (document.getElementById('product-grid'));

// ----- Event delegation on the grid -----
grid.addEventListener('click', e => {
  const btn = /** @type {HTMLElement} */ (e.target.closest('[data-add-id]'));
  if (!btn) return;

  const id = Number(btn.dataset.addId);
  const product = _productMap.get(id);
  if (!product) return;

  addItem(product);

  // Brief visual feedback on the button
  btn.textContent = '✓ Added';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.disabled = false;
  }, 1200);
});

/**
 * Show a full-page loading skeleton.
 */
export function showLoading() {
  grid.innerHTML = `
    <div class="state-loading" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>Loading products&hellip;</p>
    </div>`;
}

/**
 * Show a friendly error state with a retry callback.
 * @param {function} onRetry
 */
export function showError(onRetry) {
  grid.innerHTML = `
    <div class="state-error">
      <span class="state-error-icon" aria-hidden="true">😕</span>
      <h2>Couldn't load products</h2>
      <p>Check your connection and try again.</p>
      <button class="btn btn-primary" id="retry-btn">Retry</button>
    </div>`;
  document.getElementById('retry-btn').addEventListener('click', onRetry);
}

/**
 * Render a filtered list of products.
 * @param {Product[]} products
 */
export function renderProducts(products) {
  _products = products;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="state-empty">
        <span class="state-empty-icon" aria-hidden="true">🔍</span>
        <p>No products found in this category.</p>
      </div>`;
    return;
  }

  // Build HTML for all cards, then set innerHTML once (one reflow).
  grid.innerHTML = products.map(buildCard).join('');
}

/**
 * Cache all products for the event delegation lookup map.
 * Call this once after fetching, before any filtering.
 * @param {Product[]} all
 */
export function setProductMap(all) {
  _productMap = new Map(all.map(p => [p.id, p]));
}

/* ---- Private helpers ---- */

/**
 * Build badge HTML for a product.
 * @param {Product} p
 * @returns {string}
 */
function buildBadges(p) {
  const badges = [];
  if (p.rating.count > 300)  badges.push(`<span class="badge badge-bestseller">Best Seller</span>`);
  if (p.rating.rate >= 4.5)  badges.push(`<span class="badge badge-toprated">Top Rated</span>`);
  return badges.length
    ? `<div class="product-badges">${badges.join('')}</div>`
    : '';
}

/**
 * Render a single product card as an HTML string.
 * API text is escaped before insertion.
 * @param {Product} p
 * @returns {string}
 */
function buildCard(p) {
  const title      = escapeHTML(p.title);
  const category   = escapeHTML(p.category);
  const image      = escapeHTML(p.image);
  const price      = formatCurrency(p.price);
  const stars      = buildStars(p.rating.rate);
  const rateStr    = escapeHTML(String(p.rating.rate));
  const countStr   = escapeHTML(String(p.rating.count));
  const badges     = buildBadges(p);

  return `
    <article class="product-card" data-product-id="${p.id}">
      <div class="product-image-wrap">
        ${badges}
        <img
          class="product-img"
          src="${image}"
          alt="${title}"
          loading="lazy"
          width="180"
          height="180"
        />
      </div>
      <div class="product-body">
        <span class="product-category">${category}</span>
        <h2 class="product-title" title="${title}">${title}</h2>
        <div class="product-rating" aria-label="Rating: ${rateStr} out of 5, ${countStr} reviews">
          <span class="stars" aria-hidden="true">${stars}</span>
          <span>${rateStr} (${countStr})</span>
        </div>
      </div>
      <div class="product-footer">
        <span class="product-price" aria-label="Price: ${price}">${price}</span>
        <button
          class="btn btn-primary btn-sm btn-add"
          data-add-id="${p.id}"
          aria-label="Add ${title} to cart"
        >Add to Cart</button>
      </div>
    </article>`;
}
