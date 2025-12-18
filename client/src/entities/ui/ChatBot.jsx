import { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import axiosinstance from '../../shared/axiosinstance';

export default function ChatBot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
    const res = await axiosinstance.post('/api/ai/chat', {
      question: userMsg,
      currentPage: window.location.pathname,  
      userBooks: ['Мастер и Маргарита', '1984', 'Маленький принц', 'Преступление и наказание', 'Гарри Поттер и философский камень', 'Война и мир', 'Шерлок Холмс: Собака Баскервилей', 'Алхимик'] 
    });
    setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
  } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Извини, библиотекарь на обеде 😴' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Кнопка чата */}
      {!isOpen && (
        <div 
          style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%', cursor: 'pointer', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setIsOpen(true)}
          title="Спроси библиотекаря"
        >
          📚
        </div>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed', bottom: '90px', right: '20px',
            width: '360px', height: '500px', background: 'white',
            borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Заголовок */}
          <div style={{ 
            padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Привет, я твой помошник!</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Помогу найти книги! 📖</div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          {/* Сообщения */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8f9ff' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                Привет! Ты можешь сказать мне какую книгу ты ищешь и я помогу тебе ее найти 😊
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                marginBottom: '16px',
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '20px', maxWidth: '80%',
                  background: msg.role === 'user' ? '#667eea' : '#ffffff',
                  color: msg.role === 'user' ? 'white' : '#333',
                  boxShadow: msg.role === 'user' ? 'none' : '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '20px', background: '#ffffff',
                  color: '#999', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  🤔 Думаю...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Control 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Что интересует?"
                style={{ borderRadius: '25px', border: '2px solid #eee' }}
                disabled={loading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!input.trim() || loading}
                style={{ 
                  borderRadius: '25px', padding: '10px 20px',
                  background: '#667eea', border: 'none',
                  fontWeight: 'bold'
                }}
              >
                ➤
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
