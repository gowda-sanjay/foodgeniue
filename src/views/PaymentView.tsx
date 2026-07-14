import React, { useState } from 'react';
import { CreditCard, ArrowLeft, ShieldCheck, QrCode, DollarSign, Wallet } from 'lucide-react';

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
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

    // Card form states
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const handlePaySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPaying(true);

        // Simulate transaction delay
        setTimeout(() => {
            setIsPaying(false);
            onPaymentSuccess({
                id: `ord_${Date.now().toString().slice(-6)}`,
                foodId: orderSummary.foodId,
                foodName: orderSummary.foodName,
                restaurantName: orderSummary.restaurantName,
                restaurantId: orderSummary.restaurantId,
                price: orderSummary.price,
                quantity: orderSummary.quantity,
                totalAmount: orderSummary.totalAmount,
                deliveryAddress: orderSummary.deliveryAddress,
                userPhone: orderSummary.userPhone,
                discount: orderSummary.discount,
                paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
                paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'PAID',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'received'
            });
        }, 2000);
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
                💳 Secure Payment Gateway
            </h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.9rem', marginBottom: '24px' }}>
                Complete payment to confirm your order of <strong>{orderSummary.foodName}</strong>.
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

                {/* Payment tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                    <button
                        onClick={() => setPaymentMethod('upi')}
                        style={{
                            padding: '12px 6px',
                            borderRadius: 'var(--radius-sm)',
                            border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            background: paymentMethod === 'upi' ? 'rgba(255, 90, 31, 0.03)' : 'var(--bg-card-solid)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                        id="upi-method-tab"
                        type="button"
                    >
                        <QrCode size={20} style={{ color: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>UPI Scan</span>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('card')}
                        style={{
                            padding: '12px 6px',
                            borderRadius: 'var(--radius-sm)',
                            border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            background: paymentMethod === 'card' ? 'rgba(255, 90, 31, 0.03)' : 'var(--bg-card-solid)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                        id="card-method-tab"
                        type="button"
                    >
                        <CreditCard size={20} style={{ color: paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Card Pay</span>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('cod')}
                        style={{
                            padding: '12px 6px',
                            borderRadius: 'var(--radius-sm)',
                            border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            background: paymentMethod === 'cod' ? 'rgba(255, 90, 31, 0.03)' : 'var(--bg-card-solid)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                        id="cod-method-tab"
                        type="button"
                    >
                        <DollarSign size={20} style={{ color: paymentMethod === 'cod' ? 'var(--primary)' : 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Cash/COD</span>
                    </button>
                </div>

                {/* Payment Gateways Forms */}
                <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* UPI Method */}
                    {paymentMethod === 'upi' && (
                        <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div
                                style={{
                                    background: 'white',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'inline-block',
                                    marginBottom: '16px'
                                }}
                            >
                                {/* Simulated QR Code SVG */}
                                <svg width="140" height="140" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
                                    <path d="M0 0h30v30h-30zm0 70h30v30h-30zm70 0h30v30h-30zm0-70h30v30h-30z" fill="var(--text-main)" />
                                    <path d="M10 10h10v10h-10zm0 70h10v10h-10zm70 0h10v10h-10zm0-70h10v10h-10z" fill="white" />
                                    <path d="M35 15h10v10h-10zm10 20h10v10h-10zm-20 10h10v10h-10zm45 10h10v10h-10zm-15 15h10v10h-10zm30 10h10v10h-10zm-15 0h10v10h-10zm-35-15h10v10h-10zm25 15h10v10h-10z" fill="var(--text-main)" />
                                </svg>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Scan QR Code with Bhim, GPay, or PhonePe</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Simulating secure merchant gateway for FoodGenie AI KGF.
                            </p>

                            <div style={{ marginTop: '16px', width: '100%' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>UPI ID</span>
                                <input
                                    type="text"
                                    value="foodgenie@ybl"
                                    readOnly
                                    style={{
                                        backgroundColor: 'var(--bg-card-solid)',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)',
                                        fontSize: '0.85rem',
                                        textAlign: 'center',
                                        width: '100%',
                                        color: 'var(--text-main)'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Credit Card Method */}
                    {paymentMethod === 'card' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Premium Credit Card Mock Visual */}
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #1d212b 0%, #3e4453 100%)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    color: 'white',
                                    minHeight: '170px',
                                    boxShadow: 'var(--shadow-lg)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    border: '1px solid rgba(255,255,255,0.08)'
                                }}
                                id="mock-credit-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Wallet size={32} style={{ color: 'var(--primary)' }} />
                                    <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.9 }}>CLASSIC VISA</span>
                                </div>

                                <div style={{ fontSize: '1.25rem', letterSpacing: '3px', fontWeight: 600, margin: '16px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {cardNumber || '•••• •••• •••• ••••'}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.8 }}>
                                    <div>
                                        <span style={{ fontSize: '0.6rem', display: 'block', opacity: 0.6 }}>CARD HOLDER</span>
                                        <strong>{cardName || 'GUEST CUSTOMER'}</strong>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.6rem', display: 'block', opacity: 0.6 }}>EXPIRES</span>
                                        <strong>{cardExpiry || 'MM/YY'}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Form Input fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CARD NUMBER</label>
                                    <input
                                        type="text"
                                        maxLength={19}
                                        placeholder="4111 2222 3333 4444"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 'var(--radius-xs)',
                                            backgroundColor: 'var(--bg-app)',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-main)',
                                            fontSize: '0.9rem',
                                            marginTop: '4px'
                                        }}
                                        required
                                        id="card-number-input"
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CARDHOLDER NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Sanjay Gowda"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 'var(--radius-xs)',
                                            backgroundColor: 'var(--bg-app)',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-main)',
                                            fontSize: '0.9rem',
                                            marginTop: '4px'
                                        }}
                                        required
                                        id="card-name-input"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>EXPIRATION DATE</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: 'var(--radius-xs)',
                                                backgroundColor: 'var(--bg-app)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-main)',
                                                fontSize: '0.9rem',
                                                marginTop: '4px'
                                            }}
                                            required
                                            id="card-expiry-input"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CVV CODE</label>
                                        <input
                                            type="password"
                                            maxLength={3}
                                            placeholder="•••"
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: 'var(--radius-xs)',
                                                backgroundColor: 'var(--bg-app)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-main)',
                                                fontSize: '0.9rem',
                                                marginTop: '4px'
                                            }}
                                            required
                                            id="card-cvv-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cash on Delivery Method */}
                    {paymentMethod === 'cod' && (
                        <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '6px' }}>💵 Pay Cash on Delivery</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                Secure payment option. Please pay the delivery executive cash or transfer via GPay/PhonePe when they reach your doorstep in KGF.
                            </p>
                        </div>
                    )}

                    {/* Gateway Trust verification icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center', margin: '10px 0' }}>
                        <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} />
                        <span>256-bit bank-grade SSL encrypted gateway secure connection</span>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '1.15rem' }}
                        disabled={isPaying}
                        id="pay-submit-btn"
                    >
                        {isPaying ? (
                            <span>Authenticating with Bank...</span>
                        ) : (
                            <span>Confirm & Place Order — ₹{orderSummary.totalAmount}</span>
                        )}
                    </button>

                </form>

            </div>
        </div>
    );
};
