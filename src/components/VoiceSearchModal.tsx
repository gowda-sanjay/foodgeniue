import React, { useEffect, useState, useRef } from 'react';
import { X, Mic, MicOff } from 'lucide-react';

interface VoiceSearchModalProps {
    onClose: () => void;
    onVoiceResult: (text: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ onClose, onVoiceResult }) => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check Web Speech API availability
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setErrorMsg("Web Speech API is not supported in this browser. Simulating voice recognition...");
            simulateListening();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Set to English (India) to fit KGF context

        recognition.onstart = () => {
            setIsListening(true);
            setErrorMsg('');
            setTranscript('Listening... Speak now.');
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                setErrorMsg("Microphone access denied. Please check site permissions.");
            } else {
                setErrorMsg(`Error: ${event.error}. Simulating voice instead...`);
                simulateListening();
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const result = finalTranscript || interimTranscript;
            setTranscript(result);

            if (finalTranscript) {
                // Automatically submit after a short delay
                setTimeout(() => {
                    onVoiceResult(finalTranscript);
                    onClose();
                }, 1200);
            }
        };

        recognitionRef.current = recognition;
        recognition.start();

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    // Offline simulation fallback for environments without microphone access
    const simulateListening = () => {
        setIsListening(true);
        const phrases = [
            "Chicken Biryani under ₹200",
            "Best Pizza in KGF",
            "Healthy Breakfast options",
            "Paneer butter masala and dosa",
            "Low calorie meals in Robertsonpet"
        ];
        // Choose a random phrase for simulation
        const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];

        // Simulate words appearing slowly
        let currentText = "";
        const words = selectedPhrase.split(" ");
        let wordIndex = 0;

        const interval = setInterval(() => {
            if (wordIndex < words.length) {
                currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
                setTranscript(currentText);
                wordIndex++;
            } else {
                clearInterval(interval);
                setIsListening(false);
                setTimeout(() => {
                    onVoiceResult(selectedPhrase);
                    onClose();
                }, 1500);
            }
        }, 450);
    };

    const handleStopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    return (
        <div className="modal-overlay animate-fade" style={{ display: 'flex' }}>
            <div className="modal-content animate-slide-up" style={{ maxWidth: '420px' }}>
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                    id="close-voice-modal-btn"
                >
                    <X size={24} />
                </button>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Voice Search</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Describe what you want to eat in natural language.
                </p>

                {/* Listening States Visualizer */}
                <div className="voice-wave-container">
                    {isListening ? (
                        <>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                        </>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                            Microphone off
                        </div>
                    )}
                </div>

                {/* Microphone Button */}
                <div
                    className={`voice-mic-active ${isListening ? 'active' : ''}`}
                    style={{ animation: isListening ? 'pulse-glow 1.5s infinite' : 'none', cursor: 'pointer' }}
                    onClick={isListening ? handleStopListening : simulateListening}
                >
                    {isListening ? <Mic size={36} /> : <MicOff size={36} style={{ color: 'var(--text-muted)' }} />}
                </div>

                {/* Live Transcription Box */}
                <div className="glass-panel" style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: isListening ? 'var(--text-main)' : 'var(--primary)',
                    marginBottom: '16px'
                }}>
                    "{transcript || 'Waiting to speak...'}"
                </div>

                {errorMsg && (
                    <p style={{
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        background: 'rgba(255, 90, 31, 0.08)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        marginTop: '8px'
                    }}>
                        {errorMsg}
                    </p>
                )}

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '20px' }}>
                    Try saying: <span style={{ fontWeight: 600 }}>"Best Biryani near me"</span> or <span style={{ fontWeight: 600 }}>"Dosa under 100"</span>
                </div>
            </div>
        </div>
    );
};
