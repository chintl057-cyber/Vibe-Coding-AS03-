# Backend Setup Guide

## What's Been Implemented

### ✅ Complete Backend System Created

**Backend Structure** (in `/backend` directory):
- FastAPI application with full CORS and error handling
- SQLAlchemy ORM models for all entities
- Pydantic schemas for request/response validation
- Complete API routes (products, basket, authentication)
- Business logic services (product querying, recommendations)
- JWT authentication with dependency injection
- Database utilities and calculation helpers

**Key Files:**
- `main.py` - FastAPI entry point
- `models/` - Database models
- `routes/` - API endpoints
- `services/` - Business logic
- `schemas/` - Request/response validation
- `config.py`, `database.py`, `security.py` - Infrastructure

### ✅ Frontend API Client Created

**Files in `/src/api`:**
- `client.ts` - Axios client with auth interceptor
- `products.ts` - Product API methods
- `basket.ts` - Basket analysis API
- `auth.ts` - Authentication API

### ✅ Frontend Integration Started

- Updated `DiscoveryContext.tsx` to fetch products from API
- Added loading/error states to contexts
- Removed dependency on static `src/data/products.ts` (deleted)
- Installed `axios` dependency

## Quick Start (Local Development)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

### 2. Database Setup (Supabase)

- Create free Supabase project at supabase.com
- Get `SUPABASE_URL` and `SUPABASE_KEY`
- Create `backend/.env`:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-key
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/postgres
JWT_SECRET=your-secret
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
```

### 3. Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE supermarkets (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE suburbs (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE products (id VARCHAR(100) PRIMARY KEY, name VARCHAR(200) NOT NULL, category VARCHAR(50) NOT NULL, image VARCHAR(10) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE product_prices (id SERIAL PRIMARY KEY, product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE, supermarket_id VARCHAR(50) NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE, price FLOAT NOT NULL, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE promotions (id SERIAL PRIMARY KEY, product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE, supermarket_id VARCHAR(50) NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE, original_price FLOAT NOT NULL, discounted_price FLOAT NOT NULL, discount_percent INTEGER NOT NULL, promotion_label VARCHAR(100) NOT NULL, is_half_price BOOLEAN DEFAULT FALSE, saving_amount FLOAT NOT NULL, ends_in VARCHAR(50), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE users (id VARCHAR(100) PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(255), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE saved_baskets (id SERIAL PRIMARY KEY, user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE, name VARCHAR(100) DEFAULT 'My Basket', created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE basket_items (id SERIAL PRIMARY KEY, basket_id INTEGER NOT NULL REFERENCES saved_baskets(id) ON DELETE CASCADE, product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE, quantity INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMP DEFAULT NOW());
```

### 4. Run Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend at: http://localhost:8000
Docs at: http://localhost:8000/docs

### 5. Frontend Setup

```bash
# In project root
npm install  # axios already installed
npm run dev
```

Frontend at: http://localhost:5173

## API Endpoints

```
Products:
  GET /api/products
  GET /api/products/search?q=milk&category=dairy
  GET /api/products/{id}

Basket Analysis:
  POST /api/basket/analyze

Authentication:
  POST /api/auth/register
  POST /api/auth/login
```

## What Still Needs Done

1. **RecommendationPage** - Update to use `basketApi.analyze()` instead of client-side function
2. **Type Updates** - Ensure frontend types match API response format (snake_case to camelCase)
3. **Error Handling** - Add error boundaries in components
4. **Loading States** - Show loading spinners while API calls in progress
5. **Authentication UI** - Connect login/register to `authApi`
6. **Testing** - Test end-to-end flow with real API

## Architecture

**Frontend → API Communication Flow:**

```
User Action
    ↓
React Component
    ↓
API Client (axios)
    ↓
FastAPI Backend
    ↓
SQLAlchemy ORM
    ↓
Supabase PostgreSQL
```

**Key Integration Points:**

- DiscoveryContext → productsApi.getAll()
- RecommendationPage → basketApi.analyze()
- Auth Routes → authApi.login/register/me()

## Notes

- All static product data migrated to database
- API responses use snake_case, frontend uses camelCase
- JWT tokens stored in localStorage
- CORS configured for localhost:5173
- Database tables auto-created on first run (SQLAlchemy)

## Next Steps

1. Update RecommendationPage component with API integration
2. Connect auth UI to authApi
3. Add error boundaries and loading states
4. Test full flow: Browse → Search → Add → Analyze → Recommendations
5. Deploy backend (Vercel, Railway, etc.)
6. Update CORS_ORIGINS for production domain
