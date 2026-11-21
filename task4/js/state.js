/**
 * state.js — Single source of truth for cart state.
 *
 * Uses a pub/sub (observer) pattern so any number of UI listeners can
 * subscribe and be notified on every cart change — no direct coupling.
 */

import { loadCart, saveCart } from './storage.js';

/** @type {CartItem[]} */
let cart = loadCart();

/** @type {Set<function>} */
const subscribers = new Set();

/** Notify all subscribers with the current cart snapshot. */
function notify() {
  const snapshot = getCart();
  for (const fn of subscribers) fn(snapshot);
}

/**
 * Subscribe to cart changes.
 * @param {function(CartItem[]): void} fn  Called immediately with current state,
 *                                         then on every future change.
 * @returns {function} Unsubscribe function.
 */
export function subscribe(fn) {
  subscribers.add(fn);
  fn(getCart());                // fire immediately so the caller can render
  return () => subscribers.delete(fn);
}

/**
 * Returns a shallow copy of the cart array (immutable snapshot).
 * @returns {CartItem[]}
 */
export function getCart() {
  return cart.map(item => ({ ...item }));
}

/**
 * Add a product to the cart. If it already exists, increment quantity.
 * @param {Product} product
 */
export function addItem(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id:       product.id,
      title:    product.title,
      price:    product.price,
      image:    product.image,
      quantity: 1,
    });
  }
  persist();
  notify();
}

/**
 * Remove an item entirely from the cart.
 * @param {number} id  Product id.
 */
export function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  persist();
  notify();
}

/**
 * Increment the quantity of a cart item by 1.
 * @param {number} id  Product id.
 */
export function incrementItem(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += 1;
    persist();
    notify();
  }
}

/**
 * Decrement the quantity of a cart item by 1.
 * Removes the item entirely when quantity would reach 0.
 * @param {number} id  Product id.
 */
export function decrementItem(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (item.quantity <= 1) {
    removeItem(id);
  } else {
    item.quantity -= 1;
    persist();
    notify();
  }
}

/**
 * Remove all items from the cart.
 */
export function clearCart() {
  cart = [];
  persist();
  notify();
}

/** Persist to localStorage after every mutation. */
function persist() {
  saveCart(cart);
}
