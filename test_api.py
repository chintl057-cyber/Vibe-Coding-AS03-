#!/usr/bin/env python
import requests
import json

BASE_URL = 'http://localhost:8000'
TOKEN = None

print('='*60)
print('TESTING VIBE API ENDPOINTS')
print('='*60)

# Test 1: Health check
print('\n1️⃣  HEALTH CHECK')
try:
    r = requests.get(f'{BASE_URL}/health')
    print(f'   Status: {r.status_code}')
    print(f'   Response: {r.json()}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 2: Root endpoint
print('\n2️⃣  ROOT ENDPOINT')
try:
    r = requests.get(f'{BASE_URL}/')
    print(f'   Status: {r.status_code}')
    print(f'   Response: {r.json()}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 3: Get all products
print('\n3️⃣  GET ALL PRODUCTS (/api/products)')
try:
    r = requests.get(f'{BASE_URL}/api/products?limit=5')
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f'   Count: {len(data)} products returned')
        if data:
            print(f'   Sample: {data[0].get("name")} - {data[0].get("category")}')
    else:
        print(f'   Error: {r.text[:200]}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 4: Get single product
print('\n4️⃣  GET SINGLE PRODUCT (/api/products/{product_id})')
try:
    r = requests.get(f'{BASE_URL}/api/products/milk_1l')
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        print(f'   Response: {r.json()}')
    elif r.status_code == 404:
        print(f'   ✓ Correctly returns 404 for non-existent product')
    else:
        print(f'   Error: {r.text[:200]}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 5: Search products
print('\n5️⃣  SEARCH PRODUCTS (/api/products/search)')
try:
    r = requests.get(f'{BASE_URL}/api/products/search?q=bread')
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f'   Results: {len(data)} products found')
    else:
        print(f'   Error: {r.text[:200]}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 6: Register user
print('\n6️⃣  REGISTER USER (/api/auth/register)')
try:
    payload = {
        'email': f'testuser{hash("test")%10000}@example.com',
        'password': 'TestPassword123!',
        'name': 'Test User'
    }
    r = requests.post(f'{BASE_URL}/api/auth/register', json=payload)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        resp = r.json()
        TOKEN = resp.get('access_token')
        print(f'   ✓ Registered successfully')
        print(f'   Email: {resp.get("email")}')
        print(f'   Token received: {TOKEN[:20]}...')
    else:
        print(f'   Error: {r.text[:300]}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 7: Login user
print('\n7️⃣  LOGIN USER (/api/auth/login)')
try:
    payload = {
        'email': 'testuser@example.com',
        'password': 'TestPassword123!'
    }
    r = requests.post(f'{BASE_URL}/api/auth/login', json=payload)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        resp = r.json()
        TOKEN = resp.get('access_token')
        print(f'   ✓ Login successful')
        print(f'   Token received: {TOKEN[:20] if TOKEN else "None"}...')
    elif r.status_code == 401:
        print(f'   ✓ Correctly returns 401 for invalid credentials')
    else:
        print(f'   Error: {r.text[:300]}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 8: Get current user (requires token)
print('\n8️⃣  GET CURRENT USER (/api/auth/me)')
try:
    if TOKEN:
        headers = {'Authorization': f'Bearer {TOKEN}'}
        r = requests.get(f'{BASE_URL}/api/auth/me', headers=headers)
        print(f'   Status: {r.status_code}')
        if r.status_code == 200:
            print(f'   ✓ User info retrieved: {r.json()}')
        else:
            print(f'   Error: {r.text[:200]}')
    else:
        # Try without token to see if it requires auth
        r = requests.get(f'{BASE_URL}/api/auth/me')
        if r.status_code == 403:
            print(f'   ✓ Correctly requires authentication (403)')
        else:
            print(f'   Status: {r.status_code}')
except Exception as e:
    print(f'   ❌ Error: {e}')

# Test 9: Analyze basket
print('\n9️⃣  ANALYZE BASKET (/api/basket/analyze)')
try:
    payload = {
        'items': [
            {'product_id': 'apple', 'quantity': 2},
            {'product_id': 'bread', 'quantity': 1}
        ]
    }
    r = requests.post(f'{BASE_URL}/api/basket/analyze', json=payload)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        resp = r.json()
        print(f'   ✓ Analysis successful')
        print(f'   Cheapest store total: {resp.get("cheapest_store_total", {})}')
    elif r.status_code == 400:
        print(f'   ✓ Returns 400 for invalid products (expected)')
        print(f'   Message: {r.json().get("detail", "")}')
    else:
        print(f'   Status: {r.status_code}, Error: {r.text[:200]}')
except Exception as e:
    print(f'   ❌ Error: {e}')

print('\n' + '='*60)
print('✅ TEST SUITE COMPLETE')
print('='*60)
