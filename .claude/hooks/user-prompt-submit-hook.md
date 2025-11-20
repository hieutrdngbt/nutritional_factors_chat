#!/usr/bin/env bash

# User Prompt Submit Hook
# This hook runs before Claude processes user prompts
# It performs quick quality checks to catch issues early

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔍 Running pre-execution quality checks..."

# Function to check if we're in a git repo
is_git_repo() {
    git rev-parse --git-dir > /dev/null 2>&1
}

# Function to check for TypeScript errors in staged/modified files
check_typescript() {
    echo "📝 Checking TypeScript..."

    # Check if there are any .ts or .tsx files
    if ! find . -name "*.ts" -o -name "*.tsx" | grep -q .; then
        echo "  ℹ️  No TypeScript files found, skipping"
        return 0
    fi

    # Try backend
    if [ -d "backend" ] && [ -f "backend/tsconfig.json" ]; then
        echo "  Checking backend TypeScript..."
        cd backend
        if ! yarn tsc --noEmit --pretty false 2>&1 | grep -q "error TS"; then
            echo "  ✅ Backend TypeScript OK"
        else
            echo -e "  ${YELLOW}⚠️  Backend has TypeScript errors${NC}"
        fi
        cd ..
    fi

    # Try frontend
    if [ -d "frontend" ] && [ -f "frontend/tsconfig.json" ]; then
        echo "  Checking frontend TypeScript..."
        cd frontend
        if ! yarn tsc --noEmit --pretty false 2>&1 | grep -q "error TS"; then
            echo "  ✅ Frontend TypeScript OK"
        else
            echo -e "  ${YELLOW}⚠️  Frontend has TypeScript errors${NC}"
        fi
        cd ..
    fi
}

# Function to check for common issues
check_common_issues() {
    echo "🔎 Checking for common issues..."

    # Check for console.log statements (excluding node_modules)
    if git diff --cached --name-only 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' | xargs grep -l 'console\.log' 2>/dev/null; then
        echo -e "  ${YELLOW}⚠️  Found console.log statements in staged files${NC}"
    fi

    # Check for TODO comments in staged files
    if is_git_repo && git diff --cached 2>/dev/null | grep -i '^\+.*TODO' > /dev/null; then
        echo -e "  ${YELLOW}⚠️  Found new TODO comments in staged changes${NC}"
    fi

    # Check for potential secrets (basic check)
    if is_git_repo && git diff --cached 2>/dev/null | grep -iE '(api[_-]?key|password|secret|token)["\s]*[:=]' > /dev/null; then
        echo -e "  ${RED}🚨 Potential secrets detected in staged changes!${NC}"
        echo "  Please review carefully before committing."
        return 1
    fi
}

# Function to check i18n compliance (basic check)
check_i18n() {
    echo "🌐 Checking i18n compliance..."

    # Look for potential hardcoded strings in JSX
    if is_git_repo; then
        if git diff --cached 2>/dev/null | grep -E '^\+.*>[ ]*[A-Z][a-z]+.*<' > /dev/null; then
            echo -e "  ${YELLOW}⚠️  Potential hardcoded text in JSX detected${NC}"
            echo "  Remember to use i18n keys for all user-facing text"
        fi
    fi
}

# Run checks
HAS_ERROR=0

check_typescript || HAS_ERROR=1
check_common_issues || HAS_ERROR=1
check_i18n || HAS_ERROR=1

echo ""
if [ $HAS_ERROR -eq 0 ]; then
    echo -e "${GREEN}✅ All quality checks passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Some issues detected, but continuing...${NC}"
fi
echo ""

# Always exit 0 to not block Claude
# This hook is informational, not blocking
exit 0
