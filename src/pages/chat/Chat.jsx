import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../api/chat";
import "./Chat.css";

const Chat = ({ isWidget = false, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const formatBotResponse = (text) => {
    if (!text) return "";

    let formatted = text.trim();
    formatted = formatted.replace(/^Chào bạn[!.,]?\s*/i, "");
    formatted = formatted.replace(/^Xin chào[!.,]?\s*/i, "");
    formatted = formatted.replace(
      /(?:\n|\r|\s)*(Nếu bạn cần(?: thêm)? thông tin.*|Hãy cho mình biết.*|Nếu bạn cần.*)$/is,
      "",
    );
    formatted = formatted.replace(/\r\n/g, "\n");
    formatted = formatted.replace(/\n{3,}/g, "\n\n");
    return formatted.trim();
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { text: trimmed, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(trimmed);
      const botText =
        response?.data?.data?.response ||
        "Xin lỗi, hệ thống chưa trả lời được.";
      const botMessage = {
        text: formatBotResponse(botText),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={isWidget ? "chat-widget-page" : "chat-page"}>
      <div className="chat-box">
        <div className="chat-header">
          <div className="chat-header-title">
            <div>
              <h2>Chat hỗ trợ Mobile Store</h2>
              <p>Hỏi về sản phẩm, giá cả.</p>
            </div>
            {isWidget && (
              <button
                type="button"
                className="chat-close-btn"
                onClick={onClose}
                aria-label="Đóng chat"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-message bot loading">
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                Đang trả lời...
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
