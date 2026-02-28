# Next.js B2B Boilerplate

A feature-rich Next.js App Router boilerplate for B2B SaaS applications. Extends [nextjs-starter](https://github.com/mattjaikaran/nextjs-starter) with dashboards, team management, billing, analytics, and organization support.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + Shadcn/ui (new-york, zinc)
- **State**: Zustand (client state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios with interceptors (JWT refresh, Django CSRF)
- **Theme**: next-themes (light/dark/system)
- **Icons**: Lucide React

## B2B Features

- **Dashboard** with sidebar navigation and analytics overview
- **Organization support** with OrgSwitcher and team management
- **Team management** with role-based access (owner, admin, member, viewer)
- **Billing & Plans** with plan comparison and invoice history
- **Analytics** dashboard with stat cards and chart placeholders
- **Notifications** center with filtering and mark-as-read
- **Settings** with tabs: Account, Notifications, Privacy, Team, Billing, API Keys
- **DataTable** component with TanStack Table (sorting, filtering, pagination)
- **Auth flow** with login, register, magic link, and password reset

## Project Structure

```
├── app/
│   ├── (main)/                # Public pages (about, contact, faq, etc.)
│   ├── (auth)/                # Auth pages (login, register, magic-link)
│   ├── dashboard/
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── analytics/         # Analytics with charts
│   │   ├── billing/           # Plans, payments, invoices
│   │   ├── notifications/     # Notification center
│   │   ├── organizations/     # Organization management
│   │   ├── profile/           # User profile
│   │   ├── settings/          # Tabbed settings (6 tabs)
│   │   └── team/              # Team member management
│   ├── todos/                 # Todo CRUD
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── nav/                   # Navbar, Footer
│   ├── layouts/               # MainLayout, DashboardLayout (with sidebar)
│   ├── shared/                # Hero, DataTable, FeatureFlag, OrgSwitcher
│   ├── charts/                # Chart components
│   └── providers/             # Theme, Query, App providers
├── hooks/                     # API, query, mutation, and utility hooks
├── lib/                       # API client, services, store, utilities
├── forms/                     # React Hook Form + Zod forms
├── types/                     # TypeScript types (including organization)
└── config/                    # App configuration
```

## Getting Started

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Run development server
bun dev

# Build for production
bun run build
```

## Dashboard Sidebar Navigation

**Main**
- Dashboard (overview)
- Todos
- Analytics

**Account**
- Profile
- Settings
- Team
- Billing
- Organizations
- Notifications

## Related

- [nextjs-starter](https://github.com/mattjaikaran/nextjs-starter) - Basic Next.js starter
- [react-vite-boilerplate](https://github.com/mattjaikaran/react-vite-boilerplate) - React Vite version
- [matt-stack](https://github.com/mattjaikaran/matt-stack) - CLI for scaffolding projects

## License

MIT
