# Architecture Overview

## High-level
- Next.js (pages router); React 19; Tailwind v4 + Preline UI
- Authentication: Firebase client SDK (email/password) + custom claims
- Authorization: Next API routes verify Firebase ID token via Firebase Admin SDK and enforce roles
- Data sources:
  - Internal: Firestore (users/admins) via Admin SDK on server; client SDK on client for auth
  - External: AlphaDrafts backend (Cloud Run) for metrics/users/projects/subscriptions

## Key modules
- Contexts
  - AuthProvider: current user state (firebase)
  - ClaimsProvider: custom claims + token state; refresh helpers
  - DashboardProvider: role flags, active dashboard
- Middleware (API routes)
  - authMiddleware: verifies Bearer token, populates req.user with roles from custom claims
  - requiredRole: enforces role presence
  - validateRequest: wraps express-validator
- API clients
  - utils/api/apiClient.ts: axios instance attaching ID token; retries on 401 expired token

## Data flow
1. User logs in → Firebase issues ID token
2. axios apiClient attaches ID token to requests
3. Next API route:
   - authMiddleware verifies token and loads custom claims; req.user set
   - requiredRole checks role; validateRequest validates payload
   - Handler performs Firestore/Admin SDK ops and returns standardized JSON
4. For platform data, components request Cloud Run backend with ID token in header

## Files by concern
- Auth/Claims: context/*, hooks/auth/*, utils/auth/*
- Admin mgmt APIs: pages/api/v1/admins/*, middleware/*
- Lists & UI: components/users/*, components/subscription/*, components/project/*
- SEO: utils/seo/CustomHead.tsx (set noindex)

## Known architectural issues
- Mixed data sources (internal Next API vs external backend) require explicit documentation and clear error contracts
- Custom claims misuse: avoid non-JSON fields; keep claims small; store metadata in Firestore instead
