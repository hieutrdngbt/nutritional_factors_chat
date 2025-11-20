---
description: Run comprehensive security audit
---

Perform a thorough security audit of the application:

1. Run `yarn audit` to check for vulnerable dependencies
2. Scan code for common security issues:
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Authentication/authorization issues
   - Hardcoded secrets or API keys
   - Insecure data handling
   - Missing input validation
   - Improper error handling

3. Check security configurations:
   - CORS settings
   - HTTP security headers
   - Environment variable usage
   - Password hashing implementation
   - JWT token handling

4. Review recent code changes for security implications

5. Provide detailed report with:
   - Critical issues (must fix immediately)
   - Medium priority issues
   - Best practice recommendations
   - Specific remediation steps

Use the security-audit agent's expertise for this analysis.
