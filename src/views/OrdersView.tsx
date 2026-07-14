import React from 'react';
import { ArrowLeft, ShoppingBag, Receipt, ChevronRight } from 'lucide-react';
import { FOODS_DATA } from '../data/restaurants';

interface OrdersViewProps {
    orders: any[];
    setView: (view: string) => void;
    setSelectedOrderId: (id: string | null) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
    orders,
    setView,
    setSelectedOrderId
}) => {

    const handleTrackClick = (order: any) => {
        setSelectedOrderId(order.id);
        setView('order-tracking');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received': return { text: 'Ordered', bg: 'rgba(255, 209, 102, 0.1)', color: '#FFD166' };
            case 'preparing': return { text: 'Cooking', bg: 'rgba(92, 107, 115, 0.1)', color: 'var(--text-muted)' };
            case 'out': return { text: 'Out for Delivery', bg: 'rgba(255, 90, 31, 0.1)', color: 'var(--primary)' };
            case 'delivered': return { text: 'Delivered', bg: 'rgba(6, 214, 160, 0.1)', color: 'var(--accent-green)' };
            default: return { text: 'Processing', bg: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' };
        }
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px', maxWidth: '680px' }}>

            {/* Return Home */}
            <button
                onClick={() => setView('landing')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="orders-back-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back Home</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem', textAlign: 'left', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    📋 My Orders History
                </h1>
                <span className="badge-health" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    Total Orders: {orders.length}
                </span>
            </div>

            {orders.length === 0 ? (
                <div
                    className="glass-panel"
                    style={{
                        padding: '60px 22px',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card-solid)'
                    }}
                >
                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>No orders placed yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '320px', margin: '6px auto 20px' }}>
                        Browse restaurants in Robertsonpet, order your food in one click and track it live.
                    </p>
                    <button onClick={() => setView('restaurants')} className="btn-primary" id="orders-discover-btn">
                        Discover Food in KGF
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((ord) => {
                        const matchedFood = FOODS_DATA.find(f => f.id === ord.foodId);
                        const statusConfig = getStatusColor(ord.status);

                        return (
                            <div
                                key={ord.id}
                                className="glass-panel"
                                style={{
                                    padding: '20px',
                                    background: 'var(--bg-card-solid)',
                                    border: '1px solid var(--border-color)',
                                    textAlign: 'left'
                                }}
                                id={`orders-log-entry-${ord.id}`}
                            >
                                {/* Header Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '14px' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ORDER ID</span>
                                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{ord.id}</strong>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>DATE & TIME</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{ord.date} {ord.time}</span>
                                    </div>
                                </div>

                                {/* Body Row */}
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {matchedFood && (
                                        <img
                                            src={matchedFood.image}
                                            alt={matchedFood.name}
                                            style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{ord.foodName}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From {ord.restaurantName}</p>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.8rem' }}>
                                            <span>Mode: <strong>{ord.paymentMethod}</strong></span>
                                            <span>Total: <strong style={{ color: 'var(--primary)' }}>₹{ord.totalAmount}</strong></span>
                                        </div>
                                    </div>

                                    {/* Actions / Track Button column */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                        <span
                                            style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                backgroundColor: statusConfig.bg,
                                                color: statusConfig.color,
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            {statusConfig.text}
                                        </span>

                                        <button
                                            onClick={() => handleTrackClick(ord)}
                                            className="btn-secondary"
                                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            id={`track-order-btn-${ord.id}`}
                                        >
                                            <Receipt size={12} />
                                            <span>{ord.status === 'delivered' ? 'Receipt Details' : 'Track live'}</span>
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
