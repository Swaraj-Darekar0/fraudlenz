import { trustedBy } from '../data/siteContent'

export function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero__background" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div
        className="hero__content reveal is-visible"
        data-reveal
        style={{ ['--delay' as string]: '0ms' }}
      >
        <p className="eyebrow eyebrow--dark">FRAUDLENS</p>
        <h1>Clean the dataset before you trust the verdict.</h1>
        <p className="hero__subhead">
          Upload raw transactions. Surface quality issues. Download the cleaned CSV.
        </p>
        <p className="hero__body">
          FraudLens now exposes the cleaning pipeline directly: row counts, parsed
          columns, timestamp range, quality metrics, preview records, and a live
          download endpoint for the normalized output.
        </p>

        <div className="hero__actions">
          <a href="#upload" className="button button--dark">
            Upload CSV ↗
          </a>
          <a href="#results" className="text-link">
            See the response model ↓
          </a>
        </div>
      </div>

      <div
        className="trusted-bar reveal is-visible"
        data-reveal
        style={{ ['--delay' as string]: '160ms' }}
      >
        <p className="trusted-bar__label">TRUSTED BY FRAUD TEAMS AT</p>
        <div className="trusted-bar__logos" aria-label="Trusted by">
          {trustedBy.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
