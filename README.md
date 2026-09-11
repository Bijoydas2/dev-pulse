# DevPulse

DevPulse is a developer productivity and project management dashboard inspired by GitHub and modern developer workflows. It turns project activity into a clear, focused workspace for tracking momentum, showcasing work, and managing projects.

The interface pairs a dark zinc foundation with emerald accents, contribution-style activity heatmaps, project filtering, and responsive project management controls.

## Key Features

- **Developer dashboard**: A focused workspace for activity and project management.
- **Contribution heatmap**: Visualizes project creation activity across the last 52 weeks using dates returned by the backend.
- **Project CRUD management**: Create, edit, view details for, and delete projects with immediate dashboard state updates.
- **Project showcase**: Display descriptions, GitHub repositories, and normalized technology stack badges.
- **Tag filtering**: Filter projects by normalized technology tags such as `#nextjs`, `#typescript`, or `#dfd`.
- **Responsive states**: Includes loading skeletons, empty states, custom confirmation dialogs, and API error handling.
- **Modular architecture**: Home page sections and dashboard UI are split into focused, reusable components.
- **Emerald-accented UI**: Modern dark-mode styling with emerald highlights, subtle borders, hover states, and accessible controls.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Lucide React](https://lucide.dev/) for interface icons
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- Next.js Route Handlers for backend API integrations
- Geist font through `next/font`

## Project Structure

This repository uses the Next.js root-level App Router layout rather than a `src/` directory. The equivalent application and component paths are:

```text
dev-pulse/
├── app/                         # App Router pages, layout, and API routes
│   ├── dashboard/page.tsx       # Dashboard UI and project management flows
│   ├── api/projects/            # Project list, creation, editing, deletion, and likes
│   ├── api/users/streak/        # User streak endpoint
│   ├── globals.css              # Tailwind entry point and shared animations
│   ├── layout.tsx               # Root layout, metadata, favicon, and navbar
│   └── page.tsx                 # Home page composition
├── components/                  # Reusable UI components
│   ├── home/                    # Hero, stats, feature, CTA, footer, and social proof sections
│   ├── ContributionHeatmap.tsx  # Activity grid
│   ├── Navbar.tsx               # Global navigation and logo
│   ├── ProjectCard.tsx          # Project showcase card
│   ├── ProjectFilterBar.tsx     # Technology tag filters
│   └── ProjectShowcaseStates.tsx# Loading and empty states
├── lib/
│   └── mongodb.ts               # Mongoose connection handling and caching
├── models/
│   ├── Project.ts               # Project schema
│   └── User.ts                  # User schema
├── public/
│   └── logo.png                 # DevPulse logo and favicon source
├── next.config.ts
├── package.json
└── tsconfig.json
```

If the project is later moved to a `src/` layout, `app/` maps to `src/app/` and `components/` maps to `src/components/` without changing the component boundaries.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A MongoDB database, such as a MongoDB Atlas cluster

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd dev-pulse
npm install
```

Create a local environment file at `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/devpulse?retryWrites=true&w=majority
```

Replace the placeholders with a valid MongoDB connection string. URL-encode special characters in the database password, configure the MongoDB user permissions, and allow the development machine in the Atlas network access settings.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dashboard is available at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
```

The repository also includes a `pnpm-lock.yaml`; `pnpm install` and the equivalent `pnpm` scripts are supported when using pnpm.

## API Overview

- `GET /api/projects`: Fetch projects with populated user information.
- `POST /api/projects`: Create a project and resolve an existing or default owner user.
- `PUT /api/projects/:id`: Update project details for the owning user.
- `DELETE /api/projects/:id`: Delete a project for the owning user.
- `PATCH /api/projects/:id/like`: Update a project like count.
- `POST /api/users/streak`: Increment a user streak.

Project mutations require a working MongoDB connection. The current project uses owner IDs for mutation validation; an authentication/session provider can be added as the application grows.

## Branding & Design

- **Primary accent**: Emerald-400 and related emerald shades communicate activity, progress, and healthy momentum.
- **Base palette**: Zinc-950, zinc-900, and translucent white borders create the dark dashboard aesthetic.
- **Typography**: Geist is loaded through Next.js font optimization for a clean developer-tool interface.
- **Logo**: `public/logo.png` is used by the navbar and configured as the browser favicon in `app/layout.tsx`.
- **Interaction language**: Lucide icons, compact controls, visible focus states, subtle card glows, and custom confirmation dialogs keep actions clear without visual noise.

## Production Notes

Before deploying, set `MONGODB_URI` in the hosting provider's environment settings rather than committing `.env.local`. Rotate any database credentials that may have been exposed during local development, and confirm MongoDB network access allows the production deployment.
