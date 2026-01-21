
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AIChatbot from './components/AIChatbot';
import AIImageTools from './components/AIImageTools';
import CampusMap from './components/CampusMap';
import Programs from './components/Programs';
import AIVoiceAssistant from './components/AIVoiceAssistant';
import AIVideoTools from './components/AIVideoTools';

const App: React.FC = () => {
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // Check if window.aistudio exists
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      } else {
        // Fallback for environment where it's already set in process.env
        setIsApiKeySelected(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setIsApiKeySelected(true); // Assume success per instructions
    }
  };

  if (!isApiKeySelected) {
    return (
      <div className="min-h-screen bg-[#002D62] flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 serif">Albertus Magnus College</h1>
        <p className="text-xl mb-8 max-w-md">Experience the next generation of academic excellence powered by Gemini AI.</p>
        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20">
          <p className="mb-4 text-sm text-blue-200">Veo and Gemini 3 Pro require a paid API key.</p>
          <button 
            onClick={handleSelectKey}
            className="bg-[#FFC72C] hover:bg-[#E5B627] text-[#002D62] font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
          >
            Connect Gemini API Key
          </button>
          <p className="mt-4 text-xs text-blue-300">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">Learn about billing</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <section id="ai-voice" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#002D62] serif">Conversational Voice Assistant</h2>
            <AIVoiceAssistant />
          </div>
        </section>

        <section id="programs" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#002D62] serif">Academic Programs</h2>
            <Programs />
          </div>
        </section>

        <section id="creative" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#002D62] serif">AI Creative Studio</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <AIImageTools />
              <AIVideoTools />
            </div>
          </div>
        </section>

        <section id="campus" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#002D62] serif">Explore the Campus</h2>
            <CampusMap />
          </div>
        </section>
      </main>

      <footer className="bg-[#002D62] text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4 serif">Albertus Magnus College</h3>
            <p className="text-blue-200">700 Prospect Street<br />New Haven, CT 06511</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 serif">AI Features</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>Gemini 3 Pro Complex Reasoning</li>
              <li>Veo Video Animation</li>
              <li>Live Audio Conversations</li>
              <li>Search & Maps Grounding</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 serif">Contact</h3>
            <p className="text-blue-200">Admissions: (203) 773-8501<br />admissions@albertus.edu</p>
          </div>
        </div>
        <div className="mt-12 text-center text-blue-400 text-xs">
          &copy; {new Date().getFullYear()} Albertus Magnus College. AI-Enhanced Experience.
        </div>
      </footer>

      <AIChatbot />
    </div>
  );
};

export default App;
