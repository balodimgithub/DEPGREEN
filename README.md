# DEPGREEN
This is an application meant to solve most of Africa environment pollution problems, with regular and In-demand requests for waste disposal, reports for mis-conducts of environmental regulations, earn during waste disposal through re-usable plastic recycling, a constant learning platform with DEPGREEN-AI. We aim to gear Africa waste disposal system to be fully Green.
# DEPGREEN — Client Application (MVP)

A Next.js client-side application for DEPGREEN's fast, regular waste
disposal system, built from the product specification. This is the
**household/business client app** only — the spec assumes a separate
agent-side application exists and is out of scope here.

## Stack

| Layer | Spec | This build |
|---|---|---|
| Framework | Next.js | Next.js 14, App Router, JavaScript |
| Auth | Clerk | Mocked in `src/context/AuthContext.js` — same function shape (`signUp`, `signIn`, `signOut`), backed by `localStorage` instead of a live Clerk project |
| Storage | Supabase (connected to Clerk) | Mocked inside the same context — swap the internals for Supabase calls once credentials are connected |
| Animation | Motion | `framer-motion`, used in the loading Modal, StatusModal, page transitions, and button taps |
| Styling | Tailwind, uniform color scheme | Tailwind, single green + nude token set (see below) |
| Payments | Paystack | Mocked "pay now" flow in `home` and `tracker` pages that mirrors the Paystack redirect → callback lifecycle. Swap in `react-paystack` / `PaystackPop.setup()` with a real public key when available. |

No real Clerk, Supabase, or Paystack credentials are connected in this
environment, so those three integrations are stubbed behind the same
interface the real SDKs would expose. Every page consumes `useAuth()` /
`useApp()`, not a vendor SDK directly — so swapping in live services is a
matter of rewriting the inside of those two context files, not touching
any page.

## Color decisions

DEPGREEN's own brief called for "the defined green and nude color
combination." The palette (`tailwind.config.js`) is:

- `forest` `#17352A` — primary dark green. Navigation, headlines, the
  onboarding background. Reads as "clean, grounded, evergreen."
- `moss` `#3B7D53` — the working green. Every primary action (Pay, Continue,
  Submit) uses this so the whole app has one consistent "go" color.
- `leaf` `#8FC29B` — light accent for success states, confirmation chips,
  and the completed segment of the Cycle Ring.
- `sand` `#F3EBDA` — warm nude background across every screen, standing in
  for "clean paper" rather than clinical white.
- `clay` `#C9A97E` — nude secondary, used for borders, dividers, and
  unfinished progress states (e.g. the empty arc of the Cycle Ring).
- `rust` `#AE4E2E` / `amber` `#B9840F` — reserved strictly for error and
  pending states, so they read as meaningful signals rather than part of
  the everyday palette.

Typography is a single variable font (Geist, bundled locally — no external
font fetch, since this sandbox has no network access to Google Fonts) used
across weights 400–900. Headings sit at 800–900, body copy at 400, and
data/countdowns use the monospace cut — deliberately using weight contrast
on one family instead of mixing multiple typefaces, per the spec's
instruction to keep styling "uniform … not random."

### Signature element — the Cycle Ring

DEPGREEN's whole premise is a **predictable, recurring** collection
cycle. `src/components/ui/CycleRing.js` is a literal cycle: an SVG ring
that empties as a household moves through its 30-day window, with the day
count at its centre. It appears on Home and the System Tracker so the
core value proposition (regular, trackable pickup) is the first thing a
user sees and the thing they check every day.

## Structure

```
src/
  app/
    page.js                  Onboarding
    sign-up/page.js           Multi-step sign-up (account type → names →
                               contact/verification → set)
    sign-in/page.js
    forgot-password/page.js
    reset-password/page.js
    (app)/                    Authenticated shell (top nav / bottom nav,
                               auth guard)
      layout.js
      home/page.js
      tracker/page.js
      profile/page.js
      marketplace/page.js
      messages/page.js
  components/ui/
    Typography.js              Header, Subheader, Paragraph, Label, ErrorMessage, Eyebrow
    Input.js, Button.js
    Modal.js                   Shared loading modal (header/subheader/paragraph slots)
    StatusModal.js              Shared success/pending/failed modal
    HistoryGoBack.js
    CycleRing.js                Signature visual
    Nav.js                      TopNav (desktop) + BottomNav (mobile)
  context/
    AuthContext.js              Mock Clerk + Supabase
    AppContext.js                Global cycle/payment/marketplace/messages state (Context API)
  data/sets.js                  Mock neighborhood/set data
```

## What's implemented against the spec

- Onboarding → multi-step Sign Up (Household vs Business, freehold vs
  leasehold, names, contact + ownership-proof upload, set assignment) →
  Sign In → Forgot/Reset Password, all sharing the Modal, StatusModal,
  Input, Button, and HistoryGoBack components.
- Home: days-to-pickup Cycle Ring, Paystack-style contribution CTA
  (₦5,000 freehold / ₦1,000 per leasehold tenant / ₦8,000 business, per
  the financial analysis), and a "Make a donation" flow.
- System Tracker: same cycle countdown, a payment gate that mirrors the
  rule that agents won't route to a set until its contribution is
  complete, and a demo control to simulate an agent completing pickup
  (advances the cycle).
- Profile: password change, referral link, profile picture, plastics
  submission (photo → mocked weigh + visual-grade valuation), and upload
  for the person responsible for rent.
- Marketplace: "Tools Owned" (auto-seeded from the Capex equipment list)
  and "Explore" (order more/replacement equipment).
- Messages: the five described threads — Set, Neighborhood, Household,
  direct Agent DM, and a DepGreen AI assistant that replies with
  cleaning/recycling guidance.

## Sentry / error-tracking notes

Sentry itself isn't wired up in this sandbox (no network egress to
sentry.io), but the app is structured to make adding it a drop-in
change: every async, user-triggered action (`signUp`, `signIn`, payment,
plastics submission) is isolated in a single `try/catch` at the call
site, in the same shape Sentry's `Sentry.captureException` would need —
so the next step is to add `@sentry/nextjs`, wrap `next.config.mjs` with
`withSentryConfig`, and add `Sentry.captureException(err)` inside each of
those existing `catch` blocks.

## Running locally

```bash
npm install
npm run dev
```
