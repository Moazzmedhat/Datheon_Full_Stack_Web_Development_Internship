/**
 * api.js — Fetches products from FakeStoreAPI and maps categories.
 */

const API_URL = 'https://fakestoreapi.com/products';

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
 * Fetches all products from FakeStoreAPI, normalises the category field.
 * @returns {Promise<Product[]>}
 */
export async function fetchProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const products = await response.json();

  // Normalize: replace raw API category with our internal key
  return products.map(p => ({
    ...p,
    category: CATEGORY_MAP[p.category] ?? p.category,
  }));
}
