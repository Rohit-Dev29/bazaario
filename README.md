# Bazaario — E-commerce Starter (Amazon/Flipkart-style)

A full-stack marketplace starter: Next.js storefront + Node/Express/MongoDB API.
This is a **working core**, not a finished production platform — see the roadmap
at the bottom for what a real launch still needs.

## What's included

**Backend** (`/backend`)
- JWT auth (register/login/logout) with hashed passwords, HTTP-only cookies
- Role-based access: `customer`, `seller`, `admin`
- Product catalog: search, filter (category/price/rating), sort, pagination, text search
- Multi-seller support (products belong to a seller)
- Reviews & ratings
- Cart-to-order flow with **server-side price/stock re-validation** (never trusts client prices)
- Order lifecycle: pending → processing → shipped → delivered, plus payment status
- Rate limiting on auth routes, Helmet security headers, centralized error handling
- Seed script with sample categories/products/users

**Frontend** (`/frontend`)
- Next.js App Router, Tailwind
- Home page, category browse, search/filter results, product detail
- Cart (persisted locally), checkout with address form, order confirmation, order history
- Login/register
- Custom design system (not a default template — see design notes below)

## Running it locally

### Backend
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET at minimum
npm install
npm run seed               # optional: loads sample data
npm run dev                 # starts on http://localhost:5000
```
You'll need a MongoDB instance — either local (`mongodb://localhost:27017/bazaario`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                 # starts on http://localhost:3000
```

Seed logins (after `npm run seed`):
- Admin: `admin@bazaario.test` / `AdminPass123`
- Seller: `seller@bazaario.test` / `SellerPass123`

## What's NOT built yet (roadmap to a real launch)

This starter gets you a working browse → cart → checkout → order flow. A real
Amazon/Flipkart-style business also needs:

1. **Payment gateway completion** — the checkout page has payment method
   selection wired, but you still need to integrate the actual Razorpay/Stripe
   client SDK + server webhook to confirm payment and call `markOrderPaid`.
2. **Image uploads & storage** — currently products take image URLs directly;
   you'll want S3/Cloudinary upload for real sellers.
3. **Admin dashboard** — a UI for managing products, orders, users (the API
   endpoints support it via role checks, but there's no admin frontend yet).
4. **Seller dashboard** — sellers currently need to hit the API directly to
   list products; a UI for that is a natural next step.
5. **Search infrastructure** — MongoDB text search works for a starter, but at
   scale you'll want Elasticsearch/Algolia/Meilisearch for typo-tolerance,
   faceting, and speed.
6. **Inventory/concurrency safety** — stock decrement happens per-order but
   isn't wrapped in a DB transaction; under high concurrency you'd want
   MongoDB transactions or an optimistic-locking pattern.
7. **Notifications** — order confirmation emails/SMS aren't wired up.
8. **Testing** — no automated tests yet; add integration tests before scaling
   the team on this codebase.
9. **Infrastructure** — deployment (e.g. Vercel for frontend, Render/Railway/
   AWS for backend + MongoDB Atlas), CI/CD, monitoring, backups.
10. **Legal/compliance** — for India specifically: GST invoicing, refund/
    cancellation policy pages, and payment aggregator KYC (Razorpay requires
    business registration).

## Design notes

The visual identity ("Bazaario") uses a deep indigo + marigold palette and a
serif display face (Fraunces) — deliberately avoiding the generic
cream-background/terracotta-accent look common in AI-generated storefronts.
Category cards on the homepage are styled like market stall signage as a
small signature touch tied to the "marketplace" concept.
