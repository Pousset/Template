#!/usr/bin/env bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🔔 Buzzer - Verification Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check npm
echo -e "\n${YELLOW}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm${NC} $NPM_VERSION"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check backend
echo -e "\n${YELLOW}Checking backend...${NC}"
if [ -d "backend" ]; then
    echo -e "${GREEN}✓ Backend directory found${NC}"
    
    if [ -f "backend/package.json" ]; then
        echo -e "${GREEN}✓ Backend package.json found${NC}"
    else
        echo -e "${RED}✗ Backend package.json not found${NC}"
    fi
else
    echo -e "${RED}✗ Backend directory not found${NC}"
fi

# Check frontend
echo -e "\n${YELLOW}Checking frontend...${NC}"
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓ Frontend directory found${NC}"
    
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✓ Frontend package.json found${NC}"
    else
        echo -e "${RED}✗ Frontend package.json not found${NC}"
    fi
else
    echo -e "${RED}✗ Frontend directory not found${NC}"
fi

# Check documentation
echo -e "\n${YELLOW}Checking documentation...${NC}"
DOCS=("README.md" "QUICK_START.md" "TESTING.md" "TEST_TOOLS.md" "DOCS_INDEX.md" "SYNC_STATUS.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc"
    else
        echo -e "${RED}✗${NC} $doc"
    fi
done

echo -e "\n${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Verification complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

echo -e "Next steps:"
echo -e "  1. ${YELLOW}Read${NC}   → ${BLUE}QUICK_START.md${NC}"
echo -e "  2. ${YELLOW}Setup${NC}  → Follow the guide"
echo -e "  3. ${YELLOW}Test${NC}   → Use test-helper.js in console\n"
