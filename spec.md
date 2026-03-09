# Norwegian Cruise Line Jobs

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing/hero section promoting Norwegian Cruise Line high-paying job opportunities
- Job listings section showcasing available positions with attractive pay details
- Application form collecting:
  - Full name
  - Email address
  - WhatsApp number
  - Position of interest
  - Short message / cover letter
- $20 application fee payment via Stripe before form submission
- Admin view to see submitted applications (with authorization)
- Confirmation screen after successful payment and form submission

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select `authorization`, `stripe` Caffeine components
2. Generate Motoko backend with:
   - `submitApplication(name, email, whatsapp, position, message, paymentIntentId)` -> stores application
   - `getApplications()` -> admin only, returns all applications
3. Frontend:
   - Hero section with NCL branding, high-pay messaging, ship imagery
   - Job listings cards (deck crew, hospitality, engineering, culinary, etc.)
   - Application form with all required fields
   - Stripe payment flow ($20 fee) gating form submission
   - Success confirmation page
   - Admin dashboard (logged-in view) showing applicant list
