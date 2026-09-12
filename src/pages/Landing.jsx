import Navbar from "..Components/Navbar";
import Hero from "..Components/Hero";
import Features from "..Components/Features";
import HowItWorks from "..Components/HowItWorks";
import CTA from "..Components/CTA";
import Footer from "..Components/Footer";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}

export default Landing;