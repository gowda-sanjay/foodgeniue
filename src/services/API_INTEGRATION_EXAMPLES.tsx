/**
 * Example: Using API Client in React Components
 * 
 * This file demonstrates how to integrate the API client
 * into your existing React views and components.
 */

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { socketService } from '../services/socket';

// ============ Example 1: Fetching Restaurants ============
export function RestaurantsExample() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.restaurants.getAll({ limit: 20 });
        setRestaurants(data.restaurants || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {restaurants.map((restaurant: any) => (
        <div key={restaurant.id}>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.cuisine}</p>
        </div>
      ))}
    </div>
  );
}

// ============ Example 2: Authentication ============
export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await api.auth.login({ email, password });

      // Save token
      localStorage.setItem('auth_token', response.token);

      // Redirect or update app state
      alert('Login successful!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ============ Example 3: Creating an Order ============
export function CheckoutExample({
  restaurantId,
  items,
}: {
  restaurantId: string;
  items: Array<{ foodId: string; quantity: number }>;
}) {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = async (
    deliveryAddressId: string,
    paymentMethodId: string
  ) => {
    try {
      setLoading(true);

      const order = await api.orders.create({
        restaurantId,
        items,
        deliveryAddress: deliveryAddressId,
        phoneNumber: '+91 94812 73921',
        paymentMethod: paymentMethodId as 'COD' | 'ONLINE' | 'UPI',
      });

      setOrderId(order.id);
      alert('Order created! Tracking your delivery...');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {orderId ? (
        <div>
          <h3>Order Confirmed!</h3>
          <p>Order ID: {orderId}</p>
        </div>
      ) : (
        <button
          onClick={() =>
            handleCheckout('address-123', 'payment-123')
          }
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Complete Order'}
        </button>
      )}
    </div>
  );
}

// ============ Example 4: Real-time Order Tracking ============
export function OrderTrackingExample({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState('pending');
  const [eta, setEta] = useState(0);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();

        // Track this specific order
        socketService.trackOrder(orderId);

        // Listen for status changes
        socketService.on('order:status_changed', (data) => {
          if (data.orderId === orderId) {
            setStatus(data.status);
            console.log(`Order status: ${data.message}`);
          }
        });

        // Listen for delivery location updates
        socketService.on('order:delivery_update', (data) => {
          if (data.orderId === orderId) {
            setLocation({ latitude: data.latitude, longitude: data.longitude });
            setEta(data.eta);
          }
        });

        return () => {
          socketService.stopTrackingOrder(orderId);
        };
      } catch (error) {
        console.error('Failed to connect socket:', error);
      }
    };

    initSocket();
  }, [orderId]);

  return (
    <div>
      <h3>Order Tracking</h3>
      <p>Status: {status}</p>
      <p>ETA: {eta} minutes</p>
      <p>
        Location: {location.latitude}, {location.longitude}
      </p>
    </div>
  );
}

// ============ Example 5: AI Search ============
export function AISearchExample() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await api.ai.search(query);
      setResults(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for food..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {results && (
        <div>
          <h3>Results</h3>
          {results.foods?.map((food: any) => (
            <div key={food.id}>{food.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Example 6: User Profile ============
export function ProfileExample() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.users.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found. Please login.</div>;

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
    </div>
  );
}

// ============ Example 7: Custom Hook for API ============
/**
 * Reusable hook for fetching data from any API endpoint
 */
export function useFetchAPI<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error');
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Usage of custom hook:
export function RestaurantsWithHook() {
  const { data: restaurants, loading, error } = useFetchAPI(
    () => api.restaurants.getAll({ limit: 20 }),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {restaurants?.map((r: any) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
}

// ============ Example 8: Error Handling ============
export function ErrorHandlingExample() {
  const [error, setError] = useState<string | null>(null);

  const handleAPICall = async () => {
    try {
      setError(null);

      // Try to fetch something
      await api.users.getProfile();
    } catch (err) {
      // Handle different error types
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setError('Please login again');
          localStorage.removeItem('auth_token');
        } else if (err.message.includes('404')) {
          setError('Resource not found');
        } else if (err.message.includes('500')) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.message);
        }
      }
    }
  };

  return (
    <div>
      <button onClick={handleAPICall}>Make API Call</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

// ============ Usage in Your Views ============
/**
 * To integrate the API client into your existing views:
 * 
 * 1. Import the api client:
 *    import { api } from '../services/api';
 * 
 * 2. Use in useEffect to fetch data:
 *    useEffect(() => {
 *      api.restaurants.getAll().then(setRestaurants);
 *    }, []);
 * 
 * 3. Use in event handlers for mutations:
 *    const handleCreate = async () => {
 *      await api.orders.create({...});
 *    };
 * 
 * 4. For real-time features:
 *    import { socketService } from '../services/socket';
 *    await socketService.connect();
 *    socketService.on('order:status_changed', handleStatusChange);
 */
