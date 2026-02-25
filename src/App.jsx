import { useState } from 'react';
import profileImage from './assets/vishul_image.jpg';
import cvFile from './assets/Vishul-Chauhan-PYTHON-4-.pdf';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();

      if (!data || typeof data.output !== 'string') {
        throw new Error('Invalid response format');
      }

      setChat((prev) => [
        {
          user: trimmedMessage,
          bot: data.output,
        },
        ...prev,
      ]);
      setMessage('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="profile-card">
        <a
          className="profile-image-link"
          href={profileImage}
          target="_blank"
          rel="noreferrer"
          title="Open full-size photo"
        >
          <img
            className="profile-image"
            src={profileImage}
            alt="Vishul Chauhan"
          />
        </a>
        <div className="profile-content">
          <h1>Vishul Chauhan</h1>
          <p className="profile-subtitle">Python Developer | Data Engineer</p>
          <div className="contact-grid">
            <p className="contact-label">Email</p>
            <p className="contact-value">
              <a href="mailto:vishul.chauhan000@gmail.com">vishul.chauhan000@gmail.com</a>
            </p>

            <p className="contact-label">Phone</p>
            <p className="contact-value">
              <a href="tel:+917526952513">+91 7526952513</a>
            </p>

            <p className="contact-label">GitHub</p>
            <p className="contact-value">
              <a href="https://github.com/karlvc-projects" target="_blank" rel="noreferrer">https://github.com/karlvc-projects</a>
            </p>

            <p className="contact-label">LinkedIn</p>
            <p className="contact-value">
              <a href="https://www.linkedin.com/in/vishul-chauhan-104009184/" target="_blank" rel="noreferrer">https://www.linkedin.com/in/vishul-chauhan-104009184/</a>
            </p>

            <p className="contact-label">CV</p>
            <p className="contact-value">
              <a href={cvFile} download="Vishul-Chauhan-CV.pdf">Download CV (PDF)</a>
            </p>
          </div>
        </div>
      </header>

      <h2>CV Chat</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        rows={4}
      />

      <button onClick={handleSend} disabled={loading || !message.trim()}>
        {loading ? 'Sending...' : 'Send'}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="chat-list">
        {chat.map((item, index) => (
          <div key={index} className="chat-item">
            <p><strong>You:</strong> {item.user}</p>
            <p><strong>Vishul:</strong> {item.bot}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
