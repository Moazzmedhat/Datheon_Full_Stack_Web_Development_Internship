/**
 * ui/cartDrawer.js — Slide-out cart drawer UI.
 *
 * Responsibilities:
 *  - Open / close the drawer (CSS transitions + aria attributes)
 *  - Render cart items and order summary from cart state
 *  - Focus management: focus moves into the drawer on open,
 *    returns to the cart toggle button on close
 *  - Event delegation for quantity and remove buttons
 *  - Checkout confirmation modal
 */

import { subscribe, removeItem, incrementItem, decrementItem, clearCart } from '../state.js';
import { calculateTotals, formatCurrency, escapeHTML } from '../utils.js';
import { clearStoredCart } from '../storage.js';

/* ---- DOM refs ---- */
const drawer        = /** @type {HTMLElement} */ (document.getElementById('cart-drawer'));
const overlay       = /** @type {HTMLElement} */ (document.getElementById('cart-overlay'));
const cartToggle    = /** @type {HTMLButtonElement} */ (document.getElementById('cart-toggle'));
const cartClose     = /** @type {HTMLButtonElement} */ (document.getElementById('cart-close'));
const cartCountBadge= /** @type {HTMLElement} */ (document.getElementById('cart-count'));
const itemsEl       = /** @type {HTMLElement} */ (document.getElementById('cart-items'));
const summaryEl     = /** @type {HTMLElement} */ (document.getElementById('cart-summary'));
const confirmModal  = /** @type {HTMLElement} */ (document.getElementById('confirm-modal'));
const modalClose    = /** @type {HTMLButtonElement} */ (document.getElementById('modal-close'));

/** Whether the drawer is currently open. */
let isOpen = false;

/* ================================================================
   Initialise
   ================================================================ */
export function initCartDrawer() {
  // Subscribe to state: re-render on every cart change
  subscribe(renderCart);

  // Open / close controls
  cartToggle.addEventListener('click', openDrawer);
  cartClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Event delegation for cart item controls
  itemsEl.addEventListener('click', handleItemClick);

  // Escape key closes drawer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (isOpen) closeDrawer();
      else if (confirmModal.classList.contains('open')) closeModal();
    }
  });

  // Checkout button (rendered dynamically → delegated from summary)
  summaryEl.addEventListener('click', e => {
    if (e.target.id === 'checkout-btn') openModal();
  });

  // Modal close
  modalClose.addEventListener('click', () => {
    clearCart();
    clearStoredCart();
    closeModal();
    closeDrawer();
  });
}

/* ================================================================
   Drawer open / close
   ================================================================ */
function openDrawer() {
  isOpen = true;
  drawer.classList.add('open');
  overlay.classList.add('visible');
  drawer.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  cartToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Move focus to the close button
  cartClose.focus();
}

function closeDrawer() {
  isOpen = false;
  drawer.classList.remove('open');
  overlay.classList.remove('visible');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  cartToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';

  // Return focus to the trigger
  cartToggle.focus();
}

/* ================================================================
   Modal open / close
   ================================================================ */
function openModal() {
  confirmModal.classList.add('open');
  confirmModal.setAttribute('aria-hidden', 'false');
  modalClose.focus();
}

function closeModal() {
  confirmModal.classList.remove('open');
  confirmModal.setAttribute('aria-hidden', 'true');
  cartToggle.focus();
}

/* ================================================================
   Event delegation for cart item buttons
   ================================================================ */
function handleItemClick(e) {
  const btn = /** @type {HTMLElement} */ (e.target.closest('[data-action]'));
  if (!btn) return;

  const id     = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === 'increment') incrementItem(id);
  else if (action === 'decrement') decrementItem(id);
  else if (action === 'remove')    removeItem(id);
}

/* ================================================================
   Render helpers — called by state subscriber
   ================================================================ */

/**
 * Full re-render of cart UI from latest state.
 * @param {CartItem[]} cart
 */
function renderCart(cart) {
  updateBadge(cart);
  renderItems(cart);
  renderSummary(cart);
}

