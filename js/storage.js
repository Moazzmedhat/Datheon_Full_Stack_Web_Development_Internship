/**
 * storage.js — Persist and restore the cart from localStorage.
 *
 * JSON.parse is wrapped in try/catch so corrupted or missing data
 * never crashes the app — we simply fall back to an empty cart.
 */

const STORAGE_KEY = 'shopwave_cart';

/**
 * Load the cart from localStorage.
 * @returns {CartItem[]}  Parsed cart, or [] on failure.
 */
export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    // Basic validation: must be an array
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    // Corrupted JSON or storage unavailable
    return [];
  }
}

/**
 * Persist the cart to localStorage.
 * @param {CartItem[]} cart
 */
export function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage quota exceeded or private-browsing restriction — silently ignore.
  }
}

/**
 * Remove the cart entry from localStorage (used after checkout).
 */
export function clearStoredCart() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
