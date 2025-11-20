---
description: Run linting and type checking for the entire project
---

Perform code quality checks across the project:

1. Run TypeScript type checking (`yarn tsc --noEmit`) in both backend and frontend
2. Run ESLint (`yarn lint`) in both directories
3. Check for any formatting issues (if Prettier is configured)
4. Report all errors and warnings found
5. Provide suggestions for fixing the issues

If there are errors:
- Categorize them by severity
- Provide specific file locations
- Suggest fixes for common issues
- Offer to fix them automatically if requested
