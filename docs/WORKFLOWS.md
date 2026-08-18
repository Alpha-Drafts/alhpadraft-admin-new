# Main Admin Workflows

## 1) Admin sign-in

- UI: pages/index.tsx → components/auth/LoginForm.tsx
- Hook: hooks/auth/useLogin.ts → Firebase signInWithEmailAndPassword
- Redirect: to /admin/overview

## 2) Route guard

- Layout: layouts/AdminLayout.tsx
- Hook: hooks/auth/useAuthGuard.ts → requires role "admin" (admin or super_admin)
- Behavior: while loading, shows LoadingState; redirects to /unauthorised if forbidden

## 3) View Overview metrics

- UI: components/overview/index.tsx
- Data: GET {API_BASE_URL}/v1/admin/metrics with Bearer token via apiClient

## 4) Browse Users / Subscriptions / Projects

- Components: components/users/UserTable.tsx, components/subscription/SubscriptionTable.tsx, components/project/ProjectTable.tsx
- Data: GET endpoints under {API_BASE_URL}/v1/admin/\* (paginated)
- Filters: sort and status parameters

## 5) Manage Admins (super_admin only for create/remove)

- UI: components/admins/\* (Switcher, AdminTable, CreateAdminForm)
- Endpoints: pages/api/v1/admins/\*
  - GET /api/v1/admins → list admins (admin role)
  - GET /api/v1/admins/admins-count → counts (admin role)
  - GET /api/v1/admins/check-status?email&role → validate email (super_admin role)
  - POST /api/v1/admins { user_id, role } → grant role(s) (super_admin role)
  - DELETE /api/v1/admins?user_id&role → remove role(s) (super_admin role)

## 6) Update own password

- UI: components/settings/Account.tsx
- Endpoint: POST /api/v1/admins/auth/update-password (admin role)

## 7) Forgot / Reset password

- Forgot: POST /api/v1/admins/auth/forgot-password (public) → email link
- Reset: POST /api/v1/admins/auth/reset-password (public) with oobCode
- Verify email: pages/auth/index.tsx handles verifyEmail mode with applyActionCode
