import { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionIntro } from '../components/SectionIntro'
import { SectionShell } from '../components/SectionShell'
import { resolveDownloadUrl, uploadCsv } from '../lib/api'
import type { CleaningResponse } from '../types/api'

export function UploadPage() {
  const inputId = useId()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<CleaningResponse | null>(null)

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
      sessionStorage.setItem('fraudlens:last-result', JSON.stringify(response))
      setLastResult(response)
      navigate(`/results/${response.file_id}`, { state: { result: response } })
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
      className="section--workbench page-section page-section--app"
      innerClassName="section__inner--wide"
      contourClassName="contour--subtle"
      contourDrift={1.1}
    >
      <div className="workbench-layout">
        <div className="workbench-layout__intro">
          <SectionIntro
            eyebrow="UPLOAD WORKSPACE"
            title="Send a raw transaction file into the cleaning pipeline."
            copy="This page is dedicated to ingest. Upload the CSV, wait for the backend to normalize it, then continue into the results workspace for detailed inspection."
          />
        </div>

        <div className="upload-card reveal is-visible" data-reveal>
          <p className="upload-card__label">POST /api/v1/clean-csv</p>
          <h3>Upload dataset</h3>
          <p className="upload-card__copy">
            The API returns file metadata, row counts, engineered columns, quality
            metrics, distributions, preview rows, and a download URL for the cleaned
            CSV.
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
              {isUploading ? 'Cleaning in progress...' : 'Upload and continue ↗'}
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
          {lastResult ? (
            <a
              className="download-link"
              href={resolveDownloadUrl(lastResult.download_url)}
              target="_blank"
              rel="noreferrer"
            >
              Download latest cleaned CSV →
            </a>
          ) : null}
        </div>
      </div>
    </SectionShell>
  )
}
