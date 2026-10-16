import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, PackageCheck } from 'lucide-react';
import { api } from '../services/api';

interface PaymentViewProps {
    orderSummary: {
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
    };
    setView: (view: string) => void;
    onPaymentSuccess: (details: any) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
    orderSummary,
    setView,
    onPaymentSuccess
}) => {
    const [isPaying, setIsPaying] = useState(false);

    const handlePaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
        if (!token) {
            alert('Please login to place your order.');
            setView('profile');
            return;
        }

        setIsPaying(true);

        try {
            const orderResponse = await api.orders.create({
                restaurantId: orderSummary.restaurantId,
                items: [{ foodId: orderSummary.foodId, quantity: orderSummary.quantity }],
                deliveryAddress: orderSummary.deliveryAddress,
                phoneNumber: orderSummary.userPhone,
                paymentMethod: 'COD',
                deliveryFee: 25,
                gst: Math.max(0, Math.round(orderSummary.totalAmount * 0.05)),
            });

            await api.payments.create({
                orderId: orderResponse.id,
                amount: Number(orderResponse.totalAmount),
                paymentMethod: 'COD',
            });

            const orderRecord = {
                id: orderResponse.id,
                foodId: orderSummary.foodId,
                foodName: orderSummary.foodName,
                restaurantName: orderSummary.restaurantName,
                restaurantId: orderSummary.restaurantId,
                price: orderSummary.price,
                quantity: orderSummary.quantity,
                totalAmount: orderResponse.totalAmount,
                deliveryAddress: orderSummary.deliveryAddress,
                userPhone: orderSummary.userPhone,
                discount: orderSummary.discount,
                paymentMethod: 'COD',
                paymentStatus: 'PENDING',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'received'
            };

            onPaymentSuccess(orderRecord);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Order creation failed. Please try again.';
            alert(message);
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px', maxWidth: '640px' }}>

            {/* Return to checkout */}
            <button
                onClick={() => setView('checkout')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="payment-back-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back to Checkout</span>
            </button>

            <h1 style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                💳 Payment
            </h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.9rem', marginBottom: '24px' }}>
                Choose Cash on Delivery to confirm your order of <strong>{orderSummary.foodName}</strong>.
            </p>

            {/* Main Payment Layout */}
            <div
                className="glass-panel"
                style={{
                    padding: '24px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'left'
                }}
            >
                {/* Total Amount Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.05) 0%, rgba(255, 209, 102, 0.05) 100%)',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-glow)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAYABLE AMOUNT</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                            ₹{orderSummary.totalAmount}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Food items amount:</span>
                        <div style={{ fontWeight: 700 }}>₹{orderSummary.price}</div>
                    </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '6px' }}>💵 Cash on Delivery</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        Pay the delivery executive when your order reaches your door. The payment status remains PENDING until delivery is complete.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center', margin: '10px 0' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} />
                    <span>Secure COD checkout for AgentAutoBite demo</span>
                </div>

                <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '1.15rem' }}
                        disabled={isPaying}
                        id="pay-submit-btn"
                    >
                        {isPaying ? (
                            <span>Placing your order...</span>
                        ) : (
                            <span><PackageCheck size={16} style={{ display: 'inline-block', marginRight: '8px' }} />Confirm & Place Order — ₹{orderSummary.totalAmount}</span>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};
