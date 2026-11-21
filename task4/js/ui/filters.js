/**
 * ui/filters.js — Category filter buttons and product count label.
 *
 * Renders filter buttons into #filter-bar and updates #product-count.
 * Calls onFilter(categoryKey) when the user clicks a filter.
 */

import { CATEGORY_LABELS } from '../api.js';

const filterBar    = /** @type {HTMLElement} */ (document.getElementById('filter-bar'));
const countDisplay = /** @type {HTMLElement} */ (document.getElementById('product-count'));

/** Category keys to render as buttons, in display order. */
const FILTER_KEYS = ['all', 'electronics', 'jewelry', 'clothing'];

/** Currently active filter key. */
let _activeKey = 'all';

/** Callback invoked when the active filter changes. */
let _onFilter = (_key) => {};

/**
 * Initialise the filter bar.
 * @param {function(string): void} onFilter  Called with the new category key.
 */
export function initFilters(onFilter) {
  _onFilter = onFilter;

  // Render buttons once
  filterBar.innerHTML = FILTER_KEYS.map(key => `
    <button
      class="filter-btn${key === _activeKey ? ' active' : ''}"
      data-filter="${key}"
      aria-pressed="${key === _activeKey}"
    >${CATEGORY_LABELS[key]}</button>
  `).join('');

  // Event delegation — one listener for all buttons
  filterBar.addEventListener('click', e => {
    const btn = /** @type {HTMLElement} */ (e.target.closest('[data-filter]'));
    if (!btn) return;
    setActive(btn.dataset.filter);
  });
}

/**
 * Update which button is highlighted and fire the onFilter callback.
 * @param {string} key
 */
function setActive(key) {
  if (key === _activeKey) return;
  _activeKey = key;

  for (const btn of filterBar.querySelectorAll('.filter-btn')) {
    const isActive = btn.dataset.filter === key;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  }

  _onFilter(key);
}

/**
 * Update the product count display.
 * @param {number} count
 * @param {string} categoryKey
 */
export function updateCount(count, categoryKey) {
  const label = categoryKey === 'all' ? 'all categories' : CATEGORY_LABELS[categoryKey];
  countDisplay.textContent = `${count} product${count !== 1 ? 's' : ''} in ${label}`;
}
