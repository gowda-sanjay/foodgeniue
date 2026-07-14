import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { type FoodItem, FOODS_DATA } from '../data/restaurants';
import { FoodCard } from '../components/FoodCard';

interface FavoritesViewProps {
    favorites: string[];
    toggleFavorite: (food: FoodItem) => void;
    setView: (view: string) => void;
    onOrderNow: (food: FoodItem) => void;
    setSelectedFood: (food: FoodItem | null) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
    favorites,
    toggleFavorite,
    setView,
    onOrderNow,
    setSelectedFood
}) => {
    // Filter foods that are favorited
    const favoriteFoods = FOODS_DATA.filter(f => favorites.includes(f.id));

    const handleFoodClick = (food: FoodItem) => {
        setSelectedFood(food);
        setView('food-detail');
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px' }}>

            {/* Return home */}
            <button
                onClick={() => setView('landing')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="favorites-back-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back Home</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', textAlign: 'left' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                        ❤️ My Favorite Foods
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        Shortcut to your preferred local dishes in Kolar Gold Fields.
                    </p>
                </div>
                <span className="badge-health" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    Items: {favoriteFoods.length}
                </span>
            </div>

            {favoriteFoods.length === 0 ? (
                <div
                    className="glass-panel"
                    style={{
                        padding: '60px 20px',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card-solid)'
                    }}
                >
                    <Heart size={48} style={{ color: '#EF476F', marginBottom: '16px', animation: 'pulse-glow 1.5s infinite', borderRadius: '50%' }} />
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Your Liked List is Empty</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '320px', margin: '6px auto 20px' }}>
                        Tap the heart icon on any food card to bookmarks it here for immediate ordering.
                    </p>
                    <button onClick={() => setView('restaurants')} className="btn-primary" id="favorites-discover-btn">
                        Browse Menu Now
                    </button>
                </div>
            ) : (
                <div className="grid-4" style={{ marginTop: '24px' }}>
                    {favoriteFoods.map(food => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            onOrderNow={onOrderNow}
                            onViewDetails={handleFoodClick}
                            isFavorite={true}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
