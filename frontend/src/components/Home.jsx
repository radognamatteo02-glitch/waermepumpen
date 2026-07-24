import { Hero, ImageBanner, WarumWaermepumpe, Ablauf, Vergleich, Wissen } from './InfoSections';


//import CalculatorSection from './CalculatorSection'; // Falls du den Rechner-JSX-Teil auch auslagern willst, oder du lässt ihn hier drin
import Faq from './Faq';

export default function Home({ step, setStep, calcState, setCalcState, formData, setFormData, isSubmitting, handleSubmit, results, isStep1Valid, isStep2Valid, isStep3Valid, isFormValid, handleSliderChange, getSliderBackground, fmt, showResult }) {
  return (
    <>
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
              <div className="progress-bar" style={{ width: typeof step === 'number' ? `${(step / 3) * 100}%` : '100%' }}></div>
            </div>
            
            <div className="card-header">
              <span className="step-label">
                {step === 1 ? 'Schritt 1 von 3 – Gebäude' :
                step === 2 ? 'Schritt 2 von 3 – Heizung' :
                step === 3 ? 'Schritt 3 von 3 – Heizverteilung' :
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
                        {val: 'aeltere_wp', label: 'Ältere Wärmepumpe'},
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
                    <div className="flex-between"><label>Aktueller Verbrauch in kWh pro Jahr</label><span className="val-display">{fmt(calcState.verbrauchKwh)} kWh</span></div>
                    <input type="range" min="5000" max="40000" step="500" value={calcState.verbrauchKwh} className="slider"
                            onChange={(e) => handleSliderChange('verbrauchKwh', e.target.value)}
                          style={{ background: getSliderBackground(calcState.verbrauchKwh, 5000, 40000) }} />
                    <div className="slider-labels"><span>5.000 kWh</span><span>40.000 kWh</span></div>
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
                      </div>
                    </div>
                  </div>

                  <div className="step-footer between">
                    <div className="footer-left">
                      <button className="btn-text" onClick={() => setStep(2)}>Zurück</button>
                      <button className="btn-text" onClick={showResult}>Überspringen</button>
                    </div>
                    <button className="btn-primary" disabled={!isStep3Valid} onClick={showResult}>Ergebnis ansehen</button>
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
                    <span>Rund {results.ersparnisProzent} % weniger Heizkosten pro Jahr</span>
                  </div>
                  
                  <div className="result-grid">
                    <div className="res-card">
                      <div className="res-label">Ersparnis in kWh</div>
                      <div className="res-val green">{fmt(results.ersparnisKwh)} kWh</div>
                    </div>
                    <div className="res-card highlight">
                      <div className="res-label">Ersparnis in %</div>
                      <div className="res-val green">{results.ersparnisProzent} %</div>
                    </div>
                    <div className="res-card">
                      <div className="res-label">Förderung</div>
                      <div className="res-val">bis zu 80 %</div>
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
    </>
  );
}