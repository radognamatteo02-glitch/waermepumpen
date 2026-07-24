import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Cookiebanner.css';

/**
 * Voraussetzung in index.html (VOR dem GTM-Snippet):
 *
 *   <script>
 *     window.dataLayer = window.dataLayer || [];
 *     function gtag(){dataLayer.push(arguments);}
 *     gtag('consent', 'default', {
 *       ad_storage: 'denied', ad_user_data: 'denied',
 *       ad_personalization: 'denied', analytics_storage: 'denied',
 *       functionality_storage: 'granted', security_storage: 'granted',
 *       wait_for_update: 500
 *     });
 *   </script>
 *
 * Ohne diesen Block feuert GTM Tags vor der Einwilligung.
 * Das <noscript>-iframe von GTM muss aus dem <body> entfernt werden.
 *
 * Im GTM-Container zusaetzlich pro Tag die zusaetzliche Einwilligungspruefung
 * setzen (analytics_storage fuer GA4, ad_storage + ad_user_data fuer Ads).
 */

const GA_ID = 'G-5GVE6GGBKS';        // nur fuer den ga-disable Fallback
const STORAGE_KEY = 'waermepumpen_consent';
const CONSENT_VERSION = '2.0';        // GTM-Umstellung -> erneute Abfrage
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

// Marketing-Kategorie erst anzeigen, wenn im GTM-Container tatsaechlich
// Ads-/Remarketing-Tags konfiguriert sind.
const HAS_MARKETING_TAGS = false;

const EMPTY_CONSENT = { statistics: false, marketing: false };

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  return window.gtag;
}

/** Consent-Signal an GTM. Der Container entscheidet, welche Tags feuern. */
function pushConsent(consent) {
  const gtag = ensureGtag();

  gtag('consent', 'update', {
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
    analytics_storage: consent.statistics ? 'granted' : 'denied',
  });

  // Fallback, falls im Container ein GA4-Tag ohne Consent-Pruefung haengt.
  window[`ga-disable-${GA_ID}`] = !consent.statistics;

  // Eigenes Event fuer Trigger im Container.
  window.dataLayer.push({
    event: 'consent_update',
    consent_statistics: consent.statistics,
    consent_marketing: consent.marketing,
  });
}

/** Bei Widerruf: gesetzte Cookies aktiv entfernen. */
function clearTrackingCookies() {
  const measurementId = GA_ID.replace(/^G-/, '');
  const names = ['_ga', `_ga_${measurementId}`, '_gid', '_gcl_au', '_gcl_aw', '_gac_gb'];
  const host = window.location.hostname;
  const domains = ['', `; domain=${host}`, `; domain=.${host}`];

  names.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    });
  });
}

function readStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.consent !== 'object' || !parsed.timestamp) return null;
    if (parsed.version !== CONSENT_VERSION) return null;

    const age = Date.now() - new Date(parsed.timestamp).getTime();
    if (!Number.isFinite(age) || age > CONSENT_MAX_AGE_MS) return null;

    return {
      statistics: parsed.consent.statistics === true,
      marketing: parsed.consent.marketing === true,
    };
  } catch {
    return null;
  }
}

export default function Cookiebanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(EMPTY_CONSENT);

  useEffect(() => {
    const stored = readStoredConsent();

    if (stored) {
      setPreferences(stored);
      pushConsent(stored);
    } else {
      // Kein gueltiger Consent: Defaults aus index.html bleiben auf denied.
      window[`ga-disable-${GA_ID}`] = true;
      setIsVisible(true);
    }

    const openBanner = () => {
      setPreferences(readStoredConsent() || EMPTY_CONSENT);
      setShowSettings(true);
      setIsVisible(true);
    };
    window.addEventListener('openCookieBanner', openBanner);
    return () => window.removeEventListener('openCookieBanner', openBanner);
  }, []);

  const saveConsent = (newConsent) => {
    const previous = readStoredConsent();
    const isRevocation =
      previous &&
      ((previous.statistics && !newConsent.statistics) ||
        (previous.marketing && !newConsent.marketing));

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        consent: newConsent,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      })
    );

    setPreferences(newConsent);
    setIsVisible(false);
    setShowSettings(false);

    pushConsent(newConsent);
    if (isRevocation) clearTrackingCookies();
  };

  const acceptAll = () =>
    saveConsent({ statistics: true, marketing: HAS_MARKETING_TAGS });
  const acceptEssential = () => saveConsent(EMPTY_CONSENT);
  const saveSelection = () => saveConsent(preferences);

  if (!isVisible) return null;

  return (
    <div
      className="custom-cookie-banner"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="cookie-content">
        <h4 id="cookie-banner-title">Ihre Privatsphäre ist uns wichtig</h4>

        <p>
          Wir nutzen Cookies und ähnliche Technologien, um den Betrieb unserer
          Website zu gewährleisten (essenziell). Mit Ihrer Einwilligung setzen
          wir über den <strong>Google Tag Manager</strong> zusätzlich{' '}
          <strong>Google Analytics</strong> zur statistischen Auswertung ein
          {HAS_MARKETING_TAGS && (
            <>
              {' '}sowie <strong>Google Ads</strong> zur Erfolgsmessung unserer
              Werbekampagnen
            </>
          )}
          .
          <br />
          <br />
          Dabei können personenbezogene Daten an Google Ireland Ltd. und Google
          LLC in die USA übermittelt werden. Google LLC ist unter dem EU-US Data
          Privacy Framework zertifiziert. Rechtsgrundlage ist Ihre Einwilligung
          nach Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Sie können Ihre
          Auswahl jederzeit mit Wirkung für die Zukunft über
          „Cookie-Einstellungen“ im Footer ändern oder widerrufen.
          <br />
          <br />
          Weitere Details finden Sie in unserer{' '}
          <Link to="/datenschutz" className="cookie-link">
            Datenschutzerklärung
          </Link>{' '}
          und im{' '}
          <Link to="/impressum" className="cookie-link">
            Impressum
          </Link>
          .
        </p>

        {showSettings && (
          <div className="cookie-settings-panel">
            <label className="cookie-checkbox">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Essenziell:</strong> Technisch notwendige Cookies zum
                Betrieb der Website. Immer aktiv.
              </span>
            </label>

            <label className="cookie-checkbox">
              <input
                type="checkbox"
                checked={preferences.statistics}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, statistics: e.target.checked }))
                }
              />
              <span>
                <strong>Statistik:</strong> Google Analytics zur
                pseudonymisierten Auswertung des Nutzerverhaltens.
              </span>
            </label>

            {HAS_MARKETING_TAGS && (
              <label className="cookie-checkbox">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, marketing: e.target.checked }))
                  }
                />
                <span>
                  <strong>Marketing:</strong> Google Ads Conversion-Tracking zur
                  Erfolgsmessung von Werbeanzeigen.
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      <div className="cookie-actions">
        <div className="cookie-buttons">
          <button type="button" className="btn-cookie" onClick={acceptEssential}>
            Nur Essenzielle
          </button>
          {showSettings ? (
            <button type="button" className="btn-cookie" onClick={saveSelection}>
              Auswahl speichern
            </button>
          ) : (
            <button
              type="button"
              className="btn-cookie btn-cookie-secondary"
              onClick={() => setShowSettings(true)}
            >
              Einstellungen
            </button>
          )}
          <button type="button" className="btn-cookie" onClick={acceptAll}>
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}