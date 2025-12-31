import { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel({ onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    image: null,
    techStacks: '',
    githubLink: '',
    liveLink: ''
  });
  const [editingId, setEditingId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
      fetchMessages();
    }
  }, [isLoggedIn]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.warn('Backend not available - projects fetch failed');
      setProjects([]);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.warn('Backend not available - messages fetch failed');
      setMessages([]);
    }
  };

  const handleLogin = () => {
    if (password === 'SWAPNANIL') {
      setIsLoggedIn(true);
    } else {
      alert('Wrong password!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('description', formData.description);
    data.append('techStacks', JSON.stringify(formData.techStacks.split(',').map(t => t.trim())));
    data.append('githubLink', formData.githubLink);
    data.append('liveLink', formData.liveLink);
    if (formData.image) {
      data.append('image', formData.image);
    }

    const url = editingId 
      ? `${API_URL}/api/projects/${editingId}`
      : `${API_URL}/api/projects`;
    
    await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      body: data
    });

    setFormData({ heading: '', description: '', image: null, techStacks: '', githubLink: '', liveLink: '' });
    setEditingId(null);
    fetchProjects();
  };

  const handleEdit = (project) => {
    setFormData({
      heading: project.heading,
      description: project.description,
      image: null,
      techStacks: project.techStacks.join(', '),
      githubLink: project.githubLink,
      liveLink: project.liveLink
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      await fetch(`${API_URL}/api/messages/${id}`, { method: 'DELETE' });
      fetchMessages();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-overlay">
        <div className="admin-login">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Admin Panel</h2>
        <p className="admin-description">
          This panel is for managing projects and messages. You can add, edit, and delete projects, as well as view and delete messages from visitors.
        </p>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => setActiveTab('messages')}
          >
            Messages ({messages.length})
          </button>
        </div>

        {activeTab === 'projects' && (
          <>
            <form onSubmit={handleSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Project Heading"
                value={formData.heading}
                onChange={(e) => setFormData({...formData, heading: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <input
                type="file"
                accept="image/*,image/gif"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              />
              <input
                type="text"
                placeholder="Tech Stacks (comma separated)"
                value={formData.techStacks}
                onChange={(e) => setFormData({...formData, techStacks: e.target.value})}
                required
              />
              <input
                type="url"
                placeholder="GitHub Link"
                value={formData.githubLink}
                onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
              />
              <input
                type="url"
                placeholder="Live Link"
                value={formData.liveLink}
                onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
              />
              <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
            </form>

            <div className="projects-list">
              <h3>Existing Projects</h3>
              {projects.map((project) => (
                <div key={project._id} className="project-item">
                  <span>{project.heading}</span>
                  <div>
                    <button onClick={() => handleEdit(project)}>Edit</button>
                    <button onClick={() => handleDelete(project._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'messages' && (
          <div className="messages-list">
            <h3>All Messages</h3>
            {messages.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              messages.map((message) => (
                <div key={message._id} className="message-item">
                  <div className="message-header">
                    <strong>{message.name}</strong>
                    <span className="message-email">{message.email}</span>
                    <span className="message-date">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="message-content">{message.message}</p>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteMessage(message._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
