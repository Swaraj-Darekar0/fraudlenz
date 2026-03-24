import type { FraudSummary } from '../types/api'

type FraudSummaryProps = {
  summary: FraudSummary
}

function formatPatternLabel(key: string) {
  return key
    .replace(/^pattern_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function FraudSummaryPanel({ summary }: FraudSummaryProps) {
  const fraudCards = [
    { label: 'Non-Fraud', value: summary.fraud_label_counts.non_fraud },
    { label: 'Fraud', value: summary.fraud_label_counts.fraud },
  ]

  return (
    <div className="summary-stack">
      <div className="result-panel reveal" data-reveal>
        <div className="result-panel__header">
          <p className="eyebrow">FRAUD VS NON-FRAUD</p>
          <h3>Final label counts from the pipeline</h3>
        </div>
        <div className="fraud-count-grid">
          {fraudCards.map((item, index) => (
            <article
              key={item.label}
              className="metric-card reveal"
              data-reveal
              style={{ ['--delay' as string]: `${index * 70}ms` }}
            >
              <p className="metric-card__label">{item.label}</p>
              <strong>{item.value.toLocaleString()}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="result-panel reveal" data-reveal>
        <div className="result-panel__header">
          <p className="eyebrow">PATTERN COUNTS</p>
          <h3>Triggered fraud patterns across the uploaded file</h3>
        </div>
        <div className="metric-grid metric-grid--patterns">
          {Object.entries(summary.pattern_counts).map(([key, value], index) => (
            <article
              key={key}
              className="metric-card reveal"
              data-reveal
              style={{ ['--delay' as string]: `${index * 70}ms` }}
            >
              <p className="metric-card__label">{formatPatternLabel(key)}</p>
              <strong>{value.toLocaleString()}</strong>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
