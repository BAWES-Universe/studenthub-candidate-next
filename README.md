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
- make sure email verification code are 4 alphanumeric character 
- PWA 

- prefetch next pages : https://stackoverflow.com/questions/72507091/how-to-prefetch-code-for-multiple-pages-from-one-page-request-in-next-js 
  `router.prefetch(url, as)`
- ping for candidate video status and update 


- test chat
- test OneSignal
- google signin deprecated, need to migrate, can try next.js popular auth.js with other option like linkedin, facebook 
 

# design 

https://www.figma.com/design/UmcngZ41ORf4DWnYRzqxFm/StudentHub-Components?node-id=219-7957&node-type=frame&m=dev

# generate static site 

Generate a Static Build
Ensure your Next.js app uses Static Site Generation (SSG) or fully static content.
Update the next.config.js file:

`module.exports = {
    output: 'export',
};`

This tells Next.js to export the app as static HTML.
Run the build and export commands:

`npm run build
npx next export`

This generates a out folder containing your static files.


# prisma 

## init 

`npx prisma`

## Usage

  `npx prisma [command]`

### Commands

       init  Set up Prisma for your app
   generate  Generate artifacts (e.g. Prisma Client)
         db  Manage your database schema and lifecycle
    migrate  Migrate your database
     studio  Browse your data with Prisma Studio
   validate  Validate your Prisma schema
     format  Format your Prisma schema
    version  Displays Prisma version info
      debug  Displays Prisma debug info

### Flags

  --preview-feature   Run Preview Prisma commands
  --help, -h          Show additional information about a command

## init from existing db 
- npx prisma db pull
- npx prisma generate - generate Prisma Client.


*** WARNING ***

The following models were ignored as they do not have a valid unique identifier or id. This is currently not supported by Prisma Client:
  - "candidate_eval_dept_ques"
  - "candidate_evaluation_answer"

These objects have comments defined in the database, which is not yet fully supported. Read more: https://pris.ly/d/database-comments
  - Type: "field", name: "campaign.utm_source"
  - Type: "field", name: "campaign.utm_medium"
  - Type: "field", name: "campaign.utm_campaign"
  - Type: "field", name: "campaign.utm_content"
  - Type: "field", name: "campaign.utm_term"
  - Type: "field", name: "campaign.total_revenue"
  - Type: "field", name: "candidate.candidate_gender"
  - Type: "field", name: "candidate.candidate_driving_license"
  - Type: "field", name: "candidate.candidate_preferred_time"
  - Type: "model", name: "candidate_eval_dept_ques"
  - Type: "field", name: "candidate_eval_dept_ques.dept_id"
  - Type: "model", name: "candidate_eval_ques"
  - Type: "field", name: "candidate_eval_ques.ceq_uuid"
  - Type: "field", name: "candidate_evaluation.can_eval_uuid"
  - Type: "field", name: "candidate_evaluation.dept_id"
  - Type: "field", name: "candidate_evaluation_answer.can_eval_uuid"
  - Type: "field", name: "chat_message.status"
  - Type: "field", name: "company.staff_id"
  - Type: "field", name: "company.company_bonus_commission"
  - Type: "field", name: "company_request.status"
  - Type: "field", name: "exam_question.question_type"
  - Type: "field", name: "invitation.invitation_status"
  - Type: "field", name: "invitation.job_interest_uuid"
  - Type: "field", name: "job.gender"
  - Type: "field", name: "job.status"
  - Type: "field", name: "job_interest.status"
  - Type: "field", name: "major.data_source"
  - Type: "field", name: "monthly_salary_contract.salary_day"
  - Type: "field", name: "request.company_id"
  - Type: "field", name: "request.contact_uuid"
  - Type: "field", name: "request.request_position_type"
  - Type: "field", name: "request.request_position_title"
  - Type: "field", name: "request_interview.status"
  - Type: "field", name: "request_interview.staff_id"
  - Type: "field", name: "request_interview.interview_note"
  - Type: "field", name: "setting.code"
  - Type: "field", name: "suggestion.suggestion_status"
  - Type: "field", name: "transfer_candidate.bank_id"
  - Type: "field", name: "transfer_candidate.bonus_commission"
  - Type: "field", name: "transfer_file_entry.debit_narrative"
  - Type: "field", name: "transfer_file_entry.credit_narrative"