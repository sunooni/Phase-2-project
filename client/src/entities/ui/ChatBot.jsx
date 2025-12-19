import { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import axiosinstance from "../../shared/axiosinstance";
import { useTranslation } from "react-i18next";

export default function ChatBot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();

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
      const examples = t("chat.examples", { returnObjects: true }) || [
        "Мастер и Маргарита",
        "1984",
        "Маленький принц",
        "Преступление и наказание",
        "Гарри Поттер и философский камень",
        "Война и мир",
        "Шерлок Холмс: Собака Баскервилей",
        "Алхимик",
      ];
      const res = await axiosinstance.post("/api/ai/chat", {
        question: userMsg,
        currentPage: window.location.pathname,
        userBooks: examples,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.busy") },
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
          title={t("chat.open")}
          aria-label={t("chat.open")}
        >
          📚
        </button>
      )}

      {isOpen && (
        <div
          className="chatbot-window"
          role="dialog"
          aria-label={t("chat.aria")}
        >
          <div className="chatbot-header">
            <div>
              <div className="chatbot-title">{t("chat.greeting")}</div>
              <div className="chatbot-sub">{t("chat.subtitle")}</div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label={t("chat.close")}
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-empty">{t("chat.placeholder")}</div>
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
                <div className="chatbot-bubble">{t("chat.thinking")}</div>
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
                placeholder={t("chat.placeholder")}
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
