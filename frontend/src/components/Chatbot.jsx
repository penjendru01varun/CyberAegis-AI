import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, Bot, Sparkles, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
        role: 'bot', 
        content: 'Good evening! I am Varun, your HyberShield AI Cybersecurity Assistant from Team CIPHER BREAKERS. How can I help you understand our 7-agent defense system or our ROI metrics today?',
        suggestions: ["Who is Varun?", "Explain 7 agents", "ROI Metrics"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride = null) => {
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/chat`, { message: userMsg.content });
      
      setMessages(prev => [...prev, { 
          role: 'bot', 
          content: res.data.response,
          suggestions: res.data.suggestions || []
      }]);
    } catch (err) {
      console.error("Chatbot API error:", err);
      setMessages(prev => [...prev, { 
          role: 'bot', 
          content: "I'm having trouble connecting to the HyberShield neural network. Please verify the backend status." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={styles.container}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="glass"
            style={styles.chatWindow}
          >
            <div style={styles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#00ffaa" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>Varun • HyberShield AI</div>
                  <div style={{ fontSize: '0.7rem', color: '#00ffaa', fontWeight: 700 }}>Lead Analyst | Cipher Breakers</div>
                </div>
              </div>
              <X size={20} cursor="pointer" onClick={() => setIsOpen(false)} color="rgba(255,255,255,0.5)" />
            </div>

            <div style={styles.messages} ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                    <div style={{ ...styles.msgRow, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {m.role === 'bot' && (
                            <div style={styles.avatar}>
                                <Bot size={14} color="#00ffaa" />
                            </div>
                        )}
                        <div style={{ 
                            ...styles.bubble, 
                            background: m.role === 'user' ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: m.role === 'user' ? '1px solid rgba(0, 255, 170, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                            borderBottomRightRadius: m.role === 'user' ? '2px' : '16px',
                            borderBottomLeftRadius: m.role === 'bot' ? '2px' : '16px',
                        }}>
                            {m.content}
                        </div>
                    </div>
                    {m.suggestions && m.suggestions.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', marginLeft: '35px' }}>
                            {m.suggestions.map((s, si) => (
                                <button
                                    key={si}
                                    onClick={() => handleSend(s)}
                                    style={styles.suggestionBtn}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              ))}
              {isTyping && (
                <div style={styles.msgRow}>
                  <div style={styles.avatar}><Bot size={14} color="#00ffaa" /></div>
                  <div style={{ ...styles.bubble, opacity: 0.5 }}>Analyzing...</div>
                </div>
              )}
            </div>

            <div style={styles.inputArea}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about GhostNet, ROI, or the 7 agents..."
                style={styles.input}
              />
              <button style={styles.sendBtn} onClick={() => handleSend()}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={styles.launcher} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare color="black" />
        {!isOpen && <div style={styles.onlineDot} />}
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    zIndex: 2000,
    fontFamily: "'Inter', sans-serif"
  },
  launcher: {
    width: '65px',
    height: '65px',
    borderRadius: '50%',
    background: '#00ffaa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(0, 255, 170, 0.4)',
    position: 'relative'
  },
  onlineDot: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '14px',
    height: '14px',
    background: '#00ffaa',
    border: '3px solid #000',
    borderRadius: '50%'
  },
  chatWindow: {
    width: '400px',
    height: '600px',
    position: 'absolute',
    bottom: '90px',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
    background: 'rgba(15, 23, 42, 0.95)'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.02)'
  },
  messages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  msgRow: {
    display: 'flex',
    width: '100%',
    gap: '10px',
    alignItems: 'flex-end'
  },
  avatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: 'rgba(0, 255, 170, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
  },
  bubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: '#ececec',
    whiteSpace: 'pre-wrap'
  },
  suggestionBtn: {
      padding: '6px 14px',
      borderRadius: '20px',
      border: '1px solid rgba(0, 255, 170, 0.3)',
      background: 'rgba(0, 255, 170, 0.05)',
      color: '#00ffaa',
      fontSize: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
  },
  inputArea: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    gap: '12px'
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '10px 15px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none'
  },
  sendBtn: {
    background: '#00ffaa',
    color: 'black',
    border: 'none',
    borderRadius: '12px',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(0, 255, 170, 0.2)'
  }
};

export default Chatbot;
