# StudentHub

A Next.js-based platform for student job management and recruitment.

## Implemented Features

### Authentication & Profile
- Multi-step registration flow with comprehensive profile building
- Login with email/password
- Profile management including:
  - Personal information
  - Education history
  - Work experience
  - Skills assessment
  - Document uploads (Civil ID, Driver's License)
  - Profile photo and video introduction

### Dashboard
- Activity tracking
- Assignment management
- Banking information
- Chat system
- Company interactions
- Interview scheduling
- Payment processing
- Wallet management
- Work history and logging

### Additional Features
- Internationalization support (i18next)
- Error tracking (Sentry)
- Analytics integration (Mixpanel)
- Form validation (Zod)
- UI Components (shadcn/ui)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Documentation

Detailed documentation can be found in the `/docs` directory:

- [Features Documentation](./docs/features/README.md)
- [Architecture Overview](./docs/architecture/README.md)
- [API Documentation](./docs/api/README.md)

## Tech Stack

- Next.js 15.0.3
- TypeScript
- Redux Toolkit
- TailwindCSS
- shadcn/ui
- Zod
- i18next
- Sentry
- Mixpanel
