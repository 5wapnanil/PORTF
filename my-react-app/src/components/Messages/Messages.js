import { useState, useEffect } from 'react';
import './Messages.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`);
      const data = await response.json();
      console.log('Fetched messages:', data);
      
      const messagesWithPosition = [];
      const occupiedAreas = [];
      
      data.forEach((msg) => {
        let attempts = 0;
        let validPosition = false;
        let x, y;
        
        while (!validPosition && attempts < 50) {
          x = Math.random() * 60 + 10;
          y = Math.random() * 60 + 15;
          
          const overlap = occupiedAreas.some(area => {
            const overlapX = Math.abs(x - area.x) < 15;
            const overlapY = Math.abs(y - area.y) < 12;
            return overlapX && overlapY;
          });
          
          if (!overlap) {
            validPosition = true;
            occupiedAreas.push({ x, y });
          }
          attempts++;
        }
        
        messagesWithPosition.push({
          ...msg,
          x: x || Math.random() * 60 + 10,
          y: y || Math.random() * 60 + 15,
          rotation: Math.random() * 20 - 10
        });
      });
      
      console.log('Messages with positions:', messagesWithPosition);
      setMessages(messagesWithPosition);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="messages-container">
      <h1 className="messages-title">Messages Board</h1>
      <div className="messages-board">
        {messages.length === 0 ? (
          <p style={{color: '#fff', textAlign: 'center', fontSize: '18px', marginTop: '50px'}}>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="message-card"
              style={{
                left: `${msg.x}%`,
                top: `${msg.y}%`,
                transform: `rotate(${msg.rotation}deg)`
              }}
            >
              <h3>{msg.name}</h3>
              <p className="message-email">{msg.email}</p>
              <p className="message-text">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;
