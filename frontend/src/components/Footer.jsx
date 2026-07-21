import { Link } from 'react-router-dom';

export default function Footer() {
  const openCookieSettings = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('openCookieBanner'));
  };

  return (
    <footer id="kontakt" className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* ... andere Footer-Spalten ... */}
          <div>
            <h4>Rechtliches</h4>
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutzerklärung</Link>
            {/* Punkt 6: Link zum Öffnen des Banners für Widerruf */}
            <a href="#" onClick={openCookieSettings} style={{ cursor: 'pointer' }}>
              Cookie-Einstellungen
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Wärmekompass</span>
          <span>Vermittlung an regionale Fachhandwerksbetriebe</span>
        </div>
      </div>
    </footer>
  );
}