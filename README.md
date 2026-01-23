# Kitchen Garden (Website + Android/iOS + Backend API)

A starter mono-repo for **Kitchen Garden**, inspired by Vegease-style “local produce ordering”, with:
- **Seller portal:** add products with image, price, and live quantity
- **Buyer portal:** browse, cart, calories estimate, and **Stripe Checkout**
- **OTP login (phone):** handled by **Supabase Auth** (SMS OTP)

> Build system requirement: **Backend is Maven (Spring Boot)**. Web/Mobile are Node projects (Next.js + Expo) because Maven cannot build React Native/Next.js.

---

## 1) Prerequisites (IntelliJ-friendly)
- IntelliJ IDEA (Community or Ultimate)
- Java 17
- Docker Desktop (recommended for Postgres)
- Node.js 18+ (for web and mobile)

---

## 2) Configure environment
Copy and edit:
- `backend-api/src/main/resources/application.yml` (already has sensible defaults)
- Create `.env` at repo root from `.env.example`

### `.env` values you need
**Supabase**
- `SUPABASE_JWT_JWKS_URL` (JWKS endpoint to validate Supabase JWT)
  - Typically: `https://<project-ref>.supabase.co/auth/v1/keys`
- `SUPABASE_AUDIENCE` (usually `authenticated`)

**Stripe**
- `STRIPE_SECRET_KEY`

---

## 3) Start Postgres (Docker)
From repo root:
```bash
docker compose up -d
```

---

## 4) Run Backend in IntelliJ (Maven)
### Option A: Run from IntelliJ
1. Open the repo folder in IntelliJ
2. Let IntelliJ import Maven project
3. Run: `com.kitchengarden.api.KitchenGardenApiApplication`

### Option B: Run via terminal
```bash
mvn -pl backend-api clean package
mvn -pl backend-api spring-boot:run
```

Backend runs at: `http://localhost:8080`

### GraphQL endpoint
- `POST http://localhost:8080/graphql`

---

## 5) Run Web (Next.js)
```bash
cd web-app
npm install
npm run dev
```
Web runs at: `http://localhost:3000`

---

## 6) Run Mobile (Expo)
```bash
cd mobile-app
npm install
npx expo start
```

---

## 7) Data model
- `users` (implicit via Supabase Auth)
- `products` (seller-owned inventory)
- `orders` (buyer checkout records)

---

## 8) Stripe Checkout
Backend creates a Stripe Checkout Session:
- `POST /payments/checkout-session`
Returns `{ "url": "https://checkout.stripe.com/..." }` for client redirect.

> This starter uses a simple “platform collects payment”. For true marketplace payouts, add **Stripe Connect** onboarding.

---

## 9) Calories estimate (“AI” starter)
A simple calorie-range estimator is included for demo. You can replace it with:
- a nutrition API
- your own nutrition table per product
- an ML model

---

## 10) Where the garden image is used
`web-app/public/kitchenGarden.jpg` is used as the home hero background.

---

## Troubleshooting
- If OTP doesn’t work, enable **Phone Auth** in Supabase and configure an SMS provider.
- If JWT validation fails, verify `SUPABASE_JWT_JWKS_URL` and `SUPABASE_AUDIENCE`.

