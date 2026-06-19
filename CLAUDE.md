# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A French pizza ordering site ("Pizza Club Fameck") built with Next.js 15 (App Router, Turbopack) + React 19. Customers browse a menu, search/filter it, build a cart, and check out with Stripe; orders are persisted to Supabase. There's a password-gated `/admin` dashboard for managing incoming orders.

## Commands

```bash
npm run dev      # start dev server (Turbopack), http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # run the production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

There is no test suite configured in this repo.

Required env vars (see `.env.local`, not committed): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `ADMIN_PASSWORD`.

## Architecture

### The real page tree vs. orphaned components

`app/page.tsx` composes the live site as: `Hero` → `InfoBand` → `MenuPage` → `Footer`, plus a `CheckoutFlow` sheet triggered from state. `MenuPage` is the actual menu screen and itself renders `CategoryNav`, `StatusBanner`, `SearchBar`, `BestsellerStrip`, `MenuCard`, `ProductModal`, `SuggestionToast`, `HelpButton`, `CartBar`, and `CartSheet`.

**`Menu.tsx`, `MenuItem.tsx`, `Cart.tsx`, `OrderForm.tsx`, `PaymentSection.tsx`, `Confirmation.tsx`, and `SuccessScreen.tsx` are not imported anywhere** — they're an earlier, unused alternate implementation of the menu/checkout flow (a multi-step page-based flow vs. the sheet-based `CheckoutFlow` that's actually wired up). Don't assume editing these affects the live site; check actual imports before touching them, and prefer the `MenuPage`/`CheckoutFlow` components for any menu or checkout changes.

### Data flow — everything fans out from `lib/menu-data.ts`

`MENU: MenuItem[]` in `lib/menu-data.ts` is the single source of truth for the catalog (no CMS/DB for menu content). Three other lib modules derive behavior from it without any external API:
- `lib/search.ts` — local fuzzy/rule-based search engine (budget parsing, halal/veggie filters, Levenshtein typo tolerance, category-priority ranking). Powers `SearchBar`.
- `lib/suggestions.ts` — cross-sell/upsell rules engine (`CROSS_SELL_RULES`, size upsell, "bottle offer" progress at 30–50€ subtotal, opening-hours status via `getOpenStatus`). Powers `SuggestionToast`, `StatusBanner`, `CartSheet`'s cross-sell strip.
- `lib/category-config.ts` — category metadata (emoji, label, gradient) used by `CategoryNav`/`MenuPage`.

`lib/images-config.ts` maps product IDs to image URLs (Unsplash by default, swappable to local `/public/images/...` files — see `PHOTOS-README.md` for the swap workflow and the full product-ID-to-filename reference table). `ProductImage` falls back to a colored placeholder with the product name if the image 404s.

### Cart, checkout, and orders

- `store/cartStore.ts` — Zustand store, persisted to localStorage (`pizza-club-cart`). Cart item identity is `menuItemId` + `size` (via `makeId`), so the same pizza in two sizes is two line items.
- `lib/order-history.ts` — separate from the cart store; persists the last 3 completed orders and saved customer info (name/phone/address) to localStorage for pre-filling the checkout form. Pure localStorage, no server round-trip.
- Checkout payment flow: `CheckoutFlow` (sheet, step machine: type → info → payment → success) creates a Stripe PaymentIntent via `POST /api/create-payment-intent`, confirms it client-side with `@stripe/react-stripe-js`, then on success calls `POST /api/orders` to write the order to Supabase and calls `saveOrder`/`clearCart`.
- `app/api/orders/route.ts` is a thin CRUD wrapper over a Supabase `orders` table (GET list, POST create, PATCH status) — used by both checkout (POST) and `/admin` (GET + PATCH for status updates).
- Delivery fees are zone-based, not distance-based: `lib/menu-data.ts` defines `DELIVERY_ZONES` (city list → flat fee), looked up via `getDeliveryFee(city)`.

### Styling

Tailwind v4 via `@theme` tokens defined directly in `app/globals.css` (no `tailwind.config.*` file). Color/spacing tokens (`--color-primary`, `--phi-*` golden-ratio spacing scale, etc.) and several reusable component classes (`.btn-red`, `.menu-card`, `.cat-pill`, `.sheet-panel`, `.size-option`, `.StripeElement`, etc.) live there — check `globals.css` before introducing a new ad hoc style, many UI patterns are already class-based rather than per-component Tailwind utility soup. The site's palette is dark (`#1A1A1A` background, `#242424` cards, `#CC2222` red accent) — most components set colors via inline `style` rather than Tailwind gray/red utility classes, so when touching visuals match that convention rather than reintroducing `bg-white`/`text-gray-*` utilities.

Two fonts are loaded in `app/layout.tsx` via `next/font/google` and exposed as CSS vars: `Playfair Display` (`--font-display`, headings) and `Inter` (`--font-sans`, body).
