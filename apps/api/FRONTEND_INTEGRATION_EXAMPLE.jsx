// Example React component showing how to use the new image upload features

import React, { useState } from 'react';

// Example Chat component with image upload
export const ChatWithImageUpload = ({ roomId, token }) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be smaller than 10MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const sendMessageWithImage = async () => {
    if (!selectedImage && !message.trim()) return;

    setUploading(true);
    try {
      const formData = new FormData();
      
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
      if (message.trim()) {
        formData.append('text', message.trim());
      }

      const response = await fetch(`/api/v1/chat/rooms/${roomId}/messages/with-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent:', result);
        // Reset form
        setMessage('');
        setSelectedImage(null);
        // Refresh chat messages...
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="chat-input-container">
      {/* Image preview */}
      {selectedImage && (
        <div className="image-preview">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Preview" 
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message or upload an image..."
          disabled={uploading}
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
          id="image-upload"
        />
        
        <label htmlFor="image-upload" className="image-upload-btn">
          📷
        </label>
        
        <button 
          onClick={sendMessageWithImage}
          disabled={uploading || (!message.trim() && !selectedImage)}
        >
          {uploading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

// Example AI Copilot component with image upload
export const AiCopilotWithImage = ({ token }) => {
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const askAiWithImage = async () => {
    if (!query.trim() && !selectedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('query', query || 'What can you tell me about this image?');
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const apiResponse = await fetch('/api/v1/ai/ask-with-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        setResponse(result);
      } else {
        console.error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error asking AI:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-copilot-container">
      <h3>🤖 Ask Ayinel AI Copilot</h3>
      
      {selectedImage && (
        <div className="image-preview">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Preview" 
            style={{ maxWidth: '300px', maxHeight: '300px' }}
          />
          <button onClick={() => setSelectedImage(null)}>Remove Image</button>
        </div>
      )}

      <div className="ai-input">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything about Ayinel, or upload an image for help..."
          disabled={loading}
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          style={{ display: 'none' }}
          id="ai-image-upload"
        />
        
        <div className="ai-controls">
          <label htmlFor="ai-image-upload" className="image-upload-btn">
            📷 Add Image
          </label>
          
          <button 
            onClick={askAiWithImage}
            disabled={loading || (!query.trim() && !selectedImage)}
          >
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>
      </div>

      {response && (
        <div className="ai-response">
          <div className="ai-answer">
            <strong>AI Response:</strong>
            <p>{response.answer}</p>
          </div>
          
          {response.suggestions && response.suggestions.length > 0 && (
            <div className="ai-suggestions">
              <strong>You might also ask:</strong>
              <ul>
                {response.suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button onClick={() => setQuery(suggestion)}>
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Example usage in a main component
export const ExampleUsage = () => {
  const token = 'your-jwt-token-here';
  const roomId = 'chat-room-id';

  return (
    <div>
      <h2>💬 Chat with Image Support</h2>
      <ChatWithImageUpload roomId={roomId} token={token} />
      
      <hr />
      
      <h2>🤖 AI Copilot with Image Support</h2>
      <AiCopilotWithImage token={token} />
    </div>
  );
};