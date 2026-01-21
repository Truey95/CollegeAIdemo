
import React, { useState } from 'react';
import { generateComplexText } from '../services/geminiService';

const programs = [
  { id: 'business', name: 'Business Administration', icon: '💼', desc: 'Prepare for leadership in a global economy.' },
  { id: 'it', name: 'Information Technology', icon: '💻', desc: 'Master the future of digital infrastructure.' },
  { id: 'arts', name: 'Fine Arts', icon: '🎨', desc: 'Cultivate your creative voice in New Haven.' },
  { id: 'crim', name: 'Criminal Justice', icon: '⚖️', desc: 'Pursue justice and social responsibility.' },
  { id: 'nurse', name: 'Nursing', icon: '🏥', desc: 'Compassionate care backed by clinical excellence.' },
  { id: 'psych', name: 'Psychology', icon: '🧠', desc: 'Understand the science of human behavior.' }
];

const Programs: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (programName: string) => {
    setSelectedProgram(programName);
    setIsLoading(true);
    try {
      const res = await generateComplexText(`Provide a detailed career outlook and industry demand analysis for a ${programName} degree at Albertus Magnus College in 2024. Use thinking for a comprehensive answer.`);
      setAnalysis(res.text || '');
    } catch (err) {
      setAnalysis("Error fetching analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((p) => (
          <div 
            key={p.id}
            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{p.icon}</div>
            <h3 className="text-xl font-bold text-[#002D62] mb-3 serif">{p.name}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{p.desc}</p>
            <button 
              onClick={() => handleAnalyze(p.name)}
              className="text-[#002D62] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
            >
              AI Career Analysis <span className="text-[#FFC72C]">→</span>
            </button>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <div className="bg-[#002D62] rounded-3xl p-8 text-white animate-in slide-in-from-bottom-6 duration-500 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
             <button onClick={() => setSelectedProgram(null)} className="text-white/50 hover:text-white">✕</button>
           </div>
           <h4 className="text-2xl font-bold mb-4 serif">Industry Outlook: {selectedProgram}</h4>
           {isLoading ? (
             <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-white/10 rounded w-3/4"></div>
               <div className="h-4 bg-white/10 rounded w-full"></div>
               <div className="h-4 bg-white/10 rounded w-5/6"></div>
             </div>
           ) : (
             <div className="prose prose-invert max-w-none text-blue-100 text-sm leading-relaxed whitespace-pre-wrap">
               {analysis}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Programs;
