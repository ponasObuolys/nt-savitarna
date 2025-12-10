# NT Vertinimo Savitarna - Task List

Generated based on PRD analysis and brainstorming session.

## Relevant Files

- `prisma/schema.prisma` - Database schema with introspected tables + app_users
- `src/app/layout.tsx` - Root layout with providers
- `src/app/page.tsx` - Landing/home page
- `src/app/api/auth/register/route.ts` - User registration endpoint
- `src/app/api/auth/login/route.ts` - User login endpoint
- `src/app/api/auth/logout/route.ts` - User logout endpoint
- `src/app/api/orders/route.ts` - Orders API for client
- `src/app/api/admin/orders/route.ts` - Admin orders API
- `src/app/api/admin/stats/route.ts` - Admin statistics API
- `src/app/dashboard/page.tsx` - Client dashboard
- `src/app/dashboard/orders/page.tsx` - Client order list
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/admin/orders/page.tsx` - Admin orders management
- `src/app/admin/products/page.tsx` - Admin products (dummy)
- `src/components/ui/*` - Shadcn/UI components
- `src/components/layout/Header.tsx` - Navigation header
- `src/components/layout/Sidebar.tsx` - Admin sidebar
- `src/components/orders/OrderTable.tsx` - Reusable order table
- `src/components/orders/StatusBadge.tsx` - Order status display
- `src/lib/auth.ts` - JWT utilities and middleware
- `src/lib/prisma.ts` - Prisma client singleton
- `src/lib/constants.ts` - Service types, prices, valuator mapping
- `src/types/index.ts` - TypeScript type definitions
- `.env` - Environment variables (DATABASE_URL, JWT_SECRET)

### Notes

- All API routes use Next.js App Router conventions (`route.ts`)
- Shared components should be built before page-specific components
- Admin and client share OrderTable component with different data sources

---

## Tasks

- [x] 1_ Project Setup & Configuration
  - [x] 1.1_ Create Next.js project with TypeScript, Tailwind, ESLint
  - [x] 1.2_ Install dependencies: prisma, @prisma/client, bcryptjs, jose, @types/bcryptjs
  - [x] 1.3_ Initialize Prisma with MySQL provider
  - [x] 1.4_ Configure .env with DATABASE_URL and JWT_SECRET
  - [x] 1.5_ Install and configure Shadcn/UI with default components (button, input, card, table, badge, dialog, dropdown-menu, form, label, sonner)

- [x] 2_ Database Layer
  - [x] 2.1_ Run `npx prisma db pull` to introspect existing uzkl_ivertink1p table
  - [x] 2.2_ Add app_users model to schema.prisma (id, email, password_hash, role, created_at)
  - [x] 2.3_ Run `npx prisma db push` to create app_users table
  - [x] 2.4_ Generate Prisma client with `npx prisma generate`
  - [x] 2.5_ Create src/lib/prisma.ts singleton for Prisma client
  - [x] 2.6_ Create src/types/index.ts with TypeScript interfaces for orders and users

- [x] 3_ Constants & Configuration
  - [x] 3.1_ Create src/lib/constants.ts with SERVICE_TYPES map (1-4 with names and prices)
  - [x] 3.2_ Add VALUATOR_MAP with priskirta codes → contact info
  - [x] 3.3_ Add STATUS_LOGIC helper function for determining display status
  - [x] 3.4_ Add PDF_BASE_URL constant for report downloads

- [x] 4_ Authentication System
  - [x] 4.1_ Create src/lib/auth.ts with JWT sign/verify functions using jose
  - [x] 4.2_ Add password hash/compare utilities using bcryptjs
  - [x] 4.3_ Create src/app/api/auth/register/route.ts POST endpoint
  - [x] 4.4_ Create src/app/api/auth/login/route.ts POST endpoint
  - [x] 4.5_ Create src/app/api/auth/logout/route.ts POST endpoint (clear cookie)
  - [x] 4.6_ Create src/middleware.ts for protected route authentication
  - [x] 4.7_ Add role-based route protection (admin vs client paths)

- [x] 5_ Shared Layout Components
  - [x] 5.1_ Create src/components/layout/Header.tsx with logo, nav, user menu
  - [x] 5.2_ Create src/components/layout/Sidebar.tsx for admin navigation
  - [x] 5.3_ Create src/components/layout/Footer.tsx with minimal info
  - [x] 5.4_ Update src/app/layout.tsx with Tailwind setup and font configuration
  - [x] 5.5_ Create src/app/(auth)/layout.tsx for auth pages (login/register)
  - [x] 5.6_ Create src/app/(dashboard)/layout.tsx for authenticated client pages
  - [x] 5.7_ Create src/app/(admin)/layout.tsx for admin pages with sidebar

- [x] 6_ Authentication Pages
  - [x] 6.1_ Create src/app/(auth)/login/page.tsx with email/password form
  - [x] 6.2_ Create src/app/(auth)/register/page.tsx with registration form
  - [x] 6.3_ Add form validation and error handling
  - [x] 6.4_ Implement redirect logic after successful auth
  - [x] 6.5_ Add loading states and toast notifications

- [x] 7_ Shared Order Components
  - [x] 7.1_ Create src/components/orders/StatusBadge.tsx with color-coded badges
  - [x] 7.2_ Create src/components/orders/ServiceTypeBadge.tsx for service type display
  - [x] 7.3_ Create src/components/orders/OrderTable.tsx with sortable columns
  - [x] 7.4_ Create src/components/orders/OrderRow.tsx with action buttons (integrated in OrderTable)
  - [x] 7.5_ Create src/components/orders/DownloadButton.tsx for PDF downloads
  - [x] 7.6_ Create src/components/orders/ValuatorInfo.tsx for assigned valuator display

- [x] 8_ Client Portal - Dashboard
  - [x] 8.1_ Create src/app/api/orders/route.ts GET endpoint (filtered by user email)
  - [x] 8.2_ Create src/app/(dashboard)/dashboard/page.tsx with order summary cards
  - [x] 8.3_ Create src/app/(dashboard)/dashboard/orders/page.tsx with full order table
  - [x] 8.4_ Add order detail modal or expandable row (info in table)
  - [x] 8.5_ Implement PDF download functionality with rc_filename (via DownloadButton)
  - [x] 8.6_ Add empty state for users with no orders

- [x] 9_ Admin TVS - Dashboard
  - [x] 9.1_ Create src/app/api/admin/orders/route.ts GET endpoint (all orders)
  - [x] 9.2_ Create src/app/api/admin/stats/route.ts GET endpoint (counts, revenue)
  - [x] 9.3_ Create src/app/(admin)/admin/page.tsx with statistics cards
  - [x] 9.4_ Create src/app/(admin)/admin/orders/page.tsx with filterable order table
  - [x] 9.5_ Add status filter dropdown (all, paid, done, pending)
  - [x] 9.6_ Add date range filter for orders (integrated in API)
  - [x] 9.7_ Add search by email/token functionality

- [x] 10_ Admin TVS - Products (Dummy)
  - [x] 10.1_ Create src/app/(admin)/admin/products/page.tsx
  - [x] 10.2_ Display hardcoded product cards (Service 1-4 with prices)
  - [x] 10.3_ Add "Edit" button that opens modal (non-functional for demo)
  - [x] 10.4_ Style cards to match 1Partner branding

- [x] 11_ Payment Stubs
  - [x] 11.1_ Create src/app/(dashboard)/checkout/page.tsx with fake checkout form
  - [x] 11.2_ Create src/app/api/checkout/route.ts POST endpoint (simulates payment)
  - [x] 11.3_ Add payment success/failure pages
  - [x] 11.4_ Create "New Order" flow from product selection to fake payment

- [x] 12_ Styling & Branding
  - [x] 12.1_ Configure Tailwind theme with 1Partner colors (white/blue palette)
  - [x] 12.2_ Add custom fonts if specified
  - [x] 12.3_ Create consistent spacing and typography scale
  - [x] 12.4_ Ensure all buttons have clear hover/active states
  - [x] 12.5_ Add loading skeletons for async content

- [x] 13_ Responsive Design
  - [x] 13.1_ Test and fix mobile navigation (hamburger menu)
  - [x] 13.2_ Make order tables horizontally scrollable on mobile
  - [x] 13.3_ Adjust card layouts for small screens
  - [x] 13.4_ Test admin sidebar collapse behavior
  - [x] 13.5_ Verify all forms are touch-friendly

- [x] 14_ Testing & Demo Data
  - [x] 14.1_ Create admin user in app_users (role='admin')
  - [x] 14.2_ Create test client user in app_users (role='client')
  - [x] 14.3_ Verify test orders exist in uzkl_ivertink1p for test email
  - [x] 14.4_ Test full client flow: register → login → view orders → download PDF
  - [x] 14.5_ Test full admin flow: login → view stats → filter orders → view products
  - [x] 14.6_ Test payment stub flow end-to-end

- [ ] 15_ Final Polish & Deployment Prep
  - [ ] 15.1_ Add error boundaries for graceful error handling
  - [ ] 15.2_ Configure proper 404 and error pages
  - [ ] 15.3_ Add meta tags and page titles
  - [ ] 15.4_ Review and remove console.logs
  - [ ] 15.5_ Test build with `npm run build`
  - [ ] 15.6_ Document environment variables needed for deployment
