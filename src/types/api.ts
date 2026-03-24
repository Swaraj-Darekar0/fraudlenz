export type DistributionMap = Record<string, number>

export type PreviewRow = Record<string, string | number | null>

export type FraudLabelCounts = {
  non_fraud: number
  fraud: number
}

export type FraudSummary = {
  fraud_label_counts: FraudLabelCounts
  pattern_counts: Record<string, number>
}

export type CleaningResponse = {
  file_id: string
  filename: string
  cleaned_filename: string
  download_url: string
  row_count: number
  column_count: number
  columns: string[]
  quality_metrics: Record<string, number>
  distributions: Record<string, DistributionMap>
  timestamp_range: {
    min: string
    max: string
  }
  preview: PreviewRow[]
  summary?: FraudSummary
}
