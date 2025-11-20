---
description: Run database migrations
---

Execute database migrations:

1. Check for migration files in the backend directory
2. Verify database connection configuration
3. Run migrations using the appropriate command (e.g., `yarn migrate`, `yarn prisma migrate`, etc.)
4. Report on:
   - Migrations executed
   - Any errors encountered
   - Current database schema state

IMPORTANT: NEVER modify or delete existing migration files. Only create new ones.

If migrations fail:
- Identify the issue
- Check database connectivity
- Verify migration file syntax
- Provide troubleshooting steps
