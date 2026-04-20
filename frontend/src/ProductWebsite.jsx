import React from 'react';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Stakeholders from './sections/Stakeholders';
import SolutionOverview from './sections/SolutionOverview';
import VeraShield from './sections/VeraShield';
import FraudShield from './sections/FraudShield';
import ElderShield from './sections/ElderShield';
import Workflow from './sections/Workflow';
import Simulation from './sections/Simulation';
import { MultiAgentView, PipelineView, Architecture } from './sections/TechnicalDetail';
import { Analytics, BusinessValue } from './sections/BusinessDetail';
import { Roadmap, Contact } from './sections/FinalSections';
import ScrollReveal from './components/animations/ScrollReveal';

const ProductWebsite = () => {
  const scrollToSim = () => {
    const el = document.getElementById('simulation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToArch = () => {
    const el = document.getElementById('architecture');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="product-website">
      {/* Stage 1: Investor/Judge Impact — Hero is always visible, no reveal */}
      <Hero onStart={scrollToSim} onExplore={scrollToArch} />

      <ScrollReveal direction="up" delay={0}>
        <Problem />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={80}>
        <Stakeholders />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0} id="solution">
        <SolutionOverview />
      </ScrollReveal>

      {/* Stage 2: Product Deep Dive */}
      <ScrollReveal direction="left" delay={0}>
        <VeraShield />
      </ScrollReveal>

      <ScrollReveal direction="right" delay={0}>
        <FraudShield />
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0}>
        <ElderShield />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <Workflow />
      </ScrollReveal>

      {/* Stage 3: Technical Credibility */}
      <ScrollReveal direction="up" delay={0}>
        <MultiAgentView />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <PipelineView />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0} id="architecture">
        <Architecture />
      </ScrollReveal>

      {/* Stage 4: Functional Proof */}
      <ScrollReveal direction="up" delay={0}>
        <div id="simulation">
          <Simulation />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <Analytics />
      </ScrollReveal>

      {/* Stage 5: Business & Closing */}
      <ScrollReveal direction="up" delay={0}>
        <BusinessValue />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <Roadmap />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <Contact />
      </ScrollReveal>
    </div>
  );
};

export default ProductWebsite;
