/**
 * API Client Service
 * Handles all HTTP requests to the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    const storedTokens = [
      localStorage.getItem('auth_token'),
      localStorage.getItem('access_token'),
    ].filter((token): token is string => Boolean(token));

    for (const token of storedTokens) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
        if (!payload.exp || payload.exp * 1000 > Date.now()) {
          return token;
        }
      } catch {
        // Remove malformed tokens and continue with the next stored token.
        localStorage.removeItem('auth_token');
        localStorage.removeItem('access_token');
      }
    }

    return null;
  }

  /**
   * Helper method to make fetch requests
   */
  private async request<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // ============ Auth Routes ============
  auth = {
    register: (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () =>
      this.request('/auth/logout', {
        method: 'POST',
      }),

    refreshToken: () =>
      this.request('/auth/refresh-token', {
        method: 'POST',
      }),

    forgotPassword: (email: string) =>
      this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (token: string, newPassword: string) =>
      this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
  };

  // ============ User Routes ============
  users = {
    getProfile: () => this.request('/users/profile'),

    updateProfile: (data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      avatar?: string;
    }) =>
      this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    changePassword: (currentPassword: string, newPassword: string) =>
      this.request('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),

    addAddress: (data: {
      label: string;
      address: string;
      latitude?: number;
      longitude?: number;
    }) =>
      this.request('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getAddresses: () => this.request('/users/addresses'),

    updateAddress: (
      id: string,
      data: {
        label?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
      }
    ) =>
      this.request(`/users/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteAddress: (id: string) =>
      this.request(`/users/addresses/${id}`, {
        method: 'DELETE',
      }),

    addPaymentMethod: (data: {
      type: string;
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
      upiId?: string;
    }) =>
      this.request('/users/payment-methods', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getPaymentMethods: () => this.request('/users/payment-methods'),

    deletePaymentMethod: (id: string) =>
      this.request(`/users/payment-methods/${id}`, {
        method: 'DELETE',
      }),
  };

  // ============ Restaurant Routes ============
  restaurants = {
    getAll: (filters?: {
      search?: string;
      cuisine?: string;
      minRating?: number;
      limit?: number;
      offset?: number;
    }) => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.cuisine) params.append('cuisine', filters.cuisine);
      if (filters?.minRating) params.append('minRating', String(filters.minRating));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return this.request(`/restaurants?${params.toString()}`);
    },

    nearby: (latitude: number, longitude: number) =>
      this.request(`/restaurants/nearby?latitude=${encodeURIComponent(String(latitude))}&longitude=${encodeURIComponent(String(longitude))}`),

    getById: (id: string) => this.request(`/restaurants/${id}`),

    getMenu: (restaurantId: string) =>
      this.request(`/restaurants/${restaurantId}/menu`),

    getReviews: (restaurantId: string) =>
      this.request(`/restaurants/${restaurantId}/reviews`),
  };

  // ============ Food Routes ============
  foods = {
    getAll: (filters?: {
      search?: string;
      category?: string;
      restaurantId?: string;
      maxPrice?: number;
      minRating?: number;
      veg?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.restaurantId) params.append('restaurantId', filters.restaurantId);
      if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters?.minRating) params.append('minRating', String(filters.minRating));
      if (filters?.veg !== undefined) params.append('veg', String(filters.veg));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return this.request(`/foods?${params.toString()}`);
    },

    getById: (id: string) => this.request(`/foods/${id}`),

    getCategories: () => this.request('/foods/categories'),

    search: (query: string) =>
      this.request(`/foods/search?q=${encodeURIComponent(query)}`),
  };

  // ============ Order Routes ============
  orders = {
    create: (data: {
      restaurantId: string;
      items: Array<{ foodId: string; quantity: number; specialInstructions?: string }>;
      deliveryAddress: string;
      phoneNumber: string;
      paymentMethod: 'COD' | 'ONLINE' | 'UPI';
      specialInstructions?: string;
      deliveryFee?: number;
      gst?: number;
    }) =>
      this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getAll: (filters?: { status?: string; limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return this.request(`/orders?${params.toString()}`);
    },

    getById: (id: string) => this.request(`/orders/${id}`),

    updateStatus: (id: string, status: string) =>
      this.request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    cancel: (id: string, reason?: string) =>
      this.request(`/orders/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),

    track: (id: string) => this.request(`/orders/${id}/track`),
  };

  // ============ Payment Routes ============
  payments = {
    create: (data: {
      orderId: string;
      amount: number;
      paymentMethod: string;
    }) =>
      this.request('/payments/create', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    initiatePayment: (data: {
      orderId: string;
      amount: number;
      paymentMethod: string;
    }) =>
      this.request('/payments/create', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    verifyPayment: (data: {
      orderId: string;
      transactionId: string;
      paymentMethod: string;
      status?: 'PENDING' | 'SUCCESS' | 'FAILED';
    }) =>
      this.request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ ...data, status: data.status || 'SUCCESS' }),
      }),

    getPaymentMethods: () => this.request('/payments/methods'),

    getTransactionHistory: (limit?: number, offset?: number) => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', String(limit));
      if (offset) params.append('offset', String(offset));
      return this.request(`/payments/history?${params.toString()}`);
    },
  };

  // ============ Review Routes ============
  reviews = {
    create: (data: {
      orderId: string;
      restaurantId: string;
      rating: number;
      comment?: string;
      foodItems?: Array<{ foodId: string; rating: number; comment?: string }>;
    }) =>
      this.request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getByRestaurant: (restaurantId: string) =>
      this.request(`/reviews/restaurant/${restaurantId}`),

    getByFood: (foodId: string) =>
      this.request(`/reviews/food/${foodId}`),

    update: (id: string, data: { rating?: number; comment?: string }) =>
      this.request(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request(`/reviews/${id}`, {
        method: 'DELETE',
      }),
  };

  // ============ AI Routes ============
  ai = {
    chat: (data: { message: string; context?: string }) =>
      this.request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    search: (query: string) =>
      this.request('/ai/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),

    getRecommendations: (filters?: { cuisine?: string; budget?: number }) =>
      this.request('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify(filters || {}),
      }),

    imageSearch: (imageData: string) =>
      this.request('/ai/image-search', {
        method: 'POST',
        body: JSON.stringify({ imageData }),
      }),

    voiceSearch: (audioData: string) =>
      this.request('/ai/voice-search', {
        method: 'POST',
        body: JSON.stringify({ audioData }),
      }),
  };

  // ============ Offer Routes ============
  offers = {
    getAll: () => this.request('/offers'),

    getById: (id: string) => this.request(`/offers/${id}`),

    applyOffer: (orderId: string, offerCode: string) =>
      this.request(`/offers/${offerCode}/apply`, {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      }),

    getActiveOffers: () => this.request('/offers/active'),
  };

  // ============ Admin Routes ============
  admin = {
    getDashboard: () => this.request('/admin/dashboard'),

    getAnalytics: (timeRange?: string) => {
      const params = new URLSearchParams();
      if (timeRange) params.append('timeRange', timeRange);
      return this.request(`/admin/analytics?${params.toString()}`);
    },

    getUsers: (limit?: number, offset?: number) => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', String(limit));
      if (offset) params.append('offset', String(offset));
      return this.request(`/admin/users?${params.toString()}`);
    },

    updateUserRole: (userId: string, role: string) =>
      this.request(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),

    getOrders: (filters?: { status?: string; limit?: number; offset?: number }) => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return this.request(`/admin/orders?${params.toString()}`);
    },

    getRestaurants: (limit?: number, offset?: number) => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', String(limit));
      if (offset) params.append('offset', String(offset));
      return this.request(`/admin/restaurants?${params.toString()}`);
    },

    approveRestaurant: (restaurantId: string) =>
      this.request(`/admin/restaurants/${restaurantId}/approve`, {
        method: 'POST',
      }),

    rejectRestaurant: (restaurantId: string, reason: string) =>
      this.request(`/admin/restaurants/${restaurantId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),

    createOffer: (data: {
      code: string;
      description: string;
      discount: number;
      type: 'percentage' | 'fixed';
      maxUses: number;
      expiryDate: string;
    }) =>
      this.request('/admin/offers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateOffer: (
      id: string,
      data: {
        code?: string;
        description?: string;
        discount?: number;
        type?: 'percentage' | 'fixed';
        maxUses?: number;
        expiryDate?: string;
      }
    ) =>
      this.request(`/admin/offers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteOffer: (id: string) =>
      this.request(`/admin/offers/${id}`, {
        method: 'DELETE',
      }),
  };
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export helper hooks for React if needed
export const useApi = () => apiClient;

// Export individual API namespaces for convenience
export const api = {
  auth: apiClient.auth,
  users: apiClient.users,
  restaurants: apiClient.restaurants,
  foods: apiClient.foods,
  orders: apiClient.orders,
  payments: apiClient.payments,
  reviews: apiClient.reviews,
  ai: apiClient.ai,
  offers: apiClient.offers,
  admin: apiClient.admin,
};
