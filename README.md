# DramaBreak

Interactive prototype of a microdrama app: genre picker → swipe preview clips → $1 trial paywall → simulated checkout (card / Apple Pay / Google Pay) → browse library.
Vite + React 18 + Tailwind CSS 3 + shadcn/ui (Radix) + lucide-react.

## Run

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # outputs dist/

## Deploy to Vercel

1. Push this folder to a Git repo and import it at vercel.com/new (Framework preset: **Vite** is auto-detected), or run `npx vercel` from this folder.
2. No environment variables needed. Build command `npm run build`, output directory `dist`.

## Flow (client-side state routing in `src/App.jsx`)

| Screen | File | Notes |
| --- | --- | --- |
| 1 Genres | `screens/GenreScreen.jsx` | Real poster wall (`src/assets/posters`, list in `lib/posters.js`). Max 2 genres, min 1 (inline error + shake). "Proceed to Trial" → 2 |
| 2 Reels | `screens/ReelsScreen.jsx` | Swipe (touch/mouse/wheel), ↑/↓/Space or "Swipe for More". Two clips picked from your genres, then → 3 |
| 3 Paywall | `screens/PaywallScreen.jsx` + `components/PosterCollage.jsx` | Heading, price, social-proof pill and a static poster collage (all 15 dramas, no motion, unaffected by scrolling). Card / Apple Pay / Google Pay picker (bottom sheet). Start Trial → checkout. Back arrow → 4 |
| 3b Checkout | `screens/PaymentApp.jsx` | Card: validated form (number/Luhn, expiry, CVC, name). Apple Pay & Google Pay: confirmation sheets. Then processing → success → 4. Cancel → 3 |
| 4 Library | `screens/LibraryScreen.jsx` | 15 mock dramas, search, genre chips, My List, details sheet, episode player |

Demo cards: `4242 4242 4242 4242` (any future expiry, any CVC) succeeds; `4000 0000 0000 0002` is declined. Prices live in `lib/data.js` (`TRIAL_PRICE` $1 today, `PLAN_PRICE` $7.99/quarter after the trial).
Episode 1 of every show is free; other episodes are locked until the trial is active (locked taps open the paywall).

## Making it real

* **Video**: `components/ClipSlide.jsx` (swipe feed) is animated art standing in for video: replace its background layer with a `<video>` (muted/loop, `playsInline`) and drive `paused`/`muted` from the same props. Its mute button only toggles state until real audio is attached.
* **Payments**: `PaymentApp.jsx` is a mock. For a real $1 trial that converts to a quarterly plan, use a provider that supports card + Apple Pay + Google Pay + subscriptions with trials (e.g. Stripe Checkout or Paddle). Create the session in a Vercel function and unlock premium from a webhook, never from a client-side "success".
* **Brand marks**: `components/PayLogo.jsx` uses stylised stand-ins for Card / Apple Pay / Google Pay. Swap in the official assets per each brand's guidelines.
* **Posters**: only Screen 1 uses the real images so far. `components/Poster.jsx` still draws generated art for the rest; see `lib/posters.js` to reuse the images elsewhere.
* **Data**: `lib/data.js` holds all mock content.
