import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your HyberShield AI Copilot. How can I help you understand our fraud prevention layers today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:8000/api/chat', { message: userMsg.content });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.response }]);
    } catch (err) {
      console.warn("Chatbot backend not reached, using fallback.");
      const msg = userMsg.content.toLowerCase();
      let response = "I'm the HyberShield AI Copilot. I can help you understand our 3-layer defense. What would you like to know?";
      
      if (msg.includes("vera")) response = "VeraShield is our proactive layer. It uses ghost accounts to trap attackers before they reach real users.";
      if (msg.includes("fraud")) response = "FraudShield is our real-time layer. it computes risk scores in under 250ms for every transaction.";
      if (msg.includes("elder")) response = "ElderShield protects users over 60 from scams using cooling periods and family alerts.";
      
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', content: response }]);
        setIsTyping(false);
      }, 600);
      return;
    }
    setIsTyping(false);
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
                <Sparkles size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>HyberShield Copilot</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Online | Multi-Agent Analysis</div>
                </div>
              </div>
              <X size={20} cursor="pointer" onClick={() => setIsOpen(false)} />
            </div>

            <div style={styles.messages} ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} style={{ ...styles.msgRow, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    ...styles.bubble, 
                    background: m.role === 'user' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)',
                    border: m.role === 'user' ? '1px solid var(--primary)' : '1px solid var(--border)',
                    borderBottomRightRadius: m.role === 'user' ? '2px' : '12px',
                    borderBottomLeftRadius: m.role === 'bot' ? '2px' : '12px',
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={styles.msgRow}>
                  <div style={{ ...styles.bubble, opacity: 0.5 }}>Typing...</div>
                </div>
              )}
            </div>

            <div style={styles.inputArea}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about VeraShield, anomalies..."
                style={styles.input}
              />
              <button style={styles.sendBtn} onClick={handleSend}>
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
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 2000
  },
  launcher: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 5px 20px var(--primary-glow)'
  },
  chatWindow: {
    width: '380px',
    height: '500px',
    position: 'absolute',
    bottom: '80px',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    padding: '15px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)'
  },
  messages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  msgRow: {
    display: 'flex',
    width: '100%'
  },
  bubble: {
    maxWidth: '80%',
    padding: '10px 15px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    lineHeight: '1.4'
  },
  inputArea: {
    padding: '15px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none'
  },
  sendBtn: {
    background: 'var(--primary)',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Chatbot;
