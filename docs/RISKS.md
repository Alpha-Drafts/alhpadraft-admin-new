# Known Risks and Limitations

## P0 bugs (must fix)
- send500Error returns 200 in many cases → incorrect error signaling
- Admin management API issues:
  - Missing authMiddleware in create-role.ts
  - Invalid custom claims payload (serverTimestamp)
  - DELETE param mismatch (id vs user_id vs userId)
- GA snippet present and incorrect
- Sitemap/robots exposure for an admin app

## Security
- No MFA enforcement for admins
- No audit logs for privileged actions
- Global window exposures via Preline and 3rd-party libs

## Operational
- Mixed internal/external API sources without a common error contract layer
- Pagination with startAfter + skip fragile under heavy writes

## Product
- Limited search/filtering; no detail views
- Minimal feedback mechanisms (only mailto for contact)

## Testing
- No unit/integration/e2e tests
- No CI pipeline

