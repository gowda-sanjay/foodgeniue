import React from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react';

interface AdminDashboardViewProps {
    orders: any[];
    setView: (view: string) => void;
    onUpdateStatus: (orderId: string, status: 'received' | 'preparing' | 'out' | 'delivered') => void;
    onResetDatabase: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
    orders,
    setView,
    onUpdateStatus,
    onResetDatabase
}) => {
    // Aggregate sales calculations
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const activeOrdersCount = orders.filter(ord => ord.status !== 'delivered').length;
    const deliveredOrdersCount = orders.filter(ord => ord.status === 'delivered').length;

    const handleStatusChange = (orderId: string, newStatus: 'received' | 'preparing' | 'out' | 'delivered') => {
        onUpdateStatus(orderId, newStatus);
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px', textAlign: 'left' }}>

            {/* Return Home */}
            <button
                onClick={() => setView('landing')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="admin-back-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back Home</span>
            </button>

            {/* Header Admin */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                        💻 FoodGenie Admin Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                        System Console for Kolar Gold Fields startup fleet management.
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to clear simulation database? This resets sales records.")) {
                            onResetDatabase();
                        }
                    }}
                    style={{
                        padding: '10px 18px',
                        background: 'rgba(239, 71, 111, 0.08)',
                        color: '#EF476F',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(239, 71, 111, 0.2)',
                        fontSize: '0.85rem',
                        fontWeight: 700
                    }}
                    id="admin-reset-db-btn"
                >
                    Reset Simulation Data
                </button>
            </div>

            {/* Key Metrics Widgets grid */}
            <div className="grid-4" style={{ marginBottom: '40px' }}>

                <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Revenue</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <DollarSign size={24} style={{ color: 'var(--accent-green)' }} />
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-heading)' }}>₹{totalRevenue}</h2>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Estimated earnings in KGF</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders Count</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <Package size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-heading)' }}>{totalOrders}</h2>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Through dynamic Cartless checkout</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outstanding Shipments</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <AlertCircle size={24} style={{ color: '#FFD166' }} />
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-heading)' }}>{activeOrdersCount}</h2>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Being cooked or transited</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed Deliveries</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <TrendingUp size={24} style={{ color: 'var(--accent-green)' }} />
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-heading)' }}>{deliveredOrdersCount}</h2>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Riders reached final location</span>
                </div>

            </div>

            {/* Orders Management Log Table */}
            <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>💼 Orders Tracking Central Logs</h3>

                {orders.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px 0' }}>No active simulation record in the database logs.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontWeight: 'bold' }}>
                                <th style={{ padding: '12px 8px' }}>ID</th>
                                <th style={{ padding: '12px 8px' }}>Client details</th>
                                <th style={{ padding: '12px 8px' }}>Hotel & Food</th>
                                <th style={{ padding: '12px 8px' }}>Amount</th>
                                <th style={{ padding: '12px 8px' }}>Status Milestones</th>
                                <th style={{ padding: '12px 8px' }}>Terminal Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((ord) => (
                                <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--primary)' }}>{ord.id}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <div style={{ fontWeight: 600 }}>{ord.userPhone}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.deliveryAddress.substring(0, 32)}...</div>
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <div style={{ fontWeight: 600 }}>{ord.foodName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.restaurantName}</div>
                                    </td>
                                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>₹{ord.totalAmount}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '10px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                backgroundColor:
                                                    ord.status === 'received' ? 'rgba(255, 209, 102, 0.15)' :
                                                        ord.status === 'preparing' ? 'rgba(92, 107, 115, 0.15)' :
                                                            ord.status === 'out' ? 'rgba(255, 90, 31, 0.15)' :
                                                                'rgba(6, 214, 160, 0.15)',
                                                color:
                                                    ord.status === 'received' ? '#FFD166' :
                                                        ord.status === 'preparing' ? 'var(--text-muted)' :
                                                            ord.status === 'out' ? 'var(--primary)' :
                                                                'var(--accent-green)'
                                            }}
                                        >
                                            {ord.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <select
                                            value={ord.status}
                                            onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                                            style={{
                                                padding: '6px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--bg-app)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-main)',
                                                fontSize: '0.8rem'
                                            }}
                                            id={`status-select-${ord.id}`}
                                        >
                                            <option value="received">Order Confirmed</option>
                                            <option value="preparing">Cooking</option>
                                            <option value="out">Out for Delivery</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};
