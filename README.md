# Full-Stack Application

Modern full-stack application with NestJS backend and React Vite frontend.

## 🏗️ Tech Stack

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with Passport
- **API Docs:** Swagger/OpenAPI
- **Testing:** Jest + Supertest

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router
- **i18n:** react-i18next (English/Vietnamese)
- **State:** Zustand
- **Testing:** Vitest + React Testing Library

## 📁 Project Structure

```
.
├── backend/              # NestJS API
│   ├── src/
│   ├── prisma/
│   ├── test/
│   └── package.json
├── frontend/             # React Vite App
│   ├── src/
│   ├── public/
│   └── package.json
├── .claude/              # Claude Code configuration
│   ├── agents/          # AI agents (code-reviewer, security-audit, etc.)
│   ├── commands/        # Slash commands (/setup, /test, /lint, etc.)
│   ├── hooks/           # Quality assurance hooks
│   └── settings.json
├── package.json          # Root workspace
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Yarn >= 1.22
- PostgreSQL database

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   yarn install
   ```

3. Set up backend:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your openai api key
   ```

4. Set up frontend:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env if needed
   ```

### Development

Run both backend and frontend in development mode:

```bash
# From root directory
yarn dev
```

Or run them separately:

```bash
# Backend (http://localhost:3000)
yarn dev:backend

# Frontend (http://localhost:5173)
yarn dev:frontend
```

### Building for Production

```bash
# Build both projects
yarn build

# Or build separately
yarn build:backend
yarn build:frontend
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run backend tests only
yarn test:backend

# Run frontend tests only
yarn test:frontend
```

## 📝 Available Scripts

### Root Level

- `yarn dev` - Start both backend and frontend in dev mode
- `yarn build` - Build both projects for production
- `yarn test` - Run all tests
- `yarn lint` - Lint all projects
- `yarn typecheck` - Type check all projects
- `yarn clean` - Remove all node_modules and build artifacts

### Backend

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn test` - Run tests
- `yarn lint` - Run ESLint
- `yarn typecheck` - TypeScript type checking
- `yarn migrate` - Run database migrations

### Frontend

- `yarn dev` - Start development server with HMR
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run tests
- `yarn lint` - Run ESLint
- `yarn typecheck` - TypeScript type checking

## 🔧 Claude Code Integration

This project includes comprehensive Claude Code configuration in the `.claude/` directory.

### Specialized Agents

- **code-reviewer** - Code quality and best practices review
- **api-tester** - API endpoint testing
- **security-audit** - Security vulnerability scanning
- **test-generator** - Generate comprehensive tests
- **i18n-validator** - Validate internationalization

### Slash Commands

- `/setup` - Initial project setup
- `/test` - Run all tests
- `/lint` - Lint and type check
- `/build` - Build for production
- `/review` - Review code changes
- `/i18n-check` - Validate i18n (no hardcoded text)
- `/security-check` - Security audit
- `/db-migrate` - Run database migrations

### Usage Example

```bash
# In Claude Code CLI
/setup              # Setup the project
/i18n-check         # Check for hardcoded text
/security-check     # Run security audit
```

## 📋 Project Rules

### Critical Rules

1. **i18n Compliance**
   - ❌ NO hardcoded text in components
   - ✅ Use i18n keys for all user-facing text
   - ✅ Support English (en) and Vietnamese (vi)
   - ✅ Only use defined i18n keys

2. **Database Migrations**
   - ❌ NEVER modify existing migration files
   - ❌ NEVER delete migration files
   - ✅ Only create new migrations

3. **Package Manager**
   - ✅ Always use `yarn` (not npm)

4. **TypeScript**
   - ✅ Strict mode enabled
   - ✅ Avoid `any` types
   - ✅ Proper type definitions

## 🔒 Security

- Input validation on all API endpoints (class-validator)
- Parameterized queries via Prisma (SQL injection prevention)
- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Rate limiting
- Password hashing with bcrypt
- Environment variables for secrets

## 🌐 API Documentation

When running backend in development mode, Swagger documentation is available at:
```
http://localhost:3000/api/docs
```

## 🧑‍💻 Development Workflow

1. **Create a new feature branch**
2. **Develop your feature** (use `/i18n-check` to ensure no hardcoded text)
3. **Run tests** (`/test`)
4. **Run linter** (`/lint`)
5. **Review your changes** (`/review`)
6. **Run security check** (`/security-check`)
7. **Commit and push**

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Claude Code Configuration](./.claude/README.md)

## 🔗 Useful Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Claude Code](https://github.com/anthropics/claude-code)

## 📄 License

MIT

## 🤝 Contributing

1. Follow the project rules above
2. Write tests for new features
3. Ensure all tests pass
4. Use i18n for all user-facing text
5. Never modify existing migration files
