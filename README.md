# IIIT-NR Student Campus Hub - Enterprise Production Guide

A full-stack, enterprise-grade web application built for the students and administration of **IIIT-NR (International Institute of Information Technology, Naya Raipur)**.

This production version features:
- **Frontend**: Single-Page Application deployed on **Vercel** with real-time SSE updates and Lucide iconography.
- **Backend**: Express REST API deployed on **Render** with Helmet security headers, rate limiting, and Zod schema validation.
- **Database**: Cloud PostgreSQL deployed on **Neon** with connection pooling (`pg`), parameterized queries, and relational integrity.
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing and server-enforced role authorizations (`student` vs `admin`).
- **Media Storage**: **Cloudinary** cloud integration for permanent CDN hosting of student avatars, event banners, and marketplace photos (storing only HTTPS URLs in the database).

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │               User Browser                   │
                               │   (Desktop, Tablet, or Mobile Phone)        │
                               └──────────────┬───────────────────────────────┘
                                              │
                         HTTPS Requests / SSE │ Static HTML/JS/CSS Assets
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
       ┌─────────────────────────────┐                 ┌─────────────────────────────┐
       │     Render Web Service      │                 │       Vercel Hosting        │
       │  (Node.js / Express API)    │                 │     (Frontend SPA App)      │
       │   - Helmet Security         │◄─── CORS ───────┤   - index.html, app.js      │
       │   - JWT Auth & Roles        │     Whitelist   │   - config.js               │
       │   - Rate Limiters & Zod     │                 │   - Tailwind UI Themes      │
       └──────────────┬──────────────┘                 └─────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
┌──────────────────┐      ┌─────────────────────────────┐
│  Neon Serverless │      │       Cloudinary CDN        │
│    PostgreSQL    │      │  (Global Media Cloud CDN)   │
│  - 9 Mapped Rel. │      │  - Student Profile Photos   │
│    Tables & Keys │      │  - Campus Event Banners     │
│  - SSL Pooling   │      │  - Marketplace Listing Pics │
└──────────────────┘      └─────────────────────────────┘
```

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Provision the PostgreSQL Database on Neon

1. Sign up or log in to **[Neon Console](https://console.neon.tech/)**.
2. Click **Create Project**, name it `iiitnr-campus-hub`, and select your nearest cloud region (e.g. `AWS us-east-2`).
3. Under your project dashboard, copy the **Connection string** (make sure **Pooled connection** and `sslmode=require` are enabled).
   - Format: `postgresql://[user]:[password]@[neon-hostname]/campus_hub?sslmode=require`
