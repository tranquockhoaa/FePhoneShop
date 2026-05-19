import React, { useState } from "react";
import Chat from "../../pages/chat/Chat";
import "./FloatingChatButton.css";

const FloatingChatButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-widget-container">
      {open && (
        <div className="chat-widget-panel">
          <Chat isWidget onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        className={`floating-chat-button ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Đóng chat hỗ trợ" : "Mở chat hỗ trợ"}
      >
        <span className="chat-icon">💬</span>
        <span className="chat-label">{open ? "Đóng chat" : "Chat hỗ trợ"}</span>
      </button>
    </div>
  );
};

export default FloatingChatButton;
