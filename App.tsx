import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Generator from './components/Generator';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Hub from './components/Hub';
import Templates from './components/Templates';
import Documents from './components/Documents';
import { AppView, GenerationMode } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [generatorMode, setGeneratorMode] = useState<GenerationMode>(GenerationMode.IMAGE);
  const [generatorPrompt, setGeneratorPrompt] = useState<string>('');

  // Function to switch to hub
  const handleStart = () => {
    setView(AppView.HUB);
    window.scrollTo(0, 0);
  };

  // Function to navigate from Hub to Generator with specific tool
  const handleToolSelect = (mode: GenerationMode) => {
    setGeneratorMode(mode);
    setGeneratorPrompt(''); // Reset prompt when selecting tool manually
    setView(AppView.GENERATOR);
    window.scrollTo(0, 0);
  };

  // Function to handle template selection
  const handleTemplateSelect = (mode: GenerationMode, prompt: string) => {
    setGeneratorMode(mode);
    setGeneratorPrompt(prompt);
    setView(AppView.GENERATOR);
    window.scrollTo(0, 0);
  };

  // Function to handle header navigation
  const handleNavigate = (targetView: AppView, sectionId?: string) => {
    if (targetView === AppView.LANDING) {
      setView(AppView.LANDING);
      // Small timeout to allow DOM to render before scrolling
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      setView(targetView);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-cyan selection:text-black">
      {/* Only show global header on Landing page */}
      {view === AppView.LANDING && (
        <Header currentView={view} onNavigate={handleNavigate} />
      )}
      
      <main className="h-full">
        {view === AppView.LANDING && (
          <>
            <Hero onStart={handleStart} />
            <Features />
            <Pricing />
          </>
        )}

        {view === AppView.HUB && (
          <Hub 
            onSelectTool={handleToolSelect} 
            onNavigate={setView}
            onBack={() => setView(AppView.LANDING)}
          />
        )}

        {view === AppView.TEMPLATES && (
          <Templates
            onSelectTemplate={handleTemplateSelect}
            onNavigate={setView}
            onSelectTool={handleToolSelect}
            onBack={() => setView(AppView.LANDING)}
          />
        )}

        {view === AppView.DOCUMENTS && (
          <Documents
            onNavigate={setView}
            onSelectTool={handleToolSelect}
            onBack={() => setView(AppView.LANDING)}
          />
        )}

        {view === AppView.GENERATOR && (
          <Generator 
            initialMode={generatorMode} 
            initialPrompt={generatorPrompt}
            onBack={() => setView(AppView.HUB)}
            onNavigate={setView}
          />
        )}
      </main>
      
      {view === AppView.LANDING && <Footer />}
    </div>
  );
};

export default App;