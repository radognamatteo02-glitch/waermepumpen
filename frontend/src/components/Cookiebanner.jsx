import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Cookiebanner.css';

// Google Analytics 4 Measurement ID
const GA_ID = 'G-5GVE6GGBKS';
// Google Ads Conversion ID -- auf die echte ID setzen oder auf null lassen,
// dann wird die Marketing-Kategorie automatisch ausgeblendet.
const ADS_ID = null; // z. B. 'AW-123456789'

const STORAGE_KEY = 'waermepumpen_consent';
const CONSENT_VERSION = '1.2'; // bei Textaenderungen hochzaehlen -> erneute Abfrage
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const EMPTY_CONSENT = { statistics: false, marketing: false };

/** gtag-Stub, damit consent-Befehle auch vor dem Laden der Bibliothek greifen. */
function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  return window.gtag;
}

/** Consent Mode v2: vor jedem Tag-Laden auf "denied" setzen. */
function setConsentDefaults() {
  const gtag = ensureGtagStub();
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });
}

function updateConsentMode(consent) {
  const gtag = ensureGtagStub();
  gtag('consent', 'update', {
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
    analytics_storage: consent.statistics ? 'granted' : 'denied',
  });
}

function loadGtagLibrary(primaryId) {
  if (document.getElementById('gtag-script')) return;
  const script = document.createElement('script');
  script.id = 'gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(script);

  const gtag = ensureGtagStub();
  gtag('js', new Date());
}

/**
 * Laedt Tags strikt getrennt nach Kategorie:
 * - statistics -> GA4 config
 * - marketing  -> Google Ads config
 */
function applyScripts(consent) {
  const wantsAnything = consent.statistics || (consent.marketing && ADS_ID);
  if (!wantsAnything) return;

  loadGtagLibrary(consent.statistics ? GA_ID : ADS_ID);
  const gtag = ensureGtagStub();
  updateConsentMode(consent);

  if (consent.statistics && !window.__gaConfigured) {
    gtag('config', GA_ID, { anonymize_ip: true });
    window.__gaConfigured = true;
  }

  if (consent.marketing && ADS_ID && !window.__adsConfigured) {
    gtag('config', ADS_ID);
    window.__adsConfigured = true;
  }
}

/** Tracking hart abschalten, Script-Tags entfernen, Cookies loeschen. */
function revokeTracking() {
  window[`ga-disable-${GA_ID}`] = true;
  window.__gaConfigured = false;
  window.__adsConfigured = false;

  ['gtag-script', 'gtag-config'].forEach((id) => {
    document.getElementById(id)?.remove();
  });

  const measurementId = GA_ID.replace(/^G-/, '');
  const names = ['_ga', `_ga_${measurementId}`, '_gid', '_gcl_au', '_gcl_aw'];
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
    setConsentDefaults();

    const stored = readStoredConsent();
    if (stored) {
      setPreferences(stored);
      if (!stored.statistics) window[`ga-disable-${GA_ID}`] = true;
      applyScripts(stored);
    } else {
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

    if (isRevocation) {
      // Kein Full-Reload: der Rechner-State des Nutzers bleibt erhalten.
      revokeTracking();
      updateConsentMode(newConsent);
    }

    if (newConsent.statistics) window[`ga-disable-${GA_ID}`] = false;
    applyScripts(newConsent);
    updateConsentMode(newConsent);
  };

  const acceptAll = () => saveConsent({ statistics: true, marketing: !!ADS_ID });
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
          wir zusätzlich <strong>Google Analytics</strong> zur statistischen
          Auswertung ein
          {ADS_ID && (
            <>
              {' '}sowie <strong>Google Ads</strong> zur Erfolgsmessung unserer
              Werbekampagnen
            </>
          )}
          .
          <br />
          <br />
          Dabei können personenbezogene Daten an Google LLC in die USA
          übermittelt werden. Google ist unter dem EU-US Data Privacy Framework
          zertifiziert; Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1
          lit. a DSGVO, § 25 Abs. 1 TDDDG. Sie können Ihre Auswahl jederzeit mit
          Wirkung für die Zukunft über „Cookie-Einstellungen“ im Footer ändern
          oder widerrufen.
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

            {ADS_ID && (
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