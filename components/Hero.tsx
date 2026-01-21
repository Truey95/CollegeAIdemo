
import React, { useState } from 'react';
import { getFastResponse } from '../services/geminiService';

const Hero: React.FC = () => {
  const [fastQuery, setFastQuery] = useState('');
  const [fastResult, setFastResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFastQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await getFastResponse(`Answer this question about a university quickly: ${fastQuery}`);
      setFastResult(res || '');
    } catch (err) {
      setFastResult("Error fetching quick answer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative ai-gradient py-24 md:py-36 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white">
          <span className="inline-block px-4 py-1 rounded-full bg-[#FFC72C]/20 text-[#FFC72C] border border-[#FFC72C]/30 text-sm font-semibold mb-6">
            NEW: AI-AUGMENTED CAMPUS
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight serif">
            Empowering Your <span className="text-[#FFC72C]">Future</span> Through AI.
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-xl leading-relaxed">
            Albertus Magnus College integrates cutting-edge Gemini technology to provide personalized learning, 
            real-time research assistance, and an immersive digital campus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="bg-[#FFC72C] text-[#002D62] px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1">
              Virtual Visit
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#002D62] transition-all">
              Request Info
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-white text-xl font-bold mb-4 serif flex items-center gap-2">
            <span className="text-[#FFC72C]">⚡</span> Lite Answers
          </h3>
          <p className="text-blue-100 text-sm mb-6">Ask anything about Albertus life for a lightning-fast response.</p>
          
          <form onSubmit={handleFastQuery} className="relative mb-4">
            <input 
              type="text" 
              value={fastQuery}
              onChange={(e) => setFastQuery(e.target.value)}
              placeholder="How many students are at Albertus?"
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-[#FFC72C] transition-all"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bg-[#FFC72C] text-[#002D62] px-3 py-1 rounded-lg font-bold disabled:opacity-50"
            >
              {isLoading ? '...' : 'Ask'}
            </button>
          </form>

          {fastResult && (
            <div className="bg-white/5 rounded-xl p-4 text-blue-50 text-sm animate-in fade-in slide-in-from-bottom-2 duration-500 max-h-48 overflow-y-auto">
              {fastResult}
            </div>
          )}
        </div>
      </div>

      <div className="absolute -bottom-1 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L1440 120L1440 0C1152 80 288 80 0 0L0 120Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
