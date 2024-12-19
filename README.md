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

# validation 

https://www.npmjs.com/package/zod#basic-usage

# todo 
- add bank detail page not centered 
- invitation page showing 10 but inside no data + no data message not matching 
- need route change animation/ loader, can try moving suspense from layout to inner pages 
- profile page: don't show loader if data available 
- favicon + sep 
- ability to record video and upload
- make sure email verification code are 4 alphanumeric character 
- prefetch next pages : https://stackoverflow.com/questions/72507091/how-to-prefetch-code-for-multiple-pages-from-one-page-request-in-next-js 
  `router.prefetch(url, as)`
- PWA 
- ping for candidate video status and update 


- test chat
- test OneSignal
- google signin deprecated, need to migrate, can try next.js popular auth.js with other option like linkedin, facebook 
 

https://www.figma.com/design/UmcngZ41ORf4DWnYRzqxFm/StudentHub-Components?node-id=219-7957&node-type=frame&m=dev