4. Initialize the PostgreSQL schema and seed the initial academic data and admin account:
   ```bash
   # Set the DATABASE_URL environment variable locally
   set DATABASE_URL="postgresql://[user]:[password]@[neon-hostname]/campus_hub?sslmode=require"

   # Initialize all 9 PostgreSQL tables
   npm run db:init

   # Seed official timetable, library resources, notices, events, and chief admin
   npm run db:seed
   ```
   *(Alternatively, copy and run the raw SQL from [`db/schema.sql`](file:///c:/Users/Raju/OneDrive/Desktop/it/db/schema.sql) in the Neon SQL Editor).*

---

### Step 2: Configure Cloudinary Media Storage

1. Create a free account at **[Cloudinary](https://cloudinary.com/)**.
2. Navigate to your **Cloudinary Dashboard**.
3. Copy the following three credentials:
   - **Cloud Name** (`CLOUDINARY_CLOUD_NAME`)
   - **API Key** (`CLOUDINARY_API_KEY`)
   - **API Secret** (`CLOUDINARY_API_SECRET`)
4. *(Optional)* Alternatively, copy the single `CLOUDINARY_URL` string under Account Details.

---

### Step 3: Deploy Backend on Render

1. Log in to **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository containing the project.
4. Configure the Web Service settings:
   - **Name**: `iiitnr-campus-hub-backend`
   - **Region**: Nearest to your Neon database region (e.g. `Oregon (US West)` or `Frankfurt`)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root `.`)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: `Free`
5. Expand **Advanced** and set:
   - **Health Check Path**: `/api/health`
6. Add the following **Environment Variables** in Render:
   | Key | Value / Source |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Your Neon pooled connection string |
   | `JWT_SECRET` | Generate a 64+ char random hex string (or click **Generate**) |
   | `FRONTEND_URL` | Your Vercel frontend URL (e.g. `https://iiitnr-campus-hub.vercel.app`) |
   | `ADMIN_NAME` | `Revanth` |
   | `ADMIN_EMAIL` | `revanth0246@gmail.com` |
   | `ADMIN_PASSWORD` | `revanth0406` |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
7. Click **Create Web Service**. Wait for the build to finish until Render reports **Live**.
8. Copy your public Render URL: `https://iiitnr-campus-hub-backend.onrender.com`.

---

### Step 4: Deploy Frontend on Vercel

1. Open [`config.js`](file:///c:/Users/Raju/OneDrive/Desktop/it/config.js) and set your live Render backend URL:
   ```javascript
   window.__API_BASE_URL__ = 'https://iiitnr-campus-hub-backend.onrender.com/api';
   ```
2. Commit and push your changes to your Git repository:
   ```bash
   git add config.js
   git commit -m "Configure production backend URL for Vercel"
   git push origin main
   ```
3. Log in to **[Vercel Dashboard](https://vercel.com/)**.
4. Click **Add New...** > **Project** and import your Git repository.
5. In the project configuration:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command**: Leave default or `echo 'Build complete'`
   - **Output Directory**: Leave blank or `./`
6. Click **Deploy**. Vercel will deploy the site in under 30 seconds.
7. Copy your public Vercel URL (e.g. `https://iiitnr-campus-hub.vercel.app`).

---

### Step 5: Connect CORS & Verify Real-Time Sync

1. Return to the **Render Dashboard** for your backend service.
2. Under **Environment**, update `FRONTEND_URL` to match your exact Vercel production URL:
   ```
   FRONTEND_URL = https://iiitnr-campus-hub.vercel.app
   ```
3. Render will automatically redeploy with the updated CORS whitelist.
4. Open your Vercel URL in your browser:
   - Check the top navbar badge: it should display **"Backend API Online"** with a green pulsing dot.
   - Click **Sign In** and authenticate with the Admin credentials or register a new student account.

---

## 🔐 Complete Environment Variables Reference

### Backend (Render / Production)

| Variable | Required? | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/campus_hub?sslmode=require` | Connection pool URL for Neon / PostgreSQL. |
| `JWT_SECRET` | **Yes** | `d4e5f6...` *(64 hex characters)* | Secret used to sign and verify JWT authentication tokens. |
| `NODE_ENV` | **Yes** | `production` | Enables production security optimizations, Helmet, and strict logging. |
| `PORT` | Auto | `5000` | Port on which Express listens (Render injects this automatically). |
| `FRONTEND_URL` | **Yes** | `https://iiitnr-campus-hub.vercel.app` | Whitelisted origin allowed to make cross-origin requests to the REST API. |
| `ADMIN_NAME` | Optional | `Revanth` | Full name of the primary administrator account created during seeding. |
| `ADMIN_EMAIL` | Optional | `revanth0246@gmail.com` | Email address for initial administrative login. |
| `ADMIN_PASSWORD` | **Yes** | `revanth0406` | Password hashed with bcrypt for the primary administrator account. |
| `ADMIN_DEPARTMENT` | Optional | `Office of Academic Affairs` | Administrative department displayed in profiles and circulars. |
| `ADMIN_DESIGNATION` | Optional | `Chief Administrator` | Professional title for official announcements. |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | `iiitnr-cloud` | Cloudinary cloud name for media hosting. |
| `CLOUDINARY_API_KEY` | **Yes** | `123456789012345` | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | **Yes** | `abcde_FGHIJKLMNOPQRSTUV123` | Cloudinary API Secret. |

### Frontend (Vercel / Production)

| Configuration Item | Location | Example | Description |
| :--- | :--- | :--- | :--- |
| `window.__API_BASE_URL__` | [`config.js`](file:///c:/Users/Raju/OneDrive/Desktop/it/config.js) | `https://iiitnr-campus-hub-backend.onrender.com/api` | Direct backend API base URL sent by all frontend `fetch()` requests. |

---

## 🖼️ Cloudinary Image Handling

All image uploads (avatars, event banners, marketplace photos) are decoupled from the database:
1. **Selection & Compression**: The client selects an image from their gallery; the browser center-crops and compresses the image to a temporary data URL.
2. **Cloudinary Upload**: The client dispatches the image to `POST /api/upload/avatar`, `POST /api/upload/banner`, or `POST /api/upload/exchange`.
3. **CDN URL Return**: Cloudinary decodes the image, stores it on their CDN, and returns an HTTPS URL (`https://res.cloudinary.com/...`).
4. **Clean Relational Storage**: The database stores **only the HTTPS URL** string in `users.avatar`, `events.banner`, or `marketplace_listings.image_url`. Raw base64 data is **never** persisted in the database.
5. **Local Fallback**: If Cloudinary credentials are not configured during local development, the backend saves the image to `backend/uploads/` and serves it locally.

---

## 🧪 Testing & Verification Suites

Run the automated test suites to ensure full system compliance:

```bash
# 1. Verify 52 REST API security tests (JWT, roles, bcrypt, Zod, Helmet, rate limiting)
node backend/scripts/test-api-security.js

# 2. Verify PostgreSQL migration artifacts (schema, connection pool, seed scripts)
node scripts/test-pg-pool.js

# 3. Verify zero localStorage data leakage in frontend
node scripts/audit-localstorage.js

# 4. Check frontend syntax
node --check app.js
```

---

## 🛡️ Default Administrative Login

| Role | Username / Identifier | Default Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `revanth0246@gmail.com` *(or `admin`)* | `revanth0406` | Timetable editing, resource uploads, announcements, events, student directory, user management |
| **Student** | Any registered Roll No *(e.g. `24DSAI001`)* | Set during registration | Timetable view, coursework tracker, study library, mess reviews, campus exchange |
