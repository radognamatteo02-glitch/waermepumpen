import { useState } from 'react';
import Navbar from './components/Navbar';
import { Hero, ImageBanner, WarumWaermepumpe, Ablauf, Vergleich, Wissen } from './components/InfoSections';
import Faq from './components/Faq';
import Footer from './components/Footer';
import './index.css';

function App() {
  // --- Rechner State ---
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

  // --- Hilfsfunktionen ---
  const fmt = (n) => new Intl.NumberFormat('de-DE').format(n);

  const handleSliderChange = (key, value) => {
    setCalcState(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const getSliderBackground = (val, min, max) => {
    const percentage = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right, #234034 ${percentage}%, #DCD4C4 ${percentage}%)`;
  };

  // --- Rechner Berechnungslogik ---
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

  // Validierung für Buttons
  const isStep1Valid = calcState.daemmstandard !== null;
  const isStep2Valid = calcState.heizungsart !== null;
  const isStep3Valid = calcState.heizverteilung !== null;
  const isFormValid = formData.name.trim() !== '' && formData.tel.trim() !== '' && formData.dsgvo;

  return (
    <>
      <Navbar />
      <Hero />
      <ImageBanner />
      <WarumWaermepumpe />

      {/* --- RECHNER KOMPONENTE --- */}
      <section id="rechner" className="bg-sand">
        <div className="container-sm">
          <div className="section-header text-center">
            <div className="eyebrow">Der Rechner</div>
            <h2>Eine erste <em>Orientierung</em> in vier Schritten</h2>
          </div>

          <div className="calculator-card">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: typeof step === 'number' ? `${step * 25}%` : '100%' }}></div>
            </div>
            
            <div className="card-header">
              <span className="step-label">
                {step === 1 ? 'Schritt 1 von 4 · Gebäude' : 
                 step === 2 ? 'Schritt 2 von 4 · Heizung' : 
                 step === 3 ? 'Schritt 3 von 4 · Heizverteilung' : 
                 step === 4 ? 'Schritt 4 von 4 · Strompreis' : 
                 step === 'result' ? 'Ihr Ergebnis' : 
                 step === 'contact' ? 'Kontakt' : 'Gesendet'}
              </span>
            </div>
            
            <div className="card-body">
              {/* SCHRITT 1 */}
              {step === 1 && (
                <div className="calc-step">
                  <h3>Ihr Gebäude</h3>
                  <p className="step-desc">Diese Angaben bestimmen, wie viel Wärme Ihr Haus benötigt.</p>
                  
                  <div className="input-group">
                    <div className="flex-between"><label>Wohnfläche</label><span className="val-display">{calcState.wohnflaeche} m²</span></div>
                    <input type="range" min="50" max="400" value={calcState.wohnflaeche} className="slider" 
                           onChange={(e) => handleSliderChange('wohnflaeche', e.target.value)}
                           style={{ background: getSliderBackground(calcState.wohnflaeche, 50, 400) }} />
                    <div className="slider-labels"><span>50 m²</span><span>400 m²</span></div>
                  </div>

                  <div className="input-group">
                    <div className="flex-between"><label>Baujahr</label><span className="val-display">{calcState.baujahr}</span></div>
                    <input type="range" min="1950" max="2024" value={calcState.baujahr} className="slider" 
                           onChange={(e) => handleSliderChange('baujahr', e.target.value)}
                           style={{ background: getSliderBackground(calcState.baujahr, 1950, 2024) }} />
                    <div className="slider-labels"><span>1950</span><span>2024</span></div>
                  </div>

                  <div className="input-group">
                    <label>Dämmstandard</label>
                    <div className="options-grid">
                      {['ungedaemmt', 'teilsaniert', 'kfw'].map(opt => (
                        <div key={opt} 
                             className={`option-card ${calcState.daemmstandard === opt ? 'active' : ''}`} 
                             onClick={() => setCalcState({...calcState, daemmstandard: opt})}>
                          <div className="opt-title">{opt === 'ungedaemmt' ? 'Ungedämmt' : opt === 'teilsaniert' ? 'Teilsaniert' : 'KfW-Standard'}</div>
                          <div className="opt-desc">{opt === 'ungedaemmt' ? 'Vor 1980, keine Sanierung' : opt === 'teilsaniert' ? 'Fenster oder Dach erneuert' : 'Vollsaniert oder Neubau'}</div>
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
                  <p className="step-desc">Grundlage für den Vergleich mit einer Wärmepumpe.</p>
                  
                  <div className="input-group">
                    <label>Heizungsart</label>
                    <div className="options-grid sm">
                      {[
                        {val: 'oel', label: 'Öl'}, 
                        {val: 'gas', label: 'Gas'}, 
                        {val: 'nachtspeicher', label: 'Nachtspeicher'}, 
                        {val: 'pellets', label: 'Pellets'}, 
                        {val: 'andere', label: 'Andere'}
                      ].map(opt => (
                        <div key={opt.val} 
                             className={`option-card ${calcState.heizungsart === opt.val ? 'active' : ''}`} 
                             onClick={() => setCalcState({...calcState, heizungsart: opt.val})}>
                          <div className="opt-title">{opt.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="flex-between"><label>Alter der Anlage</label><span className="val-display">{calcState.anlagenalter === 30 ? '30+ Jahre' : `${calcState.anlagenalter} Jahre`}</span></div>
                    <input type="range" min="0" max="30" value={calcState.anlagenalter} className="slider" 
                           onChange={(e) => handleSliderChange('anlagenalter', e.target.value)}
                           style={{ background: getSliderBackground(calcState.anlagenalter, 0, 30) }} />
                    <div className="slider-labels"><span>neu</span><span>30+ Jahre</span></div>
                  </div>

                  <div className="input-group">
                    <div className="flex-between"><label>Aktuelle Heizkosten (Jahr)</label><span className="val-display">{fmt(calcState.heizkosten)} €</span></div>
                    <input type="range" min="500" max="8000" step="50" value={calcState.heizkosten} className="slider" 
                           onChange={(e) => handleSliderChange('heizkosten', e.target.value)}
                           style={{ background: getSliderBackground(calcState.heizkosten, 500, 8000) }} />
                    <div className="slider-labels"><span>500 €</span><span>8.000 €</span></div>
                  </div>

                  <div className="step-footer between">
                    <div className="footer-left">
                      <button className="btn-text" onClick={() => setStep(1)}>Zurück</button>
                      <button className="btn-text" onClick={() => setStep(3)}>Überspringen</button>
                    </div>
                    <button className="btn-primary" disabled={!isStep2Valid} onClick={() => setStep(3)}>Weiter</button>
                  </div>
                </div>
              )}

              {/* SCHRITT 3 */}
              {step === 3 && (
                <div className="calc-step">
                  <h3>Heizverteilung im Haus</h3>
                  <p className="step-desc">Die Heizflächen beeinflussen, wie effizient eine Wärmepumpe arbeitet.</p>
                  
                  <div className="input-group">
                    <div className="options-list">
                      <div className={`option-card list-item ${calcState.heizverteilung === 'normalkoerper' ? 'active' : ''}`} onClick={() => setCalcState({...calcState, heizverteilung: 'normalkoerper'})}>
                        <div className="flex-1">
                          <div className="opt-title">Standard-Heizkörper</div>
                          <div className="opt-desc">Ältere Heizkörper, im Einzelfall zu prüfen</div>
                        </div>
                      </div>
                      <div className={`option-card list-item ${calcState.heizverteilung === 'niedertemperatur' ? 'active' : ''}`} onClick={() => setCalcState({...calcState, heizverteilung: 'niedertemperatur'})}>
                        <div className="flex-1">
                          <div className="opt-title">Niedertemperatur-Heizkörper</div>
                          <div className="opt-desc">Moderne, großflächige Heizkörper</div>
                        </div>
                      </div>
                      <div className={`option-card list-item ${calcState.heizverteilung === 'fussboden' ? 'active' : ''}`} onClick={() => setCalcState({...calcState, heizverteilung: 'fussboden'})}>
                        <div className="flex-1">
                          <div className="opt-title">Fußbodenheizung</div>
                          <div className="opt-desc">Niedrige Vorlauftemperatur, gut für Wärmepumpen</div>
                        </div>
                        <span className="badge">Geeignet</span>
                      </div>
                    </div>
                  </div>

                  <div className="step-footer between">
                    <div className="footer-left">
                      <button className="btn-text" onClick={() => setStep(2)}>Zurück</button>
                      <button className="btn-text" onClick={() => setStep(4)}>Überspringen</button>
                    </div>
                    <button className="btn-primary" disabled={!isStep3Valid} onClick={() => setStep(4)}>Weiter</button>
                  </div>
                </div>
              )}

              {/* SCHRITT 4 */}
              {step === 4 && (
                <div className="calc-step">
                  <h3>Ihr Strompreis</h3>
                  <p className="step-desc">Eine Wärmepumpe läuft mit Strom. Voreingestellt ist der deutsche Durchschnitt.</p>
                  
                  <div className="input-group">
                    <div className="flex-between"><label>Strompreis</label><span className="val-display">{calcState.strompreis} ct/kWh</span></div>
                    <input type="range" min="20" max="50" value={calcState.strompreis} className="slider" 
                           onChange={(e) => handleSliderChange('strompreis', e.target.value)}
                           style={{ background: getSliderBackground(calcState.strompreis, 20, 50) }} />
                    <div className="slider-labels"><span>20 ct</span><span>50 ct</span></div>
                  </div>
                  
                  <div className="info-box">
                    <div className="eyebrow sm">Zur Einordnung</div>
                    <p>Der Haushaltsstrompreis lag 2024 im Mittel bei rund 30 bis 32 ct/kWh. Mit einem gesonderten Wärmepumpentarif kann er niedriger ausfallen.</p>
                  </div>

                  <div className="step-footer between">
                    <div className="footer-left">
                      <button className="btn-text" onClick={() => setStep(3)}>Zurück</button>
                      <button className="btn-text" onClick={showResult}>Überspringen</button>
                    </div>
                    <button className="btn-primary" onClick={showResult}>Ergebnis ansehen</button>
                  </div>
                </div>
              )}

              {/* ERGEBNIS */}
              {step === 'result' && results && (
                <div className="calc-step">
                  <div className="text-center">
                    <h3>Eine Wärmepumpe <em>lohnt sich</em> für Ihr Haus</h3>
                    <p className="step-desc">So viel können Sie nach unserer Einschätzung beim Heizen sparen.</p>
                  </div>
                  
                  <div className="result-highlight">
                    <span>Rund {results.sparProzent} % weniger Heizkosten pro Jahr</span>
                  </div>
                  
                  <div className="result-grid">
                    <div className="res-card">
                      <div className="res-label">Heizkosten mit Wärmepumpe</div>
                      <div className="res-val">ca. {fmt(results.wpCostMin)} €</div>
                      <div className="res-sub">geschätzt pro Jahr</div>
                    </div>
                    <div className="res-card highlight">
                      <div className="res-label">Ihre Ersparnis pro Jahr</div>
                      <div className="res-val green">ca. {fmt(results.erspMin)} €</div>
                      <div className="res-sub">im Vergleich zu heute</div>
                    </div>
                    <div className="res-card">
                      <div className="res-label">Amortisation</div>
                      <div className="res-val">ca. {results.amortYears} bis {results.amortYears + 3} Jahre</div>
                      <div className="res-sub">inkl. Förderung, geschätzt</div>
                    </div>
                  </div>
                  
                  <p className="disclaimer">Die Werte beruhen auf vereinfachten Annahmen und dienen nur der groben Einordnung. Tatsächliche Kosten und Einsparungen hängen von vielen weiteren Faktoren ab. Diese Berechnung ersetzt keine Vor-Ort-Beratung.</p>
                  
                  <button className="btn-primary full-width" onClick={() => setStep('contact')}>Ergebnis mit einem Fachpartner besprechen</button>
                  <div className="text-center mt-2"><button className="btn-text" onClick={() => setStep(4)}>Zurück zu den Eingaben</button></div>
                </div>
              )}

              {/* KONTAKTFORMULAR */}
              {step === 'contact' && (
                <div className="calc-step">
                  <h3>Ergebnis besprechen</h3>
                  <p className="step-desc">Hinterlassen Sie Ihre Kontaktdaten, ein Fachpartner aus der Region meldet sich für ein unverbindliches Gespräch.</p>
                  
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" placeholder="Vor- und Nachname" className="form-input" 
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    
                    <label>Telefonnummer *</label>
                    <input type="tel" placeholder="z. B. 05374 123456" className="form-input" 
                           value={formData.tel} onChange={e => setFormData({...formData, tel: e.target.value})} />
                    
                    <div className="form-row">
                      <div className="flex-1"><label>E-Mail</label><input type="email" className="form-input" placeholder="ihre@email.de" 
                                                                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                      <div className="flex-1"><label>PLZ / Ort</label><input type="text" className="form-input" placeholder="38547 Calberlah" 
                                                                             value={formData.plz} onChange={e => setFormData({...formData, plz: e.target.value})} /></div>
                    </div>
                    
                    <div className="checkbox-group">
                      <input type="checkbox" id="dsgvo" checked={formData.dsgvo} onChange={e => setFormData({...formData, dsgvo: e.target.checked})} />
                      <label htmlFor="dsgvo">Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß der Datenschutzerklärung zu. Eine Weitergabe an Dritte erfolgt nicht.</label>
                    </div>
                  </div>
                  
                  <button className="btn-primary full-width" disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? 'Wird gesendet...' : 'Kontakt aufnehmen'}
                  </button>
                  <div className="text-center mt-2"><button className="btn-text" onClick={() => setStep('result')}>Zurück zum Ergebnis</button></div>
                </div>
              )}

              {/* ERFOLG */}
              {step === 'success' && (
                <div className="calc-step text-center">
                  <div className="success-icon">✓</div>
                  <h3>Vielen Dank!</h3>
                  <p className="step-desc">Ihre Anfrage ist eingegangen. Ein Fachpartner aus der Region wird sich bei Ihnen melden.</p>
                  <button className="btn-outline mt-3" onClick={() => window.location.reload()}>Neue Berechnung starten</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Ablauf />
      <Vergleich />
      <Wissen />
      <Faq />
      <Footer />
    </>
  );
}

export default App;