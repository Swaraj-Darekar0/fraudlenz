import './styles/site.css'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'
import { HeroSection } from './sections/HeroSection'
import { SiteFooter } from './sections/SiteFooter'
import { SiteHeader } from './sections/SiteHeader'
import { WorkbenchSection } from './sections/WorkbenchSection'

function App() {
  useRevealOnScroll()

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <HeroSection />
        <WorkbenchSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
