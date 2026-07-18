import { Link } from 'react-router-dom';

export function Hero() {
  const handleScroll = (id) => {
    // Scrollt sanft zum Element, sobald React auf der Startseite ist
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  };

  return (
    <section id="hero" className="bg-light">
      <div className="container hero-container">
        <div className="eyebrow">Wärmepumpen-Beratung · Gifhorn · Wolfsburg · Braunschweig</div>
        <h1>Lohnt sich eine Wärme­pumpe für <em>Ihr</em> Zuhause?</h1>
        <div className="hero-flex">
          <div className="hero-text">
            <p>Mit wenigen Angaben erhalten Sie eine erste, sachliche Einschätzung für Ihr Zuhause. Im Anschluss meldet sich ein Fachbetrieb aus Ihrer Region und bespricht alles Weitere in Ruhe mit Ihnen.</p>
            <div className="hero-buttons">
              {/* Wir nutzen <Link to="/"> um sicherzustellen, dass wir auf der Home-Seite sind, und triggern das Scrollen */}
              <Link to="/" className="btn-primary" onClick={() => handleScroll('rechner')}>
                Kostenlos berechnen
              </Link>
              <Link to="/" className="btn-link" onClick={() => handleScroll('informationen')}>
                Wie funktioniert das?
              </Link>
            </div>
            <div className="hero-subtext">In rund 2 Minuten zu Ihrer persönlichen Einschätzung. Kostenlos und unverbindlich.</div>
          </div>
          <div className="hero-trust">Unabhängige Einschätzung<br/>Regionale Fachbetriebe<br/>Kostenlos & unverbindlich</div>
        </div>
      </div>
    </section>
  );
}

export function ImageBanner() {
  return (
    <div style={{ width: '100%', height: 'clamp(320px, 52vw, 640px)', overflow: 'hidden', background: 'rgb(231, 224, 210)' }}>
      <img src="/imgs/pexels-alpha-innotec-936418931-20046693.jpg" alt="Luft-Wärmepumpe im Garten eines Wohnhauses" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%', display: 'block' }} />
    </div>
  );
}

