# Handover Notes for Future Engineers

## Contacts and ownership
- Product: PM for Admin app
- Engineering: Frontend lead + Backend lead (APIs + Firebase)
- DevOps: CI/CD and secret management owner

## Infrastructure
- Next.js app (likely Vercel or containerized Node)
- Firebase projects: client auth + server admin SDK
- Cloud Run backend (external API_BASE_URL)

## Secrets and access
- FIREBASE_SERVICE_ACCOUNT_KEYS required server-side
- Do not commit secrets; rotate periodically

## Code boundaries
- Admin role management lives in Next API routes using Firebase Admin SDK and Firestore
- Platform data lives in Cloud Run backend; frontend calls it directly
- Keep these concerns separate and documented

## Processes
- Enforce code review; run lint, typecheck, and tests before merge
- After P0 fixes, institute CI and basic e2e smoke tests

## Post-P0 Stabilization
- Add audit logging, MFA, and improve guard behavior
- Unify table components and add search/filters
- Harden error contracts with the external backend

## Release checklist
- All P0s resolved; manual regression of role mgmt and auth flows
- Envs configured for target stage; robots/sitemap verified
- Monitoring/logging in place for privileged actions
