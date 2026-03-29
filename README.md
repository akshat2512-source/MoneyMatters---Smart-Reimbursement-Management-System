# Reimbursement Management System

## Stack
- Frontend: React 18 + Vite + TailwindCSS + Zustand
- Backend: Node.js + Express + Prisma ORM
- DB: PostgreSQL
- Auth: JWT

## Quick Start
```bash
# Backend
cd backend && npm install
cp .env.example .env  # fill in your DB url + JWT secret
npx prisma migrate dev --name init
npm run dev

# Frontend
cd frontend && npm install
cp .env.example .env
npm run dev
```

## Team Split (7 hrs)
- P1: Backend — Auth, User CRUD, Company, Currency API
- P2: Backend — Expenses, Approval Engine (sequential/conditional)
- P3: Frontend — Auth pages, Employee dashboard
- P4: Frontend — Manager/Admin dashboards, Rule builder
