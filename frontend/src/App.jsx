import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';
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

const calculatorProps = { step, setStep, calcState, setCalcState, formData, setFormData, isSubmitting, handleSubmit, results, isStep1Valid, isStep2Valid, isStep3Valid, isFormValid, handleSliderChange, getSliderBackground, fmt, showResult };

  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home {...calculatorProps} />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;