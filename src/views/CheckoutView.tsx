import React, { useEffect, useState } from 'react';
import { MapPin, ArrowRight, Ticket, CheckCircle2 } from 'lucide-react';
import { type FoodItem } from '../data/restaurants';
import { api } from '../services/api';

interface CheckoutViewProps {
    food: FoodItem;
    setView: (view: string) => void;
    onProceedToPayment: (orderSummary: any) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
    food,
    setView: _setView,
    onProceedToPayment
}) => {
    const [address, setAddress] = useState('Flat 204, Royal Palms Residency, Robertsonpet, KGF – 563122');
    const [phone, setPhone] = useState('+91 94812 73921');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [discountVal, setDiscountVal] = useState(0);
    const [locationState, setLocationState] = useState<'loading' | 'success' | 'error'>('loading');
    const [locationMessage, setLocationMessage] = useState('AI is looking for your location...');
    const [deliveryState, setDeliveryState] = useState<'checking' | 'available' | 'unavailable'>('checking');
    const [deliveryMessage, setDeliveryMessage] = useState('Checking delivery availability...');

    // Price calculations
    const basePrice = food.price;
    const deliveryCharge = 25;
    const packingFee = 15;
    const gstTax = Math.round(basePrice * 0.05); // 5% GST

    const handleApplyPromo = () => {
        setPromoError('');
        const code = promoCode.trim().toUpperCase();
        if (code === 'GENIE50') {
            const discount = Math.round(basePrice * 0.5 > 100 ? 100 : basePrice * 0.5);
            setDiscountVal(discount);
            setPromoApplied(true);
        } else if (code === 'GENIEFLAT') {
            const discount = basePrice > 120 ? 50 : 20;
            setDiscountVal(discount);
            setPromoApplied(true);
        } else {
            setPromoError('Invalid promo code. Try using GENIE50 or GENIEFLAT');
        }
    };

    const finalTotal = basePrice + deliveryCharge + packingFee + gstTax - discountVal;

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationState('error');
            setLocationMessage('Location unavailable on this device.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocationState('success');
                setLocationMessage('Location found');

                try {
                    setDeliveryState('checking');
                    setDeliveryMessage('Checking delivery availability...');
                    const result = await api.restaurants.nearby(latitude, longitude);
                    if (Array.isArray(result) && result.length > 0) {
                        setDeliveryState('available');
                        setDeliveryMessage('Delivery available');
                    } else {
                        setDeliveryState('unavailable');
                        setDeliveryMessage('Restaurant unavailable for this delivery location.');
                    }
                } catch (error) {
                    setDeliveryState('unavailable');
                    setDeliveryMessage('Delivery unavailable right now. Please try another location.');
                }
            },
            () => {
                setLocationState('error');
                setLocationMessage('Location permission denied. Please allow access to continue.');
                setDeliveryState('unavailable');
                setDeliveryMessage('Delivery unavailable right now. Please try another location.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const handlePlaceOrder = () => {
        if (deliveryState !== 'available') {
            alert(deliveryMessage || 'Delivery unavailable for this restaurant.');
            return;
        }
        onProceedToPayment({
            foodId: food.id,
            foodName: food.name,
            restaurantName: food.restaurantName,
            restaurantId: food.restaurantId,
            price: food.price,
            quantity: 1,
            totalAmount: finalTotal,
            deliveryAddress: address,
            userPhone: phone,
            discount: discountVal
        });
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px' }}>
            <h1 style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                🧾 Order Review
            </h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.9rem', marginBottom: '20px' }}>
                Food Details → AI Location → Delivery Check → Payment → Order Confirmation
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    {locationState === 'success' ? <CheckCircle2 size={18} color="#06D6A0" /> : <span>📍</span>}
                    <span>{locationMessage}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    {deliveryState === 'available' ? <CheckCircle2 size={18} color="#06D6A0" /> : <span>🚚</span>}
                    <span>{deliveryMessage}</span>
                </div>
            </div>

            <div className="checkout-grid">

                {/* Left Side: Address Details and Instructions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>

                    {/* Delivery Address Box */}
                    <div className="checkout-section glass-panel" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} style={{ color: 'var(--primary)' }} />
                            <span>1. Delivery Address (KGF)</span>
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>SHIPPING ADDRESS</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'var(--bg-app)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        resize: 'none',
                                        height: '80px',
                                        marginTop: '4px'
                                    }}
                                    id="checkout-shipping-address-input"
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>MOBILE NUMBER</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'var(--bg-app)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        marginTop: '4px'
                                    }}
                                    id="checkout-mobile-phone-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Special Instructions card */}
                    <div className="checkout-section glass-panel" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>💡 Delivery Instructions</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                            Our delivery network operates inside KGF areas. Orders are delivered in under 45 mins. Safety and hygiene are guaranteed.
                        </p>
                    </div>

                </div>

                {/* Right Side: Fare Receipt Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>

                    <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                            Receipt Details
                        </h3>

                        {/* Item Card listing */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                            <img
                                src={food.image}
                                alt={food.name}
                                style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                                <span className="food-card-veg-indicator" style={{ display: 'block', marginBottom: '2px' }}>
                                    {food.veg ? <span className="badge-veg" style={{ fontSize: '0.6rem', padding: '2px 4px' }}>● VEG</span> : <span className="badge-nonveg" style={{ fontSize: '0.6rem', padding: '2px 4px' }}>▲ NON-VEG</span>}
                                </span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{food.name}</span>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {food.restaurantName}</span>
                            </div>
                        </div>

                        {/* Promo Area */}
                        <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                <Ticket size={16} />
                                <span>Apply Promo Coupon</span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter Code (e.g. GENIE50)"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-xs)',
                                        backgroundColor: 'var(--bg-app)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.85rem'
                                    }}
                                    disabled={promoApplied}
                                    id="promo-code-input"
                                />

                                <button
                                    onClick={handleApplyPromo}
                                    className="btn-secondary"
                                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                    disabled={promoApplied}
                                    id="apply-promo-btn"
                                >
                                    Apply
                                </button>
                            </div>

                            {promoApplied && (
                                <div style={{ color: 'var(--accent-green)', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>
                                    ✓ Promo applied! Saved ₹{discountVal} discount code.
                                </div>
                            )}
                            {promoError && (
                                <div style={{ color: 'var(--primary)', fontSize: '0.75rem', marginTop: '6px' }}>
                                    {promoError}
                                </div>
                            )}
                        </div>

                        {/* Fare Breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="summary-row">
                                <span>Base Fare Price</span>
                                <span>₹{basePrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Packing & Hygiene Fee</span>
                                <span>₹{packingFee}</span>
                            </div>
                            <div className="summary-row">
                                <span>Local Delivery Rider Tip</span>
                                <span>₹{deliveryCharge}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST Tax (5%)</span>
                                <span>₹{gstTax}</span>
                            </div>
                            {promoApplied && (
                                <div className="summary-row" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                                    <span>Genie Discount</span>
                                    <span>- ₹{discountVal}</span>
                                </div>
                            )}

                            <div className="summary-row total">
                                <span>Total amount</span>
                                <span>₹{finalTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '1.05rem', marginTop: '24px' }}
                            id="proceed-payment-gateway-btn"
                        >
                            <span>Proceed to Payment</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
