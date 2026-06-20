# Court Click — Admin Dashboard

Admin dashboard for managing CTC (Certified True Copy) orders with a deep plum/maroon design system.

## Tech Stack

- **Next.js** (App Router)
- **Ant Design** 6
- **TypeScript**
- Lucide (icons)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages & global styles
├── components/   # Reusable UI components
├── data/         # Mock data
├── hooks/        # Custom hooks
└── types/        # TypeScript type definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Features

- Orders table with pagination, filtering, and search
- Tag management (create, edit, delete, assign to orders)
- Clerk assignment and sharing
- ECopy document upload
- Notes per order
- Filter modal with district, court, and product dropdowns
