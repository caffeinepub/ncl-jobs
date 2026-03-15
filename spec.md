# NCL Jobs

## Current State
The site has a full application form with:
- A $20 Stripe payment flow (redirects to Stripe checkout)
- BTC payment option with QR code
- Payout method selection (BTC, PayPal, Gift Card)
- App.tsx handles Stripe session callbacks, payment verification, and submission gated behind payment
- ConfirmationView shows payout summary after payment

## Requested Changes (Diff)

### Add
- WhatsApp contact button/section with number +12028169872 so applicants can reach us directly
- A prominent "Contact us on WhatsApp" CTA (link: https://wa.me/12028169872) visible in the form section and/or footer

### Modify
- ApplicationForm: remove all payment sections (BTC panel, Stripe note, payout method cards and fields, fee language in heading/subheading). Form should submit directly without payment.
- ApplicationForm: update submit button to say "Submit Application" (no fee reference)
- App.tsx: remove all Stripe session handling, payment state, payout state, and related imports. On form submit, call submitApplication directly (without paymentIntentId — pass empty string or omit if possible).
- ConfirmationView: remove payout details section; simplify to just show name, position, and a thank-you message with the WhatsApp contact number for follow-up.
- Section header: remove "— $20 Fee" from the heading and fee disclaimer from subheading.

### Remove
- All BTC payment UI and QR code image reference
- All Stripe checkout session creation
- All payout method selection (BTC/PayPal/Gift Card)
- Payment error states in the form
- Processing payment overlay in App.tsx
- Fee-related assurance badges at the bottom of the form

## Implementation Plan
1. Rewrite ApplicationForm.tsx: keep name/email/whatsapp/position/message fields; remove payout, BTC, Stripe sections; submit button says "Submit Application"; add WhatsApp contact link below the form.
2. Rewrite App.tsx: remove Stripe/payment/payout logic; on form submit call submitApplication directly; simplified confirmation state.
3. Rewrite ConfirmationView.tsx: remove payout details; show applicant name, position, and WhatsApp contact info for follow-up.
