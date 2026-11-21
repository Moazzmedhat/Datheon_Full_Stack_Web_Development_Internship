/**
 * utils.js — Pure helper functions.
 *
 * All monetary arithmetic is performed in integer cents to avoid
 * floating-point errors (e.g. 0.1 + 0.2 === 0.30000000000000004).
 */

const TAX_RATE        = 0.08;           // 8%
const SHIPPING_COST   = 5.99;           // USD
const FREE_THRESHOLD  = 50.00;          // subtotal >= $50 → free shipping

/** Reusable USD formatter. */
const usdFmt = new Intl.NumberFormat('en-US', {
  style:    'currency',
  currency: 'USD',
});

/**
 * Format a numeric dollar amount as a USD currency string.
 * @param {number} amount  Dollar amount (e.g. 12.5).
 * @returns {string}  E.g. "$12.50"
 */
export function formatCurrency(amount) {
  return usdFmt.format(amount);
}

/**
 * Calculate order totals from a cart array.
 * All intermediate math is done in integer cents.
 *
 * @param {CartItem[]} cart
 * @returns {{
 *   subtotalCents: number,
 *   taxCents: number,
 *   shippingCents: number,
 *   totalCents: number,
 *   subtotal: number,
 *   tax: number,
 *   shipping: number,
 *   total: number,
 *   isFreeShipping: boolean,
 *   amountUntilFreeShipping: number,
 * }}
 */
export function calculateTotals(cart) {
  // Sum each line in cents (round each line to avoid accumulating fractional cents)
  const subtotalCents = cart.reduce((acc, item) => {
    return acc + Math.round(item.price * 100) * item.quantity;
  }, 0);

  const taxCents      = Math.round(subtotalCents * TAX_RATE);

  const isFreeShipping = subtotalCents >= Math.round(FREE_THRESHOLD * 100);
  const shippingCents  = isFreeShipping ? 0 : Math.round(SHIPPING_COST * 100);

  const totalCents = subtotalCents + taxCents + shippingCents;

  // Amount still needed to unlock free shipping (0 when already free)
  const amountUntilFreeShippingCents = isFreeShipping
    ? 0
    : Math.round(FREE_THRESHOLD * 100) - subtotalCents;

  return {
    subtotalCents,
    taxCents,
    shippingCents,
    totalCents,
    subtotal:                subtotalCents / 100,
    tax:                     taxCents / 100,
    shipping:                shippingCents / 100,
    total:                   totalCents / 100,
    isFreeShipping,
    amountUntilFreeShipping: amountUntilFreeShippingCents / 100,
  };
}

/**
 * Escape a string for safe insertion as HTML text content.
 * Use when building HTML via template literals (not needed with textContent).
 * @param {string} str
 * @returns {string}
 */
export function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build a star-rating string (★ / ☆) for a given 0–5 rate.
 * @param {number} rate
 * @returns {string}  5-character star string.
 */
export function buildStars(rate) {
  const full  = Math.round(rate);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}
