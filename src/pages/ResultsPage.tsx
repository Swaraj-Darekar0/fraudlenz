import { Link, useLocation, useParams } from 'react-router-dom'
import { ResultsWorkspace } from '../components/ResultsWorkspace'
import { SectionShell } from '../components/SectionShell'
import type { CleaningResponse } from '../types/api'

type ResultsLocationState = {
  result?: CleaningResponse
}

function getStoredResult() {
  const stored = sessionStorage.getItem('fraudlens:last-result')
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as CleaningResponse
  } catch {
    return null
  }
}

export function ResultsPage() {
  const { fileId } = useParams()
  const location = useLocation()
  const state = location.state as ResultsLocationState | null
  const result = state?.result ?? getStoredResult()

  return (
    <SectionShell
      id="results"
      className="section--workbench page-section page-section--app"
      innerClassName="section__inner--wide"
      contourClassName="contour--subtle"
      contourDrift={1.4}
    >
      <div className="workspace-header reveal is-visible" data-reveal>
        <div>
          <p className="eyebrow">RESULTS WORKSPACE</p>
          <h2>Cleaned file investigation</h2>
          <p className="section-copy">
            File ID: {fileId ?? 'unknown'} . This page is the staging area for
            command centre, evidence chain, user timeline, pattern atlas, and data
            provenance.
          </p>
        </div>
        <div className="workspace-header__actions">
          <Link to="/upload" className="button button--ghost">
            Upload another file
          </Link>
        </div>
      </div>

      <div className="workspace-tabs reveal is-visible" data-reveal>
        <span className="workspace-tab workspace-tab--active">Cleaning Summary</span>
        <span className="workspace-tab">Command Centre</span>
        <span className="workspace-tab">Evidence Chain</span>
        <span className="workspace-tab">User Timeline</span>
        <span className="workspace-tab">Pattern Atlas</span>
        <span className="workspace-tab">Data Provenance</span>
      </div>

      {result ? (
        <ResultsWorkspace result={result} />
      ) : (
        <div className="empty-state reveal is-visible" data-reveal>
          <p className="eyebrow">NO RESULT LOADED</p>
          <h3>There is no uploaded dataset attached to this workspace yet.</h3>
          <p>
            Start on the upload page, send a CSV through the cleaning API, and then
            return here with the generated file ID.
          </p>
          <Link to="/upload" className="button button--outline">
            Go to upload page ↗
          </Link>
        </div>
      )}
    </SectionShell>
  )
}
