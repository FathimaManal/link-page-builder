# Link Page Builder

Create a public page of links that anyone can visit without an account.

## Stack

- **Backend:** Node.js, Express, MongoDB Atlas (Mongoose), bcryptjs, JWT
- **Frontend:** React (Vite, plain JS), React Router, Axios, plain CSS

## Setup

### 1. Server

```bash
cd server
cp .env.example .env    # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:5000
```

### 2. Client

```bash
cd client
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm install
npm run dev             # http://localhost:5173
```

### 3. Seed demo data (optional)

```bash
cd server
node seed.js
# username: demo   email: demo@example.com   password: demo1234
# Public page: http://localhost:5173/u/demo
```

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | JWT | Get current user |
| PUT | /api/auth/me | JWT | Update bio |
| GET | /api/links | JWT | Get your links |
| POST | /api/links | JWT | Create a link |
| PUT | /api/links/:id | JWT (owner) | Update title/url/order |
| DELETE | /api/links/:id | JWT (owner) | Delete a link |
| GET | /api/public/:username | — | Public profile — no token needed |

## Notes

**Render free-tier cold starts:** If deployed to Render's free tier, the server sleeps after ~15 minutes of inactivity. The first request after sleep takes 30–60 seconds to wake up. This is a Render hosting limitation, not an app bug.
