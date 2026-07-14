import React from 'react';
import { ArrowLeft, Clock, ShoppingCart, Trophy, Heart, ShieldCheck } from 'lucide-react';
import { type FoodItem } from '../data/restaurants';

interface FoodDetailViewProps {
    food: FoodItem;
    setView: (view: string) => void;
    onOrderNow: (food: FoodItem) => void;
    isFavorite: boolean;
    toggleFavorite: (food: FoodItem) => void;
}

export const FoodDetailView: React.FC<FoodDetailViewProps> = ({
    food,
    setView,
    onOrderNow,
    isFavorite,
    toggleFavorite
}) => {

    // Function to determine nutritional comments
    const getNutritionQuality = (score: number) => {
        if (score >= 85) return { text: "Excellent Health Rating — Outstanding choice for clean nutrition!", color: "var(--accent-green)" };
        if (score >= 70) return { text: "Good Health Rating — Great balanced everyday meal.", color: "#4EA8DE" };
        return { text: "Average Rating — Intended as an occasional tasty indulgence.", color: "#FFD166" };
    };

    const ratingQuality = getNutritionQuality(food.healthScore);

    return (
        <div className="container animate-fade" style={{ padding: '24px 20px 60px' }}>

            {/* Return to Restaurants Button */}
            <button
                onClick={() => setView('restaurants')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="food-detail-back-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back to Menu</span>
            </button>

            {/* Main Details Panel Layout */}
            <div
                className="glass-panel"
                style={{
                    padding: '24px',
                    border: '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '30px',
                    textAlign: 'left'
                }}
            >
                {/* Left Side: Images & Quick badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                        <img
                            src={food.image}
                            alt={food.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Diet Badges */}
                        <span style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                            {food.veg ? <span className="badge-veg">● VEG</span> : <span className="badge-nonveg">▲ NON-VEG</span>}
                        </span>

                        {/* Favorite heart */}
                        <button
                            onClick={() => toggleFavorite(food)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                zIndex: 5,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.95)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-md)',
                                color: isFavorite ? '#EF476F' : '#9BA6B5',
                                fontSize: '1.2rem'
                            }}
                            id={`food-detail-fav-btn-${food.id}`}
                        >
                            <Heart size={20} fill={isFavorite ? "#EF476F" : "none"} />
                        </button>
                    </div>

                    {/* Quick Metrics Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                                <Clock size={16} />
                                <span>Delivery Duration</span>
                            </div>
                            <p style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>{food.deliveryTime} mins</p>
                        </div>

                        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem' }}>
                                <ShieldCheck size={16} />
                                <span>Availability</span>
                            </div>
                            <p style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px', color: food.availability ? 'var(--accent-green)' : '#EF476F' }}>
                                {food.availability ? "In Stock" : "Out of Stock"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Information Content, Nutrition facts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Served by {food.restaurantName}
                        </span>
                        <h1 style={{ fontSize: '2rem', margin: '4px 0 10px', letterSpacing: '-0.5px' }}>{food.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                            <span className="food-price" style={{ fontSize: '2rem' }}>₹{food.price}</span>
                            <span
                                className="badge-health"
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '0.85rem',
                                    backgroundColor: 'rgba(255, 90, 31, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Trophy size={14} />
                                <span>Health Rating: {food.healthScore}/100</span>
                            </span>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {food.description}
                        </p>
                    </div>

                    {/* Premium Ingredient List Tags */}
                    <div>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Recipe Ingredients</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {food.ingredients.map((ing, i) => (
                                <span
                                    key={i}
                                    style={{
                                        background: 'var(--bg-app)',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    🥗 {ing}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Integrated Nutrition Facts Table */}
                    <div
                        style={{
                            background: 'var(--bg-app)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            padding: '20px'
                        }}
                    >
                        <h3 style={{
                            fontSize: '1rem',
                            borderBottom: '2px solid var(--text-main)',
                            paddingBottom: '6px',
                            marginBottom: '14px',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            📋 Nutrition Facts Table
                        </h3>

                        {/* Calories Highlight banner */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                            <div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Total Calories</span>
                                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Estimated serving size</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>{food.calories}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>kcal</span>
                            </div>
                        </div>

                        {/* Nutrients Metrics Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                                <span>💪 <strong>Protein</strong></span>
                                <span><strong>{food.protein} g</strong></span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                                <span>🥯 <strong>Total Carbohydrates</strong></span>
                                <span><strong>{food.carbohydrates} g</strong></span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                                <span>🧈 <strong>Total Fat</strong></span>
                                <span><strong>{food.fat} g</strong></span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                                <span>🥬 Dietary Fiber</span>
                                <span>{food.fiber} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                                <span>🍬 Sugars</span>
                                <span>{food.sugar} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                                <span>🧂 Sodium</span>
                                <span>{food.sodium} mg</span>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '16px',
                            fontSize: '0.75rem',
                            fontWeight: 650,
                            color: ratingQuality.color,
                            padding: '8px 12px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-card-solid)',
                            border: '1px solid var(--border-color)'
                        }}>
                            {ratingQuality.text}
                        </div>
                    </div>

                    {/* Action Order Button */}
                    <div style={{ marginTop: '10px' }}>
                        <button
                            onClick={() => onOrderNow(food)}
                            className="btn-primary"
                            style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-sm)', fontSize: '1.15rem' }}
                            id={`food-detail-ordernow-btn-${food.id}`}
                        >
                            <ShoppingCart size={20} />
                            <span>Order Now — Skip Cart & Checkout</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
