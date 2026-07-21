import React, { useState, useEffect } from 'react';
import './styles/CookieBanner.css';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prüfen, ob der Nutzer bereits eine Wahl getroffen hat
    const consent = localStorage.getItem('waermepumpen_cookie_consent');
    
    if (!consent) {
      // Keine Entscheidung gefunden -> Banner anzeigen
      setIsVisible(true);
    } else if (consent === 'all') {
      // Nutzer hatte in der Vergangenheit zugestimmt -> Skripte laden
      loadTrackingScripts();
    }
  }, []);

  // Funktion zum dynamischen Laden der Tracking-Skripte
  const loadTrackingScripts = () => {
    // Verhindern, dass Skripte doppelt geladen werden
    if (!document.getElementById('analytics-script')) {
      console.log("Tracking-Skripte werden geladen...");
      
      // Beispiel: Google Analytics Script dynamisch einfügen
      const script = document.createElement('script');
      script.id = 'analytics-script';
      script.src = 'https://www.googletagmanager.com/gtag/js?id=DEINE_TRACKING_ID';
      script.async = true;
      document.head.appendChild(script);

      const scriptConfig = document.createElement('script');
      scriptConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'DEINE_TRACKING_ID');
      `;
      document.head.appendChild(scriptConfig);
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('waermepumpen_cookie_consent', 'all');
    setIsVisible(false);
    loadTrackingScripts(); // Skripte sofort nach Klick laden
  };

  const handleDecline = () => {
    // Nur essenzielle Cookies (also keine Tracking-Skripte laden)
    localStorage.setItem('waermepumpen_cookie_consent', 'essential');
    setIsVisible(false);
  };

  // Wenn der Banner nicht sichtbar sein soll, rendere nichts
  if (!isVisible) return null;

  return (
    <div className="custom-cookie-banner">
      <div className="cookie-content">
        <h4>Wir respektieren Ihre Privatsphäre</h4>
        <p>
          Wir verwenden Cookies, um unsere Website zu optimieren und Ihnen relevante Inhalte anzubieten. 
          Klicken Sie auf "Alle akzeptieren", um dem Tracking zuzustimmen.
        </p>
      </div>
      <div className="cookie-buttons">
        <button className="btn-decline" onClick={handleDecline}>Nur Essenzielle</button>
        <button className="btn-accept" onClick={handleAcceptAll}>Alle akzeptieren</button>
      </div>
    </div>
  );
}