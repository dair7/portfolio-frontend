import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

export default function App() {
  return (
    /* The one page background. Sections do not paint their own — they are
       separated by spacing, not by alternating fills. */
    <div className="flex min-h-screen flex-col bg-bg text-cream">
      <Navbar />
      <main className="flex-1">
        <Home />
      </main>
      <Footer />
    </div>
  )
}
