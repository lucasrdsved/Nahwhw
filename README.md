# EvoFit Ultimate

EvoFit Ultimate is a polished progressive web application (PWA) concept for personal trainers and their students. It showcases how a Next.js 14 front end can be paired with a Supabase-style backend interface while still running entirely offline thanks to extensive mocks. The goal of the project is to demonstrate the complete product experience—from authentication to dashboards—so the real Supabase infrastructure can be swapped in with minimal effort.

## Key Features

- **Mocked Supabase client** – A fully documented `supabase` drop-in replacement that mirrors authentication, storage, and query builder behaviour.
- **Role-aware experience** – Dashboards adapt to the logged-in profile (personal trainer or student) while enforcing simulated row-level security rules.
- **Training management** – Review prescriptions, update exercises, and track series completion with real-time feedback.
- **Student roster administration** – Create new students directly from the UI with generated mock identifiers and profile records.
- **Offline-ready shell** – Service worker registration and rich UI components highlight the intended PWA experience.

## Project Structure

```
src/
├─ app/              # Next.js app router pages, layouts, and routes
├─ components/       # Reusable UI blocks used across screens
├─ lib/              # Mock Supabase implementation and shared utilities
└─ types/            # Shared domain types for the fitness data model
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm (bundled with Node.js)

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser to access the PWA shell. Hot reloading is enabled by default.

### Production Build

```bash
npm run build
npm run start
```

The first command compiles the application. The second starts a production-ready server that serves the built assets.

### Linting

```bash
npm run lint
```

## Mock Authentication and Data

- The login screen offers quick buttons for predefined accounts such as `personal@teste.com`.
- Authentication, storage and querying are powered by the documented mocks in `src/lib`. They replicate the Supabase JavaScript client so you can later swap in the actual SDK.
- Mock databases persist between reloads via browser storage. Use the **Resetar banco mock** button on the Perfil page to restore the seed data.

## PWA Setup

The `PwaSetup` component registers a service worker (`/service-worker.js`) once the window `load` event fires. Ensure the service worker file exists when integrating with a real deployment.

## Extending the Project

- Replace the mock Supabase client in `src/lib/supabaseClientMock.ts` with the genuine `@supabase/supabase-js` client once your backend is ready.
- Update the domain types in `src/types` to match your actual tables.
- Tailwind CSS can be configured through `tailwind.config.js` to adjust theming as needed.

## Available Scripts

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `npm run dev`  | Start the development server.                    |
| `npm run lint` | Run Next.js linting with the configured rules.   |
| `npm run build`| Create an optimized production build.            |
| `npm run start`| Serve the compiled application.                  |

## License

This project is intended for demonstration purposes. Adapt and integrate it into your own stack as needed.

## GitHub Copilot CLI

Para instalar globalmente o GitHub Copilot CLI:

```bash
npm install -g @github/copilot
```
