import React, { useState } from 'react';
import { Search, Mic, Image, ArrowRight, Sparkles, Award, TrendingUp, Info, ShieldCheck, Mail } from 'lucide-react';
import { type FoodItem, FOODS_DATA, RESTAURANTS_DATA } from '../data/restaurants';
import { FoodCard } from '../components/FoodCard';
import { VoiceSearchModal } from '../components/VoiceSearchModal';
import { ImageSearchModal } from '../components/ImageSearchModal';

interface LandingViewProps {
    setView: (view: string) => void;
    setSelectedRestaurantId: (id: string | null) => void;
    setSelectedFood: (food: FoodItem | null) => void;
    onOrderNow: (food: FoodItem) => void;
    favorites: string[];
    toggleFavorite: (food: FoodItem) => void;
    setSearchQuery: (query: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
    setView,
    setSelectedRestaurantId,
    setSelectedFood,
    onOrderNow,
    favorites,
    toggleFavorite,
    setSearchQuery
}) => {
    const [searchInput, setSearchInput] = useState('');
    const [voiceModalOpen, setVoiceModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    // Take top foods or recommended (healthScore >= 75)
    const aiRecommendedFoods = FOODS_DATA.filter(f => f.healthScore >= 80).slice(0, 4);
    const trendingFoods = FOODS_DATA.filter(f => f.rating >= 4.6).slice(0, 4);
    const popularRestaurants = RESTAURANTS_DATA.slice(0, 4);

    const handleSearchSubmit = (queryText: string) => {
        if (!queryText.trim()) return;
        setSearchQuery(queryText);
        setView('restaurants');
    };

    const handleSuggestionClick = (phrase: string) => {
        setSearchInput(phrase);
        handleSearchSubmit(phrase);
    };

    const handleRestaurantClick = (id: string) => {
        setSelectedRestaurantId(id);
        setView('restaurant-detail');
    };

    const handleViewFoodDetails = (food: FoodItem) => {
        setSelectedFood(food);
        setView('food-detail');
    };

    const todayOffers = [
        { title: "Flat ₹50 OFF", code: "GENIE50", desc: "No minimum order value, valid for KGF users.", color: "from-orange-500 to-amber-500" },
        { title: "Buy 1 Get 1 Free", code: "BOGO", desc: "Buy South Indian Meal, get masala dosa free at Janardhan Cafe.", color: "from-emerald-500 to-teal-500" },
        { title: "Free Chilled Pepsi", code: "PEPSI", desc: "Add pepsi worth ₹60 free with Ambur Biryani bucket.", color: "from-blue-600 to-cyan-500" }
    ];

    const suggestedSearches = [
        "Chicken Biryani under ₹200",
        "Healthy Breakfast in KGF",
        "Pizzas near Champion Reefs",
        "High Protein Meals",
        "Low Calorie Food under ₹150"
    ];

    return (
        <div className="animate-fade" style={{ width: '100%' }}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-tag">
                        <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                        <span>KGF's FIRST AI FOOD FINDER</span>
                    </div>
                    <h1 className="hero-title">
                        Your Premium AI Food Scout in <span>KGF</span>
                    </h1>
                    <p className="hero-subtitle">
                        Order food from Kolar Gold Fields' top restaurants. Discover healthy menus, calorie counts, and prices by speaking or uploading a photo.
                    </p>

                    {/* Search Box */}
                    <div className="search-box-wrapper">
                        <div className="search-bar-inner">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Ask Genie: 'Chicken Biryani under ₹200' or 'Healthy Breakfast'..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchInput)}
                                id="main-nlp-search-input"
                            />
                            <div className="search-actions">
                                <button
                                    onClick={() => setVoiceModalOpen(true)}
                                    className="search-icon-btn"
                                    title="Voice Search"
                                    id="voice-search-trigger-btn"
                                >
                                    <Mic size={20} />
                                </button>
                                <button
                                    onClick={() => setImageModalOpen(true)}
                                    className="search-icon-btn"
                                    title="Image Vision Search"
                                    id="image-search-trigger-btn"
                                >
                                    <Image size={20} />
                                </button>
                                <button
                                    onClick={() => handleSearchSubmit(searchInput)}
                                    className="search-btn-main"
                                    title="Submit Search"
                                    id="nlp-search-submit-btn"
                                >
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Queries Chips */}
                    <div className="search-suggestions">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '6px' }}>Try asking:</span>
                        {suggestedSearches.map((phrase, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(phrase)}
                                className="suggestion-chip"
                                id={`suggestion-${idx}`}
                            >
                                {phrase}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offers Section */}
            <section className="container" style={{ padding: '40px 20px' }}>
                <div className="section-header">
                    <h2 className="section-title">🔥 Today's Sparkly Deals</h2>
                    <p className="section-subtitle">Exclusive limited-time promo deals from local restaurants in KGF.</p>
                </div>

                <div className="grid-3">
                    {todayOffers.map((offer, idx) => (
                        <div
                            key={idx}
                            className={`gradient-card`}
                            style={{
                                borderRadius: 'var(--radius-md)',
                                background: `linear-gradient(135deg, rgba(255, 90, 31, 0.05) 0%, rgba(255, 209, 102, 0.05) 100%)`,
                                border: '2px solid var(--border-glow)',
                                padding: '24px',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'between',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            id={`promo-card-${idx}`}
                        >
                            <div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    letterSpacing: '0.5px'
                                }}>
                                    CODE: {offer.code}
                                </span>
                                <h3 style={{ fontSize: '1.4rem', margin: '12px 0 6px', color: 'var(--text-main)' }}>{offer.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>{offer.desc}</p>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => handleSuggestionClick("biryani")}>
                                <span>Claim Offer</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Recommended Section */}
            <section style={{ padding: '60px 0', background: 'var(--bg-card)' }}>
                <div className="container">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles style={{ color: 'var(--primary)' }} />
                                <span>AI Recommended Health Foods</span>
                            </h2>
                            <p className="section-subtitle">Specially curated menus with clean list ingredients & high health ratings in KGF.</p>
                        </div>
                        <button
                            onClick={() => handleSuggestionClick("healthy")}
                            className="btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            id="view-all-healthy-btn"
                        >
                            <span>Explore All</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="grid-4" style={{ marginTop: '24px' }}>
                        {aiRecommendedFoods.map(food => (
                            <FoodCard
                                key={food.id}
                                food={food}
                                onOrderNow={onOrderNow}
                                onViewDetails={handleViewFoodDetails}
                                isFavorite={favorites.includes(food.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Restaurants Section */}
            <section className="container" style={{ padding: '60px 20px' }}>
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h2 className="section-title">🏬 Top Rated KGF Restaurants</h2>
                        <p className="section-subtitle">Real verified dining spots in Robertsonpet, BEML Nagar, and Andersonpet.</p>
                    </div>
                    <button
                        onClick={() => { setView('restaurants'); }}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        id="view-all-restaurants-btn"
                    >
                        <span>All Restaurants</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="grid-4" style={{ marginTop: '24px' }}>
                    {popularRestaurants.map(r => (
                        <div
                            key={r.id}
                            className="glass-card"
                            style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                            onClick={() => handleRestaurantClick(r.id)}
                            id={`rest-landing-card-${r.id}`}
                        >
                            <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
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
                            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>{r.name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{r.cuisine}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>{r.address.split(',')[2] || 'KGF'}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <div>🚴 {r.deliveryTime} mins</div>
                                    <div>📍 {r.distance} km</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trending Foods Section */}
            <section style={{ padding: '60px 0', background: 'var(--bg-card)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp style={{ color: 'var(--primary)' }} />
                            <span>Trending Menu Searches in KGF</span>
                        </h2>
                        <p className="section-subtitle">Local favorites that people of KGF are ordering right now.</p>
                    </div>

                    <div className="grid-4" style={{ marginTop: '24px' }}>
                        {trendingFoods.map(food => (
                            <FoodCard
                                key={food.id}
                                food={food}
                                onOrderNow={onOrderNow}
                                onViewDetails={handleViewFoodDetails}
                                isFavorite={favorites.includes(food.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container" style={{ padding: '60px 20px' }}>
                <div className="section-header">
                    <h2 className="section-title">💡 How AgentAutoBite Works</h2>
                    <p className="section-subtitle">Discovering dining has never been this advanced.</p>
                </div>

                <div className="grid-3" style={{ marginTop: '24px' }}>
                    <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <Award size={36} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>1. State Your Cravings</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Speak query terms, type normal instructions or drop a picture. AI processes it immediately in real-time.
                        </p>
                    </div>
                    <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <Info size={36} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>2. Rich Nutrition Audit</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Gene shows exact metrics like protein, calories, fiber, carbs, and health score filters.
                        </p>
                    </div>
                    <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <ShieldCheck size={36} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>3. Order in One Tap</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            No messy carts. Tap "Order Now" on your favorite meal, choose your address, pay, and track in real-time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', padding: '60px 0', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <Mail size={36} style={{ margin: '0 auto 16px', display: 'block' }} />
                    <h2 style={{ color: 'white', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Join the AgentAutoBite Club</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: '8px 0 24px', lineHeight: '1.4' }}>
                        Subscribe to receive local deals, fitness menu articles, and new restaurant additions in KGF.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            style={{
                                padding: '12px 20px',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                width: '100%',
                                maxWidth: '320px',
                                fontSize: '0.95rem',
                                color: 'var(--text-main)',
                                backgroundColor: 'white'
                            }}
                            id="newsletter-email-input"
                        />
                        <button
                            onClick={() => alert("Thank you for subscribing to AgentAutoBite! Updates will serve in your mailbox.")}
                            style={{
                                backgroundColor: 'var(--bg-app)',
                                color: 'var(--primary)',
                                fontWeight: 700,
                                padding: '12px 24px',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                transition: 'all 0.2s'
                            }}
                            id="newsletter-subscribe-btn"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="main-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div style={{ textAlign: 'left' }}>
                            <div className="logo-link" style={{ fontSize: '1.3rem' }}>
                                <span>🍔</span> <span>AgentAutoBite</span>
                            </div>
                            <p className="footer-text">
                                KGF's premier food finder powered by Gemini AI. Bringing instant health-tracking delivery services directly to Robertsonpet, Andersonpet, Coromandel, and nearby areas since 2026.
                            </p>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <h5 className="footer-heading">KGF Locations Served</h5>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("Robertsonpet"); }}>Robertsonpet</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("Andersonpet"); }}>Andersonpet</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("BEML Nagar"); }}>BEML Nagar</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("Champion Reefs"); }}>Champion Reefs</a></li>
                            </ul>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <h5 className="footer-heading">Diet Searches</h5>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("healthy"); }}>High Health Score</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("low calorie"); }}>Low Calorie Meals</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("high protein"); }}>Muscle Building</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleSuggestionClick("cheap"); }}>Budget Bites</a></li>
                            </ul>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <h5 className="footer-heading">Startup Profile</h5>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setView('admin'); }}>Admin Dashboard</a></li>
                                <li><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="footer-link">Google Maps Integration</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setView('profile'); }}>User Profile</a></li>
                                <li><a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setView('orders'); }}>Orders History</a></li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            © 2026 AgentAutoBite Inc. Karnataka, India. All rights reserved. Made for hungry citizens of KGF.
                    </div>
                </div>
            </footer>

            {/* Modals rendering */}
            {voiceModalOpen && (
                <VoiceSearchModal
                    onClose={() => setVoiceModalOpen(false)}
                    onVoiceResult={(query) => {
                        setSearchInput(query);
                        handleSearchSubmit(query);
                    }}
                />
            )}

            {imageModalOpen && (
                <ImageSearchModal
                    onClose={() => setImageModalOpen(false)}
                    onSearchFood={(food) => {
                        setSearchInput(food);
                        handleSearchSubmit(food);
                    }}
                />
            )}
        </div>
    );
};
