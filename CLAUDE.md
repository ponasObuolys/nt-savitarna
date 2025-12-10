
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NT Vertinimo Savitarna - A property valuation self-service portal and management system (TVS) for 1Partner. The system provides a customer-facing dashboard for viewing property valuation orders and an admin panel for order management.

**Domain**: `vid.vertintojas.pro`

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI components
- **ORM**: Prisma (connected to existing MySQL database)
- **Auth**: NextAuth.js or JWT sessions
- **Database**: MySQL (`ntsmainuser_nts2db`)

## Commands

```bash
# Project setup
npx create-next-app@latest my-tvs --typescript --tailwind --eslint
npm install prisma --save-dev
npm install @prisma/client

# Prisma commands
npx prisma init
npx prisma db pull          # Introspect existing DB structure
npx prisma db push          # Push schema changes
npx prisma generate         # Generate Prisma client

# Development
npm run dev
npm run build
npm run lint
npx tsc --noEmit            # Type check without building
```

## Database Architecture

### Existing Table (Read-Only): `uzkl_ivertink1p`
Contains property valuation requests with fields for contact info, address, property details, features, and order status. Key fields:
- `id`, `token` - Identifiers
- `contact_email` - Links orders to users
- `service_type` (1-4) - Service tier
- `status` - Order status ('paid', 'done', etc.)
- `is_enough_data_for_ai` - Used for automated valuations
- `rc_filename` - PDF report filename
- `priskirta` - Assigned valuator code

### New Table: `app_users`
User authentication table with `email`, `password_hash`, `role` ('client'/'admin').

## Business Logic

### Service Types
| Type | Name | Price |
|------|------|-------|
| 1 | Automatinis vertinimas | 8 EUR |
| 2 | Vertintojo nustatymas | 30 EUR |
| 3 | Kainos patikslinimas (Apžiūra) | Variable |
| 4 | Turto vertinimas (Bankui) | Variable |

### Status Logic
- `service_type == 1 AND is_enough_data_for_ai == 1` → "Atlikta" (Completed)
- `status == 'paid'` → "Apmokėta / Vykdoma" (Paid/In Progress)
- Default → "Laukiama apmokėjimo" (Awaiting Payment)

### PDF Download URL Pattern
```
https://www.vertintojas.pro/d_pdf.php?f={rc_filename}
```

## PRD Workflow (from rules/)

This project uses a structured PRD-to-Tasks workflow:

1. **PRD Creation** (`create-prd.mdc`): Generate PRDs in `/tasks/prd-[feature-name].md` with clarifying questions before writing
2. **Task Generation** (`generate-tasks.mdc`): Convert PRDs to task lists in `/tasks/tasks-prd-[feature-name].md`
3. **Task Processing** (`process-task-list.mdc`): Execute one sub-task at a time, marking complete with `[x]`, wait for user approval between sub-tasks

## Key Integration Points

- User orders linked via `contact_email` field matching authenticated user
- Valuator mapping uses `priskirta` field (hardcoded code → contact info mapping)
- Admin dashboard filters all orders from `uzkl_ivertink1p`
- Monthly revenue calculated by summing service prices based on `service_type`
