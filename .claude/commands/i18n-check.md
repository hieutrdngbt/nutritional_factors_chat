---
description: Validate i18n implementation (no hardcoded text, only defined keys)
---

Perform a comprehensive i18n validation:

1. Search for hardcoded text in source files:
   - Check .tsx, .ts, .jsx, .js files
   - Look for string literals in JSX/templates
   - Identify text that should be internationalized

2. Verify i18n key usage:
   - Find all i18n key references
   - Check that keys exist in en.json and vi.json
   - Ensure both languages have the same keys

3. Check translation files:
   - Locate en.json and vi.json files
   - Verify proper structure
   - Find missing translations

4. Report findings:
   - List hardcoded text with file locations
   - List undefined keys being used
   - List missing translations
   - Suggest proper i18n key names

IMPORTANT: Follow user's i18n rules:
- No hardcoded text allowed
- Only use i18n keys that are already defined
- Support both English and Vietnamese
