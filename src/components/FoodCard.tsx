import React from 'react';
import { Star, Clock, Trophy, Heart } from 'lucide-react';
import { type FoodItem } from '../data/restaurants';

interface FoodCardProps {
    food: FoodItem;
    onOrderNow: (food: FoodItem) => void;
    onViewDetails: (food: FoodItem) => void;
    isFavorite: boolean;
    onToggleFavorite: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
    food,
    onOrderNow,
    onViewDetails,
    isFavorite,
    onToggleFavorite
}) => {
    return (
        <div className="glass-card animate-fade" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Cover Image & Badges */}
            <div className="food-card-img-container">
                <span className="food-card-veg-indicator">
                    {food.veg ? (
                        <span className="badge-veg">● VEG</span>
                    ) : (
                        <span className="badge-nonveg">▲ NON-VEG</span>
                    )}
                </span>

                <span className="food-card-health-score">
                    <span className="badge-health" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Trophy size={11} />
                        <span>Health: {food.healthScore}</span>
                    </span>
                </span>

                {/* Favorite Heart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(food);
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        zIndex: 5,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        border: 'none',
                        fontSize: '1rem',
                        color: isFavorite ? '#EF476F' : '#9BA6B5',
                        transition: 'transform var(--transition-fast)'
                    }}
                    className="fav-heart-btn"
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                    <Heart size={16} fill={isFavorite ? "#EF476F" : "none"} />
                </button>

                <img
                    src={food.image}
                    alt={food.name}
                    className="food-card-img"
                    onClick={() => onViewDetails(food)}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            {/* Body Details */}
            <div className="food-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="flex-between">
                    <span className="food-card-rest-name">{food.restaurantName}</span>
                    <span className="meta-item" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {food.category}
                    </span>
                </div>

                <h4
                    className="food-card-title"
                    onClick={() => onViewDetails(food)}
                    style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
                >
                    {food.name}
                </h4>

                {/* Rating and Delivery Speed */}
                <div className="food-card-meta">
                    <div className="meta-item">
                        <Star className="meta-star" size={14} fill="#FFC107" stroke="#FFC107" />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{food.rating}</span>
                    </div>
                    <div style={{ color: 'var(--border-color)' }}>|</div>
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>{food.deliveryTime} mins</span>
                    </div>
                </div>

                <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.4',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                }}>
                    {food.description}
                </p>

                {/* Integrated Nutrition Summary */}
                <div
                    style={{
                        background: 'var(--bg-app)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-xs)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary-light)',
                        marginBottom: '16px'
                    }}
                    className="food-card-nutrition-bar"
                >
                    <div>Cal: <strong style={{ color: 'var(--text-main)' }}>{food.calories}</strong> <span style={{ fontSize: '0.6rem' }}>kcal</span></div>
                    <div>Pro: <strong style={{ color: 'var(--text-main)' }}>{food.protein}g</strong></div>
                    <div>Carb: <strong style={{ color: 'var(--text-main)' }}>{food.carbohydrates}g</strong></div>
                    <div>Fat: <strong style={{ color: 'var(--text-main)' }}>{food.fat}g</strong></div>
                </div>

                {/* Footer pricing and Order Button */}
                <div className="food-card-footer">
                    <div className="food-price">₹{food.price}</div>
                    <button
                        onClick={() => onOrderNow(food)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                        id={`order-now-btn-${food.id}`}
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
};