/**
 * Update the header badge count.
 * @param {CartItem[]} cart
 */
function updateBadge(cart) {
  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
  cartCountBadge.textContent = String(totalQty);
  cartToggle.setAttribute('aria-label', `Open cart (${totalQty} item${totalQty !== 1 ? 's' : ''})`);

  // Pop animation
  cartCountBadge.classList.remove('bump');
  void cartCountBadge.offsetWidth; // force reflow
  cartCountBadge.classList.add('bump');
}

/**
 * Render the scrollable list of cart lines (or empty state).
 * @param {CartItem[]} cart
 */
function renderItems(cart) {
  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon" aria-hidden="true">🛒</span>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started.</p>
        <button class="btn btn-outline" id="continue-shopping">Continue Shopping</button>
      </div>`;
    // Wire up "Continue shopping" → close drawer
    document.getElementById('continue-shopping').addEventListener('click', closeDrawer);
    return;
  }

  itemsEl.innerHTML = cart.map(buildItemHTML).join('');
}

/**
 * Build HTML for a single cart line.
 * @param {CartItem} item
 * @returns {string}
 */
function buildItemHTML(item) {
  const title    = escapeHTML(item.title);
  const image    = escapeHTML(item.image);
  const price    = formatCurrency(item.price);
  const lineTotal= formatCurrency(item.price * item.quantity);

  return `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="cart-item-thumb-wrap">
        <img
          class="cart-item-thumb"
          src="${image}"
          alt="${title}"
          loading="lazy"
          width="52"
          height="52"
        />
      </div>

      <div class="cart-item-title">${title}</div>

      <div class="cart-item-remove">
        <button
          data-action="remove"
          data-id="${item.id}"
          aria-label="Remove ${title} from cart"
          title="Remove item"
        >&times;</button>
      </div>

      <div class="cart-item-controls">
        <button
          class="qty-btn"
          data-action="decrement"
          data-id="${item.id}"
          aria-label="Decrease quantity of ${title}"
        >&minus;</button>
        <span class="qty-value" aria-live="polite" aria-label="Quantity: ${item.quantity}">
          ${item.quantity}
        </span>
        <button
          class="qty-btn"
          data-action="increment"
          data-id="${item.id}"
          aria-label="Increase quantity of ${title}"
        >+</button>
        <span class="cart-item-line-total" aria-label="Line total: ${lineTotal}">
          ${lineTotal}
        </span>
        <span class="visually-hidden">(@&nbsp;${price} each)</span>
      </div>
    </div>`;
}

/**
 * Render the order summary (subtotal / tax / shipping / total).
 * @param {CartItem[]} cart
 */
function renderSummary(cart) {
  if (cart.length === 0) {
    summaryEl.innerHTML = '';
    return;
  }

  const t = calculateTotals(cart);

  const shippingHTML = t.isFreeShipping
    ? `<span class="shipping-free">Free</span>`
    : formatCurrency(t.shipping);

  const freeShippingHint = !t.isFreeShipping
    ? `<p class="free-shipping-hint">
         Add ${formatCurrency(t.amountUntilFreeShipping)} more for free shipping!
       </p>`
    : `<p class="free-shipping-hint">🎉 You've unlocked free shipping!</p>`;

  summaryEl.innerHTML = `
    <div class="summary-row">
      <span>Subtotal</span>
      <span>${formatCurrency(t.subtotal)}</span>
    </div>
    <div class="summary-row">
      <span>Tax (8%)</span>
      <span>${formatCurrency(t.tax)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shippingHTML}</span>
    </div>
    ${freeShippingHint}
    <hr class="checkout-divider" aria-hidden="true"/>
    <div class="summary-row total">
      <span>Total</span>
      <span>${formatCurrency(t.total)}</span>
    </div>
    <button id="checkout-btn" class="btn btn-primary btn-full" aria-label="Proceed to checkout">
      Checkout — ${formatCurrency(t.total)}
    </button>`;
}
