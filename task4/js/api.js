/**
 * api.js — Fetches products from FakeStoreAPI (with local fallback) and maps categories.
 */

const API_URL = 'https://fakestoreapi.com/products';
const FALLBACK_URL = './data/products.json';

/**
 * Maps raw API category strings to our display categories.
 * "men's clothing" and "women's clothing" both map to "clothing".
 * @type {Record<string, string>}
 */
export const CATEGORY_MAP = {
  'electronics':      'electronics',
  'jewelery':         'jewelry',       // Note: API uses "jewelery" (misspelled)
  "men's clothing":   'clothing',
  "women's clothing": 'clothing',
};

/**
 * Human-readable labels for our internal category keys.
 * @type {Record<string, string>}
 */
export const CATEGORY_LABELS = {
  all:         'All',
  electronics: 'Electronics',
  jewelry:     'Jewelry',
  clothing:    'Clothing',
};

/**
 * Normalises image URLs to Amazon CDN if fakestoreapi.com images fail.
 * @param {string} url
 * @returns {string}
 */
function normalizeImageUrl(url) {
  if (url && url.includes('fakestoreapi.com/img/')) {
    const filename = url.split('/').pop();
    return `https://m.media-amazon.com/images/I/${filename}`;
  }
  return url;
}

/**
 * Fetches all products. Attempts the live FakeStoreAPI first, but if it is
 * unreachable, down (e.g. Cloudflare 525), or slow, falls back to the local dataset.
 * @returns {Promise<Product[]>}
 */
export async function fetchProducts() {
  let products = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      products = await response.json();
    } else {
      console.warn(`FakeStoreAPI returned HTTP ${response.status}. Falling back to local products.`);
    }
  } catch (err) {
    console.warn('FakeStoreAPI is unreachable. Using local fallback products.', err);
  }

  // Fallback if API returned error, empty, or timed out
  if (!products || !Array.isArray(products) || products.length === 0) {
    const fallbackRes = await fetch(FALLBACK_URL);
    if (!fallbackRes.ok) {
      throw new Error(`Failed to load fallback products (${fallbackRes.status})`);
    }
    products = await fallbackRes.json();
  }

  // Normalize: replace raw API category with our internal key and ensure resilient images
  return products.map(p => ({
    ...p,
    id: Number(p.id),
    price: Number(p.price),
    category: CATEGORY_MAP[p.category] ?? p.category,
    image: normalizeImageUrl(p.image),
    rating: {
      rate: Number(p.rating?.rate ?? 0),
      count: Number(p.rating?.count ?? 0),
    },
  }));
}
