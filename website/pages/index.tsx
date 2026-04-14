import { AnimatedShapes } from '~/components/LandingPage/AnimatedShapes'
import { CodeExample } from '~/components/LandingPage/CodeExample'
import { GettingStarted } from '~/components/LandingPage/GettingStarted'
import SEO from '~/components/SEO'

function Home() {
  return (
    <div className="min-h-screen landing-page-container">
      <SEO />
      <CodeExample />
      <AnimatedShapes />
      <GettingStarted className="large-screen" />
    </div>
  )
}

export default Home
