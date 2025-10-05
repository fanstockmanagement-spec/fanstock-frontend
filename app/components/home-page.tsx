import HeroPage from "./hero-page";
import ProblemsSection from "./problem-section";
import PricingSection from "./pricing-section";
import Footer from "./footer";
import {NavigationBar}  from "./navigation-bar";

export default function HomePage() {
  return <div>
    <NavigationBar/>  
    <HeroPage /> 
    <ProblemsSection/>
    <PricingSection/>
    <Footer/>
  </div>;
}