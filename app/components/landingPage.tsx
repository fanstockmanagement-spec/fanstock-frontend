import React from 'react'
import HomePage from './home-page'
import ProblemsSection from './problem-section' 
import PricingSection from "./pricing-section"
import Footer from './footer'

const LandingPage = () => {
  return (
    <div>
        <HomePage/>  
        <ProblemsSection/> 
        {/* <FeaturesSection/> */} 
        <PricingSection/> 
        <Footer/>
      
    </div>
  )
}

export default LandingPage