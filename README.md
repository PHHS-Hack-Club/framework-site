# Framework 2027 Site

Framework 2027 Site is the website and operations platform for `Framework 2027`, a same-day software hackathon run by PHHS Hack Club for Bergen County students. It combines a public-facing event site with role-based dashboards for hackers, judges, and organizers.

This is not just a landing page. The app also handles applications, check-in, team and project submission, judging workflows, organizer communications, and ceremony exports.

## What The App Does

- Public marketing site with event overview, schedule, FAQ, location, and contact form
- Hacker accounts with email verification, application submission, team management, and project submission
- Judge accounts with assignment queues and scoring flows
- Organizer dashboard for reviewing applications, managing judges and members, running check-in, configuring the event, sending email, and exporting PowerPoint decks
- File uploads for school ID verification

## Tech Stack

- `Next.js 16` with the App Router
- `React 19` and `TypeScript`
- `Tailwind CSS 4` for styling
- `Prisma 7` with PostgreSQL via `@prisma/adapter-pg`
- Custom JWT session auth stored in HTTP-only cookies
- `bcryptjs` for password hashing
- `nodemailer` for verification, reset, organizer, and contact email
- MinIO / S3-compatible object storage for uploaded files
- `PptxGenJS` for organizer export decks
- `Framer Motion`, `GSAP`, `Lenis`, `Three.js`, and `Leaflet` for the frontend experience
- `PM2` for the production process defined in [`ecosystem.config.js`](./ecosystem.config.js)

## Core Product Areas

### Public Site

The homepage in [`app/page.tsx`](./app/page.tsx) is built from reusable sections in [`app/components`](./app/components). It presents the event identity, rules, schedule, FAQ, venue info, and contact flow.

### Hacker Flow

Hackers can:

- sign up and verify email
- submit an application
- upload school ID proof
- create or join a team
- submit and edit a project once organizers open the project flow

Key pages live under [`app/hacker`](./app/hacker).

### Judge Flow

Judges receive project assignments and submit scores against active judging rounds. The main UI is under [`app/judge`](./app/judge), backed by APIs in [`app/api/judge`](./app/api/judge).

### Organizer Flow

Organizers can:

- review and update application decisions
- manage members, judges, and admins
- manage schedule items and awards
- control theme release and project submission state
- assign judging rounds
- send bulk email
- export ceremony and score decks as `.pptx`

Organizer pages live under [`app/organizer`](./app/organizer).

## Data Model

The Prisma schema in [`prisma/schema.prisma`](./prisma/schema.prisma) models:

- users, sessions, and roles
- applications and review status
- teams and team membership
- projects
- event config
- judging rounds, assignments, and scores
- awards and winners
- schedule events
- email logs

## Environment

Copy [`.env.example`](./.env.example) to `.env` and fill in the required values.

Important variables:

- `DATABASE_URL`
- `APP_URL`
- `JWT_SECRET`
- `SMTP_*`
- `CONTACT_EMAIL_TO`
- `MINIO_*`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL locally:

```bash
docker compose up -d
```

3. Create `.env` from `.env.example` and update values as needed.

If you use the bundled [`docker-compose.yml`](./docker-compose.yml), make sure `DATABASE_URL` points at port `5432`. The sample env file currently uses a different port.

4. Run Prisma migrations:

```bash
npm run db:migrate
```

5. Optionally seed the database:

```bash
npm run seed
```

6. Start the dev server:

```bash
npm run dev
```

The app is configured around `http://localhost:2027` in the example env file, so keep `APP_URL` aligned with however you run it locally.

## Scripts

- `npm run dev` - start Next.js in development
- `npm run build` - build the app, then restart the PM2 process
- `npm run start` - run the production server directly
- `npm run lint` - run ESLint
- `npm run db:migrate` - run Prisma dev migrations
- `npm run db:studio` - open Prisma Studio
- `npm run seed` - seed the database

## Deployment Notes

- Production process settings live in [`ecosystem.config.js`](./ecosystem.config.js)
- The PM2 app runs `next start -p 2027`
- PostgreSQL can be brought up locally with [`docker-compose.yml`](./docker-compose.yml)
- Uploaded files expect an S3-compatible backend such as MinIO
- Email features require valid SMTP credentials

## Additional Docs

- Plain-English project summary: [`project-desc.md`](./project-desc.md)
