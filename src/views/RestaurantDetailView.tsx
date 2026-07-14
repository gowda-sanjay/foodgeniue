import React from 'react';
import { ArrowLeft, Star, Clock, MapPin, Grid, Compass } from 'lucide-react';
import { type FoodItem, FOODS_DATA, RESTAURANTS_DATA } from '../data/restaurants';
import { FoodCard } from '../components/FoodCard';

interface RestaurantDetailViewProps {
    restaurantId: string;
    setView: (view: string) => void;
    setSelectedFood: (food: FoodItem | null) => void;
    onOrderNow: (food: FoodItem) => void;
    favorites: string[];
    toggleFavorite: (food: FoodItem) => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
    restaurantId,
    setView,
    setSelectedFood,
    onOrderNow,
    favorites,
    toggleFavorite
}) => {
    const restaurant = RESTAURANTS_DATA.find(r => r.id === restaurantId);

    if (!restaurant) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h2>Restaurant not found</h2>
                <button className="btn-primary" onClick={() => setView('restaurants')}>Back to directory</button>
            </div>
        );
    }

    // Filter foods belonging to this restaurant
    const restaurantFoods = FOODS_DATA.filter(f => f.restaurantId === restaurantId);

    // Group foods by category
    const categories = Array.from(new Set(restaurantFoods.map(f => f.category)));

    const handleFoodClick = (food: FoodItem) => {
        setSelectedFood(food);
        setView('food-detail');
    };

    return (
        <div className="container animate-fade" style={{ padding: '24px 20px 60px' }}>

            {/* Back Button */}
            <button
                onClick={() => setView('restaurants')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="back-to-restaurants-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back to Restaurants</span>
            </button>

            {/* Restaurant Header Banner Card */}
            <div className="restaurant-banner">
                <img src={restaurant.coverImage} alt={restaurant.name} className="banner-image" />
                <div className="banner-overlay">
                    <div className="banner-content" style={{ width: '100%' }}>

                        {/* Cuisine and Rating Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                                <span className="banner-cuisine">{restaurant.cuisine}</span>
                                <h1 className="banner-title" style={{ margin: '4px 0' }}>{restaurant.name}</h1>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={14} />
                                    <span>{restaurant.address}</span>
                                </p>
                            </div>

                            {/* Rating Card */}
                            <div
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '10px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '1.25rem', color: '#FFC107', fontWeight: 800 }}>
                                    <Star fill="#FFC107" size={18} />
                                    <span>{restaurant.rating}</span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', marginTop: '2px', textTransform: 'uppercase', fontWeight: 700 }}>
                                    {restaurant.reviewsCount} Reviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant Info Widgets block */}
            <div
                className="glass-panel"
                style={{
                    padding: '20px 24px',
                    marginBottom: '30px',
                    border: '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    textAlign: 'left'
                }}
            >
                <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivery Info</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.05rem', fontWeight: 700, marginTop: '4px' }}>
                        <Clock size={16} style={{ color: 'var(--primary)' }} />
                        <span>{restaurant.deliveryTime} Mins Delivery</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance: {restaurant.distance} km from center</span>
                </div>

                <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Opening Timings</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.05rem', fontWeight: 700, marginTop: '4px' }}>
                        <Compass size={16} style={{ color: 'var(--accent-green)' }} />
                        <span>Open: {restaurant.openingHours} – {restaurant.closingHours}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Working every day</span>
                </div>

                {/* Real Google Maps Integration Link */}
                <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Directions</span>
                    <div style={{ marginTop: '6px' }}>
                        <a
                            href={restaurant.googleMaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                            id={`rest-maps-link-${restaurant.id}`}
                        >
                            🗺️ Open in Google Maps
                        </a>
                    </div>
                </div>
            </div>

            {/* Special Restaurant Coupons row */}
            {restaurant.offers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '35px', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Offers at this Outlet:</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {restaurant.offers.map((offerText, i) => (
                            <div
                                key={i}
                                className="glass-panel"
                                style={{
                                    padding: '10px 16px',
                                    fontSize: '0.85rem',
                                    fontWeight: 650,
                                    border: '1px dashed var(--primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'rgba(255, 90, 31, 0.03)',
                                    color: 'var(--text-main)'
                                }}
                                id={`outlet-offer-${restaurant.id}-${i}`}
                            >
                                🏷️ {offerText}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Menu / Section Index */}
            <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '24px' }}>
                    Browse Menu ({restaurantFoods.length} items)
                </h2>

                {/* Categories loop */}
                {categories.map(cat => {
                    const categorizedFood = restaurantFoods.filter(f => f.category === cat);
                    return (
                        <div key={cat} style={{ marginBottom: '40px' }} id={`menu-category-${cat.toLowerCase().replace(' ', '-')}`}>
                            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Grid size={18} />
                                <span>{cat} Menu</span>
                            </h3>

                            <div className="grid-3">
                                {categorizedFood.map(food => (
                                    <FoodCard
                                        key={food.id}
                                        food={food}
                                        onOrderNow={onOrderNow}
                                        onViewDetails={handleFoodClick}
                                        isFavorite={favorites.includes(food.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
