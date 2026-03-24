import { useId, useRef, useState } from 'react'
import { resolveDownloadUrl, uploadCsv } from '../lib/api'
import type { CleaningResponse } from '../types/api'
import { ColumnGroups } from '../components/ColumnGroups'
import { DistributionPanel } from '../components/DistributionPanel'
import { PreviewTable } from '../components/PreviewTable'
import { QualityMetrics } from '../components/QualityMetrics'
import { ResultOverview } from '../components/ResultOverview'
import { SectionIntro } from '../components/SectionIntro'
import { SectionShell } from '../components/SectionShell'

export function WorkbenchSection() {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<CleaningResponse | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload() {
    if (!selectedFile) {
      setError('Choose a CSV file before uploading.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const response = await uploadCsv(selectedFile)
      console.log('clean-csv response:', response)
      setResult(response)
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'Upload failed.'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <SectionShell
      id="upload"
      className="section--workbench"
      innerClassName="section__inner--wide"
      contourClassName="contour--subtle"
      contourDrift={1.1}
    >
      <div className="workbench-layout">
        <div className="workbench-layout__intro">
          <SectionIntro
            eyebrow="LIVE CSV CLEANING"
            title="Upload a raw transaction file and inspect the cleaned output."
            copy="This frontend speaks directly to the cleaning API. Upload a CSV, inspect data quality metrics, review distributions, and download the cleaned file returned by the service."
          />
        </div>

        <div
          className="upload-card reveal"
          data-reveal
          style={{ ['--delay' as string]: '120ms' }}
        >
          <p className="upload-card__label">UPLOAD DATASET</p>
          <h3>POST /api/v1/clean-csv</h3>
          <p className="upload-card__copy">
            Accepts a raw CSV, returns cleaned metadata, metrics, preview rows, and a
            download URL for the cleaned file.
          </p>

          <label className="file-dropzone" htmlFor={inputId}>
            <input
              id={inputId}
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            <span>{selectedFile ? selectedFile.name : 'Choose a CSV file'}</span>
            <small>
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB ready for upload`
                : 'Drag a file here or browse from your machine'}
            </small>
          </label>

          <div className="upload-card__actions">
            <button
              type="button"
              className="button button--dark"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Cleaning in progress...' : 'Upload and clean ↗'}
            </button>
            <button
              type="button"
              className="button button--ghost button--ghost-dark"
              onClick={() => fileInputRef.current?.click()}
            >
              Pick another file
            </button>
          </div>

          {error ? <p className="form-message form-message--error">{error}</p> : null}
          {result ? (
            <a
              className="download-link"
              href={resolveDownloadUrl(result.download_url)}
              target="_blank"
              rel="noreferrer"
            >
              Download cleaned CSV →
            </a>
          ) : null}
        </div>
      </div>

      {result ? (
        <div className="result-stack" id="results">
          <div className="result-header reveal is-visible" data-reveal>
            <p className="eyebrow">CLEANING RESPONSE</p>
            <h2>{result.filename}</h2>
            <p className="section-copy">
              Timestamp window: {result.timestamp_range.min} to{' '}
              {result.timestamp_range.max}
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
      ) : (
        <div className="empty-state reveal" data-reveal style={{ ['--delay' as string]: '180ms' }}>
          <p className="eyebrow">WAITING FOR DATA</p>
          <h3>No response yet.</h3>
          <p>
            Upload a CSV to populate summary metrics, quality findings, category
            distributions, city clusters, and the cleaned row preview.
          </p>
        </div>
      )}
    </SectionShell>
  )
}
