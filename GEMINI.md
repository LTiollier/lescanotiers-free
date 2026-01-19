# Technical Context of "Les Canotiers" Application

## ⚠️ Important Directive - Use of Skill Agents

**ALWAYS and IMPERATIVELY launch the `lead-frontend-developer` skill agent for any development task.**

The `lead-frontend-developer` will be responsible for orchestrating and calling the right skill agents based on the task at hand.

### Mandatory Rules for the `lead-frontend-developer`

**Mandatory Commit**: After each successfully completed task, the `lead-frontend-developer` MUST create one or more atomic Git commits with a message using Gitmoji that clearly describes the changes made.

## Project Vision and Goals

The goal is to build the "Les Canotiers" application into a modern, high-performance, and maintainable Web App. The application will remain a management and monitoring tool for market gardening, but with a robust technical architecture, an optimized user experience (mobile first), and rigorous development practices.

## Fundamental Business Concepts

The core business remains unchanged and revolves around the following entities:

- **Users** (`users`): Managed via Supabase Auth, with roles (`admin`, `employee`)
- **Parcels** (`parcels`): Cultivation plots
- **Vegetable Categories** (`vegetable_categories`): Groupings (e.g., "root vegetables")
- **Vegetables** (`vegetables`): Crop types (e.g., "Tomato")
- **Cycles** (`cycles`): Association of a vegetable and a parcel over a given period
- **Activities** (`activities`): Predefined tasks (e.g., "Sowing", "Harvesting")
- **Time Spent** (`times`): Work log entries associating a user, a cycle, an activity, a date, a duration, and an optional quantity

## Architecture and Technical Stack

### Frontend Framework

**React 19+** with **TypeScript** and **MUI**. Use of Hooks, Context API, and functional components.

### Build Tool

**Vite** for fast development and optimized bundling (native ESM).

### Database and Backend (BaaS)

**Supabase** with:

- **Database**: PostgreSQL
- **Authentication**: Supabase Auth for user management (email/password)
- **APIs**: Auto-generated RESTful APIs and JavaScript client (`@supabase/supabase-js`) to interact with the database
- **Realtime**: Use of Supabase subscriptions for real-time updates if necessary (e.g., notifications)

### State Management

- **Server State**: **TanStack Query (React Query)** for fetching, caching, and synchronizing data with Supabase. Essential for managing asynchronous state (loading, error, success)
- **Global Client State**: **React Context** for lightweight global states (theme, navigation state, user information)

### Offline Management (Online-First)

- **PWA (Progressive Web App)**: Use of a **Service Worker** to cache the application (Application Shell) and static resources
- **Data Management**: When offline, it should not be possible to add any information; action buttons must be disabled. An alert banner will be displayed to inform the user.

### Hosting and Deployment

**Vercel** with continuous integration with the GitHub repository for automatic deployments on push/merge to the main branch.

### Source Code Management

**Git** & **GitHub**

## Data Model (Supabase Tables)

```sql
-- Authentication managed by Supabase, with a `profiles` table for public data.
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'employee' -- 'admin' or 'employee'
);

CREATE TABLE parcels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vegetable_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vegetables (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category_id INT REFERENCES vegetable_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cycles (
  id SERIAL PRIMARY KEY,
  vegetable_id INT NOT NULL REFERENCES vegetables(id),
  parcel_id INT NOT NULL REFERENCES parcels(id),
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE times (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  cycle_id INT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  activity_id INT NOT NULL REFERENCES activities(id),
  date DATE NOT NULL,
  minutes INT NOT NULL,
  quantity NUMERIC(10, 2), -- For harvests, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Best Practices and Conventions

### Code Quality

- **Linting**: **BiomeJS** with @biomejs/biome
- **Formatting**: **BiomeJS** for a unified and automatic code style. A `pre-commit` script (via Husky) will format the code before each commit

### Commit Conventions

Use of [Gitmoji](https://gitmoji.dev/) for commit messages to standardize and improve the readability of the Git history. Commits must be small and atomic.

### Component Architecture

Organization of components by functionality (feature-based). Components should be typed and, if possible, generic.

### API Communication

- **Client Usage**: `@supabase/supabase-js`
- **Type Generation**: TypeScript from the Supabase database schema (`supabase gen types typescript`) for a fully typed and secure API

### CI/CD (Continuous Integration and Deployment)

- **GitHub Actions**: Workflow to automatically run linters on every Pull Request
- **Vercel Deployment**: Automatic deployment of the `main` branch to production and creation of previews for each Pull Request

### Error Handling

- **Error Boundaries**: Use of React Error Boundaries to capture rendering errors
- **Error Reporting**: In production with a service like Sentry or directly in Vercel logs

## Conclusion

This document serves as a technical foundation to guide development, ensure consistency, and achieve a high level of quality for the new version of "Les Canotiers".
