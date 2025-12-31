import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Projects.css';

function Projects({ onAdminClick }) {
  const [projects, setProjects] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const containerRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      const colors = [
        'linear-gradient(145deg, #4F46E5, #000)',
        'linear-gradient(210deg, #10B981, #000)',
        'linear-gradient(165deg, #F59E0B, #000)',
        'linear-gradient(195deg, #EF4444, #000)',
        'linear-gradient(225deg, #8B5CF6, #000)',
        'linear-gradient(135deg, #06B6D4, #000)',
        'linear-gradient(180deg, #EC4899, #000)',
        'linear-gradient(150deg, #14B8A6, #000)'
      ];
      const projectsWithColors = data.map((project, index) => ({
        ...project,
        gradient: colors[index % colors.length]
      }));
      setProjects(projectsWithColors);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: 0.45,
      ease: 'power3.out',
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = containerRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: 0.6, overwrite: true });
  };

  const toggleFlip = (projectId) => {
    setFlippedCards(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div 
      ref={containerRef}
      className="projects-container"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="chroma-overlay-full" />
      <div ref={fadeRef} className="chroma-fade-full" />
      <button className="admin-btn" onClick={onAdminClick}>Admin</button>
      <h1 className="projects-title">My Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card-wrapper">
            <div className={`project-card-inner ${flippedCards[project._id] ? 'flipped' : ''}`} style={{ '--card-gradient': project.gradient }}>
              <div className="project-card-front" onClick={() => toggleFlip(project._id)}>
                <div className="flip-hint-text">Flip the card</div>
                <div className="project-image-container">
                  {project.image && (
                    <img 
                      src={`${API_URL}${project.image}`} 
                      alt={project.heading}
                      className="project-image"
                    />
                  )}
                </div>
                <div className="project-content">
                  <h2 className="project-heading">{project.heading}</h2>
                  <div className="tech-stacks">
                    {project.techStacks.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="project-card-back" onClick={() => toggleFlip(project._id)}>
                <p className="project-description">{project.description}</p>
                <div className="project-links">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>
                      GitHub
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>
                      Live
                    </a>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleFlip(project._id); }} className="flip-back-btn">
                    Flip it
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
