import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-sans text-espresso">
      <Navbar />
      <Hero />
      <Menu />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}
