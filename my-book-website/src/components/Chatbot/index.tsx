import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import axios from 'axios'; // Assuming axios is installed

interface Message {
  text: string;
  sender: 'user' | 'bot';
  sources?: any[];
}

interface ChatbotProps {
  selectedText: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ selectedText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedText, setCurrentSelectedText] = useState<string | null>(null);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false); // New state to track first open
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (selectedText) {
      setCurrentSelectedText(selectedText);
      setIsOpen(true);
    }
  }, [selectedText]);

  const handleSendMessage = async () => {
    if (input.trim() === '' && !currentSelectedText) return;

    const userQuery = input.trim();
    const messageToSend: Message = {
      text: currentSelectedText
        ? `"${currentSelectedText}" - ${userQuery}`
        : userQuery,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, messageToSend]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        query: userQuery,
        selected_text: currentSelectedText,
      });
      const botMessage: Message = {
        text: response.data.answer,
        sender: 'bot',
        sources: response.data.sources,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Sorry, something went wrong.', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
      setCurrentSelectedText(null);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !hasOpenedBefore) { // If opening for the first time
      setIsLoading(true); // Show typing indicator
      setHasOpenedBefore(true); // Mark as opened
      setTimeout(() => {
        setIsLoading(false); // Hide typing indicator
        setMessages((prevMessages) => [
          { text: 'Welcome! How can I help you with this book?', sender: 'bot' },
          ...prevMessages, // Prepend the welcome message
        ]);
      }, 1000); // 1-second delay
    } else if (!isOpen) { // If opening again, clear selected text if any
        setCurrentSelectedText(null);
    }
  };

  const clearSelectedText = () => {
    setCurrentSelectedText(null);
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={`${styles.speechBubbleContainer} ${!isOpen && !hasOpenedBefore ? styles.visible : ''}`}>
        <div className={styles.speechBubble}>
          Hi!
        </div>
      </div>
      <button className={styles.chatToggleButton} onClick={toggleChat}>
        {isOpen ? 'Close Chat' : 'AI Assistant'}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Book Chatbot</h3>
            <button className={styles.closeButton} onClick={toggleChat}>X</button>
          </div>
          <div className={styles.messageList}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                <p>{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className={styles.sources}>
                    <h4>Sources:</h4>
                    {msg.sources.map((source, srcIndex) => (
                      <p key={srcIndex} className={styles.sourceItem}>
                        {source.page_content.substring(0, 100)}...
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className={`${styles.message} ${styles.bot}`}>Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.chatInputContainer}>
            {currentSelectedText && (
              <div className={styles.selectedTextDisplay}>
                <p>Selected: "{currentSelectedText}"</p>
                <button onClick={clearSelectedText} className={styles.clearSelectedTextButton}>
                  Clear
                </button>
              </div>
            )}
              <input
                type="text"
                className={styles.chatInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything about the book..."
                disabled={isLoading}
              />
              <button className={styles.sendButton} onClick={handleSendMessage} disabled={isLoading}>
                Send
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;