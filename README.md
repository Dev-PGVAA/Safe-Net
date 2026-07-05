# Safe-Net Admin Panel

Full-featured admin panel for the Safe-Net LMS platform, built with Next.js 16, React 19 and TypeScript. The backend API runs on NestJS 10 with Prisma ORM and PostgreSQL.

## 📋 Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup & Docker](#-setup--docker)
- [Troubleshooting](#-troubleshooting)
- [Useful Docker Commands](#-useful-docker-commands)

## ✨ Features

- 📊 **Dashboard:** Interactive platform statistics with auto-refresh every 30 seconds.
- 👥 **User management:** Full CRUD cycle, role management, blocking and detailed activity analytics.
- 📚 **Content management:** Stages → Courses → Lessons hierarchy, Markdown support and 6 types of practice tasks.
- 📈 **Analytics:** Detailed reports on course completion, average scores and platform growth.

## 🛠 Tech Stack

| Layer        | Technologies                                                      |
| :----------- | :---------------------------------------------------------------- |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Radix UI, TanStack Query v5 |
| **Backend**  | NestJS 10, Prisma 7, PostgreSQL, Passport JWT, Argon2             |
| **Tooling**  | Docker, Zod, Axios, Lucide React, Framer Motion                   |

## 📦 Setup & Docker

### Step 1: Clone and start containers

```bash
git clone https://github.com/Dev-PGVAA/Safe-Net.git
cd Safe-Net
docker-compose up -d
```

Make sure the `safe-net-postgres` container is running (`docker-compose ps`). The database listens on port **5433**.

### Step 2: Environment setup (server)

Create `server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/safenet?schema=public
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
FRONTEND_URL=http://localhost:3000
```

**Note:** Port 5433 is used to avoid conflicts with a local PostgreSQL instance on 5432.

### Step 3: Initialize the database and run

1. **Install dependencies:** run `npm install` in both `client` and `server`.
2. **Database:** in `server`, run `npx prisma migrate dev` and `npx prisma db seed`.
3. **Verify:** run `npm run check-db` to confirm the PostgreSQL connection.

## 🆘 Troubleshooting

- **Connection refused:** check the container status (`docker-compose ps`) and make sure port 5433 is not taken by another process.
- **Authentication failed:** verify the username (`postgres`) and password (`postgres`) in `.env`.
- **Database does not exist:** if the database wasn't created automatically, run `docker-compose exec postgres psql -U postgres` and execute `CREATE DATABASE safenet;`.
- **Relation does not exist:** migrations haven't been applied. Run `npx prisma migrate dev`.

## 🗂 Useful Docker Commands

- `docker-compose down -v` — stop containers and wipe database data completely.
- `docker-compose logs -f postgres` — tail database logs in real time.
- `npx prisma studio` — launch the browser GUI for managing data.
