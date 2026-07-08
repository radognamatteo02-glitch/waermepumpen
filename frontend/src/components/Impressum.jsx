import { useEffect } from 'react';

export default function Impressum() {
  // Scrollt beim Laden der Seite ganz nach oben
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-main" style={{ padding: '120px 0 80px' }}>
      <div className="container-md">
        <article className="legal-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #DCD4C4' }}>
          <h1>Impressum</h1>
          <address style={{ fontStyle: 'normal', marginTop: '20px', lineHeight: '1.8' }}>
            <strong>Matteo Radogna</strong><br />
            Matteo Radogna Webdesign<br />
            Vorderer Kamp 46<br />
            25479 Ellerau<br />
            Deutschland             
          </address>
          
          <h2 style={{ marginTop: '30px' }}>Kontakt</h2>
          <p>
            Tel.: <a href="tel:+4917681282082">+49 176 81282082</a><br />
            E-Mail: <a href="mailto:matteo@radogna.de">matteo@radogna.de</a>
          </p>
          
          <h2 style={{ marginTop: '30px' }}>Umsatzsteuer</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer: DE337387849<br />
            Umsatzsteuerbefreit (Kleinunternehmerregelung)
          </p>
          
          <h2 style={{ marginTop: '30px' }}>Streitschlichtung</h2>
          <p>
            Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
          </p>
          
          <div className="legal-meta" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #DCD4C4', fontSize: '13px', color: '#a7b0a6' }}>
            <span>Stand: 12.04.2026</span>
          </div>
        </article>
      </div>
    </main>
  );
}