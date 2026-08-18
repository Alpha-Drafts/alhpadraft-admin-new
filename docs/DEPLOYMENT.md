# Deployment Process

## Targets

- Likely Vercel or similar for Next.js app
- Requires server-side execution for API routes (Node runtime) with access to FIREBASE_SERVICE_ACCOUNT_KEYS

## Steps

1. Configure environment variables in the hosting platform (see docs/ENVIRONMENT.md)
2. Build

```
yarn build
```

3. Start (prod)

```
yarn start
```

## Notes

- Remove next-sitemap from postbuild for admin app (package.json). Admin should not expose sitemap.
- Ensure robots.txt disallows all crawling (serve a static robots.txt or configure next-sitemap with policies)
- Secure headers (CSP, HSTS) recommended; consider next-safe middleware or custom headers in next.config
- Rotate Firebase service account keys regularly. Scope permissions minimally.

## Observability

- Add logging for privileged API routes (create/remove admin; password update)
- Consider connecting to Cloud Logging or a SIEM for audit compliance

## Rollbacks

- Keep previous successful deployment available for rollback
- Verify that environment variables are versioned separately from code deploys
