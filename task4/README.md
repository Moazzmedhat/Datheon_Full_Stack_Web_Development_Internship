# ShopWave — Modern E-Commerce Storefront

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://datheonfullstackwebdevelopmentinter-nu.vercel.app/)

A complete, production-quality e-commerce UI built with **plain HTML, CSS, and vanilla JavaScript (ES modules)** — no frameworks, no build tools, no libraries.

**Live Demo**: [https://datheonfullstackwebdevelopmentinter-nu.vercel.app/](https://datheonfullstackwebdevelopmentinter-nu.vercel.app/)

---

## Quick Start

Open `index.html` with any static file server that supports ES modules:

```bash
# Option 1 — VS Code Live Server (right-click index.html → Open with Live Server)

# Option 2 — Python
python -m http.server 3000
# then visit http://localhost:3000

# Option 3 — Node.js (npx, no install required)
npx serve .
# then visit http://localhost:3000
```

> [!IMPORTANT]
> ES modules require a server (`http://` or `https://`). Opening `index.html` as a local `file://` URL will cause CORS errors on the `fetch()` import chain.

---

## Project Structure

```
ecommerce/
├── index.html              — Main page (semantic HTML, ARIA roles)
├── tests.html              — Unit test runner (open in browser)
├── README.md
│
├── css/
│   └── styles.css          — All styles (custom properties, responsive grid)
│
└── js/
    ├── main.js             — Entry point: wires everything together
    ├── api.js              — fetchProducts(), CATEGORY_MAP, CATEGORY_LABELS
    ├── state.js            — Cart state: pub/sub, add/remove/increment/decrement/clear
    ├── storage.js          — localStorage persistence with error handling
    ├── utils.js            — formatCurrency, calculateTotals, escapeHTML, buildStars
    └── ui/
        ├── productGrid.js  — Product card rendering + "Add to Cart" delegation
        ├── cartDrawer.js   — Slide-out drawer, order summary, checkout modal
        └── filters.js      — Category filter buttons, product count label
```

---

## Features

### Product Catalog
- Fetches all 20 products from [FakeStoreAPI](https://fakestoreapi.com/products)
- **Loading state** (spinner) while fetching; friendly **error state** with Retry button
- Each card shows: image, title (clamped to 2 lines), price, star rating + review count, category, Add to Cart button
- **Badges**: `Best Seller` (rating.count > 300), `Top Rated` (rating.rate ≥ 4.5)
- **Responsive CSS Grid**: 1 col mobile → 2 col tablet → 4 col desktop
- API text is HTML-escaped before insertion

### Category Filtering
- Buttons: **All / Electronics / Jewelry / Clothing**
- Maps `jewelery` (API typo) → Jewelry; maps both clothing genders → Clothing
- Highlights active filter; shows live product count

### Slide-out Cart Drawer
- Cart icon in header with live item-count badge (animates on change)
- Drawer slides in from the right; dimmed overlay closes on click; `Esc` key also closes
- Each line: thumbnail, title, unit price, quantity ± buttons, line total, remove button
- Decrement at qty 1 → removes item; adding a duplicate → increments qty
- Empty cart state with "Continue Shopping" button
- Event delegation on the grid and cart items list

### Order Summary
| Component | Detail |
|-----------|--------|
| Subtotal  | Σ (price × qty) |
| Tax       | 8% of subtotal |
| Shipping  | \$5.99; free when subtotal ≥ \$50 |
| Total     | Subtotal + Tax + Shipping |

- All arithmetic in **integer cents** (avoids `0.1 + 0.2` float errors)
- Formatted with `Intl.NumberFormat` (USD)
- Hint bar shows how much more is needed for free shipping
- Checkout button opens a confirmation modal; modal close clears the cart

### Persistence
- Cart saved to `localStorage` on every mutation
- Restored on page load; `JSON.parse` wrapped in `try/catch` → falls back to `[]`

---

## Architecture

### State (pub/sub)
`state.js` is the single source of truth. UI modules call `subscribe(fn)` to register a callback that fires immediately (for initial render) and on every subsequent mutation:

```
state.js ──subscribe──▶ cartDrawer.js (re-renders badge + items + summary)
        └─subscribe──▶ (any future listener — no coupling)
```

### Integer-cent arithmetic
```js
// In calculateTotals (utils.js):
const subtotalCents = cart.reduce((acc, item) =>
  acc + Math.round(item.price * 100) * item.quantity, 0);
// All intermediate math stays in cents; divide by 100 only for display.
```

### Accessibility
- Semantic HTML (`<header>`, `<main>`, `<aside>`, `<article>`, `<footer>`)
- `aria-label` on all icon buttons
- `aria-expanded`, `role="dialog"`, `aria-modal`, `aria-hidden` on the drawer
- `role="dialog"` and `aria-modal` on the confirmation modal
- Focus moves to the close button when the drawer opens; returns to the cart toggle when it closes
- `aria-live` regions for product count and cart contents
- Fully keyboard navigable; `Esc` closes the drawer and modal

---

## Running the Tests

Open `tests.html` in a browser (via the same static server):

```
http://localhost:3000/tests.html
```

The test runner uses `console.assert` (as required by the spec) and renders pass/fail results in the page. Tests cover:

- `calculateTotals` — empty cart, single item, free-shipping threshold, quantity multiplication, floating-point safety, mixed items
- State mutations — `addItem`, duplicate deduplication, `incrementItem`, `decrementItem`, decrement-at-1 removal, `removeItem`, `clearCart`
- Pub/sub — `subscribe` fires immediately, unsubscribe prevents further calls

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| ES modules, no bundler | Zero tooling; works with Live Server or any static host |
| Pub/sub in `state.js` | Decouples state from UI — multiple subscribers, no direct imports between UI modules |
| Integer cents in `calculateTotals` | Eliminates IEEE 754 float rounding issues in monetary math |
| Event delegation on grid + cart | One listener per container instead of N listeners per card/item |
| `Intl.NumberFormat` for currency | Locale-aware, handles edge cases automatically |
| `escapeHTML` util | Prevents XSS when injecting API text into `innerHTML` template literals |

---

## Browser Support

Modern browsers supporting ES modules (Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+). No polyfills needed.
