import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Sparkles, User, ShoppingBag, UtensilsCrossed, Home } from 'lucide-react';

interface NavbarProps {
    currentView: string;
    setView: (view: string) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
    currentView,
    setView,
    theme,
    toggleTheme,
    favoritesCount
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'landing', label: 'Home', icon: Home },
        { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'ai-chat', label: 'AI Assistant', icon: Sparkles },
        { id: 'profile', label: 'Profile', icon: User }
    ];

    const handleNavClick = (viewId: string) => {
        setView(viewId);
        setMobileMenuOpen(false);
    };

    return (
        <header className="main-header" style={{ width: '100%' }}>
            <div className="container header-container">
                {/* Logo */}
                <a
                    href="#home"
                    className="logo-link"
                    onClick={(e) => { e.preventDefault(); handleNavClick('landing'); }}
                    id="nav-logo"
                >
                    <span className="logo-icon">🍔</span>
                    <span>AgentAutoBite</span>
                </a>

                {/* Desktop Menu */}
                <nav className="nav-menu">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id ||
                            (item.id === 'restaurants' && currentView === 'restaurant-detail') ||
                            (item.id === 'landing' && currentView === 'food-detail');
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                id={`nav-link-${item.id}`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                                {item.id === 'ai-chat' && (
                                    <span style={{
                                        fontSize: '0.65rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '8px',
                                        marginLeft: '2px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>Live</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Actions (Theme Toggle & Settings/Admin) */}
                <div className="header-actions">
                    <button
                        onClick={() => handleNavClick('favorites')}
                        className={`btn-icon ${currentView === 'favorites' ? 'active' : ''}`}
                        title="Favorites"
                        id="nav-fav-btn"
                        style={{ position: 'relative' }}
                    >
                        ❤️
                        {favoritesCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                background: 'var(--primary)',
                                color: 'white',
                                fontSize: '0.65rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700
                            }}>
                                {favoritesCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="btn-icon"
                        aria-label="Toggle Theme"
                        title="Theme Toggle"
                        id="theme-toggler"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Admin Dashboard Navigation Shortcut */}
                    <button
                        onClick={() => handleNavClick('admin')}
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                            background: 'var(--accent-green-bg)',
                            color: 'var(--accent-green)',
                            border: '1px solid rgba(6, 214, 160, 0.3)'
                        }}
                        id="nav-admin-link"
                    >
                        Dashboard
                    </button>

                    {/* Mobile Menu Icon */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="btn-icon mobile-menu-btn"
                        aria-label="Toggle Mobile Menu"
                        id="mobile-menu-toggle"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {
                mobileMenuOpen && (
                    <div className="mobile-nav animate-fade">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 16px' }}
                                    id={`mobile-nav-link-${item.id}`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )
            }
        </header >
    );
};
