import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNutritionChatStore } from '../store/nutrition-chat-store';
import './ChatInterface.css';

function ChatInterface() {
  const { t } = useTranslation();
  const { session, isSending, sendMessage } = useNutritionChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const message = inputMessage.trim();
    setInputMessage('');

    try {
      await sendMessage(message);
    } catch (error) {
      // Error is handled in store
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!session) {
    return (
      <div className="chat-interface empty">
        <p>{t('nutrition_chat.chat.no_session')}</p>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {session.messages.map((message, index) => (
          <div key={`${message.timestamp}-${index}`} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('nutrition_chat.chat.input_placeholder')}
            rows={1}
            disabled={isSending}
            className="chat-textarea"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="send-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="send-icon"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="input-hint">{t('nutrition_chat.chat.input_hint')}</p>
      </form>
    </div>
  );
}

export default ChatInterface;
