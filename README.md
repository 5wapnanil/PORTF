# Portfolio Website

A modern, interactive portfolio website built with React and Node.js featuring smooth animations, interactive puzzles, and a full-stack architecture.

## Features

- **Interactive UI**: Smooth page transitions with GSAP animations
- **Puzzle Game**: Skill-based puzzle to unlock additional pages
- **Admin Panel**: Manage projects and messages
- **Contact Form**: Visitors can send messages
- **Message Board**: Display visitor messages in a creative layout
- **Glass Morphism Design**: Modern UI with backdrop blur effects
- **Custom Cursor**: Interactive target cursor
- **3D Elements**: Spline 3D models and interactive stickers
- **Responsive Warning**: Mobile device detection with friendly message

## Tech Stack

### Frontend
- React.js
- GSAP (GreenSock Animation Platform)
- Spline (3D graphics)
- CSS3 with Glass Morphism
- WebGL

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- JSON file storage

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd porfolio
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../my-react-app
npm install
```

4. Create `.env` file in backend folder (optional)
```
PORT=5000
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd my-react-app
npm start
```
Frontend runs on `http://localhost:3000`

## Project Structure

```
porfolio/
├── backend/
│   ├── uploads/          # Uploaded project images
│   ├── messages.json     # Stored messages
│   ├── projects.json     # Stored projects
│   └── server.js         # Express server
├── my-react-app/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── imgs/         # Static images
│   │   └── App.js        # Main app component
│   └── public/
└── README.md
```

## Features Guide

### Puzzle System
- Navigate to Skills page
- Arrange tech stack stickers in correct positions
- Enter secret code: `Hello DEV!`
- Unlock Projects, Contact, and Messages pages

### Admin Panel
- Access via Projects page
- Password: `GOURAB_BABA`
- Manage projects (add, edit, delete)
- View and delete messages

### Navigation
- Use navigation menu or scroll to navigate
- Smooth transitions between sections
- Locked pages require puzzle completion

## Deployment

### Frontend (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository to hosting service
3. Set start command: `node server.js`

## License

MIT License - see LICENSE file for details

## Author

Swapnanil Ghosh
- GitHub: [@5wapnanil](https://github.com/5wapnanil)
- LinkedIn: [Swapnanil Ghosh](https://www.linkedin.com/in/swapnanil-ghosh-289b46327)
- Twitter: [@SgSwapnanil](https://x.com/SgSwapnanil)
- Instagram: [@the._dream._blue](https://www.instagram.com/the._dream._blue)

## Acknowledgments

- GSAP for animations
- Spline for 3D graphics
- React community for excellent tools and libraries
