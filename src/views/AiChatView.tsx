import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Mic, Image, Settings, Trash2, Key } from 'lucide-react';
import { getGeminiChatStream, getGeminiApiKey, setGeminiApiKey, removeGeminiApiKey } from '../services/ai';
import { type FoodItem } from '../data/restaurants';
import { VoiceSearchModal } from '../components/VoiceSearchModal';
import { ImageSearchModal } from '../components/ImageSearchModal';

interface Message {
    id: string;
    role: 'user' | 'model';
    parts: string;
    timestamp: Date;
}

interface AiChatViewProps {
    onOrderNow: (food: FoodItem) => void;
    setView: (view: string) => void;
    setSelectedFood: (food: FoodItem | null) => void;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
    onOrderNow: _onOrderNow,
    setView: _setView,
    setSelectedFood: _setSelectedFood
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            parts: `Hello! I'm **FoodGenie AI**, your dedicated culinary assistant for **Kolar Gold Fields (KGF)**. 🍔  
How can I satisfy your cravings today? Here is what I can do:
- 🔎 Find dishes within a budget (e.g., *“Biryani under ₹200”*)
- 🥗 Match health goals (*“Low calorie breakfast options”* or *“High protein foods”*)
- 🏬 Recommend the top restaurants in Robertsonpet, BEML Nagar, etc.
- 📸 Analyze food items from photos (click the Image button below)
- 🎙️ Listen to voice commands (click the Microphone button below)

Add your **Google Gemini API Key** by clicking the settings gear icon to get live neural answers!`,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [activeVoiceModal, setActiveVoiceModal] = useState(false);
    const [activeImageModal, setActiveImageModal] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load and sync existing API key
        const savedKey = getGeminiApiKey();
        if (savedKey) {
            setApiKeyInput(savedKey);
        }
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAiTyping]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSaveApiKey = () => {
        if (apiKeyInput.trim()) {
            setGeminiApiKey(apiKeyInput.trim());
            alert("Success! Your Gemini API key is securely saved in your local storage.");
            setShowSettings(false);
        }
    };

    const handleRemoveApiKey = () => {
        removeGeminiApiKey();
        setApiKeyInput('');
        alert("Gemini API key removed. Falling back to simulated offline NLP engine.");
        setShowSettings(false);
    };

    const submitMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isAiTyping) return;

        const userMsg: Message = {
            id: `user_${Date.now()}`,
            role: 'user',
            parts: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsAiTyping(true);

        const aiMsgId = `ai_${Date.now()}`;
        const initialAiMsg: Message = {
            id: aiMsgId,
            role: 'model',
            parts: '',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, initialAiMsg]);

        const activeKey = getGeminiApiKey();
        // Build history format required for gemini
        const historyHistory = messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
                role: m.role,
                parts: m.parts
            }));

        try {
            await getGeminiChatStream(
                historyHistory,
                textToSend,
                activeKey,
                (chunk) => {
                    setMessages(prev =>
                        prev.map(m => m.id === aiMsgId ? { ...m, parts: m.parts + chunk } : m)
                    );
                }
            );
        } catch (err) {
            console.error(err);
            setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, parts: "Something went wrong. Please check your config." } : m)
            );
        } finally {
            setIsAiTyping(false);
        }
    };

    const handleSuggestionClick = (query: string) => {
        submitMessage(query);
    };

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear chat history?")) {
            setMessages([
                {
                    id: 'welcome',
                    role: 'model',
                    parts: "Chat history cleared. How can I help you discover food in KGF today?",
                    timestamp: new Date()
                }
            ]);
        }
    };

    const suggestedQuestions = [
        "Find Chicken Biryani under ₹200",
        "Show me healthy breakfast",
        "Cheapest burger nearby",
        "Best restaurant for family in KGF"
    ];

    return (
        <div className="chat-page-layout animate-fade" style={{ width: '100%' }}>

            {/* Sidebar - Settings and Help */}
            <aside className="chat-sidebar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ fontSize: '1.1rem' }}>Genie Hub</h3>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Key Status banner */}
                        <div className="glass-panel" style={{ padding: '14px', background: 'var(--bg-app)', border: '1px solid var(--border-glow)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                                <Key size={14} />
                                <span>Engine Mode</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', marginTop: '6px', fontWeight: 600 }}>
                                {apiKeyInput ? "🟢 Google Gemini Online" : "🟡 Local Offline NLP"}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {apiKeyInput ? "Enjoying live generative search." : "Falling back to KGF keyword matcher."}
                            </p>
                        </div>

                        {/* Quick Helper */}
                        <div>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Chat Tips</h4>
                            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Ask for specific calories like: <em>"Meals under 400 calories"</em>.</li>
                                <li>Compare options: <em>"Which restaurant has better noodles?"</em>.</li>
                                <li>Identify locations: <em>"South Indian food in Robertsonpet"</em>.</li>
                            </ul>
                        </div>

                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="btn-secondary"
                            style={{ padding: '10px', fontSize: '0.85rem', width: '100%' }}
                            id="chat-toggle-settings-btn"
                        >
                            <Settings size={16} />
                            <span>Gemini Settings</span>
                        </button>

                        <button
                            onClick={handleClearHistory}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px',
                                fontSize: '0.85rem',
                                width: '100%',
                                color: '#EF476F',
                                background: 'rgba(239, 71, 111, 0.08)',
                                borderRadius: 'var(--radius-sm)'
                            }}
                            id="clear-chat-history-btn"
                        >
                            <Trash2 size={16} />
                            <span>Clear History</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Chat Box area */}
            <section className="chat-container">

                {/* Chat Header */}
                <div className="chat-header flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.3rem'
                        }}>
                            🧙‍♂️
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>FoodGenie AI Assistant</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>● Online & Ready</p>
                        </div>
                    </div>

                    {/* Mobile view Action shortcut buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="btn-icon"
                            style={{ width: '36px', height: '36px' }}
                            title="Settings"
                        >
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="btn-icon"
                            style={{ width: '36px', height: '36px', color: '#EF476F' }}
                            title="Clear Chat"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* API settings Overlay Card (sliding drop card) */}
                {showSettings && (
                    <div
                        className="glass-panel"
                        style={{
                            position: 'absolute',
                            top: '72px',
                            left: '20px',
                            right: '20px',
                            padding: '20px',
                            zIndex: 10,
                            background: 'var(--bg-card-solid)',
                            border: '2px solid var(--primary)',
                            textAlign: 'left'
                        }}
                        id="gemini-key-settings-panel"
                    >
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--primary)' }}>⚙️ Google Gemini API Key Settings</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                            Your key is only saved locally in your browser cache to authenticate directly with Google Generative AI servers.
                        </p>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <input
                                type="password"
                                placeholder="Paste your API Key here (AIzaSy...)"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--bg-app)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.9rem'
                                }}
                                id="api-key-textbox-input"
                            />
                            <button
                                onClick={handleSaveApiKey}
                                className="btn-primary"
                                style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                                id="save-key-btn"
                            >
                                Save key
                            </button>
                            {getGeminiApiKey() && (
                                <button
                                    onClick={handleRemoveApiKey}
                                    style={{
                                        padding: '10px 14px',
                                        fontSize: '0.85rem',
                                        background: 'rgba(239, 71, 111, 0.1)',
                                        color: '#EF476F',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)'
                                    }}
                                    id="delete-key-btn"
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>

                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            Get a free API key instantly in <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Google AI Studio</a>.
                        </p>
                    </div>
                )}

                {/* Message Log viewport */}
                <div className="chat-messages">
                    {messages.map((m) => {
                        const isUser = m.role === 'user';
                        return (
                            <div
                                key={m.id}
                                className={`message-bubble ${isUser ? 'user' : 'ai'}`}
                                style={{
                                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                                    textAlign: 'left'
                                }}
                            >
                                {/* Parse Markdown representation simply */}
                                <div style={{ whiteSpace: 'pre-line', fontSize: '0.92rem' }}>
                                    {m.parts}
                                </div>

                                <span className="bubble-time">
                                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isAiTyping && (
                        <div className="typing-indicator">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Floating Suggested Action Chips */}
                <div className="chat-suggested">
                    {suggestedQuestions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(q)}
                            className="suggestion-chip"
                            style={{ whiteSpace: 'nowrap' }}
                            id={`chat-sugg-${i}`}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Chat Input Toolbar controls */}
                <div className="chat-input-wrapper">
                    <div className="chat-input-inner">

                        {/* Image input clip icon */}
                        <button
                            onClick={() => setActiveImageModal(true)}
                            className="search-icon-btn"
                            style={{ width: '40px', height: '40px' }}
                            title="Upload image to analyze"
                            id="chat-image-uploader-trigger"
                        >
                            <Image size={18} />
                        </button>

                        {/* Voice input mic icon */}
                        <button
                            onClick={() => setActiveVoiceModal(true)}
                            className="search-icon-btn"
                            style={{ width: '40px', height: '40px' }}
                            title="Voice assistant input"
                            id="chat-voice-uploader-trigger"
                        >
                            <Mic size={18} />
                        </button>

                        <input
                            type="text"
                            className="chat-textbox"
                            placeholder="Ask FoodGenie... (e.g. 'mutton biryani from Al Naaz')"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submitMessage(inputText)}
                            disabled={isAiTyping}
                            id="chat-message-input"
                        />

                        <button
                            onClick={() => submitMessage(inputText)}
                            className="search-btn-main"
                            style={{ width: '40px', height: '40px' }}
                            disabled={isAiTyping}
                            id="chat-message-send-btn"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>

            </section>

            {/* Voice and Image Scan overlays */}
            {activeVoiceModal && (
                <VoiceSearchModal
                    onClose={() => setActiveVoiceModal(false)}
                    onVoiceResult={(speechText) => {
                        submitMessage(speechText);
                    }}
                />
            )}

            {activeImageModal && (
                <ImageSearchModal
                    onClose={() => setActiveImageModal(false)}
                    onSearchFood={(scannedFood) => {
                        submitMessage(`Analyze image detection for: ${scannedFood}`);
                    }}
                />
            )}

        </div>
    );
};
