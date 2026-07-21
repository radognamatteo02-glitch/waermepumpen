import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Navbar.css';
export default function Navbar() {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // React Router Hooks für die Navigation
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Unsere eigene Scroll-Logik
  const scrollTo = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Schließt das mobile Menü automatisch

    if (location.pathname !== '/') {
      // Wenn der User auf einer Unterseite (z.B. Impressum) ist: 
      // Erst zur Startseite wechseln, kurz warten und dann scrollen
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Wenn der User schon auf der Startseite ist: Direkt scrollen
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <div className="top-bar">
        <div className="top-bar-content">
          <a href="tel:04023189900" className="top-bar-link" style={{ display: 'none' }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#7fa890" strokeWidth="1.4">
              <path d="M5.5 2.5 3 3.2c-.6.2-.9.8-.8 1.4.6 3.7 3.6 6.7 7.3 7.3.6.1 1.2-.2 1.4-.8l.7-2.5-2.7-1.1-1 1.3C6.9 8.2 5.4 6.7 4.7 5l1.3-1L5.5 2.5Z" strokeLinejoin="round"></path>
            </svg>
            <span className="top-bar-text">040 / 23 18 99 00</span>
            <span className="top-bar-sub hide-mobile">Rückruf anfordern</span>
          </a>

          {/* hide-mobile vom umschließenden <span> entfernt */}
          <a href="mailto:info@waermekompass.de" className="top-bar-link">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#7fa890" strokeWidth="1.4">
              <rect x="2" y="3.5" width="12" height="9" rx="1.2"></rect>
              <path d="m2.5 4.5 5.5 4 5.5-4" strokeLinejoin="round"></path>
            </svg>
            <span className="top-bar-text">info<span>@</span>waermekompass.de</span>
            {/* hide-mobile nur auf den Untertext angewendet, um Platz zu sparen */}
            <span className="top-bar-sub hide-mobile">Einfach per Mail anfragen</span>
          </a>
        </div>
      </div>
      
      <nav id="main-nav" className={isNavScrolled ? 'scrolled' : ''}>
        <div className="nav-content">
          <div className="nav-brand" onClick={(e) => scrollTo(e, 'root')} style={{ cursor: 'pointer' }}>
            <svg width="27" height="27" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13.5" stroke="#234034" strokeWidth="1"></circle><circle cx="16" cy="16" r="9.5" stroke="#234034" strokeWidth="0.7" opacity="0.28"></circle><path d="M16 6L19 16L16 16Z" fill="#234034"></path><path d="M16 6L13 16L16 16Z" fill="#234034" opacity="0.6"></path><path d="M16 26L19 16L16 16Z" fill="#234034" opacity="0.2"></path><path d="M16 26L13 16L16 16Z" fill="#234034" opacity="0.32"></path><circle cx="16" cy="16" r="1.5" fill="#234034"></circle><path d="M16 2.8v2M16 27.2v2M2.8 16h2M27.2 16h2" stroke="#234034" strokeWidth="1" strokeLinecap="round"></path></svg>
            <span>Wärmekompass</span>
          </div>
          
          <div className="nav-links hide-mobile">
            <a href="#rechner" onClick={(e) => scrollTo(e, 'rechner')}>Rechner</a>
            <a href="#so-funktioniert-es" onClick={(e) => scrollTo(e, 'so-funktioniert-es')}>Ablauf</a>
            <a href="#informationen" onClick={(e) => scrollTo(e, 'informationen')}>Wissen</a>
            <a href="#kontakt" onClick={(e) => scrollTo(e, 'kontakt')}>Kontakt</a>
          </div>
          
          <div className="nav-actions">
            <a href="#rechner" className="btn-primary hide-mobile" onClick={(e) => scrollTo(e, 'rechner')}>Kostenlos berechnen</a>
            
            <button id="mobile-menu-btn" className="show-mobile-flex" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="1.6" rx="0.8" fill="#1B2A20"></rect><rect y="6.2" width="20" height="1.6" rx="0.8" fill="#1B2A20"></rect><rect y="12.4" width="20" height="1.6" rx="0.8" fill="#1B2A20"></rect></svg>
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div id="mobile-menu" style={{ display: 'flex' }}>
            <a href="#rechner" onClick={(e) => scrollTo(e, 'rechner')}>Rechner</a>
            <a href="#so-funktioniert-es" onClick={(e) => scrollTo(e, 'so-funktioniert-es')}>Ablauf</a>
            <a href="#informationen" onClick={(e) => scrollTo(e, 'informationen')}>Wissen</a>
            <a href="#kontakt" onClick={(e) => scrollTo(e, 'kontakt')}>Kontakt</a>
            
            <a href="#rechner" className="btn-primary" style={{ marginTop: '12px', textAlign: 'center' }} onClick={(e) => scrollTo(e, 'rechner')}>
              Kostenlos berechnen
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}