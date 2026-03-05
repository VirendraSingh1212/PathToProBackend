#!/bin/bash

# Test script to verify course content seeding
# Run this after seeding to verify the API endpoint works

BASE_URL="http://localhost:3000"

echo "🧪 Testing Course Content API"
echo "======================================"
echo ""

# Subject IDs
FULL_STACK_ID="ec264424-a538-49b5-879e-4187561142ab"
SYSTEM_DESIGN_ID="5ea04861-3287-4870-8ff6-07344554bc54"
DSA_ID="d3529755-2fd8-4c3e-95b6-77c5496dff0b"

# Test Full-Stack Development
echo "📚 Testing Full-Stack Development Masterclass..."
RESPONSE=$(curl -s "$BASE_URL/api/subjects/$FULL_STACK_ID/tree")
if echo "$RESPONSE" | grep -q "HTML Basics"; then
    echo "   ✅ Full-Stack course tree loaded successfully"
else
    echo "   ❌ Full-Stack course tree test failed"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test System Design
echo "🏗️  Testing System Design Fundamentals..."
RESPONSE=$(curl -s "$BASE_URL/api/subjects/$SYSTEM_DESIGN_ID/tree")
if echo "$RESPONSE" | grep -q "System Design Basics"; then
    echo "   ✅ System Design course tree loaded successfully"
else
    echo "   ❌ System Design course tree test failed"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test DSA
echo "💻 Testing Data Structures & Algorithms..."
RESPONSE=$(curl -s "$BASE_URL/api/subjects/$DSA_ID/tree")
if echo "$RESPONSE" | grep -q "Arrays & Strings"; then
    echo "   ✅ DSA course tree loaded successfully"
else
    echo "   ❌ DSA course tree test failed"
    echo "   Response: $RESPONSE"
fi
echo ""

echo "======================================"
echo "✅ Testing complete!"
echo ""
echo "To see full responses, run:"
echo "  curl $BASE_URL/api/subjects/$FULL_STACK_ID/tree | jq"
