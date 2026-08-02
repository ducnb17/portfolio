import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Portfolio from '@/components/Portfolio';
import Learning from '@/components/Learning';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Portfolio />
      <Learning />
      <Contact />
      <Footer />
    </main>
  );
}
