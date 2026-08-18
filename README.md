# Trivir Public School Website

A modern, fast, and fully functional school website with a custom CMS admin panel built on React, Express, and SQLite (Drizzle ORM).

## Features
- **Public Website**: Single-page smooth scrolling website, fully responsive, and fast.
- **Admin Portal**: Complete CMS to manage school info, homepage content, teachers, facilities, gallery, events, notices, videos, and admission enquiries.
- **Authentication**: Secure JWT-based authentication with forced password change on first login.
- **Database**: Embedded SQLite database via `libsql` for portable, reliable storage.

## How to Install
1. Clone the repository.
2. Run `npm install` to install all dependencies.
3. Make sure you have Node.js v18+ installed.

## How to Run Locally
1. Run `npm run dev` to start the development server.
2. The website will be available at `http://localhost:3000`.
3. The server runs both the Vite frontend and the Express backend simultaneously.

## How Authentication Works
- Authentication uses **JSON Web Tokens (JWT)**.
- Passwords are securely hashed using `bcryptjs`.
- The admin login route (`/api/login`) returns a token that is stored in the browser's `localStorage`.
- All `/api/admin/*` routes are protected and require the `Authorization: Bearer <token>` header.
- On first login, the admin is redirected to the Settings page to change the default password.

## How Database Works
- The app uses an embedded SQLite database (`.data/trivir.db`).
- **Drizzle ORM** is used to define the schema and query the database.
- The schema is located in `src/db/schema.ts`.
- The database is automatically seeded on the first startup if it's empty (via `src/db/seed.ts`).

## How to Create the First Admin
- The first admin is automatically created by the seed script when the server starts for the first time.
- **Username/Email**: `admin@trivirpublicschool.com`
- **Initial Password**: `admin`

## Admin Login URL
Access the admin portal at:
`/admin/login`

## How to Change Password
1. Log in to the Admin Portal.
2. Navigate to **Settings** in the sidebar.
3. Enter your current password and the new password.
4. Click **Change Password**.

## How to Deploy
1. The app can be deployed to any Node.js hosting provider (like Google Cloud Run, Railway, Render, etc.).
2. Set the environment variable `NODE_ENV=production`.
3. Generate a strong random string and set it as the `JWT_SECRET` environment variable.
4. Run `npm run build` to create the production build.
5. Run `npm start` (which executes `node dist/server.cjs`) to start the production server.
6. The SQLite database file will be stored in the `.data` directory. If you are deploying to an ephemeral environment (like standard Docker containers without volumes), make sure to mount a persistent volume to `.data` or `/uploads` so that your database and uploaded images aren't lost on restart.

## How to Connect a Custom Domain
- Depending on your hosting provider, you can link a custom domain in the provider's dashboard (e.g., Cloud Run Custom Domains, or Vercel/Render Domains section).
- Update your DNS records (A/CNAME) to point to the provided hosting URL.

## Static HTML/CSS Requirement Note
The public frontend (`src/pages/PublicPage.tsx`) uses a clean component architecture with Tailwind CSS. If you decide to host the public website statically on GitHub Pages in the future:
1. You can build the React app and host the `dist/` folder.
2. Note that GitHub Pages **cannot** run the Express backend or SQLite database.
3. To do this, you would need to export the dynamic database content as static JSON files during the build process, or separate the backend to another host (like Cloud Run) and update the API URLs in the static frontend.
