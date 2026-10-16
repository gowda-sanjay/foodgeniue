import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    CheckCircle2,
    CreditCard,
    MapPin,
    PackageCheck,
    Sparkles,
    Truck,
    Wallet,
    X
} from 'lucide-react';
import { type FoodItem } from '../data/restaurants';
import { api } from '../services/api';

type PaymentMethod = 'COD' | 'ONLINE';
type FlowPhase = 'payment-choice' | 'payment-processing' | 'payment-success' | 'location' | 'location-found' | 'delivery-check' | 'confirmed' | 'tracking' | 'error';

interface OrderNowModalProps {
    food: FoodItem;
    onClose: () => void;
    onOrderCreated: (order: any) => void;
    onTrackOrder: () => void;
}

const DELIVERY_ADDRESS = 'Flat 204, Royal Palms Residency, Robertsonpet, KGF - 563122';
const PHONE_NUMBER = '+91 94812 73921';
const DELIVERY_FEE = 25;

const sleep = (duration: number) => new Promise(resolve => window.setTimeout(resolve, duration));

export const OrderNowModal: React.FC<OrderNowModalProps> = ({
    food,
    onClose,
    onOrderCreated,
    onTrackOrder
}) => {
    const [phase, setPhase] = useState<FlowPhase>('payment-choice');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [createdOrder, setCreatedOrder] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const gst = Math.round(food.price * 0.05);
    const totalAmount = food.price + DELIVERY_FEE + gst;

    useEffect(() => {
        if (!paymentMethod) return;

        let cancelled = false;
        const moveTo = (nextPhase: FlowPhase) => {
            if (!cancelled) setPhase(nextPhase);
        };

        const runFlow = async () => {
            try {
                if (paymentMethod === 'ONLINE') {
                    moveTo('payment-processing');
                    await sleep(2000);
                    moveTo('payment-success');
                    await sleep(1200);
                }

                moveTo('location');
                await sleep(2000);
                moveTo('location-found');
                await sleep(1500);
                moveTo('delivery-check');
                await sleep(2000);

                const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('Please login to place your order.');
                }

                const orderResponse = await api.orders.create({
                    restaurantId: food.restaurantId,
                    items: [{ foodId: food.id, quantity: 1 }],
                    deliveryAddress: DELIVERY_ADDRESS,
                    phoneNumber: PHONE_NUMBER,
                    paymentMethod,
                    deliveryFee: DELIVERY_FEE,
                    gst
                });

                await api.payments.create({
                    orderId: orderResponse.id,
                    amount: Number(orderResponse.totalAmount),
                    paymentMethod
                });

                const order = {
                    id: orderResponse.id,
                    foodId: food.id,
                    foodName: food.name,
                    restaurantName: food.restaurantName,
                    restaurantId: food.restaurantId,
                    price: food.price,
                    quantity: 1,
                    totalAmount: orderResponse.totalAmount,
                    deliveryAddress: DELIVERY_ADDRESS,
                    userPhone: PHONE_NUMBER,
                    discount: 0,
                    paymentMethod,
                    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'SUCCESS',
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'received'
                };

                if (cancelled) return;
                setCreatedOrder(order);
                onOrderCreated(order);
                setPhase('confirmed');
                await sleep(2000);
                if (!cancelled) {
                    setPhase('tracking');
                    await sleep(1200);
                    if (!cancelled) onTrackOrder();
                }
            } catch (error) {
                if (cancelled) return;
                setErrorMessage(error instanceof Error ? error.message : 'Order could not be created. Please try again.');
                setPhase('error');
            }
        };

        void runFlow();
        return () => {
            cancelled = true;
        };
    }, [food, gst, paymentMethod]);

    const phaseIndex = phase === 'payment-choice' ? 0 : phase === 'payment-processing' || phase === 'payment-success' ? 1 : phase === 'location' || phase === 'location-found' ? 2 : phase === 'delivery-check' ? 3 : 4;
    const isBusy = phase !== 'payment-choice' && phase !== 'error';

    return (
        <motion.div
            className="order-now-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Automatic order process"
        >
            <motion.div
                className="order-now-modal"
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                <div className="order-now-modal-header">
                    <div className="order-now-brand"><Sparkles size={18} /> AgentAutoBite</div>
                    <button className="btn-icon" onClick={onClose} disabled={isBusy} aria-label="Close order process" title="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="order-now-progress" aria-label="Order progress">
                    {['Payment', 'Location', 'Delivery', 'Confirmed', 'Tracking'].map((label, index) => (
                        <React.Fragment key={label}>
                            <div className={`order-now-progress-step ${index <= phaseIndex ? 'active' : ''}`}>
                                <span>{index < phaseIndex ? <Check size={14} /> : index + 1}</span>
                                <small>{label}</small>
                            </div>
                            {index < 4 && <div className={`order-now-progress-line ${index < phaseIndex ? 'active' : ''}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="order-now-product">
                    <img src={food.image} alt={food.name} />
                    <div>
                        <span>{food.restaurantName}</span>
                        <h2>{food.name}</h2>
                        <p>Quantity 1 <strong>·</strong> ₹{totalAmount}</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {phase === 'payment-choice' && (
                        <motion.div key="choice" className="order-now-step" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                            <div className="order-now-step-icon orange"><Wallet size={34} /></div>
                            <p className="order-now-eyebrow">Ready when you are</p>
                            <h1>Choose Payment Method</h1>
                            <p className="order-now-muted">Select once and AgentAutoBite will take care of the rest.</p>
                            <div className="payment-choice-grid">
                                <button className="payment-choice" onClick={() => setPaymentMethod('COD')}>
                                    <Wallet size={28} />
                                    <strong>Cash on Delivery</strong>
                                    <span>Pay when your food arrives</span>
                                </button>
                                <button className="payment-choice" onClick={() => setPaymentMethod('ONLINE')}>
                                    <CreditCard size={28} />
                                    <strong>Online Payment</strong>
                                    <span>Secure digital payment</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {(phase === 'payment-processing' || phase === 'location' || phase === 'delivery-check') && (
                        <motion.div key={phase} className="order-now-step" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                            <div className="order-now-loader"><span /></div>
                            <p className="order-now-eyebrow">{phase === 'payment-processing' ? 'Online Payment' : 'AgentAutoBite'}</p>
                            <h1>{phase === 'payment-processing' ? 'Payment Processing...' : phase === 'location' ? 'Tracking your delivery address...' : 'Checking delivery availability...'}</h1>
                            <p className="order-now-muted">{phase === 'payment-processing' ? 'Securing your payment automatically.' : phase === 'location' ? 'Finding your saved KGF delivery location.' : 'Matching your restaurant with the delivery network.'}</p>
                        </motion.div>
                    )}

                    {phase === 'payment-success' && (
                        <motion.div key="payment-success" className="order-now-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <motion.div className="order-now-success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={42} /></motion.div>
                            <p className="order-now-eyebrow">Online Payment</p>
                            <h1>Payment Successful</h1>
                            <p className="order-now-muted">Moving you to delivery tracking.</p>
                        </motion.div>
                    )}

                    {phase === 'location-found' && (
                        <motion.div key="location-found" className="order-now-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <motion.div className="order-now-success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }}><MapPin size={42} /></motion.div>
                            <p className="order-now-eyebrow">Location Found</p>
                            <h1>✓ Location Found</h1>
                            <p className="order-now-address">{DELIVERY_ADDRESS}</p>
                        </motion.div>
                    )}

                    {phase === 'confirmed' && createdOrder && (
                        <motion.div key="confirmed" className="order-now-step order-confirmed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <motion.div className="order-now-success-icon" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}><PackageCheck size={44} /></motion.div>
                            <p className="order-now-eyebrow">Everything is ready</p>
                            <h1>🎉 Order Confirmed!</h1>
                            <div className="order-confirmed-details">
                                <div><span>Restaurant</span><strong>{createdOrder.restaurantName}</strong></div>
                                <div><span>Food</span><strong>{createdOrder.foodName}</strong></div>
                                <div><span>Quantity</span><strong>{createdOrder.quantity}</strong></div>
                                <div><span>Total amount</span><strong>₹{createdOrder.totalAmount}</strong></div>
                                <div><span>Payment method</span><strong>{createdOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong></div>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'tracking' && (
                        <motion.div key="tracking" className="order-now-step tracking-preview" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="tracking-preview-icon"><Truck size={36} /></div>
                            <p className="order-now-eyebrow">Your order is on its way</p>
                            <h1>🚴 Track Your Order</h1>
                            <div className="tracking-preview-timeline">
                                {['Order Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'].map((item, index) => (
                                    <div className="tracking-preview-item" key={item}>
                                        <span className={index === 0 ? 'done' : ''}>{index === 0 ? <Check size={14} /> : '○'}</span>
                                        <strong>{item}</strong>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {phase === 'error' && (
                        <motion.div key="error" className="order-now-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="order-now-error-icon"><X size={38} /></div>
                            <h1>We couldn't place that order</h1>
                            <p className="order-now-muted">{errorMessage}</p>
                            <button className="btn-primary order-now-retry" onClick={onClose}>Close</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
