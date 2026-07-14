import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Sparkles, ShieldAlert } from 'lucide-react';

interface ProfileViewProps {
    setView: (view: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ setView }) => {
    const [profileName, setProfileName] = useState('Sanjay Gowda');
    const [email, setEmail] = useState('sanjay.gowda@kgfmail.com');
    const [phone, setPhone] = useState('+91 94812 73921');
    const [address, setAddress] = useState('Flat 204, Royal Palms Residency, Robertsonpet, Kolar Gold Fields – 563122');

    // Custom Diet Goals configuration
    const [dietPref, setDietPref] = useState<'any' | 'veg'>('any');
    const [calorieCap, setCalorieCap] = useState(600);
    const [proteinGoal, setProteinGoal] = useState(15); // minimum grams

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Profile configurations saved! Search results will align with your fitness constraints.");
    };

    return (
        <div className="container animate-fade" style={{ padding: '30px 20px 60px', maxWidth: '680px' }}>

            {/* Return to Dashboard */}
            <button
                onClick={() => setView('landing')}
                style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}
                id="profile-back-btn"
            >
                <ArrowLeft size={18} />
                <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>Back Home</span>
            </button>

            <h1 style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                👤 My User Profile
            </h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.9rem', marginBottom: '24px' }}>
                Manage contact details and configure customized health metrics for AI recommendations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Profile Card details */}
                <form onSubmit={handleSaveProfile} className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                        Account Parameters
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                                    required
                                    id="profile-name-input"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-2">
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                                        required
                                        id="profile-email-input"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PHONE SPEED DIAL</label>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                                        required
                                        id="profile-phone-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEFAULT LOCAL KGF ADDRESS</label>
                            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '4px', position: 'relative' }}>
                                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', resize: 'none', height: '60px' }}
                                    required
                                    id="profile-address-input"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', marginTop: '10px' }}
                            id="profile-save-btn"
                        >
                            Update Account Profiles
                        </button>
                    </div>
                </form>

                {/* Customized health metrics configuration */}
                <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                        <span>Genie Personalized Health Filters</span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Diet constraint */}
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>DIETARY REGIME</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setDietPref('any')}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '0.85rem',
                                        borderRadius: '6px',
                                        background: dietPref === 'any' ? 'rgba(255, 90, 31, 0.05)' : 'var(--bg-app)',
                                        color: dietPref === 'any' ? 'var(--primary)' : 'var(--text-muted)',
                                        border: dietPref === 'any' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                        fontWeight: 700
                                    }}
                                >
                                    🥗 General / All Foods
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDietPref('veg')}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '0.85rem',
                                        borderRadius: '6px',
                                        background: dietPref === 'veg' ? 'rgba(6, 214, 160, 0.08)' : 'var(--bg-app)',
                                        color: dietPref === 'veg' ? 'var(--accent-green)' : 'var(--text-muted)',
                                        border: dietPref === 'veg' ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                                        fontWeight: 700
                                    }}
                                >
                                    🟢 Strict Veg Only
                                </button>
                            </div>
                        </div>

                        {/* Calorie setting slider */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                                <span>CALORIC LIMIT PER MEAL</span>
                                <strong style={{ color: 'var(--primary)' }}>{calorieCap} kcal</strong>
                            </div>
                            <input
                                type="range"
                                min="200"
                                max="800"
                                step="25"
                                value={calorieCap}
                                onChange={(e) => setCalorieCap(parseInt(e.target.value, 10))}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                                id="profile-calorie-slider"
                            />
                        </div>

                        {/* Min Protein limit */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                                <span>MINIMUM PROTEIN REQUIRED</span>
                                <strong style={{ color: 'var(--accent-green)' }}>{proteinGoal}g Protein</strong>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="40"
                                step="5"
                                value={proteinGoal}
                                onChange={(e) => setProteinGoal(parseInt(e.target.value, 10))}
                                style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                                id="profile-protein-slider"
                            />
                        </div>

                        {/* Warning tag */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#FFD166', background: 'rgba(255, 209, 102, 0.05)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255, 209, 102, 0.2)' }}>
                            <ShieldAlert size={16} />
                            <span>AI search queries will automatically prioritize healthy items matching these macros.</span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
