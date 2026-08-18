# AlphaDrafts Admin App Repository Report

## Overview

- Repository: `alpha-drafts-admin-app`
- Branch: `dev`
- Purpose: Admin dashboard for AlphaDrafts, built to manage users, admins, projects, subscriptions, settings, and system operations.
- Stack: `Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `Firebase`, `React Query`, `Framer Motion`.

## Key Features

- Firebase-based authentication and admin access
- Role-based middleware and protected admin flows
- Modular UI components for admin, auth, overview, project, settings, subscription, and users
- Shared table and dashboard utilities for fast data presentation
- Sitemap generation via `next-sitemap`
- Commitlint, Prettier, ESLint, and Husky for code quality

## Project Structure

- `pages/` - Next.js pages, public routes, admin pages, auth pages, API routes
- `components/` - feature-specific components and UI modules
- `common/` - reusable common components, tables, icons, and UI utilities
- `constants/` - centralized app constants for routes, auth, forms, plans, tables, users, and more
- `context/` - React providers and application state management (auth, dashboard)
- `middleware/` - route-level middleware for auth, role checks, and validation
- `database/` - database utilities and Firebase data access
- `utils/` - helpers for API calls, auth, formatting, validation, SEO, and other utilities
- `styles/` - CSS files and theme utilities
- `types/` - TypeScript type definitions across the app
- `docs/` - supporting project documentation and workflows

## Important Configuration

- `package.json`
  - `dev`: `next dev`
  - `build`: `next build`
  - `postbuild`: `next-sitemap`
  - `start`: `next start`
  - `format`: `prettier . --write --ignore-path .gitignore`
  - `lint`: `next lint . --fix`
  - `check-types`: `tsc --noEmit --pretty`
  - `analyze`: `cross-env ANALYZE=true next build`

- `next.config.ts`
  - `reactStrictMode: true`
  - image domains configured for Firebase storage, Google, Unsplash, and more
  - redirect from `/auth/login` to `/`

- `site.metadata.ts`
  - site metadata for SEO, social, and app branding
  - app title: `AlphaDrafts Admin Panel`
  - site URL: `https://admin.alphadrafts.com`

## Deployment & URLs

- Local: `http://localhost:3000`
- Development: `https://admindev.alphadrafts.com`
- Staging: `https://adminstaging.alphadrafts.com`
- Production: `https://admin.alphadrafts.com`

## Notes

- The project is organized to separate shared UI logic from feature-specific pages and components.
- Firebase client and admin integration are likely defined in `firebase.ts` and `firebaseAdmin.ts`.
- `docs/` contains architecture, deployment, handover, and workflow guidance that can be used to understand the project.

## Suggested Next Steps

- Review `pages/admin/`, `components/admin/`, and `middleware/` to map the exact admin flows.
- Inspect `firebase.ts` / `firebaseAdmin.ts` for authentication and database configuration.
- Use existing docs for deployment instructions and environment setup.
