# Security policy

## Supported versions

Security fixes are applied to the **current minor release line** of this repository (see `version` in [`package.json`](package.json)). Older deployments should upgrade to the latest tag on that line.

| Version                             | Supported |
| ----------------------------------- | --------- |
| 1.x (current `1.*` in package.json) | Yes       |
| Older major/minor lines             | No        |

When in doubt, run the latest commit on your release branch and keep dependencies updated (`pnpm audit`, upstream advisories).

## Reporting a vulnerability

**Please do not** open a public GitHub issue for undisclosed security bugs.

1. **Email or private channel**: Contact the repository maintainers with a clear description of the issue, affected versions or commits, and reproduction steps if safe to share.
2. **Scope**: Include relevant components (auth, file uploads, inventory APIs, etc.) and any suspected CWE class if known.
3. **Timeline**: Maintainers will acknowledge receipt when possible and coordinate a fix and disclosure timeline with you.

If you are unsure whether something is a vulnerability, report it anyway and label it as an informational finding.

## Secure configuration reminders

- Set a strong **`BETTER_AUTH_SECRET`** in production (never rely on build placeholders).
- Restrict **`BETTER_AUTH_TRUSTED_ORIGINS`** and **`BETTER_AUTH_BASE_URL`** to real app origins.
- Protect **`DATABASE_URL`**, SMTP credentials, and **Tigris** keys; never commit them to the repo.
