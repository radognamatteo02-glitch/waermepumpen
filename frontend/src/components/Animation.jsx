import React, { useRef, useEffect, useCallback } from 'react';
import './styles/Animation.css';

/**
 * Wärmepumpe – Montage-Animation
 * Portierte React-Version der ursprünglichen HTML/SVG/CSS/JS-Animation.
 *
 * Die Animation startet automatisch, sobald das Bauteil zu 35% im
 * Viewport sichtbar ist (IntersectionObserver), und wiederholt sich
 * 3 Sekunden nach Fertigstellung automatisch in einer Schleife.
 */

const STEPS = [
  { id: 'pDaempfer', label: 'Schwingungsdämpfer', cx: 460, cy: 498 },
  { id: 'pBase', label: 'Bodenwanne', cx: 460, cy: 480 },
  { id: 'pFrame', label: 'Grundrahmen', cx: 460, cy: 294 },
  { id: 'pTauscher', label: 'Wärmetauscher (Verdampfer)', cx: 276, cy: 300, fins: true },
  { id: 'pKomp', label: 'Verdichter', cx: 648, cy: 380 },
  { id: 'pMotor', label: 'Lüftermotor', cx: 420, cy: 291 },
  { id: 'pKreis', label: 'Kältemittelleitungen', cx: 650, cy: 260, slow: true },
  { id: 'pFan', label: 'Lüfterflügel', cx: 420, cy: 290 },
  { id: 'pPlatine', label: 'Steuerplatine & Inverter', cx: 647, cy: 187 },
  { id: 'pBox', label: 'Anschlussbox', cx: 623, cy: 258 },
  { id: 'pSchrauben1', label: 'Verschraubung der Komponenten', cx: 460, cy: 294 },
  { id: 'pRueck', label: 'Rückwand', cx: 460, cy: 294 },
  { id: 'pSeite', label: 'Seitenverkleidung', cx: 644, cy: 294 },
  { id: 'pFront', label: 'Frontverkleidung mit Lüftergitter', cx: 376, cy: 294 },
  { id: 'pSchrauben2', label: 'Gehäuse verschrauben', cx: 460, cy: 294 },
  { id: 'pDeckel', label: 'Obere Abdeckung', cx: 460, cy: 114 },
];

const STEP_MS = 560;
const REPEAT_DELAY_MS = 3000; // Pause vor dem Neustart (3 Sekunden)

