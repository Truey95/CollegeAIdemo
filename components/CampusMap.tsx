
import React, { useState } from 'react';
import { mapsGrounding } from '../services/geminiService';

const CampusMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; sources: any[] }>({ text: '', sources: [] });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    try {
      const res = await mapsGrounding(query, { lat: 41.3323, lng: -72.9238 }); // Albertus location
      setResults({
        text: res.text || '',
        sources: (res.sources as any[]) || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 bg-white p-4 rounded-3xl shadow-xl border">
      <div className="lg:w-1/3 p-6 space-y-6">
        <h3 className="text-xl font-bold text-[#002D62] serif">Falcon Navigator</h3>
        <p className="text-gray-500 text-sm">Find landmarks, parking, or local services around the New Haven campus.</p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#002D62]"
            placeholder="Search e.g. 'Coffee near Rosary Hall'"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#002D62] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Locating...' : 'Search Campus'}
          </button>
        </form>

        {results.sources.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Sources</h4>
            {results.sources.map((chunk, i) => (
              chunk.maps && (
                <a 
                  key={i} 
                  href={chunk.maps.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 rounded-lg text-xs text-[#002D62] font-semibold hover:bg-[#FFC72C]/10 border border-transparent hover:border-[#FFC72C] transition-all"
                >
                  📍 {chunk.maps.title}
                </a>
              )
            ))}
          </div>
        )}
      </div>

      <div className="lg:w-2/3 bg-gray-100 rounded-2xl min-h-[400px] p-8 flex flex-col justify-center relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#002D62] border-t-[#FFC72C] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Grounding with Google Maps...</p>
          </div>
        ) : results.text ? (
          <div className="prose prose-blue text-gray-700 animate-in fade-in duration-700">
            <h4 className="text-lg font-bold text-[#002D62] mb-4">Location Intelligence</h4>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{results.text}</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">🗺️</div>
            <p className="text-gray-400 font-medium italic">Campus location insights will appear here.</p>
          </div>
        )}
        
        {/* Decorative campus dots */}
        <div className="absolute top-4 right-4 text-[10px] text-gray-300 pointer-events-none font-mono">
          41.3323° N, 72.9238° W
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
