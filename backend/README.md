# Backend - NestJS API

NestJS backend API with TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT with Passport
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest

## Project Structure

```
src/
├── common/              # Shared utilities, filters, guards, etc.
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── middleware/
├── config/              # Configuration files
├── modules/             # Feature modules
│   └── [feature]/
│       ├── dto/
│       ├── entities/
│       ├── [feature].controller.ts
│       ├── [feature].service.ts
│       └── [feature].module.ts
├── types/               # TypeScript type definitions
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
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

3. Configure your database connection in `.env`

4. Generate Prisma client:
   ```bash
   yarn prisma:generate
   ```

5. Run migrations:
   ```bash
   yarn migrate
   ```

## Development

```bash
# Start development server with hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start:prod
```

## Testing

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run test coverage
yarn test:cov

# Run e2e tests
yarn test:e2e
```

## Code Quality

```bash
# Run linter
yarn lint

# Type checking
yarn typecheck

# Format code
yarn format
```

## Database

```bash
# Generate Prisma client
yarn prisma:generate

# Run migrations (development)
yarn migrate

# Run migrations (production)
yarn migrate:prod

# Open Prisma Studio
npx prisma studio
```

## API Documentation

When running in development mode, Swagger documentation is available at:
```
http://localhost:3000/api/docs
```

## Environment Variables

See `.env.example` for all required environment variables.

## Key Features

- ✅ TypeScript strict mode
- ✅ Swagger API documentation
- ✅ Global validation pipe
- ✅ Error handling with custom filters
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Compression
- ✅ Prisma ORM with migrations
- ✅ JWT authentication ready
- ✅ Rate limiting ready
- ✅ Testing setup with Jest
