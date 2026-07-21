import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Cookiebanner.css';

export default function Cookiebanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Granulare Auswahl (Punkt 4)
  const [preferences, setPreferences] = useState({
    statistics: false,
    marketing: false
  });

  const TRACKING_ID = 'G-5GVE6GGBKS'; // Hier deine Google Analytics/Ads ID eintragen

  useEffect(() => {
    const savedData = localStorage.getItem('waermepumpen_consent');
    
    if (!savedData) {
      setIsVisible(true);
    } else {
      const parsed = JSON.parse(savedData);
      
      // Punkt 8: Nach ~12 Monaten (365 Tage) erneut abfragen
      const ageInMs = Date.now() - new Date(parsed.timestamp).getTime();
      const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
      
      if (ageInMs > oneYearInMs) {
        setIsVisible(true);
      } else {
        setPreferences(parsed.consent);
        applyScripts(parsed.consent);
      }
    }

    // Punkt 6: Custom Event Listener, um Banner aus dem Footer zu öffnen
    const openBanner = () => {
      setIsVisible(true);
      setShowSettings(true);
    };
    window.addEventListener('openCookieBanner', openBanner);
    return () => window.removeEventListener('openCookieBanner', openBanner);
  }, []);

  const applyScripts = (consent) => {
    // Analytics laden, falls zugestimmt
    if (consent.statistics || consent.marketing) {
      if (!document.getElementById('gtag-script')) {
        const script = document.createElement('script');
        script.id = 'gtag-script';
        script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`;
        script.async = true;
        document.head.appendChild(script);

        const scriptConfig = document.createElement('script');
        scriptConfig.id = 'gtag-config';
        scriptConfig.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${TRACKING_ID}', { 
            'anonymize_ip': true,
            'allow_ad_personalization_signals': ${consent.marketing}
          });
        `;
        document.head.appendChild(scriptConfig);
      }
    }
  };

  const removeCookiesAndTracking = () => {
    // Punkt 10: Tracking hart deaktivieren und Cookies löschen
    window[`ga-disable-${TRACKING_ID}`] = true;
    
    const cookiesToClear = ['_ga', `_ga_${TRACKING_ID}`, '_gcl_au', '_gid'];
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
  };

  const saveConsent = (newConsent) => {
    const isUpdate = localStorage.getItem('waermepumpen_consent') !== null;

    // Punkt 8: Speicherung mit Timestamp und Version
    const data = {
      consent: newConsent,
      timestamp: new Date().toISOString(),
      version: "1.1" // Bei zukünftigen Textänderungen hochzählen
    };
    
    localStorage.setItem('waermepumpen_consent', JSON.stringify(data));
    setPreferences(newConsent);
    setIsVisible(false);

    if (isUpdate) {
      // Wenn der User widerruft, Cookies hart löschen und Seite neu laden, 
      // um alle laufenden JS-Instanzen im RAM zu killen.
      removeCookiesAndTracking();
      window.location.reload();
    } else {
      applyScripts(newConsent);
    }
  };

  const handleAcceptAll = () => saveConsent({ statistics: true, marketing: true });
  const handleAcceptEssential = () => saveConsent({ statistics: false, marketing: false });
  const handleSaveSettings = () => saveConsent(preferences);

  if (!isVisible) return null;

  return (
    <div className="custom-cookie-banner">
      <div className="cookie-content">
        <h4>Ihre Privatsphäre ist uns wichtig</h4>
        
        {/* Punkt 9: Konkrete Nennung der Zwecke, Dienste und Drittlandtransfer */}
        <p>
          Wir nutzen Cookies und ähnliche Technologien, um den reibungslosen Betrieb unserer Website zu gewährleisten (Essenziell). 
          Mit Ihrer Zustimmung verwenden wir <strong>Google Analytics</strong> zur statistischen Auswertung (Statistik) 
          sowie <strong>Google Ads</strong> zur Erfolgsmessung unserer Werbekampagnen (Marketing). 
          <br /><br />
          Ihre Einwilligung umfasst auch die mögliche Datenübermittlung in die USA (Art. 49 Abs. 1 lit. a DSGVO), 
          wo derzeit kein mit der EU vergleichbares Datenschutzniveau garantiert werden kann. 
          Sie können diese Auswahl jederzeit über den Link "Cookie-Einstellungen" im Footer widerrufen.
          <br /><br />
          {/* Punkt 7: Verlinkungen direkt auf der ersten Ebene */}
          Weitere Details finden Sie in unserer <Link to="/datenschutz" className="cookie-link">Datenschutzerklärung</Link> und im <Link to="/impressum" className="cookie-link">Impressum</Link>.
        </p>

        {showSettings && (
          <div className="cookie-settings-panel">
            <label className="cookie-checkbox">
              <input type="checkbox" checked disabled />
              <span><strong>Essenziell:</strong> Technisch notwendige Cookies zum Betrieb der Website.</span>
            </label>
            <label className="cookie-checkbox">
              <input 
                type="checkbox" 
                checked={preferences.statistics} 
                onChange={(e) => setPreferences({...preferences, statistics: e.target.checked})} 
              />
              <span><strong>Statistik:</strong> Google Analytics zur pseudonymisierten Auswertung des Nutzerverhaltens.</span>
            </label>
            <label className="cookie-checkbox">
              <input 
                type="checkbox" 
                checked={preferences.marketing} 
                onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})} 
              />
              <span><strong>Marketing:</strong> Google Ads Conversion Tracking zur Erfolgsmessung von Werbeanzeigen.</span>
            </label>
          </div>
        )}
      </div>

      <div className="cookie-actions">
        {/* Punkt 5: Gleichwertige Buttons ohne Dark Patterns */}
        <div className="cookie-buttons">
          <button className="btn-cookie" onClick={handleAcceptEssential}>Nur Essenzielle</button>
          {showSettings ? (
            <button className="btn-cookie" onClick={handleSaveSettings}>Auswahl speichern</button>
          ) : (
            <button className="btn-cookie" onClick={() => setShowSettings(true)}>Einstellungen</button>
          )}
          <button className="btn-cookie" onClick={handleAcceptAll}>Alle akzeptieren</button>
        </div>
      </div>
    </div>
  );
}