export default function WaermepumpeAnimation() {
  const sceneRef = useRef(null);
  const captionRef = useRef(null);
  const progRef = useRef(null);
  const ringRef = useRef(null);
  const finRectRef = useRef(null);
  const partRefs = useRef({});
  const timersRef = useRef([]);
  const startedRef = useRef(false);

  const setPartRef = (id) => (el) => {
    partRefs.current[id] = el;
  };

  const pulseAt = useCallback((cx, cy) => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.classList.remove('go');
    // force reflow so the animation can restart
    void ring.getBoundingClientRect();
    ring.classList.add('go');
  }, []);

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (sceneRef.current) sceneRef.current.classList.remove('spinning');
    STEPS.forEach((s) => {
      const el = partRefs.current[s.id];
      if (el) el.classList.remove('in');
    });
    if (finRectRef.current) finRectRef.current.setAttribute('width', '0');
    if (ringRef.current) ringRef.current.classList.remove('go');
    if (progRef.current) progRef.current.style.width = '0';
    if (captionRef.current) captionRef.current.textContent = '';
  }, []);

  const play = useCallback(() => {
    reset();
    if (sceneRef.current) void sceneRef.current.getBoundingClientRect();

    let t = 350;
    STEPS.forEach((s, i) => {
      timersRef.current.push(
        setTimeout(() => {
          const el = partRefs.current[s.id];
          if (el) el.classList.add('in');
          if (s.fins && finRectRef.current) finRectRef.current.setAttribute('width', '120');
          pulseAt(s.cx, s.cy);
          if (captionRef.current) {
            captionRef.current.innerHTML =
              '<span class="wp-num">' + String(i + 1).padStart(2, '0') + '</span>' + s.label;
          }
          if (progRef.current) {
            progRef.current.style.width = ((i + 1) / STEPS.length) * 100 + '%';
          }
        }, t)
      );
      t += s.slow ? STEP_MS + 400 : STEP_MS;
    });

    // Endzustand & automatische Wiederholung nach 3 Sekunden
    timersRef.current.push(
      setTimeout(() => {
        if (sceneRef.current) sceneRef.current.classList.add('spinning');
        if (captionRef.current) {
          captionRef.current.innerHTML =
            '<span class="wp-num">✓</span>Fertig montiert – die Wärmepumpe läuft an';
        }
        if (progRef.current) progRef.current.style.width = '100%';

        // Timer für die automatische Wiederholung hinzufügen
        timersRef.current.push(
          setTimeout(() => {
            play();
          }, REPEAT_DELAY_MS)
        );
      }, t + 250)
    );
  }, [reset, pulseAt]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            play();
            io.disconnect();
          }
        });
      }, { threshold: 0.35 });
      io.observe(scene);
    } else {
      play();
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      if (io) io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wp-montage">
      <div className="wp-stage">
        <div className="wp-head">
          <div>
            <div className="wp-eyebrow">Technik im Detail</div>
            <h1>So entsteht Ihre Wärmepumpe</h1>
          </div>
          <button className="wp-replay" type="button" onClick={play} style={{ display: 'none' }}>
            Nochmal abspielen
          </button>
        </div>

        <div className="wp-canvas">
          <svg
            ref={sceneRef}
            viewBox="0 0 920 560"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Animierte Montage einer Luft-Wasser-Wärmepumpe Schritt für Schritt bis zum fertigen Gerät"
          >
            <defs>
              <clipPath id="wpFinClip">
                <rect ref={finRectRef} id="wpFinClipRect" x="216" y="150" width="0" height="300" />
              </clipPath>
            </defs>

            {/* ground shadow */}
            <ellipse cx="460" cy="512" rx="330" ry="22" fill="rgba(28,34,31,0.10)" />

            {/* 1 · vibration dampers */}
            <g ref={setPartRef('pDaempfer')} className="wp-part from-bottom">
              <rect x="222" y="492" width="34" height="16" rx="4" fill="#141618" />
              <rect x="443" y="492" width="34" height="16" rx="4" fill="#141618" />
              <rect x="664" y="492" width="34" height="16" rx="4" fill="#141618" />
            </g>

            {/* 2 · base tray */}
            <g ref={setPartRef('pBase')} className="wp-part from-left">
              <rect x="180" y="468" width="560" height="26" rx="6" fill="var(--wp-anthracite)" />
              <rect x="196" y="474" width="528" height="4" rx="2" fill="#3A3E41" />
            </g>

            {/* 3 · frame */}
            <g ref={setPartRef('pFrame')} className="wp-part from-top-far">
              <rect x="192" y="118" width="536" height="352" rx="10" fill="none" stroke="#8A8F93" strokeWidth="10" />
              <line x1="560" y1="124" x2="560" y2="464" stroke="#8A8F93" strokeWidth="8" />
              <rect x="200" y="126" width="520" height="336" rx="6" fill="#3A3E41" />
            </g>

            {/* 4 · heat exchanger (fins wipe in) */}
            <g ref={setPartRef('pTauscher')} className="wp-part from-left">
              <rect x="216" y="150" width="120" height="300" rx="8" fill="var(--wp-fin)" />
              <g clipPath="url(#wpFinClip)" stroke="rgba(246,242,233,0.55)" strokeWidth="3">
                <line x1="226" y1="170" x2="326" y2="170" />
                <line x1="226" y1="196" x2="326" y2="196" />
                <line x1="226" y1="222" x2="326" y2="222" />
                <line x1="226" y1="248" x2="326" y2="248" />
                <line x1="226" y1="274" x2="326" y2="274" />
                <line x1="226" y1="300" x2="326" y2="300" />
                <line x1="226" y1="326" x2="326" y2="326" />
                <line x1="226" y1="352" x2="326" y2="352" />
                <line x1="226" y1="378" x2="326" y2="378" />
                <line x1="226" y1="404" x2="326" y2="404" />
                <line x1="226" y1="430" x2="326" y2="430" />
              </g>
            </g>

            {/* 5 · compressor */}
            <g ref={setPartRef('pKomp')} className="wp-part from-top">
              <ellipse cx="648" cy="430" rx="42" ry="14" fill="#101214" />
              <rect x="606" y="330" width="84" height="100" rx="18" fill="#17191B" />
              <ellipse cx="648" cy="330" rx="42" ry="16" fill="#26292B" />
              <rect x="636" y="306" width="24" height="18" rx="5" fill="#101214" />
              <rect x="600" y="352" width="8" height="52" rx="4" fill="#0C0E0F" />
            </g>

            {/* 6 · fan motor */}
            <g ref={setPartRef('pMotor')} className="wp-part from-deep">
              <rect x="398" y="272" width="46" height="38" rx="8" fill="#8A8F93" />
              <rect x="404" y="278" width="34" height="26" rx="5" fill="#6E7377" />
              <circle cx="420" cy="291" r="7" fill="#4A4E52" />
            </g>

            {/* 7 · refrigerant circuit draws itself */}
            <g ref={setPartRef('pKreis')} className="wp-part wp-pipe-draw" style={{ opacity: 1 }}>
              <g fill="none" stroke="var(--wp-copper)" strokeWidth="9" strokeLinecap="round">
                <path pathLength="1" d="M648 306 C648 250, 600 240, 596 200 S620 150, 596 150" />
                <path pathLength="1" d="M690 370 C740 360, 736 300, 700 280 S660 240, 690 210" />
                <path pathLength="1" d="M606 400 C560 400, 520 430, 470 424" />
              </g>
              <circle cx="596" cy="150" r="10" fill="var(--wp-copper)" />
              <circle cx="690" cy="210" r="10" fill="var(--wp-copper)" />
              <circle cx="470" cy="424" r="9" fill="var(--wp-copper)" />
            </g>

            {/* 8 · fan blade */}
            <g ref={setPartRef('pFan')} className="wp-part from-spin">
              <g id="wpFanBlade">
                <circle cx="420" cy="290" r="16" fill="#101214" />
                <path d="M420 290 C380 250, 372 210, 412 196 C430 226, 428 262, 420 290 Z" fill="#1B1E20" />
                <path d="M420 290 C472 302, 500 332, 470 362 C438 346, 420 318, 420 290 Z" fill="#1B1E20" />
                <path d="M420 290 C388 330, 352 336, 342 296 C372 276, 404 280, 420 290 Z" fill="#1B1E20" />
              </g>
            </g>

            {/* 9 · control PCB */}
            <g ref={setPartRef('pPlatine')} className="wp-part from-top">
              <rect x="588" y="152" width="118" height="70" rx="8" fill="#1E4A3C" />
              <rect x="598" y="162" width="30" height="18" rx="3" fill="#DDE8E2" />
              <rect x="636" y="162" width="18" height="18" rx="3" fill="#B87343" />
              <rect x="662" y="162" width="32" height="10" rx="2" fill="#9CC8B4" />
              <circle cx="604" cy="200" r="5" fill="#9CC8B4" />
              <circle cx="622" cy="200" r="5" fill="#9CC8B4" />
              <rect x="640" y="192" width="54" height="16" rx="3" fill="#2C6152" />
            </g>

            {/* 10 · connection box */}
            <g ref={setPartRef('pBox')} className="wp-part from-right">
              <rect x="588" y="234" width="70" height="48" rx="6" fill="#141618" />
              <rect x="596" y="242" width="54" height="10" rx="2" fill="#2C3033" />
              <rect x="596" y="258" width="54" height="10" rx="2" fill="#2C3033" />
            </g>

            {/* 11 · screws set 1 */}
            <g ref={setPartRef('pSchrauben1')} className="wp-part wp-screw">
              <circle cx="212" cy="140" r="7" fill="#9A9EA2" /><circle cx="212" cy="140" r="2.5" fill="#5C6064" />
              <circle cx="708" cy="140" r="7" fill="#9A9EA2" /><circle cx="708" cy="140" r="2.5" fill="#5C6064" />
              <circle cx="212" cy="450" r="7" fill="#9A9EA2" /><circle cx="212" cy="450" r="2.5" fill="#5C6064" />
              <circle cx="708" cy="450" r="7" fill="#9A9EA2" /><circle cx="708" cy="450" r="2.5" fill="#5C6064" />
            </g>

            {/* 12 · back wall */}
            <g ref={setPartRef('pRueck')} className="wp-part from-deep">
              <rect x="206" y="132" width="508" height="324" rx="6" fill="#2E3235" />
              <g stroke="#26292B" strokeWidth="3">
                <line x1="220" y1="160" x2="700" y2="160" /><line x1="220" y1="200" x2="700" y2="200" />
                <line x1="220" y1="240" x2="700" y2="240" /><line x1="220" y1="280" x2="700" y2="280" />
                <line x1="220" y1="320" x2="700" y2="320" /><line x1="220" y1="360" x2="700" y2="360" />
                <line x1="220" y1="400" x2="700" y2="400" />
              </g>
              <rect x="216" y="142" width="490" height="306" rx="6" fill="#3A3E41" opacity="0" />
            </g>

            {/* 13 · side panel */}
            <g ref={setPartRef('pSeite')} className="wp-part from-right">
              <rect x="560" y="118" width="168" height="352" rx="10" fill="var(--wp-panel)" />
              <rect x="560" y="118" width="10" height="352" fill="#D8D8D3" />
              <rect x="700" y="404" width="16" height="44" rx="4" fill="#DDDDD8" />
              <circle id="wpLed" cx="644" cy="150" r="5" fill="#2C6152" />
            </g>

            {/* 14 · front grille */}
            <g ref={setPartRef('pFront')} className="wp-part from-left">
              <rect x="192" y="118" width="368" height="352" rx="10" fill="var(--wp-anthracite)" />
              <g stroke="#33373A" strokeWidth="4">
                <line x1="204" y1="144" x2="548" y2="144" /><line x1="204" y1="168" x2="548" y2="168" />
                <line x1="204" y1="192" x2="548" y2="192" /><line x1="204" y1="216" x2="548" y2="216" />
                <line x1="204" y1="240" x2="548" y2="240" /><line x1="204" y1="264" x2="548" y2="264" />
                <line x1="204" y1="288" x2="548" y2="288" /><line x1="204" y1="312" x2="548" y2="312" />
                <line x1="204" y1="336" x2="548" y2="336" /><line x1="204" y1="360" x2="548" y2="360" />
                <line x1="204" y1="384" x2="548" y2="384" /><line x1="204" y1="408" x2="548" y2="408" />
                <line x1="204" y1="432" x2="548" y2="432" /><line x1="204" y1="456" x2="548" y2="456" />
              </g>
              <circle cx="376" cy="294" r="132" fill="#141618" />
              <g fill="none" stroke="#2C3033" strokeWidth="6">
                <circle cx="376" cy="294" r="120" /><circle cx="376" cy="294" r="102" />
                <circle cx="376" cy="294" r="84" /><circle cx="376" cy="294" r="66" />
                <circle cx="376" cy="294" r="48" />
              </g>
              <circle cx="376" cy="294" r="30" fill="#1B1E20" />
            </g>

            {/* 15 · screws set 2 */}
            <g ref={setPartRef('pSchrauben2')} className="wp-part wp-screw">
              <circle cx="568" cy="136" r="6" fill="#C9CCCF" /><circle cx="568" cy="136" r="2" fill="#7A7E82" />
              <circle cx="568" cy="452" r="6" fill="#C9CCCF" /><circle cx="568" cy="452" r="2" fill="#7A7E82" />
              <circle cx="204" cy="132" r="6" fill="#C9CCCF" /><circle cx="204" cy="132" r="2" fill="#7A7E82" />
              <circle cx="204" cy="456" r="6" fill="#C9CCCF" /><circle cx="204" cy="456" r="2" fill="#7A7E82" />
            </g>

            {/* 16 · top cover */}
            <g ref={setPartRef('pDeckel')} className="wp-part from-top-far">
              <rect x="184" y="102" width="552" height="24" rx="10" fill="#1B1E20" />
              <rect x="200" y="108" width="520" height="3" rx="1.5" fill="#2C3033" />
            </g>

            {/* heat shimmer (end state) */}
            <g className="wp-heat" fill="none" stroke="var(--wp-copper)" strokeWidth="4" strokeLinecap="round" opacity="0">
              <path d="M770 210 q8 -12 0 -24 q-8 -12 0 -24" />
              <path d="M796 224 q8 -12 0 -24 q-8 -12 0 -24" />
              <path d="M822 210 q8 -12 0 -24 q-8 -12 0 -24" />
            </g>

            {/* landing pulse ring */}
            <circle ref={ringRef} className="wp-pulse" r="40" />
          </svg>
        </div>

        <div className="wp-bar">
          <div className="wp-caption" ref={captionRef} aria-live="polite" />
          <div className="wp-progress" aria-hidden="true">
            <i ref={progRef} />
          </div>
        </div>
      </div>
    </div>
  );
}