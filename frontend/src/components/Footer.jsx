import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="kontakt" className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* ... andere Footer-Spalten ... */}
          <div>
            <h4>Rechtliches</h4>
            {/* WICHTIG: Link statt a verwenden */}
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutzerklärung</Link>
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