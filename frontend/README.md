# Frontend - React + Vite

React frontend application with Vite, TypeScript, and i18n support.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router
- **State Management:** Zustand (lightweight)
- **i18n:** react-i18next
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API services
│   └── api.ts       # Axios instance with interceptors
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── contexts/         # React contexts
├── store/            # State management (Zustand)
├── assets/           # Static assets (images, fonts)
├── i18n/             # Internationalization
│   ├── config.ts
│   └── locales/
│       ├── en.json  # English translations
│       └── vi.json  # Vietnamese translations
├── test/             # Test utilities
├── App.tsx
├── main.tsx
└── index.css
```

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Configure your API URL in `.env`

## Development

```bash
# Start development server (with HMR)
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run test coverage
yarn test:coverage
```

## Code Quality

```bash
# Run linter
yarn lint

# Fix linting errors
yarn lint:fix

# Type checking
yarn typecheck
```

## Internationalization (i18n)

This app supports English and Vietnamese.

### Adding New Translations

1. Add keys to both `src/i18n/locales/en.json` and `src/i18n/locales/vi.json`
2. Use the `useTranslation` hook in components:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('pages.home.title')}</h1>;
}
```

### Important i18n Rules

- ❌ **NO hardcoded text** in components
- ✅ **Always use i18n keys** for user-facing text
- ✅ **Only use defined keys** that exist in both en.json and vi.json

## API Integration

The app uses Axios with interceptors configured in `src/services/api.ts`.

Features:
- Automatic JWT token injection
- Global error handling
- Request/response interceptors
- 401 redirect to login

Example usage:

```tsx
import api from '@/services/api';

// GET request
const response = await api.get('/users');

// POST request
const response = await api.post('/users', { name: 'John' });
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client.

See `.env.example` for all available variables.

## Key Features

- ✅ TypeScript strict mode
- ✅ Path aliases (@/* for src/*)
- ✅ i18n support (en/vi)
- ✅ API proxy configuration
- ✅ Axios with interceptors
- ✅ React Router for navigation
- ✅ Form validation with Zod
- ✅ Testing setup with Vitest
- ✅ ESLint + Prettier
- ✅ Hot Module Replacement (HMR)

## Vite Proxy

The dev server is configured to proxy `/api` requests to the backend at `http://localhost:3000`.

This means you can call `/api/health` in development and it will automatically proxy to `http://localhost:3000/api/health`.
