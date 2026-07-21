import React from 'react';
import CookieBanner from './components/CookieBanner';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    verbrauchKwh: 15000,
    heizverteilung: null
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
    // Beispielhafte Berechnung: Wärmepumpe macht aus 1 Teil Strom ca. 3.5 Teile Wärme
    const cop = 3.5; 
    const neueKwh = calcState.verbrauchKwh / cop;
    const ersparnisKwh = Math.round(calcState.verbrauchKwh - neueKwh);
    const ersparnisProzent = Math.round((ersparnisKwh / calcState.verbrauchKwh) * 100);

    setResults({ ersparnisKwh, ersparnisProzent });
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
      <CookieBanner />
    </Router>
  );
}

export default App;