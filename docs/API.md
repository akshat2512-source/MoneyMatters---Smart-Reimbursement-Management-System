# API Reference

## Auth
POST /api/auth/signup  — { name, email, password, country }
POST /api/auth/login   — { email, password }

## Expenses
POST   /api/expenses        — Submit (Employee)
GET    /api/expenses/my     — My expense history
GET    /api/expenses/team   — Team expenses (Manager/Admin)

## Approvals
GET    /api/approvals/pending      — Pending for current approver
POST   /api/approvals/:id/decide   — { decision: APPROVED|REJECTED, comment }

## Users (Admin)
GET    /api/users                  — All company users
POST   /api/users                  — Create user
PATCH  /api/users/:id/role         — { role }
PATCH  /api/users/:id/manager      — { managerId }

## Company
GET    /api/company/countries      — Country + currency list
GET    /api/company/rate           — ?from=USD&to=INR
POST   /api/company/rules          — Create approval rule
