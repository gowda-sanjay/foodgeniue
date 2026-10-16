# Frontend-Backend Connection Setup Guide

This guide explains how to connect the FoodGenie frontend and backend applications.

## Architecture Overview

```
Frontend (Vite + React) → Backend (Express + TypeScript)
       http://localhost:5173        http://localhost:4000
```

## Prerequisites

- Node.js v16+ and npm
- PostgreSQL database (for backend)
- Two terminal windows or tabs

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install Additional Socket.IO Package

```bash
npm install socket.io-client
```

### 3. Configure Environment Variables

Create or update `.env.local` in the `backend/` directory:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/foodgenie

# Admin credentials (change in production)
ADMIN_EMAIL=foodgen@123
ADMIN_PASSWORD=Food@123
ADMIN_NAME=FoodGenie Admin

# Optional API keys
# GEMINI_API_KEY=your_gemini_api_key
# STRIPE_API_KEY=your_stripe_key
# CLOUDINARY_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Setup Database

```bash
# Run migrations
npm run prisma migrate dev

# Seed database (optional)
npm run seed
```

### 5. Start Backend Server

```bash
npm run dev
```

Backend will run on: **http://localhost:4000**

## Frontend Setup

### 1. Install Dependencies

```bash
cd ../
npm install
```

### 2. Install Socket.IO Client

```bash
npm install socket.io-client
```

### 3. Configure Environment Variables

Create or update `.env.local` in the root directory:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

## Using the API Client

### In React Components

```typescript
import { api, useApi } from './services/api';
import { socketService } from './services/socket';

function MyComponent() {
  // Using API
  const fetchRestaurants = async () => {
    try {
      const restaurants = await api.restaurants.getAll({ limit: 10 });
      console.log(restaurants);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Using Socket.IO
  const setupSocket = async () => {
    await socketService.connect();
    socketService.on('notification:new', (notification) => {
      console.log('New notification:', notification);
    });
  };

  return (
    <div>
      <button onClick={fetchRestaurants}>Get Restaurants</button>
      <button onClick={setupSocket}>Connect Socket</button>
    </div>
  );
}
```

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh auth token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/addresses` - Get saved addresses
- `POST /api/users/addresses` - Add new address

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Foods
- `GET /api/foods` - List all foods
- `GET /api/foods/:id` - Get food details
- `GET /api/foods/categories` - Get food categories
- `GET /api/foods/search?q=query` - Search foods

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/methods` - Get payment methods

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `GET /api/reviews/food/:id` - Get food reviews

### AI
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/search` - AI-powered search
- `POST /api/ai/recommendations` - Get personalized recommendations
- `POST /api/ai/image-search` - Search by food image
- `POST /api/ai/voice-search` - Voice-based search

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/users` - List users
- `GET /api/admin/orders` - List all orders

## Authentication Flow

1. **Register/Login**: Get JWT token from backend
2. **Store Token**: Save token in localStorage as `auth_token`
3. **API Requests**: Token automatically included in Authorization header
4. **Token Refresh**: Use refresh endpoint to get new token when expired

Example:
```typescript
// After login
const response = await api.auth.login({ email, password });
localStorage.setItem('auth_token', response.token);

// Token is automatically added to subsequent requests
const profile = await api.users.getProfile();
```

## Real-time Features (Socket.IO)

```typescript
// Connect to socket
await socketService.connect();

// Listen for order updates
socketService.on('order:status_changed', (data) => {
  console.log(`Order ${data.orderId} is now ${data.status}`);
});

// Track specific order
socketService.trackOrder('order-123');

// Listen for notifications
socketService.on('notification:new', (notification) => {
  console.log(notification);
});

// Disconnect when done
socketService.disconnect();
```

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env.local` matches your frontend URL
- Default backend CORS allows `http://localhost:5173`

### Connection Refused
- Verify backend is running on port 4000
- Check if port is not blocked by firewall

### API 404 Errors
- Verify endpoint path matches the route definitions
- Check network tab in browser DevTools for actual request

### Socket.IO Connection Issues
- Ensure `VITE_SOCKET_URL` is set correctly in frontend `.env.local`
- Check browser console for WebSocket errors
- Verify socket.io is installed: `npm install socket.io-client`

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format in `.env.local`
- Run migrations: `npm run prisma migrate dev`

## Development Workflow

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend**
   ```bash
   npm run dev
   ```

3. **Browser**
   - Open `http://localhost:5173`
   - Open DevTools (F12) to see API calls and socket events

## Production Deployment

For production:

1. Update CORS settings in backend
2. Set proper environment variables
3. Use HTTPS for secure connections
4. Update Socket.IO configuration for production URLs
5. Set secure cookies with `secure: true`

Example production `.env`:
```env
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://prod_user:prod_password@prod_host/foodgenie
NODE_ENV=production
PORT=3000
```

## Next Steps

1. ✅ Start backend server
2. ✅ Start frontend server
3. Test API connectivity by making sample requests
4. Implement authentication in UI
5. Build features using the API client
6. Test real-time features with Socket.IO
7. Deploy to production

For more details, see:
- Backend: `backend/README.md`
- API Documentation: Check individual controller files in `backend/src/controllers/`
