#!/bin/bash

# ScrollSoul Music Sync API - Endpoint Test Script
# This script tests all API endpoints to verify functionality

API_BASE="http://localhost:3000"

echo "🌌 ScrollSoul Music Sync API - Comprehensive Endpoint Testing 🌌"
echo "================================================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json "$API_BASE$endpoint")
    fi
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED (HTTP $response)${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 2

# System Endpoints
echo -e "\n📡 System Endpoints:"
test_endpoint "Root API" "/"
test_endpoint "Health Check" "/health"

# Music Endpoints
echo -e "\n🎵 Music Catalog Endpoints:"
test_endpoint "Get All Music" "/api/music"
test_endpoint "Get Music by ID" "/api/music/1"

# Licensing Endpoints
echo -e "\n📄 Licensing Endpoints:"
test_endpoint "Get All Licenses" "/api/licensing"
test_endpoint "Get License by ID" "/api/licensing/1"
test_endpoint "Get Licenses by Track" "/api/licensing/track/1"

# Placement Endpoints
echo -e "\n🎬 Placement Endpoints:"
test_endpoint "Get All Placements" "/api/placements"
test_endpoint "Get Placements by Platform" "/api/placements?platform=Film"
test_endpoint "Get Placements by Status" "/api/placements?status=confirmed"
test_endpoint "Get Placement by ID" "/api/placements/1"

# Royalty Endpoints
echo -e "\n💰 Royalty Endpoints:"
test_endpoint "Get All Royalties" "/api/royalties"
test_endpoint "Get Royalties Summary" "/api/royalties/summary/totals"
test_endpoint "Get Royalty by ID" "/api/royalties/1"

# Distribution Endpoints
echo -e "\n📦 Distribution Endpoints:"
test_endpoint "Get Distribution Partners" "/api/distribution/partners"
test_endpoint "Get Partner by ID" "/api/distribution/partners/1"
test_endpoint "Get All Distributions" "/api/distribution"

# Analytics Endpoints
echo -e "\n📊 Analytics Endpoints:"
test_endpoint "Get Dashboard Analytics" "/api/analytics/dashboard"
test_endpoint "Get Campaign Analytics" "/api/analytics/campaigns"
test_endpoint "Get Placement Analytics" "/api/analytics/placements"
test_endpoint "Get Royalty Analytics" "/api/analytics/royalties"
test_endpoint "Get Streaming Analytics" "/api/analytics/streaming"

# Summary
echo ""
echo "================================================================"
echo "Test Summary:"
echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
echo "================================================================"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🕋 ${GREEN}ALL TESTS PASSED - SYSTEM FULLY OPERATIONAL${NC} 🕋"
    echo "🌌 ScrollSoul Music Sync API - Perfect Alignment Achieved 🌌"
    exit 0
else
    echo -e "\n${RED}Some tests failed. Please check the API.${NC}"
    exit 1
fi
