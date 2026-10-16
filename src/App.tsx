import { useState, useEffect } from 'react';
import { type FoodItem } from './data/restaurants';

// Views
import { LandingView } from './views/LandingView';
import { RestaurantsView } from './views/RestaurantsView';
import { RestaurantDetailView } from './views/RestaurantDetailView';
import { FoodDetailView } from './views/FoodDetailView';
import { AiChatView } from './views/AiChatView';
import { CheckoutView } from './views/CheckoutView';
import { PaymentView } from './views/PaymentView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { OrdersView } from './views/OrdersView';
import { ProfileView } from './views/ProfileView';
import { FavoritesView } from './views/FavoritesView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { OrderNowModal } from './components/OrderNowModal';

// Components
import { Navbar } from './components/Navbar';

function App() {
  const [currentView, setView] = useState<string>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selection states
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderFlowFood, setOrderFlowFood] = useState<FoodItem | null>(null);

  // checkout temp summary
  const [tempOrderSummary, setTempOrderSummary] = useState<any>(null);

  // Persistent States
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Initial local state loader
  useEffect(() => {
    // 1. Theme sync
    const savedTheme = localStorage.getItem('fg_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateThemeDom(savedTheme);
    } else {
      updateThemeDom('dark');
    }

    // 2. Favorites load
    const savedFavs = localStorage.getItem('fg_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    // 3. Orders load
    const savedOrders = localStorage.getItem('fg_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const updateThemeDom = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.removeAttribute('data-theme');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  };

  const toggleTheme = () => {
    const target = theme === 'light' ? 'dark' : 'light';
    setTheme(target);
    localStorage.setItem('fg_theme', target);
    updateThemeDom(target);
  };

  const toggleFavorite = (food: FoodItem) => {
    setFavorites(prev => {
      let updated;
      if (prev.includes(food.id)) {
        updated = prev.filter(id => id !== food.id);
      } else {
        updated = [...prev, food.id];
      }
      localStorage.setItem('fg_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Direct checkout routing (No Cart system)
  const handleOrderNow = (food: FoodItem) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    if (!token) {
      alert('Please login to place your order.');
      setView('profile');
      return;
    }

    setSelectedFood(food);
    setOrderFlowFood(food);
  };

  const handleAutomaticOrderCreated = (order: any) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      localStorage.setItem('fg_orders', JSON.stringify(updated));
      return updated;
    });
    setSelectedOrderId(order.id);
  };

  const handleAutomaticOrderTracking = () => {
    setOrderFlowFood(null);
    setView('order-tracking');
  };

  const handleProceedToPayment = (summary: any) => {
    setTempOrderSummary(summary);
    setView('payment');
  };

  const handlePaymentSuccess = (finalOrder: any) => {
    setOrders(prev => {
      const updated = [finalOrder, ...prev];
      localStorage.setItem('fg_orders', JSON.stringify(updated));
      return updated;
    });
    setSelectedOrderId(finalOrder.id);
    setView('order-tracking');
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'received' | 'preparing' | 'out' | 'delivered') => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
      localStorage.setItem('fg_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetDatabase = () => {
    setOrders([]);
    localStorage.removeItem('fg_orders');
    alert("Simulation database has been fully restored to default empty states.");
  };

  // Find active tracking order
  const activeTrackingOrder = orders.find(o => o.id === selectedOrderId);

  // Render view conditionally
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingView
            setView={setView}
            setSelectedRestaurantId={setSelectedRestaurantId}
            setSelectedFood={setSelectedFood}
            onOrderNow={handleOrderNow}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'restaurants':
        return (
          <RestaurantsView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setView={setView}
            setSelectedRestaurantId={setSelectedRestaurantId}
            setSelectedFood={setSelectedFood}
            onOrderNow={handleOrderNow}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'restaurant-detail':
        return (
          <RestaurantDetailView
            restaurantId={selectedRestaurantId || ''}
            setView={setView}
            setSelectedFood={setSelectedFood}
            onOrderNow={handleOrderNow}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'food-detail':
        return selectedFood ? (
          <FoodDetailView
            food={selectedFood}
            setView={setView}
            onOrderNow={handleOrderNow}
            isFavorite={favorites.includes(selectedFood.id)}
            toggleFavorite={toggleFavorite}
          />
        ) : (
          <div className="container" style={{ padding: '60px 0' }}><h3>Please select a valid food item</h3></div>
        );
      case 'checkout':
        return selectedFood ? (
          <CheckoutView
            food={selectedFood}
            setView={setView}
            onProceedToPayment={handleProceedToPayment}
          />
        ) : (
          <div className="container" style={{ padding: '60px 0' }}><h3>No item selected for checkout</h3></div>
        );
      case 'payment':
        return tempOrderSummary ? (
          <PaymentView
            orderSummary={tempOrderSummary}
            setView={setView}
            onPaymentSuccess={handlePaymentSuccess}
          />
        ) : (
          <div className="container" style={{ padding: '60px 0' }}><h3>No active invoice segment found</h3></div>
        );
      case 'order-tracking':
        return activeTrackingOrder ? (
          <OrderTrackingView
            order={activeTrackingOrder}
            setView={setView}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        ) : (
          <div className="container" style={{ padding: '60px 0' }}>
            <h3>No tracking order selected.</h3>
            <button className="btn-primary" onClick={() => setView('landing')}>Go Home</button>
          </div>
        );
      case 'orders':
        return (
          <OrdersView
            orders={orders}
            setView={setView}
            setSelectedOrderId={setSelectedOrderId}
          />
        );
      case 'profile':
        return (
          <ProfileView
            setView={setView}
          />
        );
      case 'favorites':
        return (
          <FavoritesView
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setView={setView}
            onOrderNow={handleOrderNow}
            setSelectedFood={setSelectedFood}
          />
        );
      case 'ai-chat':
        return (
          <AiChatView
            onOrderNow={handleOrderNow}
          />
        );
      case 'admin':
        return (
          <AdminDashboardView
            orders={orders}
            setView={setView}
            onUpdateStatus={handleUpdateOrderStatus}
            onResetDatabase={handleResetDatabase}
          />
        );
      default:
        return <div className="container" style={{ padding: '60px 0' }}><h3>View not found</h3></div>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Navbar
        currentView={currentView}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        favoritesCount={favorites.length}
      />
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {renderActiveView()}
      </main>
      {orderFlowFood && (
        <OrderNowModal
          food={orderFlowFood}
          onClose={() => setOrderFlowFood(null)}
          onOrderCreated={handleAutomaticOrderCreated}
          onTrackOrder={handleAutomaticOrderTracking}
        />
      )}
    </div>
  );
}

export default App;
