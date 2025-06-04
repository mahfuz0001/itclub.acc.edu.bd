# Agent Guidelines for ACC IT Club Codebase

## Commands
- Dev server: `npm run dev` or `npm run dev -- --turbo`
- Build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`

## Code Style Guidelines
- **Imports**: Group imports by type (React, Next.js, components, utils), follow absolute imports with `@/` prefix
- **TypeScript**: Use strict type checking, explicit type annotations for function parameters and returns
- **Naming**: PascalCase for components and interfaces, camelCase for variables and functions
- **Components**: Use client components with "use client" directive when needed
- **Error Handling**: Try/catch blocks with specific error messages, logging to console
- **Styling**: Tailwind CSS with consistent class naming and organization
- **State Management**: React useState/useEffect, with clear loading/error states
- **Formatting**: No trailing whitespace, consistent indentation (2 spaces)

## File Organization
- Components in `/components` directory, grouped by feature
- Types in `/types` directory
- API routes in `/app/api`
- Firebase integration in `/lib/firebase`