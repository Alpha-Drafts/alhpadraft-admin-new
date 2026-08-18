# Environment Variables and Configuration

## Summary
The admin app relies on Firebase (client + admin) and the AlphaDrafts backend. Configure these values via .env files or deployment platform secrets.

## Files
- .env.local.example → template
- firebase.ts → client SDK init (uses NEXT_PUBLIC_FIREBASE_*)
- firebaseAdmin.ts → admin SDK init (uses FIREBASE_SERVICE_ACCOUNT_KEYS)
- constants/auth.ts → API_BASE_URL derived from NEXT_PUBLIC_NODE_ENV
- utils/others/envUtils.ts → URL per environment; used for password reset continue URLs

## Required variables

Client (NEXT_PUBLIC_*)
- NEXT_PUBLIC_NODE_ENV: local | development | staging | production
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- (optional) NEXT_PUBLIC_MEASUREMENT_ID (unused in admin)
- NEXT_PUBLIC_LOCAL_URL
- NEXT_PUBLIC_DEVELOPMENT_URL
- NEXT_PUBLIC_STAGING_URL
- NEXT_PUBLIC_PRODUCTION_URL

Server-side only
- FIREBASE_SERVICE_ACCOUNT_KEYS: stringified JSON service account

## Example (.env.local)
```
NEXT_PUBLIC_NODE_ENV="development"

NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

FIREBASE_SERVICE_ACCOUNT_KEYS='{"type":"service_account", ... }'

NEXT_PUBLIC_LOCAL_URL="http://localhost:3000"
NEXT_PUBLIC_DEVELOPMENT_URL="https://admindev.alphadrafts.com"
NEXT_PUBLIC_STAGING_URL="https://adminstaging.alphadrafts.com"
NEXT_PUBLIC_PRODUCTION_URL="https://admin.alphadrafts.com"
```

## Notes
- Do not commit secrets
- Service account must have permissions to read/set custom claims and read/write the relevant Firestore collections
- For staging, consider pointing API_BASE_URL to a staging backend; constants/auth.ts currently toggles only dev/prod
