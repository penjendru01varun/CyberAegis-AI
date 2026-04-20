import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Trash2, Copy } from 'lucide-react';

const ChatWidget = ({ context = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { 
            id: 'init', 
            type: 'bot', 
            text: "Namaste! I am Varun, the specialized HyberShield AI Fraud Analyst from Team CIPHER BREAKERS. I'm here to explain our 7-agent security layer and sub-250ms decisioning system for the Technoverse Hackathon 2026. How can I assist you?",
            suggestions: ["Who is Varun?", "Explain GhostNet agent", "What is ElderShield?", "Platform ROI Metrics"]
        }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (textToSend) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: query }]);
        if (!textToSend) setInput('');
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query, context: context })
            });
            const data = await response.json();
            
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                type: 'bot', 
                text: data.response,
                suggestions: data.suggestions || []
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "I'm having trouble connecting to the HyberShield intelligence network. Is the backend running?" }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([messages[0]]);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            width: '60px', height: '60px', borderRadius: '30px',
                            background: 'var(--primary)', boxShadow: '0 10px 30px rgba(0, 212, 255, 0.4)',
                            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000'
                        }}
                    >
                        <MessageSquare size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.8 }}
                        className="glass"
                        style={{
                            width: '400px', height: '600px', borderRadius: '24px',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '20px', background: 'rgba(0, 212, 255, 0.1)', 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '10px', height: '10px', background: '#00ffaa', borderRadius: '50%', boxShadow: '0 0 10px #00ffaa' }} />
                                <div>
                                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Varun • HyberShield AI</h4>
                                    <span style={{ fontSize: '0.7rem', color: '#00ffaa', fontWeight: 800, letterSpacing: '1px' }}>LEAD ANALYST • CIPHER BREAKERS</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={clearChat} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }} title="Clear Chat">
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            {messages.map((msg) => (
                                <div key={msg.id} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                    <div style={{ 
                                        display: 'flex', gap: '10px', 
                                        flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-end'
                                    }}>
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '50%', 
                                            background: msg.type === 'bot' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {msg.type === 'bot' ? <Bot size={16} color="var(--primary)" /> : <User size={16} color="#fff" />}
                                        </div>
                                        <div style={{ 
                                            padding: '12px 16px', borderRadius: '16px',
                                            borderTopRightRadius: msg.type === 'user' ? '4px' : '16px',
                                            borderTopLeftRadius: msg.type === 'bot' ? '4px' : '16px',
                                            background: msg.type === 'user' ? 'rgba(0, 212, 255, 0.8)' : 'rgba(255,255,255,0.05)',
                                            color: msg.type === 'user' ? '#000' : '#ececec',
                                            fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap',
                                            boxShadow: msg.type === 'user' ? '0 4px 15px rgba(0, 212, 255, 0.2)' : 'none'
                                        }}>
                                            {msg.text}
                                            {msg.type === 'bot' && (
                                                <button 
                                                    onClick={() => copyToClipboard(msg.text)}
                                                    style={{ display: 'block', marginTop: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', textAlign: 'right', width: '100%' }}
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', marginLeft: msg.type === 'bot' ? '42px' : '0' }}>
                                            {msg.suggestions.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleSendMessage(s)}
                                                    style={{ 
                                                        padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(0, 212, 255, 0.3)',
                                                        background: 'transparent', color: 'var(--primary)', fontSize: '0.75rem', 
                                                        cursor: 'pointer', transition: '0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.background = 'rgba(0, 212, 255, 0.1)'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Bot size={16} color="var(--primary)" />
                                    </div>
                                    <div className="typing-indicator" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', borderTopLeftRadius: '4px' }}>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '5px 5px 5px 15px', alignItems: 'center' }}
                            >
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about agents, risk, or ROI..."
                                    style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    style={{ 
                                        width: '40px', height: '40px', borderRadius: '10px', 
                                        background: 'var(--primary)', border: 'none', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', opacity: input.trim() ? 1 : 0.5
                                    }}
                                >
                                    <Send size={18} color="#000" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>
                {`
                .typing-indicator .dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--primary);
                    margin-right: 4px;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
                `}
            </style>
        </div>
    );
};

export default ChatWidget;
