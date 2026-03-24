import type { CleaningResponse, FraudSummary } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001'

type RawApiResponse = Partial<CleaningResponse> & {
  rows_processed?: number
  columns_produced?: string[]
  summary?: FraudSummary
  fraud_label_counts?: FraudSummary['fraud_label_counts']
  pattern_counts?: FraudSummary['pattern_counts']
}

function normalizeSummary(payload: RawApiResponse): FraudSummary | undefined {
  if (payload.summary) {
    return payload.summary
  }

  if (payload.fraud_label_counts || payload.pattern_counts) {
    return {
      fraud_label_counts: payload.fraud_label_counts ?? {
        non_fraud: 0,
        fraud: 0,
      },
      pattern_counts: payload.pattern_counts ?? {},
    }
  }

  return undefined
}

function normalizeResponse(payload: RawApiResponse): CleaningResponse {
  return {
    file_id: payload.file_id ?? 'pipeline-run',
    filename: payload.filename ?? 'uploaded.csv',
    cleaned_filename: payload.cleaned_filename ?? 'cleaned_output.csv',
    download_url: payload.download_url ?? '',
    row_count: payload.row_count ?? payload.rows_processed ?? 0,
    column_count:
      payload.column_count ??
      payload.columns?.length ??
      payload.columns_produced?.length ??
      0,
    columns: payload.columns ?? payload.columns_produced ?? [],
    quality_metrics: payload.quality_metrics ?? {},
    distributions: payload.distributions ?? {},
    timestamp_range: payload.timestamp_range ?? {
      min: '-',
      max: '-',
    },
    preview: payload.preview ?? [],
    summary: normalizeSummary(payload),
  }
}

export async function uploadCsv(file: File): Promise<CleaningResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/v1/clean-csv`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Upload failed.')
  }

  const payload = (await response.json()) as RawApiResponse
  return normalizeResponse(payload)
}

export function resolveDownloadUrl(downloadUrl: string) {
  if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
    return downloadUrl
  }

  return `${API_BASE_URL}${downloadUrl}`
}
