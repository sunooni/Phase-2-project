import { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import axiosinstance from "../../shared/axiosinstance";

export default function ChatBot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await axiosinstance.post("/api/ai/chat", {
        question: userMsg,
        currentPage: window.location.pathname,
        userBooks: [
          "Мастер и Маргарита",
          "1984",
          "Маленький принц",
          "Преступление и наказание",
          "Гарри Поттер и философский камень",
          "Война и мир",
          "Шерлок Холмс: Собака Баскервилей",
          "Алхимик",
        ],
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Извини, библиотекарь на обеде 😴" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          title="Спроси библиотекаря"
          aria-label="Открыть чат"
        >
          📚
        </button>
      )}

      {isOpen && (
        <div
          className="chatbot-window"
          role="dialog"
          aria-label="Чат с библиотекарем"
        >
          <div className="chatbot-header">
            <div>
              <div className="chatbot-title">Привет, я твой помощник!</div>
              <div className="chatbot-sub">Помогу найти книги! 📖</div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-empty">
                Привет! Ты можешь сказать мне какую книгу ты ищешь и я помогу
                тебе ее найти 😊
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                <div className="chatbot-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message assistant">
                <div className="chatbot-bubble">🤔 Думаю...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <div className="chatbot-input-row">
              <Form.Control
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                placeholder="Что интересует?"
                className="chatbot-input-field"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="chatbot-send-btn"
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
