import { useState } from 'react';

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(null);

const faqData = [
    {
      q: "Was gilt bei der Förderung?",
      a: "Für den Tausch alter Öl- und Gasheizungen, sowie Wärmepumpen und Fernheizungsanschlüsse gewährt der Staat über die Bundesförderung für effiziente Gebäude (BEG) Zuschüsse. Höhe und Voraussetzungen hängen von mehreren Faktoren ab und werden regelmäßig angepasst. Welche Sätze für Ihr Vorhaben gelten, klärt der Fachpartner mit Ihnen, verlässliche Zahlen gibt es nur im konkreten Fall."
    },
    {
      q: "Funktioniert eine Wärmepumpe auch im Altbau?",
      a: "Generell ja, vor allem nach einer energetischen Sanierung. Ob es sich für Ihr Gebäude eignet, hängt von Dämmung, Heizflächen und Aufstellort ab. Das lässt sich nur im Einzelfall vor Ort beurteilen."
    },
    {
      q: "Wie laut ist eine Wärmepumpe?",
      a: "Moderne Luft-Wärmepumpen liegen im Betrieb meist bei rund 40–55 dB(A), vergleichbar mit einem ruhigen Gespräch. Aufstellort und Ausrichtung beeinflussen die wahrgenommene Lautstärke deutlich."
    },
    {
      q: "Brauche ich eine Fußbodenheizung?",
      a: "Nein. Eine Fußbodenheizung verbessert die Effizienz, doch auch mit geeigneten Heizkörpern lässt sich eine Wärmepumpe betreiben."
    },
    {
      q: "Was kostet eine Wärmepumpe?",
      a: "Die Kosten unterscheiden sich je nach Gebäude und Technik stark. Belastbare Zahlen ergeben sich erst aus einer konkreten Planung. Der Rechner auf dieser Seite liefert nur eine grobe Orientierung."
    }
  ];

  return (
    <section className="bg-sand pb-4">
      <div className="container-md">
        <div className="eyebrow">Häufige Fragen</div>
        <h2>Was Hausbesitzer <em>oft fragen</em></h2>
        
        <div className="faq-accordion">
          {faqData.map((faq, i) => (
            <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`}>
              <button className="faq-btn" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                {faq.q} <span className="faq-icon">+</span>
              </button>
              <div className="faq-content"><p>{faq.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}