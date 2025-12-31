import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DottedSurface from './components/Background/DottedSurface.tsx';
import LightRays from './components/Background/LightRays.tsx';
import FloatingLines from './components/FloatingLines/FloatingLines.tsx';
import ColorBends from './components/ColorBends/ColorBends.tsx';
import Lanyard from './components/Lanyard/Lanyard';
import PillNav from './components/Navigation/PillNav';
import TextPressure from './components/Hero/TextPressure';
import RotatingText from './components/Hero/RotatingText';
import ScrambledText from './components/Hero/ScrambledText';
import TargetCursor from './components/Cursor/TargetCursor';
import { SplineScene } from './components/ui/splite.tsx';
import AboutBento from './components/AboutBento/AboutBento';
import StickerPeel from './components/StickerPeel/StickerPeel';
import Projects from './components/Projects/Projects';
import AdminPanel from './components/AdminPanel/AdminPanel';
import ContactMe from './components/ContactMe/ContactMe';
import Messages from './components/Messages/Messages';
import img1 from './imgs/1-modified.png';
import img2 from './imgs/2-modified.png';
import img3 from './imgs/3-modified.png';
import img4 from './imgs/4-modified.png';
import img5 from './imgs/5-modified.png';
import img6 from './imgs/6-modified.png';
import img7 from './imgs/7-modified.png';
import img8 from './imgs/8-modified.png';
import img9 from './imgs/9-modified.png';
import img10 from './imgs/10-modified.png';
import img11 from './imgs/11-modified.png';
import img12 from './imgs/12-modified.png';
import img13 from './imgs/13-modified.png';
import img14 from './imgs/14-modified.png';
import img15 from './imgs/15-modified.png';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const aboutPageRef = useRef(null);
  const skillsPageRef = useRef(null);
  const projectsPageRef = useRef(null);
  const contactPageRef = useRef(null);
  const messagesPageRef = useRef(null);
  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const [activeHref, setActiveHref] = useState('#');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWrongCodeModal, setShowWrongCodeModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('portfolioUnlocked') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const animateToSection = (section) => {
    if (isAnimatingRef.current || currentSectionRef.current === section) return;
    
    isAnimatingRef.current = true;
    lastScrollTimeRef.current = Date.now(); // Set scroll time immediately
    currentSectionRef.current = section;
    
    if (section === 0) {
      setActiveHref('#');
    } else if (section === 1) {
      setActiveHref('#about');
    } else if (section === 2) {
      setActiveHref('#skills');
    } else if (section === 3) {
      setActiveHref('#projects');
    } else if (section === 4) {
      setActiveHref('#contact');
    } else if (section === 5) {
      setActiveHref('#messages');
    }

    if (aboutPageRef.current) {
      gsap.to(aboutPageRef.current, {
        y: section === 0 ? '100%' : section === 1 ? '0%' : '-100%',
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }

    if (skillsPageRef.current) {
      gsap.to(skillsPageRef.current, {
        y: section === 2 ? '0%' : section > 2 ? '-100%' : '100%',
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }

    if (projectsPageRef.current) {
      gsap.to(projectsPageRef.current, {
        y: section === 3 ? '0%' : section > 3 ? '-100%' : '100%',
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }

    if (contactPageRef.current) {
      gsap.to(contactPageRef.current, {
        y: section === 4 ? '0%' : section > 4 ? '-100%' : '100%',
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }

    if (messagesPageRef.current) {
      gsap.to(messagesPageRef.current, {
        y: section === 5 ? '0%' : '100%',
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }

    setTimeout(() => {
      isAnimatingRef.current = false;
      lastScrollTimeRef.current = Date.now(); // Reset after animation too
    }, 1250);
  };

  const handleNavClick = (href) => {
    // Check if trying to access locked pages
    if (!isUnlocked && (href === '#projects' || href === '#contact' || href === '#messages')) {
      setShowErrorModal(true);
      return;
    }
    
    if (href === '#about') {
      animateToSection(1);
    } else if (href === '#skills') {
      animateToSection(2);
    } else if (href === '#projects') {
      animateToSection(3);
    } else if (href === '#contact') {
      animateToSection(4);
    } else if (href === '#messages') {
      animateToSection(5);
    } else if (href === '#') {
      animateToSection(0);
    }
  };

  const handleSecretCode = () => {
    if (secretCode === 'Hello DEV!') {
      setIsUnlocked(true);
      localStorage.setItem('portfolioUnlocked', 'true');
      setSecretCode('');
      setShowSuccessModal(true);
    } else if (secretCode.trim() !== '') {
      setShowWrongCodeModal(true);
    }
  };

  const handleSkip = () => {
    setIsUnlocked(true);
    localStorage.setItem('portfolioUnlocked', 'true');
    setShowErrorModal(false);
  };

  const handleRestart = () => {
    setIsUnlocked(false);
    localStorage.removeItem('portfolioUnlocked');
    setShowErrorModal(false);
    setShowSuccessModal(false);
    setShowWrongCodeModal(false);
    setSecretCode('');
    animateToSection(0);
  };

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading with progress
    const loadData = async () => {
      setLoadProgress(20);
      
      // Fetch messages
      try {
        await fetch(`${API_URL}/api/messages`);
        setLoadProgress(50);
      } catch (error) {
        setLoadProgress(50);
      }
      
      // Fetch projects
      try {
        await fetch(`${API_URL}/api/projects`);
        setLoadProgress(80);
      } catch (error) {
        setLoadProgress(80);
      }
      
      // Complete loading
      setTimeout(() => {
        setLoadProgress(100);
        setTimeout(() => setLoading(false), 500);
      }, 500);
    };

    loadData();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const aboutPage = aboutPageRef.current;
    const skillsPage = skillsPageRef.current;
    const projectsPage = projectsPageRef.current;
    const contactPage = contactPageRef.current;
    const messagesPage = messagesPageRef.current;
    if (!aboutPage || !skillsPage || !projectsPage || !contactPage || !messagesPage) return;

    gsap.set(aboutPage, { y: '100%' });
    gsap.set(skillsPage, { y: '100%' });
    gsap.set(projectsPage, { y: '100%' });
    gsap.set(contactPage, { y: '100%' });
    gsap.set(messagesPage, { y: '100%' });

    // Reset to home page after loading
    if (!loading) {
      currentSectionRef.current = 0;
      setActiveHref('#');
    }

    const handleWheel = (e) => {
      e.preventDefault();
      
      // Block if animation is in progress
      if (isAnimatingRef.current) {
        return;
      }

      // Check if we're on projects page and if it's scrollable
      if (currentSectionRef.current === 3) {
        const projectsContainer = projectsPage.querySelector('.projects-container');
        if (projectsContainer) {
          const { scrollTop, scrollHeight, clientHeight } = projectsContainer;
          
          if (e.deltaY < 0 && scrollTop === 0) {
            animateToSection(2);
            return;
          }
          
          if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 1) {
            animateToSection(4);
            return;
          }
          
          // Allow scrolling within projects
          return;
        }
      }

      // Check if we're on messages page and if it's scrollable
      if (currentSectionRef.current === 5) {
        const messagesContainer = messagesPage.querySelector('.messages-container');
        if (messagesContainer) {
          const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
          
          if (e.deltaY < 0 && scrollTop === 0) {
            animateToSection(4);
            return;
          }
          
          if (e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 1) {
            // Allow scrolling within messages
            return;
          }
          
          // Allow scrolling within messages
          return;
        }
      }

      // Require a minimum scroll amount to trigger section change
      if (Math.abs(e.deltaY) < 3) {
        return;
      }

      if (e.deltaY > 0) {
        if (currentSectionRef.current === 0) {
          animateToSection(1);
        } else if (currentSectionRef.current === 1) {
          animateToSection(2);
        } else if (currentSectionRef.current === 2) {
          animateToSection(3);
        } else if (currentSectionRef.current === 3) {
          animateToSection(4);
        } else if (currentSectionRef.current === 4) {
          animateToSection(5);
        }
      } else if (e.deltaY < 0) {
        if (currentSectionRef.current === 5) {
          animateToSection(4);
        } else if (currentSectionRef.current === 4) {
          animateToSection(3);
        } else if (currentSectionRef.current === 3) {
          animateToSection(2);
        } else if (currentSectionRef.current === 2) {
          animateToSection(1);
        } else if (currentSectionRef.current === 1) {
          animateToSection(0);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [loading]);

  return (
    <div className="App" style={{height: '100vh', overflow: 'hidden', position: 'relative'}}>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <h2 style={{
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '30px'
          }}>Cooking my portfolio...</h2>
          <div style={{
            width: '400px',
            height: '8px',
            background: '#333',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              background: '#fff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            marginTop: '20px'
          }}>{loadProgress}%</p>
        </div>
      )}
      
      {isMobile && !loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '40px',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.4'
          }}>📱 Oops!</h2>
          <p style={{
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            lineHeight: '1.6',
            maxWidth: '500px'
          }}>This portfolio is not responsive for your device. Please visit it on a larger screen for the best experience.</p>
        </div>
      )}
      
      {!loading && !isMobile && (
      <>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none'}}>
        <div style={{pointerEvents: 'auto'}}>
          <PillNav
            items={[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#about' },
              { label: 'Skills', href: '#skills' },
              { label: 'Projects', href: '#projects' },
              { label: 'Contact Me', href: '#contact' },
              { label: 'Messages', href: '#messages' }
            ]}
            activeHref={activeHref}
            baseColor="#ffffff"
            pillColor="#000000"
            hoveredPillTextColor="#000000"
            pillTextColor="#ffffff"
            onNavClick={handleNavClick}
          />
        </div>
      </div>
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', background: '#000', zIndex: 1}}>
        <DottedSurface theme="dark" />
        <div style={{position: 'absolute', left: '100px', top: '50%', transform: 'translateY(-50%)'}}>
          <div style={{width: '600px', height: '120px'}}>
            <TextPressure
              text="SWAPNANIL GHOSH"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              minFontSize={60}
            />
          </div>
          <div style={{marginTop: '-30px', fontSize: '24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span>I'm </span>
            <div style={{overflow: 'hidden', height: '30px'}}>
              <RotatingText
                texts={['Full Stack Developer', 'Figma Designer', 'Kotlin Developer']}
                mainClassName="rotating-text-container"
                staggerFrom="last"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </div>
          </div>
          <div style={{marginTop: '30px'}}>
            <ScrambledText
              radius={70}
              duration={1.7}
              speed={0.5}
              scrambleChars=".:"
            >
              Driven by a passion for creating beautiful and functional digital experiences. I am a Full Stack Developer who enjoys building responsive, scalable, and user-focused web applications. I work comfortably across frontend and backend technologies. In addition, I develop modern Android applications using Kotlin. My goal is to combine clean design, solid architecture, and impactful functionality.
            </ScrambledText>
          </div>
          <div style={{marginTop: '30px', display: 'flex', gap: '20px'}}>
            <button className="glass-button cursor-target">My Works</button>
            <button className="glass-button cursor-target">Hire Me</button>
          </div>
          <div style={{marginTop: '30px', display: 'flex', gap: '15px'}}>
            <a 
              href="https://github.com/5wapnanil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-target"
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                color: '#fff',
                fontSize: '24px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://x.com/SgSwapnanil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-target"
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                color: '#fff',
                fontSize: '24px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/swapnanil-ghosh-289b46327" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-target"
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                color: '#fff',
                fontSize: '24px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/the._dream._blue?utm_source=qr&igsh=MXBrZW14NWpmeGdkOA==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-target"
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                color: '#fff',
                fontSize: '24px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
        <div style={{position: 'absolute', right: '50px', top: '50%', transform: 'translateY(-50%)', width: '800px', height: '800px'}}>
          <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
        </div>
      </div>

      <div ref={aboutPageRef} id="about" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', background: '#000', zIndex: 2, cursor: 'default'}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0}}>
          <LightRays 
            raysOrigin="top-center"
            raysColor="#2cb9dd"
            raysSpeed={0.8}
            lightSpread={1.2}
            rayLength={2.5}
            pulsating={true}
            fadeDistance={1.0}
            saturation={0.8}
            followMouse={true}
            mouseInfluence={0.15}
          />
        </div>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px 40px 40px', boxSizing: 'border-box', cursor: 'default', zIndex: 1}}>
          <AboutBento />
        </div>
        <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '100vh', zIndex: 10}}>
          <Lanyard position={[0, 0, 8]} gravity={[0, -40, 0]} fov={45} />
        </div>
      </div>
      <div ref={skillsPageRef} id="skills" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #8b5a3c 0%, #5c3d2e 100%)', zIndex: 3, cursor: 'default'}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 20px, rgba(0,0,0,0.1) 21px), repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 20px, rgba(0,0,0,0.1) 21px)', opacity: 0.5}}></div>
        
        <button 
          className="restart-button cursor-target"
          onClick={handleRestart}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 20,
            transition: 'all 0.3s ease',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          Restart
        </button>
        
        <button 
          className="hint-button cursor-target"
          onClick={() => setShowHint(!showHint)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(0px)';
          }}
        >
          <span style={{fontSize: '16px'}}>💡</span>
          Hint!
        </button>
        
        {showHint && (
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            zIndex: 19,
            minWidth: '200px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{marginBottom: '10px', fontSize: '16px', fontWeight: '700'}}>Tech Stack Numbers:</div>
            <div style={{lineHeight: '1.6'}}>
              CSS = 1<br/>
              JS = 2<br/>
              HTML = 3<br/>
              Python = 4<br/>
              Angular = 5<br/>
              GSAP = 6<br/>
              Node.js = 7<br/>
              MongoDB = 8<br/>
              ReactJS = 9<br/>
              Next.js = 10<br/>
              WebGL = 11<br/>
              Kotlin = 12<br/>
              React Native = 13<br/>
              GitHub = 14<br/>
              Vue.js = 15
            </div>
          </div>
        )}
        
        <div style={{position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 10}}>
          <h1 style={{color: '#fff', fontSize: '42px', fontWeight: '800', fontFamily: 'Inter, sans-serif', textAlign: 'center', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Skills That I Learned</h1>
        </div>
        
        <div style={{position: 'absolute', right: '50px', top: '150px', zIndex: 15, pointerEvents: 'none'}}>
          <p style={{color: '#fff', fontSize: '18px', fontWeight: '600', fontFamily: 'Inter, sans-serif', textAlign: 'center', margin: '0 0 20px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', maxWidth: '300px'}}>Place us in the correct place... We give you a secret code.</p>
          
          <div style={{marginTop: '250px', transform: 'rotate(-2deg)', pointerEvents: 'auto', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '12px', padding: '20px', background: 'rgba(139,90,60,0.3)', backdropFilter: 'blur(10px)', boxSizing: 'border-box', width: '300px'}}>
            <h3 style={{color: '#fff', fontSize: '16px', fontWeight: '700', fontFamily: 'Inter, sans-serif', margin: '0 0 15px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '1px'}}>Enter The Secret Code For Next Pages</h3>
            <input 
              type="text" 
              placeholder="Enter code..." 
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              onKeyPress={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  handleSecretCode();
                }
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                border: '2px solid rgba(255,255,255,0.6)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.9)',
                color: '#000',
                outline: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                marginBottom: '15px',
                boxSizing: 'border-box'
              }}
            />
            <button className="cursor-target" onClick={handleSecretCode} style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: '700',
              fontFamily: 'Inter, sans-serif',
              border: '2px solid rgba(255,255,255,0.6)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}>Check</button>
          </div>
        </div>

        <div style={{position: 'relative', width: '100%', height: '100%', padding: '160px 40px 40px 40px', boxSizing: 'border-box', overflow: 'hidden'}}>
          <StickerPeel imageSrc={img1} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 1200, y: 39 }} />
          <StickerPeel imageSrc={img2} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 200, y: 20 }} />
          <StickerPeel imageSrc={img3} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 320, y: 20 }} />
          <StickerPeel imageSrc={img4} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 1100, y: 20 }} />
          <StickerPeel imageSrc={img5} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 560, y: 20 }} />
          <StickerPeel imageSrc={img6} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 80, y: 160 }} />
          <StickerPeel imageSrc={img7} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 1250, y: 160 }} />
          <StickerPeel imageSrc={img8} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 320, y: 160 }} />
          <StickerPeel imageSrc={img9} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 440, y: 160 }} />
          <StickerPeel imageSrc={img10} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 1360, y: 30 }} />
          <StickerPeel imageSrc={img11} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 80, y: 300 }} />
          <StickerPeel imageSrc={img12} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 200, y: 300 }} />
          <StickerPeel imageSrc={img13} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 1120, y: 120 }} />
          <StickerPeel imageSrc={img14} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 440, y: 300 }} />
          <StickerPeel imageSrc={img15} width={120} rotate={0} peelBackHoverPct={20} peelBackActivePct={40} shadowIntensity={0.6} lightingIntensity={0.1} initialPosition={{ x: 560, y: 300 }} />
        </div>
      </div>
      <div ref={projectsPageRef} id="projects" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', background: '#000', zIndex: 4, cursor: 'default'}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0}}>
          <FloatingLines />
        </div>
        <div style={{position: 'relative', zIndex: 1, width: '100%', height: '100%'}}>
          <Projects onAdminClick={() => setShowAdmin(true)} />
        </div>
      </div>
      <div ref={contactPageRef} id="contact" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', background: '#000', zIndex: 5, cursor: 'default'}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0}}>
          <ColorBends
            colors={['#2cb9dd', '#9333ea', '#ffffff']}
            speed={0.5}
            mouseInfluence={0.3}
            autoRotate={0.5}
          />
        </div>
        <div style={{position: 'relative', zIndex: 1, width: '100%', height: '100%'}}>
          <ContactMe />
        </div>
      </div>
      <div ref={messagesPageRef} id="messages" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #8b5a3c 0%, #5c3d2e 100%)', zIndex: 6, cursor: 'default'}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 20px, rgba(0,0,0,0.1) 21px), repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 20px, rgba(0,0,0,0.1) 21px)', opacity: 0.5}}></div>
        <Messages />
      </div>
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </>
      )}
      
      {showErrorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h2 style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700'}}>Puzzle Required!</h2>
            <p style={{margin: '0 0 30px 0', fontSize: '16px', lineHeight: '1.6'}}>First try to solve the puzzle in the skill page, see the hints and follow the yellow lines.</p>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
              <button 
                onClick={() => {
                  setShowErrorModal(false);
                  animateToSection(2);
                }}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Try the Puzzle
              </button>
              <button 
                onClick={handleSkip}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Just Skip It
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h2 style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700'}}>🧠 Amazing!</h2>
            <p style={{margin: '0 0 30px 0', fontSize: '16px', lineHeight: '1.6'}}>You are crazy smart! Scientists should research on your brain. You unlocked the other pages!</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {showWrongCodeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h2 style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700'}}>❌ Wrong Code!</h2>
            <p style={{margin: '0 0 30px 0', fontSize: '16px', lineHeight: '1.6'}}>Please try again. You can use the hints and or restart from the start by clicking the restart button on the top.</p>
            <button 
              onClick={() => setShowWrongCodeModal(false)}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
