# Singapore Tutoring Agency MVP

A simple zero-cost tutoring agency website/app for Singapore.

## Recommended free tech stack

- Frontend: HTML, CSS, and vanilla JavaScript
- First-version storage: Browser `localStorage`
- Free hosting: GitHub Pages, Netlify, or Cloudflare Pages
- Future scalable database: Supabase free tier
- Future forms/email: Formspree, Resend free tier, or Supabase Edge Functions

This MVP has no install step and no paid services. It is intentionally simple so a beginner can understand it, edit it, and deploy it as a static site.

## Project structure

```text
.
├── index.html              # Homepage and app screens
├── styles.css              # Visual design
├── app.js                  # Form handling, matching, admin dashboard
├── data/
│   └── schema.sql          # Simple scalable database structure
└── README.md               # Setup and deployment guide
```

## Features

- Homepage for a Singapore tutoring agency
- Parent/student enquiry form
- Tutor application form
- Admin dashboard for enquiries and tutor applications
- Tutor matching by subject, level, location, and availability
- WhatsApp/email-style follow-up templates
- Seed sample data so the dashboard is useful immediately
- Beginner-friendly comments in the code

## How to run locally

Option 1: open directly

1. Open `index.html` in your browser.
2. Submit an enquiry or tutor application.
3. Open the Admin tab to view records and matches.

Option 2: run a local server

If you have Python installed:

```bash
python -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Admin access

This MVP does not include real login because it is a static zero-cost prototype. The Admin tab is visible so you can test the workflow.

Before accepting real customer data, add authentication and a real database such as Supabase.

## How to deploy for free

### GitHub Pages

1. Create a GitHub repository.
2. Upload these files.
3. Go to repository Settings -> Pages.
4. Set the source to the main branch root.
5. Save and wait for GitHub to publish your site.

### Netlify

1. Go to Netlify and create a free account.
2. Drag this folder into Netlify Drop, or connect a GitHub repo.
3. No build command is needed.
4. Publish directory should be the project root.

### Cloudflare Pages

1. Create a free Cloudflare account.
2. Create a Pages project from a GitHub repo.
3. No build command is needed.
4. Build output directory should be `/` or left as the root, depending on the UI.

## Suggested scalable upgrade path

1. Replace `localStorage` with Supabase tables using `data/schema.sql`.
2. Add Supabase Auth for the admin dashboard.
3. Add email notifications using Resend or Formspree.
4. Add booking status changes: New, Contacted, Trial Scheduled, Confirmed, Closed.
5. Add tutor verification fields such as NRIC/FIN last 4 digits, documents, and interview notes.

## Important privacy note

This MVP stores form submissions in the browser on the same device. It is suitable for demos, learning, and early prototyping. For real Singapore customer data, use secure storage, admin authentication, HTTPS, and a privacy policy aligned with PDPA expectations.
