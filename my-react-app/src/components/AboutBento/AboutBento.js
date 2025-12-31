import { gsap } from 'gsap';
import { useRef } from 'react';
import './AboutBento.css';

const AboutBento = () => {
  const particlePoolRef = useRef([]);
  const lastParticleTimeRef = useRef(0);

  const createParticle = (x, y, container) => {
    const now = Date.now();
    if (now - lastParticleTimeRef.current < 50) return;
    lastParticleTimeRef.current = now;

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  };

  const handleMouseMove = (e, cardRef) => {
    if (!cardRef) return;
    
    const card = cardRef;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    if (Math.random() > 0.85) {
      createParticle(e.clientX, e.clientY, card);
    }
  };

  const handleMouseLeave = (cardRef) => {
    if (!cardRef) return;
    
    gsap.to(cardRef, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  return (
    <div className="about-bento-container">
      <div className="about-bento-grid">
        <div 
          className="bento-card about-card"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div className="card-glow"></div>
          <div className="card-content">
            <h2 className="card-title">About Me</h2>
            <p className="card-description">
              Passionate Full Stack Developer with expertise in building modern, scalable web applications. 
              I specialize in React, Node.js, and cloud technologies, creating seamless user experiences 
              with clean, maintainable code.
            </p>
          </div>
        </div>

        <div 
          className="bento-card education-card"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div className="card-glow"></div>
          <div className="card-content">
            <h2 className="card-title">Education</h2>
            <div className="education-item">
              <h3>Bachelor of Technology in Computer Science and Engineering</h3>
              <p className="education-field">Heritage Institute of Technology</p>
              <p className="education-year">2024 - 2028</p>
              <p className="education-description">Specialized in Software Engineering and Web Development. Completed various projects including web applications, mobile apps, and database systems.</p>
            </div>
            <div className="education-item">
              <h3>Full Stack Web Development Bootcamp</h3>
              <p className="education-field">Hack Tropica</p>
              <p className="education-year">15 Dec 2025 - 21 Dec 2025</p>
              <p className="education-description">Intensive bootcamp covering modern web technologies including React, Node.js, MongoDB, and various other frameworks and tools.</p>
            </div>
            <div className="education-item">
              <h3>High School Diploma</h3>
              <p className="education-field">Behala Aryya Vidyamandir</p>
              <p className="education-year">2010 - 2024</p>
              <p className="education-description">Completed high school with focus on Mathematics and Science. Participated in various coding competitions and tech clubs.</p>
            </div>
          </div>
        </div>

        <div 
          className="bento-card experience-card"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="stat-number">5+</div>
            <p className="stat-label">Years Experience</p>
          </div>
        </div>

        <div 
          className="bento-card projects-card"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
        >
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="stat-number">30+</div>
            <p className="stat-label">Projects Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBento;
