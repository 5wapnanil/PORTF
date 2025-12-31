const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const DB_FILE = 'projects.json';
const MESSAGES_FILE = 'messages.json';

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
}

const readProjects = () => {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

const writeProjects = (projects) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(projects, null, 2));
};

const readMessages = () => {
  const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
  return JSON.parse(data);
};

const writeMessages = (messages) => {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
};

app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    const { heading, description, techStacks, githubLink, liveLink } = req.body;
    const projects = readProjects();
    const project = {
      _id: Date.now().toString(),
      heading,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      techStacks: JSON.parse(techStacks),
      githubLink,
      liveLink,
      createdAt: new Date().toISOString()
    };
    projects.push(project);
    writeProjects(projects);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', upload.single('image'), async (req, res) => {
  try {
    const { heading, description, techStacks, githubLink, liveLink } = req.body;
    const projects = readProjects();
    const index = projects.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        heading,
        description,
        techStacks: JSON.parse(techStacks),
        githubLink,
        liveLink
      };
      if (req.file) {
        projects[index].image = `/uploads/${req.file.filename}`;
      }
      writeProjects(projects);
      res.json(projects[index]);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projects = readProjects();
    const filtered = projects.filter(p => p._id !== req.params.id);
    writeProjects(filtered);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const messages = readMessages();
    const newMessage = {
      _id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    writeMessages(messages);
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = readMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const messages = readMessages();
    const filtered = messages.filter(m => m._id !== req.params.id);
    writeMessages(filtered);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
