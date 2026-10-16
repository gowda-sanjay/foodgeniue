import React, { useState } from 'react';
import { X, ChevronRight, MapPin, Phone, Zap } from 'lucide-react';
import { type FoodItem } from '../data/restaurants';

interface QuickOrderModalProps {
    food: FoodItem;
    onConfirm: (orderData: any) => void;
    onClose: () => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
    food,
    onConfirm,
    onClose
}) => {
    const [step] = useState<'confirm' | 'address' | 'payment'>('confirm');
    const deliveryAddress = 'Flat 204, Royal Palms, KGF - 563132';
    const phone = '+91 94812 73921';
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

    const deliveryFee = 25;
    const gst = Math.round((food.price * 5) / 100);
    const totalAmount = food.price + deliveryFee + gst;

    const handleNext = () => {
        if (step === 'confirm') {
            // Skip to order confirmation - auto-fill address and payment
            const orderData = {
                id: `ord_${Date.now().toString().slice(-6)}`,
                foodId: food.id,
                foodName: food.name,
                restaurantName: food.restaurantName,
                restaurantId: food.restaurantId,
                price: food.price,
                quantity: 1,
                totalAmount: totalAmount,
                deliveryAddress: deliveryAddress,
                userPhone: phone,
                discount: 0,
                paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
                paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'PAID',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'received'
            };
            
            onConfirm(orderData);
            onClose();
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    animation: 'slideUp 0.3s ease'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                            Quick Order
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Order Summary */}
                <div
                    style={{
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        marginBottom: '20px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '12px'
                        }}
                    >
                        <img
                            src={food.image}
                            alt={food.name}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: 'var(--radius-sm)',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600 }}>
                                {food.name}
                            </h3>
                            <p style={{
                                margin: '0 0 6px 0',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)'
                            }}>
                                {food.restaurantName}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--accent-green)' }}>⭐ {food.rating.toFixed(1)}</span>
                                {food.veg ? (
                                    <span style={{ color: 'var(--accent-green)' }}>🟢 Veg</span>
                                ) : (
                                    <span style={{ color: '#FF6B6B' }}>🔴 Non-Veg</span>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                textAlign: 'right',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                                ₹{food.price}
                            </span>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.85rem',
                                marginBottom: '6px'
                            }}
                        >
                            <span>Item Price</span>
                            <span>₹{food.price}</span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.85rem',
                                marginBottom: '6px'
                            }}
                        >
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.85rem',
                                marginBottom: '8px'
                            }}
                        >
                            <span>GST (5%)</span>
                            <span>₹{gst}</span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '8px',
                                color: 'var(--primary)'
                            }}
                        >
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Details */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <MapPin size={18} style={{ color: 'var(--primary)' }} />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                            Delivery Address
                        </h4>
                    </div>
                    <p
                        style={{
                            background: 'var(--bg-app)',
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            margin: 0,
                            color: 'var(--text-muted)'
                        }}
                    >
                        {deliveryAddress}
                    </p>
                </div>

                {/* Contact Details */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Phone size={18} style={{ color: 'var(--primary)' }} />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                            Contact Number
                        </h4>
                    </div>
                    <p
                        style={{
                            background: 'var(--bg-app)',
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            margin: 0,
                            color: 'var(--text-muted)'
                        }}
                    >
                        {phone}
                    </p>
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                        Payment Method
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {(['upi', 'card', 'cod'] as const).map((method) => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    border: `2px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border-color)'}`,
                                    background: paymentMethod === method ? 'rgba(255, 90, 31, 0.1)' : 'transparent',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {method === 'upi' ? '💳 UPI' : method === 'card' ? '🏦 Card' : '💵 COD'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleNext}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--primary-dark)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
                        }}
                    >
                        <span>Next</span>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};
