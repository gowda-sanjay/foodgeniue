# FoodGenie Frontend-Backend Connection Summary

## ✅ What's Been Set Up

### 1. **Environment Configuration**
- ✅ `.env.local` created in root (frontend)
- ✅ `.env.local` created in backend folder
- ✅ Vite proxy configured for API calls

### 2. **API Client Service**
- ✅ Comprehensive API client at `src/services/api.ts`
- ✅ Covers all backend routes: auth, users, restaurants, foods, orders, payments, reviews, AI, offers, admin
- ✅ Automatic JWT token handling
- ✅ Error handling built-in

### 3. **Socket.IO Service**
- ✅ Real-time event handling at `src/services/socket.ts`
- ✅ Order tracking support
- ✅ Notifications and chat events
- ✅ Auto-reconnection

### 4. **Documentation**
- ✅ Complete setup guide: `SETUP_GUIDE.md`
- ✅ All API endpoints documented
- ✅ Troubleshooting guide included

## 🚀 Quick Start

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
npm install socket.io-client  # For Socket.IO support
```

**Frontend (root):**
```bash
npm install
npm install socket.io-client  # For Socket.IO support
```

### Step 2: Configure Environment

Backend `.env.local`:
```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/foodgenie
ADMIN_EMAIL=foodgen@123
ADMIN_PASSWORD=Food@123
ADMIN_NAME=FoodGenie Admin
```

Frontend `.env.local` (already created):
```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

## 💻 Usage Examples

### Basic API Call

```typescript
import { api } from './services/api';

// Get all restaurants
const restaurants = await api.restaurants.getAll({ limit: 10 });

// Get specific restaurant
const restaurant = await api.restaurants.getById('restaurant-id');

// Search foods
const foods = await api.foods.search('pizza');
```

### Authentication

```typescript
import { api } from './services/api';

// Register
const result = await api.auth.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
});

// Login
const loginResult = await api.auth.login({
  email: 'john@example.com',
  password: 'password123',
});

// Save token
localStorage.setItem('auth_token', loginResult.token);

// Token is automatically used in all subsequent requests
```

### Creating Orders

```typescript
import { api } from './services/api';

const order = await api.orders.create({
  restaurantId: 'restaurant-1',
  items: [
    { foodId: 'food-1', quantity: 2 },
    { foodId: 'food-2', quantity: 1 },
  ],
  deliveryAddressId: 'address-1',
  paymentMethodId: 'payment-1',
  notes: 'No onions please',
});

console.log('Order created:', order.id);
```

### Real-time Order Tracking

```typescript
import { socketService } from './services/socket';

// Connect to socket
await socketService.connect();

// Track specific order
socketService.trackOrder('order-123');

// Listen for status updates
socketService.on('order:status_changed', (data) => {
  console.log(`Order status: ${data.status}`);
  console.log(`Message: ${data.message}`);
});

// Listen for delivery updates
socketService.on('order:delivery_update', (data) => {
  console.log(`Delivery location: ${data.latitude}, ${data.longitude}`);
  console.log(`ETA: ${data.eta} minutes`);
});

// Stop tracking when done
socketService.stopTrackingOrder('order-123');
socketService.disconnect();
```

### AI Features

```typescript
import { api } from './services/api';

// Chat with AI
const response = await api.ai.chat({
  message: 'Show me vegetarian restaurants near me',
});

// Get recommendations
const recommendations = await api.ai.getRecommendations({
  cuisine: 'Italian',
  budget: 500,
});

// Search by image
const imageBase64 = 'data:image/jpeg;base64,...'; // Base64 encoded image
const results = await api.ai.imageSearch(imageBase64);
```

### Admin Operations

```typescript
import { api } from './services/api';

// Get dashboard stats
const dashboard = await api.admin.getDashboard();

// Get analytics
const analytics = await api.admin.getAnalytics('weekly');

// Create offer
const offer = await api.admin.createOffer({
  code: 'SAVE20',
  description: '20% off on all orders',
  discount: 20,
  type: 'percentage',
  maxUses: 1000,
  expiryDate: '2024-12-31',
});
```

## 📁 File Structure

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.ts              # Main API client
│   │   ├── socket.ts           # Real-time events
│   │   └── ai.ts               # Local AI services
│   ├── views/                   # Page components
│   └── components/              # Reusable components
├── .env.local                   # Environment variables
└── vite.config.ts              # Vite configuration

backend/
├── src/
│   ├── controllers/             # Route handlers
│   ├── services/                # Business logic
│   ├── repositories/            # Database access
│   ├── routes/                  # API route definitions
│   ├── middlewares/             # Express middlewares
│   ├── socket/                  # Socket.IO handlers
│   └── server.ts                # Main server file
├── .env.local                   # Environment variables
└── package.json                 # Dependencies
```

## 🔑 Key Features

### ✨ API Client
- Automatic error handling
- JWT token management
- Request/response intercepting
- Type-safe endpoints
- Query parameter building

### 🔌 Real-time Updates
- Order status tracking
- Live notifications
- Delivery location updates
- Chat support
- Auto-reconnection

### 🛡️ Security
- CORS configured
- Secure cookie handling
- JWT-based authentication
- Input validation

## 🧪 Testing the Connection

1. **Test API:**
   ```javascript
   // In browser console
   import { api } from './services/api.ts';
   const restaurants = await api.restaurants.getAll();
   console.log(restaurants);
   ```

2. **Test Socket:**
   ```javascript
   // In browser console
   import { socketService } from './services/socket.ts';
   await socketService.connect();
   console.log('Connected:', socketService.isConnected());
   ```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API 404 errors | Check backend is running on :4000, verify endpoint path |
| CORS errors | Verify FRONTEND_URL in backend .env.local matches http://localhost:5173 |
| Socket not connecting | Install socket.io-client: `npm install socket.io-client` |
| Database errors | Check DATABASE_URL, run: `npm run prisma migrate dev` |
| Token not working | Ensure auth_token is saved in localStorage after login |
| Vite proxy issues | Restart dev server after changing vite.config.ts |

## 📚 Next Steps

1. ✅ All infrastructure is set up
2. Update existing views to use the API client
3. Implement authentication UI
4. Add real-time order tracking UI
5. Test all features end-to-end
6. Deploy to production

## 📖 Full Documentation

See `SETUP_GUIDE.md` for:
- Complete architecture overview
- Detailed installation steps
- All API endpoint documentation
- Production deployment guide
- Additional troubleshooting

---

**Status**: ✅ Frontend and backend are now ready to connect!
