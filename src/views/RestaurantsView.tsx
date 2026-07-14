import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Clock, MapPin, X, ArrowLeft } from 'lucide-react';
import { type FoodItem, type Restaurant, RESTAURANTS_DATA, FOODS_DATA } from '../data/restaurants';
import { FoodCard } from '../components/FoodCard';
import { searchDatasetLocally } from '../services/ai';

interface RestaurantsViewProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setView: (view: string) => void;
    setSelectedRestaurantId: (id: string | null) => void;
    setSelectedFood: (food: FoodItem | null) => void;
    onOrderNow: (food: FoodItem) => void;
    favorites: string[];
    toggleFavorite: (food: FoodItem) => void;
}

export const RestaurantsView: React.FC<RestaurantsViewProps> = ({
    searchQuery,
    setSearchQuery,
    setView,
    setSelectedRestaurantId,
    setSelectedFood,
    onOrderNow,
    favorites,
    toggleFavorite
}) => {
    const [activeTab, setActiveTab] = useState<'foods' | 'restaurants'>('foods');
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [aiExplanation, setAiExplanation] = useState('');

    // Filtering States
    const [vegOnly, setVegOnly] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'delivery' | 'distance'>('rating');
    const [maxPrice, setMaxPrice] = useState<number>(500);

    // Re-run search whenever query changes
    useEffect(() => {
        runSearch();
    }, [searchQuery]);

    const runSearch = () => {
        if (!searchQuery) {
            // Default lists if query is empty
            setFoods([...FOODS_DATA]);
            setRestaurants([...RESTAURANTS_DATA]);
            setAiExplanation("Showing all available local menus and restaurants in KGF.");
            return;
        }

        const result = searchDatasetLocally(searchQuery);
        setFoods(result.foods);
        setRestaurants(result.restaurants);
        setAiExplanation(result.explanation);

        // If query has matched restaurant, automatically focus restaurants tab
        const matchedRest = RESTAURANTS_DATA.some(r =>
            searchQuery.toLowerCase().includes(r.name.toLowerCase())
        );
        if (matchedRest) {
            setActiveTab('restaurants');
        } else {
            setActiveTab('foods');
        }
    };

    // Get unique cuisines
    const cuisines = ['all', 'Biryani', 'South Indian', 'Meals', 'Pizza', 'Chinese', 'Fast Food', 'Curries', 'Starters'];

    // Apply filters
    let displayedFoods = [...foods];
    let displayedRestaurants = [...restaurants];

    // 1. Veg filter (applied to foods)
    if (vegOnly) {
        displayedFoods = displayedFoods.filter(f => f.veg);
        // sync restaurants: must have veg items
        const vegRestIds = new Set(displayedFoods.map(f => f.restaurantId));
        displayedRestaurants = displayedRestaurants.filter(r => vegRestIds.has(r.id));
    }

    // 2. Cuisine filter
    if (selectedCuisine !== 'all') {
        displayedFoods = displayedFoods.filter(f => f.category.toLowerCase() === selectedCuisine.toLowerCase());
        const cuisineRestIds = new Set(displayedFoods.map(f => f.restaurantId));
        displayedRestaurants = displayedRestaurants.filter(r =>
            r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()) || cuisineRestIds.has(r.id)
        );
    }

    // 3. Max Price filter
    displayedFoods = displayedFoods.filter(f => f.price <= maxPrice);

    // 4. Sorting logic
    if (sortBy === 'rating') {
        displayedFoods.sort((a, b) => b.rating - a.rating);
        displayedRestaurants.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
        displayedFoods.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'delivery') {
        displayedFoods.sort((a, b) => a.deliveryTime - b.deliveryTime);
        displayedRestaurants.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'distance') {
        displayedRestaurants.sort((a, b) => a.distance - b.distance);
        // Sync foods sorting to match restaurant sorting
        const restOrder = displayedRestaurants.map(r => r.id);
        displayedFoods.sort((a, b) => restOrder.indexOf(a.restaurantId) - restOrder.indexOf(b.restaurantId));
    }

    const handleRestaurantSelect = (id: string) => {
        setSelectedRestaurantId(id);
        setView('restaurant-detail');
    };

    const handleFoodSelect = (food: FoodItem) => {
        setSelectedFood(food);
        setView('food-detail');
    };

    const clearQuery = () => {
        setSearchQuery('');
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px' }}>

            {/* Top breadcrumb and search display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <button
                    onClick={() => setView('landing')}
                    style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)' }}
                    id="back-home-search-btn"
                >
                    <ArrowLeft size={18} />
                    <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back</span>
                </button>
            </div>

            {/* Query Title */}
            <div
                className="glass-panel"
                style={{
                    padding: '20px 24px',
                    marginBottom: '30px',
                    textAlign: 'left',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            💡 FoodGenie AI Scout Engine
                        </span>
                        <h1 style={{ fontSize: '1.8rem', margin: '4px 0 8px', letterSpacing: '-0.5px' }}>
                            {searchQuery ? `Searching: "${searchQuery}"` : "All Dishes & Restaurants"}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                            {aiExplanation}
                        </p>
                    </div>
                    {searchQuery && (
                        <button
                            onClick={clearQuery}
                            className="btn-secondary"
                            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                            id="clear-search-query-btn"
                        >
                            <X size={14} />
                            <span>Reset Search</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Search Grid Filters & Tab Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="search-layout">

                {/* Filters Sidebar */}
                <div
                    className="glass-panel"
                    style={{
                        padding: '20px',
                        height: 'fit-content',
                        textAlign: 'left',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card-solid)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ fontSize: '1.15rem' }}>Filters & Sorting</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Diet Veg Button */}
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Dietary Preference
                            </span>
                            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={vegOnly}
                                    onChange={(e) => setVegOnly(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-green)' }}
                                    id="veg-checkbox-filter"
                                />
                                <span className="badge-veg">● Pure Veg Only</span>
                            </label>
                        </div>

                        {/* Sort Dropdown */}
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Sort By
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e: any) => setSortBy(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--bg-app)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.85rem'
                                }}
                                id="search-sort-dropdown"
                            >
                                <option value="rating">Popularity & Rating</option>
                                {activeTab === 'foods' && <option value="price">Budget: Price Low to High</option>}
                                <option value="delivery">Delivery Speed (Fastest First)</option>
                                <option value="distance">Proximity (Nearest First)</option>
                            </select>
                        </div>

                        {/* Category / Cuisine Filter */}
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
                                Cuisines / Categories
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {cuisines.map(cuis => (
                                    <button
                                        key={cuis}
                                        onClick={() => setSelectedCuisine(cuis)}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '0.75rem',
                                            borderRadius: 'var(--radius-xs)',
                                            background: selectedCuisine === cuis ? 'var(--primary)' : 'var(--bg-app)',
                                            color: selectedCuisine === cuis ? 'white' : 'var(--text-muted)',
                                            border: '1px solid var(--border-color)',
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}
                                        id={`cuisine-filter-${cuis.toLowerCase().replace(' ', '-')}`}
                                    >
                                        {cuis === 'all' ? 'All Cuisines' : cuis}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Budget Slider */}
                        {activeTab === 'foods' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    <span>Max Budget</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>₹{maxPrice}</span>
                                </div>
                                <input
                                    type="range"
                                    min="30"
                                    max="500"
                                    step="10"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                    id="budget-slider"
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    <span>₹30</span>
                                    <span>₹250</span>
                                    <span>₹500</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results Display Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Tab Selector */}
                    <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid var(--border-color)', paddingBottom: '2px' }}>
                        <button
                            onClick={() => setActiveTab('foods')}
                            style={{
                                padding: '12px 24px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: activeTab === 'foods' ? 'var(--primary)' : 'var(--text-muted)',
                                borderBottom: activeTab === 'foods' ? '3px solid var(--primary)' : '3px solid transparent',
                                marginBottom: '-3px'
                            }}
                            id="tab-foods-selector"
                        >
                            🍽️ Dishes ({displayedFoods.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('restaurants')}
                            style={{
                                padding: '12px 24px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: activeTab === 'restaurants' ? 'var(--primary)' : 'var(--text-muted)',
                                borderBottom: activeTab === 'restaurants' ? '3px solid var(--primary)' : '3px solid transparent',
                                marginBottom: '-3px'
                            }}
                            id="tab-restaurants-selector"
                        >
                            🏪 Restaurants ({displayedRestaurants.length})
                        </button>
                    </div>

                    {/* Foods Results (Grid of Foods) */}
                    {activeTab === 'foods' && (
                        displayedFoods.length > 0 ? (
                            <div className="grid-3">
                                {displayedFoods.map(food => (
                                    <FoodCard
                                        key={food.id}
                                        food={food}
                                        onOrderNow={onOrderNow}
                                        onViewDetails={handleFoodSelect}
                                        isFavorite={favorites.includes(food.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                <span style={{ fontSize: '3rem' }}>🤔</span>
                                <h4 style={{ fontSize: '1.25rem', marginTop: '12px', color: 'var(--text-main)' }}>No matching dishes found</h4>
                                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Try adjusting your filters, budget slider, or search query.</p>
                            </div>
                        )
                    )}

                    {/* Restaurants Results (Grid of Restaurants) */}
                    {activeTab === 'restaurants' && (
                        displayedRestaurants.length > 0 ? (
                            <div className="grid-3">
                                {displayedRestaurants.map(r => (
                                    <div
                                        key={r.id}
                                        className="glass-card"
                                        style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                                        onClick={() => handleRestaurantSelect(r.id)}
                                        id={`restaurant-card-${r.id}`}
                                    >
                                        <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
                                            <img src={r.coverImage} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <span style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: 'rgba(255,255,255,0.92)',
                                                color: '#FFC107',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                boxShadow: 'var(--shadow-sm)'
                                            }}>
                                                ★ {r.rating}
                                            </span>
                                        </div>
                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{r.name}</h4>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    background: 'rgba(255, 90, 31, 0.08)',
                                                    color: 'var(--primary)',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {r.cuisine.split(',')[0]}
                                                </span>

                                                <p style={{
                                                    fontSize: '0.82rem',
                                                    color: 'var(--text-muted)',
                                                    marginTop: '12px',
                                                    lineHeight: '1.4',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {r.description}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <Clock size={13} />
                                                    <span>{r.deliveryTime} mins</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <MapPin size={13} />
                                                    <span>{r.distance} km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                <span style={{ fontSize: '3rem' }}>🤔</span>
                                <h4 style={{ fontSize: '1.25rem', marginTop: '12px', color: 'var(--text-main)' }}>No matching restaurants found</h4>
                                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Try searching Robertsonpet, Andersonpet or another KGF locality.</p>
                            </div>
                        )
                    )}

                </div>
            </div>
        </div>
    );
};
