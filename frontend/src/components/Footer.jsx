export default function Footer() {
  return (
    <footer id="kontakt" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Wärmekompass</div>
            <p className="footer-desc">Unabhängige Orientierung rund um die Wärmepumpe für die Region Gifhorn · Wolfsburg · Braunschweig.</p>
          </div>
          <div>
            <h4>Kontakt</h4>
            <p>Wärmekompass<br/>Vorderer Kamp 46, 25479 Ellerau<br/>Telefon: <a href="tel:04023189900">0 176 8128 2082</a><br/><a href="mailto:info@waermekompass.de">info@waermekompass.de</a></p>
          </div>
          <div>
            <h4>Rechtliches</h4>
            <a href="rechtliches/impressum.html">Impressum</a>
            <a href="rechtliches/datenschutz.html">Datenschutzerklärung</a>
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