import { useEffect } from 'react';

export default function Datenschutz() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-main" style={{ padding: '120px 0 80px' }}>
      <div className="container-md">
        <article className="legal-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #DCD4C4', lineHeight: '1.8' }}>
          <h1>Datenschutzerklärung für die Website wärmekompass.de</h1>
          <p><strong>Stand: Juli 2026</strong></p>
          
          {/* ================= SEKTION 1 ================= */}
          <h2 style={{ marginTop: '30px' }}>1. Verantwortlicher</h2>
          <p>Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
          <address style={{ fontStyle: 'normal', margin: '15px 0', paddingLeft: '15px', borderLeft: '3px solid #234034' }}>
            <strong>Matteo Radogna</strong><br />
            Vorderer Kamp 46<br />
            25479 Ellerau<br />
            E-Mail: <a href="mailto:info@waermekompass.de">info@waermekompass.de</a>
          </address>
          {/* Interner Hinweis: Diese Angaben müssen mit dem Impressum übereinstimmen. Sobald sich die Rechtsform ändert (z. B. GbR mit Nisius oder weiteren Partnern), bitte hier anpassen. */}

          {/* ================= SEKTION 2 ================= */}
          <h2 style={{ marginTop: '30px' }}>2. Allgemeines zur Datenverarbeitung</h2>
          <p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung des Nutzers oder sofern eine gesetzliche Erlaubnis die Verarbeitung gestattet.</p>
          
          <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>Rechtsgrundlagen</h3>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung (z. B. für Cookies/Tracking)</li>
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung / vorvertragliche Maßnahmen (z. B. Bearbeitung einer Anfrage über den Wirtschaftlichkeitsrechner)</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – berechtigtes Interesse (z. B. Server-Logfiles, Absicherung der Website)</li>
          </ul>

          {/* ================= SEKTION 3 ================= */}
          <h2 style={{ marginTop: '30px' }}>3. Hosting</h2>
          <p>Unsere Website wird bei folgendem Hosting-Anbieter gehostet:</p>
          <p style={{ color: '#c0392b', fontWeight: '600' }}>Strato GmbH</p>
          
          <p>Mit dem Hosting-Anbieter besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO), der sicherstellt, dass der Anbieter die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet. Der Hosting-Anbieter erhebt in sog. Logfiles folgende Daten, die durch den Aufruf der Website automatisch übermittelt werden:</p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>IP-Adresse des anfragenden Endgeräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
            <li>verwendeter Browser und ggf. das Betriebssystem sowie der Name des Access-Providers</li>
          </ul>
          <p>Die Verarbeitung erfolgt auf Grundlage von <strong>Art. 6 Abs. 1 lit. f DSGVO</strong>. Unser berechtigtes Interesse liegt in der technisch fehlerfreien Darstellung und der Optimierung unserer Website sowie in der Gewährleistung der Sicherheit unserer informationstechnischen Systeme. Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich sind, in der Regel nach 7 bis 14 Tagen.</p>

          {/* ================= SEKTION 4 ================= */}
          <h2 style={{ marginTop: '30px' }}>4. Kontaktaufnahme und Wirtschaftlichkeitsrechner</h2>
          <p>Wenn Sie uns über das Kontakt- bzw. Anfrageformular oder den interaktiven Wirtschaftlichkeitsrechner auf unserer Website Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Daten (z. B. Name, E-Mail-Adresse, Telefonnummer, Postleitzahl/Ort, Angaben zu Immobilie und Heizsystem) zum Zwecke der Bearbeitung Ihrer Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
          <p>Rechtsgrundlage für die Verarbeitung ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong>, sofern Ihre Anfrage der Anbahnung eines Vertrags dient (z. B. Angebot für eine Wärmepumpe), bzw. <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigtes Interesse an der Beantwortung Ihrer Anfrage), sofern kein Vertragsschluss beabsichtigt ist.</p>
          <p>Die zu diesem Zweck erhobenen personenbezogenen Daten löschen wir, sobald die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.</p>

          {/* ================= SEKTION 5 ================= */}
          <h2 style={{ marginTop: '30px' }}>5. Weitergabe von Daten an Partnerunternehmen</h2>
          <p>Da wir als Vermittler für Wärmepumpen-Installationen auftreten, geben wir Ihre über das Formular bzw. den Rechner übermittelten Daten ausschließlich zum Zweck der Angebotserstellung und Terminvereinbarung an von uns beauftragte, ausführende Fachbetriebe weiter, insbesondere an:</p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>Nisius Heizungsbau GmbH &amp; Co. KG</strong>, Hauptstraße 67, 38547 Calberlah</li>
          </ul>
          <p>Diese Partnerbetriebe verarbeiten die Daten in eigener datenschutzrechtlicher Verantwortung zur Erstellung eines Angebots bzw. zur Durchführung der angefragten Leistung. Rechtsgrundlage der Weitergabe ist <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Erfüllung Ihres Anliegens) i. V. m. Ihrer Einwilligung, die Sie durch das Absenden des Formulars erteilen. Eine Weitergabe an weitere Dritte über die genannten Partner hinaus erfolgt nicht, es sei denn, Sie stimmen dem gesondert zu oder wir sind gesetzlich dazu verpflichtet.</p>
          {/* Hinweis zur Umsetzung: Sofern mehrere rechtlich eigenständige Partner beteiligt sind, sind sie datenschutzrechtlich als eigene Verantwortliche zu behandeln – das sollte vertraglich sauber geregelt sein. */}

          {/* ================= SEKTION 6 ================= */}
          <h2 style={{ marginTop: '30px' }}>6. Cookies und Tracking</h2>
          
          <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>6.1 Technisch notwendige Cookies</h3>
          <p>Wir setzen Cookies ein, die für den technischen Betrieb der Website zwingend erforderlich sind (z. B. zur Speicherung Ihrer Cookie-Einwilligung selbst, oder zur Bereitstellung des Rechners über mehrere Schritte hinweg). Rechtsgrundlage ist <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> bzw. <strong>§ 25 Abs. 2 TTDSG</strong>.</p>
          
          <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>6.2 Google Ads Conversion-Tracking</h3>
          <p>Diese Website nutzt den Dienst „Google Ads Conversion-Tracking“ der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland („Google“). Wenn Sie über eine von Google geschaltete Anzeige auf unsere Website gelangt sind, wird von Google Ads ein Cookie auf Ihrem Endgerät gespeichert. Dieses Cookie verliert nach 90 Tagen seine Gültigkeit und dient nicht der persönlichen Identifizierung. Besucht der Nutzer bestimmte Seiten unserer Website und ist das Cookie noch nicht abgelaufen, können wir und Google erkennen, dass der Nutzer auf die Anzeige geklickt hat und zu dieser Seite weitergeleitet wurde. Die durch das Conversion-Cookie erhaltenen Informationen dienen dazu, Conversion-Statistiken zu erstellen.</p>
          <p>Rechtsgrundlage ist Ihre Einwilligung gemäß <strong>Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG</strong>, die Sie über unseren Cookie-Banner erteilen bzw. widerrufen können. Es kann dabei zu einer Datenübermittlung an Server von Google LLC in die USA kommen; Google ist unter dem EU-US Data Privacy Framework zertifiziert.</p>
          
          <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>6.3 Google Analytics</h3>
          <p>Diese Website nutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited. Google Analytics verwendet Cookies bzw. vergleichbare Technologien, die eine Analyse der Benutzung der Website ermöglichen. Die dabei erzeugten Informationen werden in der Regel an einen Server von Google übertragen und dort gespeichert. Diese Verarbeitung erfolgt nur, wenn Sie zuvor über unseren Cookie-Banner eingewilligt haben (<strong>Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG</strong>). Die IP-Adresse wird, sofern von Google angeboten, gekürzt (IP-Anonymisierung), bevor eine Speicherung erfolgt.</p>
          
          <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>6.4 Cookie-Einwilligung</h3>
          <p>Beim ersten Besuch unserer Website werden Sie über das Cookie-Consent-Tool</p>
          <p style={{ color: '#c0392b', fontWeight: '600', display: 'none' }}>[PLATZHALTER: Name des eingesetzten Cookie-Consent-Tools noch offen — bitte ergänzen, z. B. Usercentrics, Cookiebot, Real Cookie Banner]</p>
          <p>gefragt, welchen der oben beschriebenen, nicht technisch notwendigen Cookies Sie zustimmen. Die entsprechenden Skripte (Google Ads, Google Analytics) werden erst nach Ihrer aktiven Einwilligung geladen. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über die Cookie-Einstellungen (Link im Footer der Website) widerrufen oder anpassen.</p>

          {/* ================= SEKTION 7 ================= */}
          <h2 style={{ marginTop: '30px' }}>7. Speicherdauer</h2>
          <p>Soweit im Rahmen dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, werden Ihre personenbezogenen Daten bei uns gelöscht, sobald sie für die Zwecke, für die sie erhoben wurden, nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten (z. B. aus dem Handels- oder Steuerrecht) entgegenstehen.</p>

          {/* ================= SEKTION 8 ================= */}
          <h2 style={{ marginTop: '30px' }}>8. Ihre Rechte als betroffene Person</h2>
          <p>Ihnen stehen gegenüber uns als für die Datenverarbeitung Verantwortlichem folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten zu:</p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p>Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren (Art. 77 DSGVO). Zuständig ist:</p>
          <p><strong>Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein (ULD)</strong>, Holstenstraße 98, 24103 Kiel</p>

          {/* ================= SEKTION 9 ================= */}
          <h2 style={{ marginTop: '30px' }}>9. Aktualität und Änderung dieser Datenschutzerklärung</h2>
          <p>Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.</p>
        </article>
      </div>
    </main>
  );
}