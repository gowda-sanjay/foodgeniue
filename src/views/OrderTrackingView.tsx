import React, { useEffect, useState } from 'react';
import { Phone, CheckCircle, Clock } from 'lucide-react';

interface OrderTrackingViewProps {
    order: {
        id: string;
        foodId: string;
        foodName: string;
        restaurantName: string;
        restaurantId: string;
        price: number;
        quantity: number;
        totalAmount: number;
        deliveryAddress: string;
        userPhone: string;
        discount: number;
        paymentMethod: string;
        paymentStatus: string;
        date: string;
        time: string;
        status: 'received' | 'preparing' | 'out' | 'delivered';
    };
    setView: (view: string) => void;
    onUpdateOrderStatus: (orderId: string, status: 'received' | 'preparing' | 'out' | 'delivered') => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
    order,
    setView
}) => {
    const eta = 35;
    const [riderCoord, setRiderCoord] = useState({ x: 20, y: 80 });

    // Status index mapping
    const statusLevels: ('received' | 'preparing' | 'out' | 'delivered')[] = ['received', 'preparing', 'out', 'delivered'];
    const currentStepIndex = statusLevels.indexOf(order.status);

    useEffect(() => {
        // Rider movement coordinate simulator loop
        const riderInterval = setInterval(() => {
            if (order.status === 'out') {
                setRiderCoord(prev => {
                    const nextX = prev.x + 8 > 80 ? 80 : prev.x + 8;
                    const nextY = prev.y - 6 < 30 ? 30 : prev.y - 6;
                    return { x: nextX, y: nextY };
                });
            }
        }, 2000);

        return () => {
            clearInterval(riderInterval);
        };
    }, [order.status]);

    const milestones = [
        { key: 'received', title: 'Order Confirmed', desc: 'Received by Kitchen at Chef Cabin' },
        { key: 'preparing', title: 'Cooking Gourmet Dish', desc: 'Chef is baking/wrapping with maximum hygiene' },
        { key: 'out', title: 'Out for Delivery', desc: 'Delivery partner has collected and is rushing to your door' },
        { key: 'delivered', title: 'Delivered Successfully', desc: 'Enjoy your warm food! Bon Appétit!' }
    ];

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px', maxWidth: '800px' }}>

            {/* Visual Success Confetti Splash placeholder header */}
            <div
                style={{
                    textAlign: 'center',
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--accent-green)',
                    borderRadius: 'var(--radius-md)',
                    padding: '30px',
                    marginBottom: '30px',
                    boxShadow: '0 0 20px rgba(6, 214, 160, 0.15)'
                }}
            >
                <CheckCircle size={56} style={{ color: 'var(--accent-green)', margin: '0 auto 16px', display: 'block' }} />
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    Order Placed Successfully!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                    Your order ID: <strong style={{ color: 'var(--primary)' }}>{order.id}</strong> • Payment Status: <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{order.paymentStatus}</span>
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="grid-2">

                {/* Left Side: Milestone Timelines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>

                    <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🚀 Live Order Progress</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Tracking food from <strong>{order.restaurantName}</strong>.
                        </p>

                        <div className="timeline progress">
                            {milestones.map((m, idx) => {
                                const isCompleted = idx < currentStepIndex;
                                const isActive = idx === currentStepIndex;
                                const stateClass = isCompleted ? 'completed' : isActive ? 'active' : '';

                                return (
                                    <div key={m.key} className={`timeline-item ${stateClass}`} id={`tracking-step-${m.key}`}>
                                        <div className="timeline-dot">
                                            {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{m.title}</h4>
                                            <p>{m.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rider Profile Card detail */}
                    {order.status !== 'delivered' && (
                        <div
                            className="glass-panel"
                            style={{
                                padding: '16px 20px',
                                background: 'var(--bg-card-solid)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                            id="rider-profile-widget"
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--bg-app)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                border: '2px solid var(--primary)'
                            }}>
                                🚴
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>YOUR GENIE PILOT</span>
                                <h4 style={{ fontSize: '1rem', margin: '2px 0 0' }}>Ramesh Kumar (KGF Fleet)</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Riding KTM 125 • ⭐ 4.9 Rating</p>
                            </div>
                            <a href="tel:+919109284521" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} id="rider-call-btn">
                                <Phone size={14} />
                                <span>Call Rider</span>
                            </a>
                        </div>
                    )}

                </div>

                {/* Right Side: Map Canvas Simulation and ETA banner */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>

                    {/* ETA card widget */}
                    <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>ESTIMATED DELIVERY TIME</span>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                                    {eta > 0 ? `${eta} Mins` : 'Arrived!'}
                                </div>
                            </div>
                            <Clock size={40} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                        </div>
                    </div>

                    {/* Simulated Map Canvas */}
                    <div className="glass-panel" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', padding: '16px' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                            📍 Live Route Simulation (KGF Main Rd)
                        </h4>

                        <div className="map-canvas">
                            {/* Map background illustration (mock styling using CSS canvas boxes) */}
                            <div style={{ position: 'absolute', top: '40px', left: '10%', right: '10%', height: '8px', background: 'var(--border-color)', borderRadius: '4px' }}></div>
                            <div style={{ position: 'absolute', top: '40px', right: '20%', bottom: '20px', width: '8px', background: 'var(--border-color)', borderRadius: '4px' }}></div>

                            {/* Restaurant marker */}
                            <div style={{ position: 'absolute', left: '20px', top: '65px', textAlign: 'center', zIndex: 3 }}>
                                <span style={{ fontSize: '1.25rem', display: 'block' }}>🏪</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 4px', background: 'var(--bg-card-solid)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                    Restaurant
                                </span>
                            </div>

                            {/* Delivery Destination pin */}
                            <div style={{ position: 'absolute', right: '40px', top: '100px', textAlign: 'center', zIndex: 3 }}>
                                <span style={{ fontSize: '1.25rem', display: 'block' }}>🏠</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 4px', background: 'var(--primary)', color: 'white', borderRadius: '4px' }}>
                                    Home
                                </span>
                            </div>

                            {/* Rider icon moving dynamically according to state */}
                            {order.status === 'out' && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${riderCoord.x}%`,
                                        top: `${riderCoord.y}px`,
                                        transition: 'all 2s linear',
                                        zIndex: 5,
                                        fontSize: '1.5rem'
                                    }}
                                    id="live-rider-tracker-icon"
                                >
                                    🏍️
                                </div>
                            )}
                            {order.status === 'preparing' && (
                                <div style={{ position: 'absolute', left: '18%', top: '75px', fontSize: '1.2rem', animation: 'pulse-glow 1.5s infinite', borderRadius: '50%' }}>
                                    👨‍🍳 preparing your food...
                                </div>
                            )}
                            {order.status === 'received' && (
                                <div style={{ position: 'absolute', left: '18%', top: '75px', fontSize: '1.2rem' }}>
                                    ⏳ order received...
                                </div>
                            )}
                            {order.status === 'delivered' && (
                                <div style={{ position: 'absolute', right: '60px', top: '80px', fontSize: '1.2rem', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(6, 214, 160, 0.3)' }}>
                                    ✓ Arrived! Executive reached home.
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Navigation options */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setView('landing')}
                            className="btn-secondary"
                            style={{ flex: 1, padding: '12px' }}
                            id="tracking-go-home-btn"
                        >
                            Return Home
                        </button>
                        <button
                            onClick={() => setView('orders')}
                            className="btn-primary"
                            style={{ flex: 1, padding: '12px' }}
                            id="tracking-view-receipt-btn"
                        >
                            View My Orders
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};
