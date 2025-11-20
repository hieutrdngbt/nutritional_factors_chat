# Claude Code Configuration

This directory contains configuration and custom tooling for Claude Code to assist with development of this full-stack TypeScript project (Node.js backend + React/Vite frontend).

## 📁 Directory Structure

```
.claude/
├── agents/           # Specialized AI agents for specific tasks
├── commands/         # Slash commands for common operations
├── hooks/            # Automation hooks
├── skills/           # Custom skills (if needed)
├── settings.json     # Project settings and best practices
└── README.md         # This file
```

## 🤖 Agents

Agents are specialized assistants that focus on specific aspects of development. Use them by mentioning their purpose or invoking them explicitly.

### Available Agents

- **code-reviewer** - Comprehensive code review focusing on quality, security, and best practices
- **api-tester** - API endpoint testing and validation
- **security-audit** - Security vulnerability scanning and OWASP compliance
- **test-generator** - Generate comprehensive test suites for frontend and backend
- **i18n-validator** - Validate internationalization compliance (en/vi)

### How to Use Agents

Simply ask Claude to perform the agent's task:
```
"Please review my recent changes"
"Run a security audit on the authentication code"
"Generate tests for the UserService"
```

## ⚡ Slash Commands

Quick commands for common development tasks.

### Available Commands

- `/setup` - Initial project setup (install dependencies, check configuration)
- `/test` - Run all tests (frontend + backend)
- `/test-backend` - Run backend tests only
- `/test-frontend` - Run frontend tests only
- `/lint` - Run linting and type checking
- `/build` - Build both projects for production
- `/review` - Review current code changes
- `/i18n-check` - Validate i18n implementation
- `/db-migrate` - Run database migrations
- `/api-docs` - Generate API documentation
- `/security-check` - Run comprehensive security audit

### Usage Examples

```
/setup
/test
/lint
/review
```

## 🪝 Hooks

Hooks run automatically at specific events to maintain code quality.

### user-prompt-submit-hook

Runs before Claude processes user prompts. Performs:
- TypeScript type checking
- Detection of console.log statements
- Secret scanning
- i18n compliance checks

## ⚙️ Settings

The `settings.json` file contains:

- **Project Context** - Tech stack, i18n configuration, database rules
- **Code Style** - Naming conventions, TypeScript preferences
- **Best Practices** - Security, testing, error handling, performance
- **File Structure** - Recommended project organization
- **Dependencies** - Recommended packages
- **Scripts** - Common npm/yarn scripts

## 📋 Project Rules

### Critical Rules (Enforced)

1. **i18n Compliance**
   - ❌ NO hardcoded text in components
   - ✅ Use i18n keys for all user-facing text
   - ✅ Only use DEFINED i18n keys (en.json, vi.json)
   - ✅ Support English and Vietnamese

2. **Database Migrations**
   - ❌ NEVER modify existing migration files
   - ❌ NEVER delete migration files
   - ✅ Only create new migrations

3. **Package Manager**
   - ✅ Always use `yarn` (not npm)

4. **TypeScript**
   - ✅ Enable strict mode
   - ✅ Avoid `any` types
   - ✅ Proper type definitions

## 🔒 Security Standards

- Input validation on all API endpoints
- Parameterized queries (prevent SQL injection)
- XSS prevention in frontend
- Proper authentication/authorization
- Environment variables for secrets
- Security headers (helmet.js)
- Rate limiting on APIs
- Password hashing (bcrypt/argon2)

## 🧪 Testing Standards

- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for React components
- Aim for >80% coverage on critical paths
- Follow AAA pattern (Arrange, Act, Assert)

## 📁 Recommended Project Structure

### Backend
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   ├── types/
│   ├── validators/
│   └── server.ts
├── tests/
├── migrations/
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── contexts/
│   ├── store/
│   ├── i18n/
│   │   ├── en.json
│   │   └── vi.json
│   └── main.tsx
└── package.json
```

## 🚀 Getting Started

1. Run initial setup:
   ```
   /setup
   ```

2. Configure environment variables (check .env.example)

3. Run tests to verify setup:
   ```
   /test
   ```

4. Start development:
   ```
   Ask Claude: "Start the development servers"
   ```

## 💡 Tips

- Use `/review` before committing code
- Run `/i18n-check` to catch hardcoded text
- Use `/security-check` before deploying
- Leverage agents for specialized tasks
- Check `/lint` regularly during development

## 📚 Additional Resources

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Note:** This configuration is optimized for a full-stack TypeScript project following industry best practices. Customize as needed for your specific requirements.