export function WarumWaermepumpe() {
  return (
    <section id="warum-waermepumpe" className="bg-light section-padding">
      <div className="container feature-split">
        <div className="feature-text">
          <div className="eyebrow">Warum eine Wärmepumpe</div>
          <h2>Heizen, das sich rechnet und Sie unabhängiger macht</h2>
          <p>Eine Wärmepumpe gewinnt den Großteil ihrer Energie aus der Außenluft. Sie kaufen keinen Brennstoff mehr ein, der jedes Jahr teurer werden kann, und machen sich Schritt für Schritt unabhängig von Öl, Gas und der steigenden CO₂-Abgabe. Wer eine Photovoltaik-Anlage hat, heizt einen Teil des Jahres sogar mit dem eigenen Strom vom Dach.</p>
        </div>
        <div className="feature-stats">
          <div className="stat-item">
            <div className="stat-title">4 bis 6 kWh</div>
            <div className="stat-desc">Wärme aus einer Kilowattstunde Strom. Der Rest kommt kostenlos aus der Umwelt.</div>
          </div>
          <div className="stat-item">
            <div className="stat-title">Bis zur Hälfte</div>
            <div className="stat-desc">geringere Heizkosten sind je nach Haus und alter Anlage realistisch.</div>
          </div>
          <div className="stat-item">
            <div className="stat-title">Staatlich gefördert</div>
            <div className="stat-desc">Der Heizungstausch wird über die BEG bezuschusst und senkt die Investition spürbar.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ablauf() {
  return (
    <section id="so-funktioniert-es" className="bg-light section-padding scroll-mt">
      <div className="container">
        <div className="eyebrow">Der Ablauf</div>
        <h2 className="max-w-18ch">Vom Rechner zur <em>persönlichen Beratung</em></h2>
        
        <div className="process-list">
          <div className="process-step">
            <div className="step-number">01</div>
            <div className="step-title"><h3>Rechner ausfüllen</h3></div>
            <p className="step-text">Drei kurze Fragen zu Ihrem Gebäude, in wenigen Minuten erledigt, ohne Anmeldung.</p>
          </div>
          <div className="process-step">
            <div className="step-number">02</div>
            <div className="step-title"><h3>Wir melden uns</h3></div>
            <p className="step-text">Ein Fachpartner aus der Region nimmt Kontakt mit Ihnen auf und beantwortet Ihre offenen Fragen.</p>
          </div>
          <div className="process-step">
            <div className="step-number">03</div>
            <div className="step-title"><h3>Beratung vor Ort</h3></div>
            <p className="step-text">Bei Interesse folgt eine Einschätzung direkt an Ihrem Haus, mit Blick auf Technik und Förderung.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Vergleich() {
  return (
    <section id="vergleich" className="bg-dark">
      <div className="compare-wrapper">
        <div className="compare-image-box">
          <img src="/imgs/c0773d3e-960c-49ec-ae25-8229367a3f88.jpg" alt="Wärmepumpe an einer Hausterrasse" />
        </div>
        <div className="compare-content">
          <div className="eyebrow eyebrow-light">Heute & mit Wärmepumpe</div>
          <h2 className="text-light mb-18">Was sich beim Heizen <em>verändert</em></h2>
          <p className="compare-intro">Der Wechsel betrifft nicht nur die Technik im Keller. Er verändert vor allem, wovon Ihre Heizkosten in Zukunft abhängen und wie gut sie sich planen lassen.</p>
          
          <div className="compare-cols">
            <div className="compare-col">
              <div className="compare-col-title title-muted">Heutige Heizung</div>
              <div className="compare-list text-muted-light">
                <div>Öl oder Gas wird verbrannt, der Brennstoff muss laufend nachgekauft werden.</div>
                <div>Die Preise folgen dem Weltmarkt und lassen sich kaum vorhersehen.</div>
                <div>Auf fossile Brennstoffe kommt Jahr für Jahr mehr CO₂-Abgabe hinzu.</div>
                <div>Für neue Öl- und Gasheizungen gelten zunehmend strengere Vorgaben.</div>
              </div>
            </div>
            <div className="compare-col">
              <div className="compare-col-title title-light">Mit Wärmepumpe</div>
              <div className="compare-list text-light-dim">
                <div>Der Großteil der Wärme kommt kostenlos aus der Außenluft.</div>
                <div>Betrieb mit Strom, auf Wunsch mit eigenem vom Dach.</div>
                <div>Ein eigener Wärmepumpentarif drückt die Stromkosten zusätzlich.</div>
                <div>Der Einbau wird über die BEG staatlich bezuschusst.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Wissen() {
  return (
    <section id="informationen" className="bg-light section-padding scroll-mt">
      <div className="container">
        <div className="eyebrow">Wissen</div>
        <h2 className="max-w-16ch mb-56">Gut zu <em>wissen</em></h2>

        <div className="info-row">
          <div className="info-image order-1">
            <img src="/imgs/f378725a-9de8-45bf-863c-f911b1c5431e.jpg" alt="Wärmepumpe an einem modernen Wohnhaus" />
          </div>
          <div className="info-text">
            <h3>Wie funktioniert eine Wärmepumpe?</h3>
            <p>Sie entzieht der Außenluft Wärme und hebt diese mit etwas Strom auf ein Niveau, das zum Heizen reicht. Aus einer Kilowattstunde Strom werden so, je nach System und Gebäude, mehrere Kilowattstunden Heizwärme. Der größere Teil der Energie stammt kostenlos aus der Umgebung.</p>
          </div>
        </div>

        <div className="info-row">
          <div className="info-text">
            <h3>Für wen kommt sie infrage?</h3>
            <p className="mb-20">Für deutlich mehr Häuser, als der alte Ruf vermuten lässt. Entscheidend ist nicht das Baujahr allein, sondern wie viel Wärme das Haus braucht und über welche Flächen es sie abgibt. Je niedriger die nötige Vorlauftemperatur, desto effizienter arbeitet die Anlage.</p>
            
            <div className="info-table">
              <div className="info-table-row">
                <span className="info-table-title">Neubau</span>
                <span className="info-table-desc">Fußbodenheizung und gute Dämmung, optimal, aber keine Förderung</span>
              </div>
              <div className="info-table-row">
                <span className="info-table-title">Sanierter Altbau</span>
                <span className="info-table-desc">neue Fenster, gedämmtes Dach, nahezu ideal</span>
              </div>
              <div className="info-table-row no-border">
                <span className="info-table-title">Unsanierter Altbau</span>
                <span className="info-table-desc">realisierbar, teils mit angepassten Heizkörpern</span>
              </div>
            </div>
            <p className="info-note">Sicherheit bringt am Ende der Blick auf Ihr konkretes Haus. Genau dafür ist die Vor-Ort-Beratung da.</p>
          </div>
          <div className="info-image">
            <img src="/imgs/6518835a-81c7-4819-b882-ab30e6b7c04f.jpg" alt="Wärmepumpe an einem Klinker-Altbau" />
          </div>
        </div>

        <div className="info-box-large">
          <h3>Was gilt bei der Förderung?</h3>
          <p>Für den Tausch alter Öl- und Gasheizungen gewährt der Staat über die Bundesförderung für effiziente Gebäude (BEG) Zuschüsse. Höhe und Voraussetzungen hängen von mehreren Faktoren ab und werden regelmäßig angepasst. Welche Sätze für Ihr Vorhaben gelten, klärt der Fachpartner mit Ihnen, verlässliche Zahlen gibt es nur im konkreten Fall.</p>
        </div>
      </div>
    </section>
  );
}