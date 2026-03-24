import type { CleaningResponse } from '../types/api'

type ResultOverviewProps = {
  result: CleaningResponse
}

const summaryItems = (result: CleaningResponse) => [
  { label: 'Rows processed', value: result.row_count.toLocaleString() },
  { label: 'Columns retained', value: result.column_count.toLocaleString() },
  { label: 'Output file', value: result.cleaned_filename },
  { label: 'File ID', value: result.file_id },
]

export function ResultOverview({ result }: ResultOverviewProps) {
  return (
    <div className="result-grid">
      {summaryItems(result).map((item, index) => (
        <article
          key={item.label}
          className="result-card reveal is-visible"
          data-reveal
          style={{ ['--delay' as string]: `${index * 70}ms` }}
        >
          <p className="result-card__label">{item.label}</p>
          <h3>{item.value}</h3>
        </article>
      ))}
    </div>
  )
}
