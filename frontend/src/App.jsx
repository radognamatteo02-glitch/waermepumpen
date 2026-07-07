import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- State Management ---
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Rechner State
  const [step, setStep] = useState(1);
  const [calcState, setCalcState] = useState({
    wohnflaeche: 150,
    baujahr: 1985,
    daemmstandard: null,
    heizungsart: null,
    anlagenalter: 15,
    heizkosten: 2400,
    heizverteilung: null,
    strompreis: 30
  });

  const [formData, setFormData] = useState({ name: '', tel: '', email: '', plz: '', dsgvo: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Hilfsfunktionen ---
  const fmt = (n) => new Intl.NumberFormat('de-DE').format(n);

  const handleSliderChange = (key, value) => {
    setCalcState(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const getSliderBackground = (val, min, max) => {
    const percentage = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right, #234034 ${percentage}%, #DCD4C4 ${percentage}%)`;
  };

  // --- Rechner Logik ---
  const showResult = () => {
    let sparQuote = 0.34;
    if (calcState.heizungsart === 'oel') sparQuote += 0.08;
    else if (calcState.heizungsart === 'nachtspeicher') sparQuote += 0.12;
    else if (calcState.heizungsart === 'gas') sparQuote += 0.04;

    sparQuote += Math.min(0.12, (calcState.anlagenalter / 30) * 0.12);
    if (calcState.heizverteilung === 'fussboden') sparQuote += 0.05;
    else if (calcState.heizverteilung === 'normalkoerper') sparQuote -= 0.02;
    if (calcState.daemmstandard === 'kfw') sparQuote += 0.03;

    sparQuote -= Math.max(0, (calcState.strompreis - 30) / 100) * 0.4;
    sparQuote = Math.max(0.24, Math.min(0.52, sparQuote));

    const sparMinQ = Math.max(0.20, sparQuote - 0.06);
    const sparMaxQ = Math.min(0.58, sparQuote + 0.06);

    const erspMin = Math.round((calcState.heizkosten * sparMinQ) / 50) * 50;
    const erspMax = Math.round((calcState.heizkosten * sparMaxQ) / 50) * 50;
    const wpCostMin = Math.round((calcState.heizkosten - erspMax) / 50) * 50;
    const wpCostMax = Math.round((calcState.heizkosten - erspMin) / 50) * 50;

    const netInvest = 12000;
    const erspAvg = Math.max(200, (erspMin + erspMax) / 2);
    let amortYears = Math.round(netInvest / erspAvg);
    amortYears = Math.max(6, Math.min(13, amortYears));

    const sparProzent = Math.round(((erspMin + erspMax) / 2 / Math.max(1, calcState.heizkosten)) * 100);

    setResults({ sparProzent, wpCostMin, wpCostMax, erspMin, erspMax, amortYears });
    setStep('result');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = { ...formData, ...calcState };
      const response = await fetch('/api/save_leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setStep('success');
      } else {
        alert('Fehler beim Speichern: ' + (result.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      alert('Es gab ein Problem mit der Netzwerkverbindung. Bitte versuchen Sie es erneut.');
    }
    setIsSubmitting(false);
  };

  // Validierung
  const isStep1Valid = calcState.daemmstandard !== null;
  const isStep2Valid = calcState.heizungsart !== null;
  const isStep3Valid = calcState.heizverteilung !== null;
  const isFormValid = formData.name.trim() !== '' && formData.tel.trim() !== '' && formData.dsgvo;

  return (
    <>
      <header>
        <div className="top-bar">
          {/* ... Top Bar HTML in JSX (Klassen in className, style={{...}}) ... */}
        </div>
        <nav id="main-nav" className={isNavScrolled ? 'scrolled' : ''}>
          <div className="nav-content">
            <div className="nav-brand" onClick={() => window.scrollTo(0, 0)}>
              Wärmekompass
            </div>
            <div className="nav-links hide-mobile">
              <a href="#rechner">Rechner</a>
              <a href="#so-funktioniert-es">Ablauf</a>
            </div>
            <div className="nav-actions">
              <a href="#rechner" className="btn-primary">Kostenlos berechnen</a>
              <button id="mobile-menu-btn" className="show-mobile-flex" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                Menu
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div id="mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>
              <a href="#rechner">Rechner</a>
              <a href="#so-funktioniert-es">Ablauf</a>
            </div>
          )}
        </nav>
      </header>

      <section id="hero" className="bg-light">
        <div className="container hero-container">
          <div className="eyebrow">Wärmepumpen-Beratung</div>
          <h1>Lohnt sich eine Wärmepumpe für <em>Ihr</em> Zuhause?</h1>
        </div>
      </section>

      {/* --- RECHNER --- */}
      <section id="rechner" className="bg-sand">
        <div className="container-sm">
          <div className="calculator-card">
            
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: typeof step === 'number' ? `${step * 25}%` : '100%' }}></div>
            </div>

            <div className="card-body">
              {/* SCHRITT 1 */}
              {step === 1 && (
                <div className="calc-step">
                  <h3>Ihr Gebäude</h3>
                  
                  <div className="input-group">
                    <div className="flex-between"><label>Wohnfläche</label><span className="val-display">{calcState.wohnflaeche} m²</span></div>
                    <input type="range" min="50" max="400" value={calcState.wohnflaeche} className="slider" 
                           onChange={(e) => handleSliderChange('wohnflaeche', e.target.value)}
                           style={{ background: getSliderBackground(calcState.wohnflaeche, 50, 400) }} />
                  </div>

                  <div className="input-group">
                    <label>Dämmstandard</label>
                    <div className="options-grid">
                      {['ungedaemmt', 'teilsaniert', 'kfw'].map(opt => (
                        <div key={opt} 
                             className={`option-card ${calcState.daemmstandard === opt ? 'active' : ''}`} 
                             onClick={() => setCalcState({...calcState, daemmstandard: opt})}>
                          <div className="opt-title">{opt === 'ungedaemmt' ? 'Ungedämmt' : opt === 'teilsaniert' ? 'Teilsaniert' : 'KfW-Standard'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step-footer between">
                    <button className="btn-text" onClick={() => setStep(2)}>Überspringen</button>
                    <button className="btn-primary" disabled={!isStep1Valid} onClick={() => setStep(2)}>Weiter</button>
                  </div>
                </div>
              )}

              {/* SCHRITT 2 */}
              {step === 2 && (
                <div className="calc-step">
                  <h3>Ihre aktuelle Heizung</h3>
                  
                  <div className="input-group">
                    <label>Heizungsart</label>
                    <div className="options-grid sm">
                      {['oel', 'gas', 'nachtspeicher', 'pellets', 'andere'].map(opt => (
                        <div key={opt} 
                             className={`option-card ${calcState.heizungsart === opt ? 'active' : ''}`} 
                             onClick={() => setCalcState({...calcState, heizungsart: opt})}>
                          <div className="opt-title">{opt.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step-footer between">
                    <button className="btn-text" onClick={() => setStep(1)}>Zurück</button>
                    <button className="btn-primary" disabled={!isStep2Valid} onClick={() => setStep(3)}>Weiter</button>
                  </div>
                </div>
              )}

              {/* ... (Schritt 3 und 4 folgen analog dem Schema oben) ... */}
              
              {/* ERGEBNIS */}
              {step === 'result' && results && (
                <div className="calc-step">
                  <div className="result-highlight">
                    <span>Rund {results.sparProzent} % weniger Heizkosten pro Jahr</span>
                  </div>
                  <button className="btn-primary full-width" onClick={() => setStep('contact')}>Ergebnis mit einem Fachpartner besprechen</button>
                </div>
              )}

              {/* KONTAKTFORMULAR */}
              {step === 'contact' && (
                <div className="calc-step">
                  <h3>Ergebnis besprechen</h3>
                  <input type="text" placeholder="Vor- und Nachname" className="form-input" 
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="tel" placeholder="Telefon" className="form-input" 
                         value={formData.tel} onChange={e => setFormData({...formData, tel: e.target.value})} />
                  
                  <div className="checkbox-group">
                    <input type="checkbox" id="dsgvo" checked={formData.dsgvo} onChange={e => setFormData({...formData, dsgvo: e.target.checked})} />
                    <label htmlFor="dsgvo">Datenschutzerklärung zustimmen</label>
                  </div>

                  <button className="btn-primary full-width" disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? 'Wird gesendet...' : 'Kontakt aufnehmen'}
                  </button>
                </div>
              )}

              {/* ERFOLG */}
              {step === 'success' && (
                <div className="calc-step text-center">
                  <h3>Vielen Dank!</h3>
                  <p>Ihre Anfrage ist eingegangen.</p>
                  <button className="btn-outline mt-3" onClick={() => window.location.reload()}>Neue Berechnung starten</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="informationen" className="bg-sand pb-4">
        <div className="container-md">
          <h2>Was Hausbesitzer <em>oft fragen</em></h2>
          <div className="faq-accordion">
            {['Funktioniert eine Wärmepumpe auch im Altbau?', 'Wie laut ist eine Wärmepumpe?'].map((frage, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`}>
                <button className="faq-btn" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  {frage} <span className="faq-icon">+</span>
                </button>
                <div className="faq-content"><p>Hier steht die Antwort aus der HTML-Vorlage...</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="kontakt" className="footer">
         {/* Footer Inhalt */}
      </footer>
    </>
  );
}

export default App;