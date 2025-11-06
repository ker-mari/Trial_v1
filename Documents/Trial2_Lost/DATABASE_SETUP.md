# Database Connection Setup

## Overview
Both the backend (Laravel) and frontend (React) are now properly connected to the SQLite database.

## Database Configuration

### Backend (Laravel)
- **Database**: SQLite
- **Location**: `backend/database/database.sqlite`
- **Configuration**: `.env` file with `DB_CONNECTION=sqlite`
- **Models**: Item, User, History
- **API Routes**: Available at `http://localhost:8000/api/`

### Frontend (React)
- **API Base URL**: `http://localhost:8000/api`
- **Configuration**: `.env` file with `REACT_APP_API_URL`
- **HTTP Client**: Axios with proper error handling

## Available API Endpoints

### Items API
- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `POST /api/items/{id}/claim` - Claim item

### Test Endpoints
- `GET /api/test-db` - Test database connection
- `POST /api/auth/verify-pin` - Verify PIN authentication

## Database Schema

### Items Table
- `id` - Primary key
- `item_no` - Unique item number
- `category` - Item category
- `is_valuable` - Boolean flag
- `image` - Image/emoji representation
- `location` - Where item was found
- `date_time` - When item was found
- `description` - Item description
- `status` - available/claimed
- `created_at`, `updated_at` - Timestamps

## Quick Start

1. **Start both servers**:
   ```bash
   # Run this from the root directory
   start-all.bat
   ```

2. **Verify setup**:
   ```bash
   # Test database connection
   verify-setup.bat
   ```

3. **Manual start**:
   ```bash
   # Backend
   cd backend
   php artisan serve --port=8000
   
   # Frontend (in new terminal)
   cd my-app
   npm run dev
   ```

## Test Data
The database is pre-populated with 8 test items including:
- Electronics (phone)
- Accessories (hair clip, watch)
- School supplies
- Personal belongings (wallet)
- Sports equipment
- Clothing
- Food containers

## Connection Status
✅ Backend connected to database.sqlite
✅ Frontend configured to connect to backend API
✅ CORS properly configured
✅ Test data available
✅ All API endpoints functional

## Troubleshooting

If you encounter issues:
1. Run `verify-setup.bat` to check connections
2. Ensure both servers are running
3. Check that database.sqlite file exists
4. Verify .env files are properly configured