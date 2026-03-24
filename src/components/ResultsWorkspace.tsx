import type { CleaningResponse } from '../types/api'
import { ColumnGroups } from './ColumnGroups'
import { DistributionPanel } from './DistributionPanel'
import { PreviewTable } from './PreviewTable'
import { QualityMetrics } from './QualityMetrics'
import { ResultOverview } from './ResultOverview'

type ResultsWorkspaceProps = {
  result: CleaningResponse
}

export function ResultsWorkspace({ result }: ResultsWorkspaceProps) {
  return (
    <div className="result-stack" id="results">
      <div className="result-header reveal is-visible" data-reveal>
        <p className="eyebrow">CLEANING RESPONSE</p>
        <h2>{result.filename}</h2>
        <p className="section-copy">
          Timestamp window: {result.timestamp_range.min} to {result.timestamp_range.max}
        </p>
      </div>

      <ResultOverview result={result} />

      {Object.keys(result.quality_metrics).length ? (
        <div className="result-panel reveal is-visible" data-reveal>
          <div className="result-panel__header">
            <p className="eyebrow">QUALITY METRICS</p>
            <h3>Issues surfaced during cleaning</h3>
          </div>
          <QualityMetrics metrics={result.quality_metrics} />
        </div>
      ) : null}

      {result.columns.length ? <ColumnGroups columns={result.columns} /> : null}

      {Object.keys(result.distributions).length ? (
        <div className="distribution-grid">
          {Object.entries(result.distributions).map(([title, items]) => (
            <DistributionPanel key={title} title={title} items={items} />
          ))}
        </div>
      ) : null}

      {result.preview.length ? (
        <div className="result-panel reveal is-visible" data-reveal id="preview">
          <div className="result-panel__header">
            <p className="eyebrow">PREVIEW</p>
            <h3>First rows returned by the cleaning API</h3>
          </div>
          <PreviewTable columns={result.columns} rows={result.preview} />
        </div>
      ) : null}
    </div>
  )
}
