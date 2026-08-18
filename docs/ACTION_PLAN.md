# Jira-Ready Action Plan

Group: P0 — Critical fixes

1. Fix error helper to return correct status
- Title: Fix send500Error to always return non-200 error status
- Problem: utils/validation/apiResponses.ts uses res.status(res.statusCode || 500), causing 200 for errors
- Expected outcome: All unhandled errors return 500 JSON with status:"error"
- Acceptance criteria:
  - Simulated thrown error from API handler returns 500
  - No route returns 200 for error paths
- Owner: backend

2. Secure + repair admin role management APIs
- Title: Add authMiddleware to create-role and fix claims payloads
- Problem: create-role.ts lacks authMiddleware; setCustomUserClaims used with serverTimestamp (invalid) in multiple files; DELETE param mismatch (id vs user_id vs userId)
- Expected outcome:
  - All admin routes wrapped with authMiddleware and requiredRole
  - Claims payload only contains JSON-safe fields (e.g., roles, updated_at as number or omit)
  - DELETE consistently uses user_id in validator, handler, and client
- Acceptance criteria:
  - Endpoints 401 unauthenticated; 403 for insufficient role; 2xx for permitted role
  - Manual UI flows succeed for add/remove admin
- Owner: backend

3. Remove Google Analytics from admin app
- Title: Remove GA script from pages/_document.tsx
- Problem: Admin app should not include GA; current usage passes wrong value anyway
- Outcome: No GA scripts in DOM
- Acceptance: View source and Lighthouse verify no GA
- Owner: frontend

4. Disable sitemap generation and disallow robots
- Title: Remove next-sitemap postbuild and serve robots Disallow: /
- Problem: Admin app should not generate discoverable routes
- Outcome: No sitemap.xml generated; robots.txt disallows all
- Acceptance: Build artifact check; test env serves Disallow: /
- Owner: DevOps/frontend

Group: P1 — Next sprint

5. Standardize API param naming and validation
- Title: Align id/user_id naming across client, validators, and handlers
- Problem: Inconsistencies lead to broken routes
- Outcome: Snake_case on server (user_id); client aligns; validators updated
- Acceptance: All API paths tested; code review approval
- Owner: backend

6. Update useAuthGuard to avoid flash of protected content
- Title: Guard should not render while claimsLoading
- Problem: isAuthorised set true during claimsLoading
- Outcome: Loading only; no flash
- Acceptance: Manual UX test; unit test for states
- Owner: frontend

7. Add audit logging for privileged actions
- Title: Log admin add/remove and password updates
- Problem: No audit trail
- Outcome: Logs with actor, action, target, timestamp
- Acceptance: Logs visible in desired sink; docs updated
- Owner: backend/DevOps

8. Enforce MFA for admin roles
- Title: Require MFA enrollment for admin/super_admin
- Problem: Single-factor auth
- Outcome: Backend check; UI prompt
- Acceptance: Non-MFA admins receive 403 with guidance
- Owner: backend/frontend

Group: P2 — Medium-term

9. Consolidate table and state patterns
- Title: Create shared DataTable with empty/error/loading patterns
- Problem: Repetition across lists
- Outcome: One reusable component across features
- Acceptance: All lists migrated
- Owner: frontend

10. Add search and richer filters
- Title: Implement search by email/name; date ranges
- Problem: Limited sorting only
- Outcome: API supports queries; UI implements
- Acceptance: Feature spec tested
- Owner: frontend/backend

11. Strengthen typing of API responses
- Title: Wrap external API responses with adapters and strict types
- Problem: Mixed response shapes
- Outcome: No any in hooks; clear types
- Acceptance: TypeScript passes; runtime verified
- Owner: frontend

12. Expand settings/profile endpoints
- Title: Allow profile updates with validation and audit
- Problem: Only password update now
- Outcome: Display name/photo update flow
- Acceptance: Endpoint + UI + logs
- Owner: backend/frontend

Group: P3 — Backlog

13. CI/CD pipeline
- Title: Add GitHub Actions for lint, typecheck, tests, previews
- Outcome: Green checks required for merge
- Owner: DevOps

14. E2E tests
- Title: Playwright/Cypress smoke tests for core flows
- Outcome: Stable CI runs
- Owner: QA/Frontend

15. Security headers/CSP
- Title: Add next-safe middleware and strong headers
- Outcome: Measurable header improvements
- Owner: DevOps

16. Feature flags and role-based nav pruning
- Title: Hide ineligible routes/actions based on roles
- Outcome: Cleaner UX by role
- Owner: frontend/PM
