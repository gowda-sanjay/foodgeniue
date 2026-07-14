import React, { useState, useRef } from 'react';
import { X, UploadCloud, RotateCcw, Search, Sparkles } from 'lucide-react';
import { scanFoodImage, getGeminiApiKey } from '../services/ai';
import type { VisionResult } from '../services/ai';

interface ImageSearchModalProps {
    onClose: () => void;
    onSearchFood: (foodName: string) => void;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ onClose, onSearchFood }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<VisionResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setImagePreview(base64);
            triggerScan(base64);
        };
        reader.readAsDataURL(file);
    };

    const triggerScan = async (base64: string) => {
        setIsScanning(true);
        setScanResult(null);
        try {
            const apiKey = getGeminiApiKey();
            const result = await scanFoodImage(base64, apiKey);
            setScanResult(result);
        } catch (err) {
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleSearchClick = () => {
        if (scanResult) {
            onSearchFood(scanResult.foodName);
            onClose();
        }
    };

    const resetImage = () => {
        setImagePreview(null);
        setScanResult(null);
        setIsScanning(false);
    };

    return (
        <div className="modal-overlay animate-fade" style={{ display: 'flex' }}>
            <div className="modal-content animate-slide-up" style={{ maxWidth: '520px', padding: '24px' }}>
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                    id="close-image-modal-btn"
                >
                    <X size={24} />
                </button>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                    <span>Gemini Vision Food Scanner</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                    Upload/drag an image of any food to let Gemini detect the dish, nutrition facts, and find it in KGF!
                </p>

                {/* Upload Container */}
                {!imagePreview && (
                    <div
                        className="dropzone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderStyle: 'dashed',
                            borderRadius: 'var(--radius-sm)'
                        }}
                        id="image-dropzone"
                    >
                        <UploadCloud size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Drag & Drop Food Photo Here</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>or click to browse local files</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="file-input-vision"
                        />
                    </div>
                )}

                {imagePreview && (
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '20px', height: '200px' }}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {isScanning && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'white',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'var(--primary)',
                                    borderRadius: '50%',
                                    animation: 'audioWave 1s infinite'
                                }}></div>
                                <span className="vision-loading">Gemini AI is analyzing food molecules...</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Scan Result Details */}
                {scanResult && (
                    <div
                        className="glass-panel animate-fade"
                        style={{
                            padding: '16px',
                            textAlign: 'left',
                            marginBottom: '20px',
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>🔎 Matches: {scanResult.foodName}</h4>
                            <span className="badge-health" style={{ marginLeft: '12px' }}>
                                Health Score: {scanResult.nutrition.healthScore}/100
                            </span>
                        </div>

                        {/* Nutrition Box */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '6px',
                            background: 'var(--bg-card-solid)',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '14px',
                            textAlign: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Calories</div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{scanResult.nutrition.calories}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>kcal</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Protein</div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{scanResult.nutrition.protein}g</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>60% DV</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carbs</div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{scanResult.nutrition.carbs}g</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>15% DV</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fat</div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{scanResult.nutrition.fat}g</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>10% DV</div>
                            </div>
                        </div>

                        {/* Dining Options matched from KGF restaurant list */}
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                                AVAILABLE AT THESE KGF RESTAURANTS:
                            </div>
                            <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {scanResult.nearbyRestaurants.map((r, i) => (
                                    <li key={i} style={{ color: 'var(--text-main)' }}>
                                        <strong>{r}</strong> {i === 0 ? ' (Best Match)' : ' (Also available)'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {imagePreview && !isScanning && (
                        <button
                            onClick={resetImage}
                            className="btn-secondary"
                            style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                            id="reset-image-btn"
                        >
                            <RotateCcw size={16} />
                            <span>Retry</span>
                        </button>
                    )}

                    {scanResult && (
                        <button
                            onClick={handleSearchClick}
                            className="btn-primary"
                            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                            id="search-detected-food-btn"
                        >
                            <Search size={16} />
                            <span>Discover in KGF</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
